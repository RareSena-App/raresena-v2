import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp, T, supabase } from '../App.jsx'

const BANDS_EXP = [[0,560,'Very poor','#8b0000','#fde8e8'],[561,720,'Poor','#8b0000','#fde8e8'],[721,880,'Fair','#7a5a00','#fff8e6'],[881,960,'Good','#1a5c1a','#ddeedd'],[961,999,'Excellent','#0d3d0d','#cceecc']]
const BANDS_EQF = [[0,438,'Poor','#8b0000','#fde8e8'],[439,530,'Fair','#7a5a00','#fff8e6'],[531,670,'Good','#1a5c1a','#ddeedd'],[671,810,'Very good','#1a5c1a','#ddeedd'],[811,1000,'Excellent','#0d3d0d','#cceecc']]
const BANDS_TU  = [[0,550,'Very poor','#8b0000','#fde8e8'],[551,565,'Poor','#8b0000','#fde8e8'],[566,603,'Fair','#7a5a00','#fff8e6'],[604,627,'Good','#1a5c1a','#ddeedd'],[628,710,'Excellent','#0d3d0d','#cceecc']]

function bandFor(v, bands) {
  for (const [lo, hi, label, color, bg] of bands) {
    if (v >= lo && v <= hi) return { label, color, bg }
  }
  return { label: 'No data', color: T.mutedDk, bg: T.bg3 }
}

function formatMonth(m) {
  if (!m) return ''
  const [y, mo] = m.split('-')
  return new Date(y, mo - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

const ACTIONS = [
  'Electoral roll registered (if eligible) — the single fastest lift; appears within 4–6 weeks',
  'Credit-builder card paid in full by direct debit — zero missed payments, usage under 30% of limit',
  'Rent reporting active (CreditLadder or Canopy) — your largest payment made visible',
  'At least two direct debits running from your main account',
  'No new credit applications in the last 3 months — hard searches suppress scores temporarily',
  'Errors disputed — wrong addresses and unknown accounts drag scores; check all three reports quarterly',
]

export default function CreditScoreTracker() {
  const { user } = useApp()
  const uid = user?.supabaseId

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingUpdates, setPendingUpdates] = useState({})

  useEffect(() => {
    if (!uid) return
    supabase.from('credit_scores').select('*').eq('user_id', uid).order('month')
      .then(({ data }) => { if (data) setRows(data); setLoading(false) })
  }, [uid])

  async function addRow() {
    if (!uid) return
    const { data } = await supabase.from('credit_scores')
      .insert({ user_id: uid, month: '', experian: null, equifax: null, transunion: null })
      .select().single()
    if (data) setRows(prev => [...prev, data])
  }

  function localUpdate(id, field, val) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val === '' ? null : (field === 'month' ? val : parseInt(val) || null) } : r))
    setPendingUpdates(prev => ({ ...prev, [`${id}_${field}`]: { id, field, val } }))
  }

  async function flushUpdate(id, field, val) {
    const parsed = field === 'month' ? (val || null) : (val === '' || val === null ? null : parseInt(val) || null)
    await supabase.from('credit_scores').update({ [field]: parsed }).eq('id', id)
  }

  async function deleteRow(id) {
    setRows(prev => prev.filter(r => r.id !== id))
    await supabase.from('credit_scores').delete().eq('id', id)
  }

  const sorted = [...rows].filter(r => r.month).sort((a, b) => a.month.localeCompare(b.month))
  const latest = sorted[sorted.length - 1] || {}

  const expBand = latest.experian != null ? bandFor(latest.experian, BANDS_EXP) : null
  const eqfBand = latest.equifax != null ? bandFor(latest.equifax, BANDS_EQF) : null
  const tuBand  = latest.transunion != null ? bandFor(latest.transunion, BANDS_TU) : null

  const chartData = sorted.map(r => ({
    month: formatMonth(r.month),
    Experian: r.experian != null ? Math.round((r.experian / 999) * 100) : null,
    Equifax: r.equifax != null ? Math.round((r.equifax / 1000) * 100) : null,
    TransUnion: r.transunion != null ? Math.round((r.transunion / 710) * 100) : null,
  }))

  const inputStyle = {
    width: '100%', padding: '7px 8px', borderRadius: '6px',
    border: `1px solid ${T.bg4}`, background: T.bg3, color: T.white,
    fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  if (loading) return <div style={{ padding: '16px', color: T.muted, fontSize: '13px' }}>Loading tracker…</div>

  return (
    <div>
      {/* Info */}
      <div style={{ background: `#1B2D5B22`, borderLeft: `3px solid #1B2D5B`,
        padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.65 }}>
          <strong style={{ color: T.white }}>Why this matters:</strong> You arrived invisible to the UK's three credit agencies. Every month of electoral roll presence, paid direct debits, and rent reporting adds data to your file. A score climbing from 400 to 750 over 18 months is one of the most motivating graphs an immigrant in the UK can watch. Log all three agencies monthly.
        </p>
      </div>

      {/* Current scores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {[
          { name: 'Experian', scale: '0–999', val: latest.experian, band: expBand },
          { name: 'Equifax', scale: '0–1000', val: latest.equifax, band: eqfBand },
          { name: 'TransUnion', scale: '0–710', val: latest.transunion, band: tuBand },
        ].map(({ name, scale, val, band }) => (
          <div key={name} style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: T.white, marginBottom: '2px' }}>{name}</p>
            <p style={{ fontSize: '10px', color: T.mutedDk, marginBottom: '8px' }}>{scale}</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: T.gold, lineHeight: 1 }}>
              {val != null ? val : '—'}
            </p>
            {band ? (
              <div style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px',
                display: 'inline-block', marginTop: '6px', background: band.bg, color: band.color }}>
                {band.label}
              </div>
            ) : (
              <div style={{ fontSize: '10px', color: T.mutedDk, marginTop: '6px' }}>No data yet</div>
            )}
          </div>
        ))}
      </div>

      {/* Monthly log */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: T.white, marginBottom: '12px' }}>
          Monthly log — same day each month
        </p>

        {rows.length > 0 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr 28px', gap: '6px', marginBottom: '6px' }}>
              {['Month', 'Experian', 'Equifax', 'TransUnion', ''].map((h, i) => (
                <div key={i} style={{ fontSize: '10px', fontWeight: '700', color: T.mutedDk, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>
            {rows.map(r => (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr 28px', gap: '6px', marginBottom: '7px', alignItems: 'center' }}>
                <input type="month" value={r.month || ''} onChange={e => localUpdate(r.id, 'month', e.target.value)}
                  onBlur={e => flushUpdate(r.id, 'month', e.target.value)} style={inputStyle} />
                <input type="number" value={r.experian ?? ''} min={0} max={999} placeholder="0–999"
                  onChange={e => localUpdate(r.id, 'experian', e.target.value)}
                  onBlur={e => flushUpdate(r.id, 'experian', e.target.value)} style={inputStyle} />
                <input type="number" value={r.equifax ?? ''} min={0} max={1000} placeholder="0–1000"
                  onChange={e => localUpdate(r.id, 'equifax', e.target.value)}
                  onBlur={e => flushUpdate(r.id, 'equifax', e.target.value)} style={inputStyle} />
                <input type="number" value={r.transunion ?? ''} min={0} max={710} placeholder="0–710"
                  onChange={e => localUpdate(r.id, 'transunion', e.target.value)}
                  onBlur={e => flushUpdate(r.id, 'transunion', e.target.value)} style={inputStyle} />
                <button onClick={() => deleteRow(r.id)}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${T.bg4}`,
                    background: '#fff5f5', color: '#a04040', fontSize: '12px', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={addRow}
          style={{ background: 'none', border: 'none', color: T.gold, fontSize: '12px',
            fontWeight: '700', cursor: 'pointer', padding: 0, fontFamily: 'inherit', marginTop: rows.length > 0 ? '4px' : 0 }}>
          + Add month
        </button>
      </div>

      {/* Trend chart */}
      {chartData.length > 0 && (
        <div style={{ background: '#1B2D5B', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Score trajectory (% of each agency's maximum)
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#1B2D5B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: 'rgba(255,255,255,0.8)' }} formatter={(v, name) => [`${v}%`, name]} />
              <Line type="monotone" dataKey="Experian" stroke="#B8962E" strokeWidth={2} dot={{ r: 3, fill: '#B8962E' }} connectNulls />
              <Line type="monotone" dataKey="Equifax" stroke="#7fb3ff" strokeWidth={2} dot={{ r: 3, fill: '#7fb3ff' }} connectNulls />
              <Line type="monotone" dataKey="TransUnion" stroke="#8fd694" strokeWidth={2} dot={{ r: 3, fill: '#8fd694' }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {[['#B8962E', 'Experian'], ['#7fb3ff', 'Equifax'], ['#8fd694', 'TransUnion']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What moves the line */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '10px', padding: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: T.white, marginBottom: '10px' }}>
          If the line is flat, check these in order
        </p>
        {ACTIONS.map((action, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0',
            borderBottom: i < ACTIONS.length - 1 ? `1px solid ${T.bg4}` : 'none' }}>
            <span style={{ color: T.gold, fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>{i + 1}.</span>
            <p style={{ fontSize: '13px', color: T.muted, lineHeight: 1.55 }}>{action}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
