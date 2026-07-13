import { useState, useEffect, useCallback } from 'react'
import { useApp, T, supabase } from '../App.jsx'

const ILR_YEARS = { A: 5, B: 5, C: 5, D: 5, E: 5, F: 5, G: 3, H: 5 }

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function rollingWorst(trips) {
  let worst = 0
  trips.forEach(t1 => {
    const wEnd = new Date(t1.depart_date)
    wEnd.setFullYear(wEnd.getFullYear() + 1)
    let total = 0
    trips.forEach(t2 => {
      const s = Math.max(new Date(t1.depart_date), new Date(t2.depart_date))
      const e = Math.min(wEnd, new Date(t2.return_date))
      if (e > s) total += daysBetween(new Date(s), new Date(e))
    })
    if (total > worst) worst = total
  })
  return worst
}

export default function VisaCountdownTracker() {
  const { user } = useApp()
  const uid = user?.supabaseId
  const track = user?.visaTrack || 'A'
  const ilrYears = ILR_YEARS[track] || 5

  const [visaExpiry, setVisaExpiry] = useState('')
  const [residenceStart, setResidenceStart] = useState('')
  const [absences, setAbsences] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!uid) return
    async function load() {
      const [{ data: vt }, { data: ab }] = await Promise.all([
        supabase.from('visa_tracking').select('visa_expiry, residence_start').eq('user_id', uid).maybeSingle(),
        supabase.from('visa_absences').select('*').eq('user_id', uid).order('depart_date'),
      ])
      if (vt?.visa_expiry) setVisaExpiry(vt.visa_expiry)
      if (vt?.residence_start) setResidenceStart(vt.residence_start)
      if (ab) setAbsences(ab)
      setLoading(false)
    }
    load()
  }, [uid])

  async function saveDates(expiry, start) {
    if (!uid) return
    setSaving(true)
    await supabase.from('visa_tracking').upsert({
      user_id: uid,
      visa_expiry: expiry || null,
      residence_start: start || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    setSaving(false)
  }

  function handleExpiryChange(val) {
    setVisaExpiry(val)
    saveDates(val, residenceStart)
  }

  function handleStartChange(val) {
    setResidenceStart(val)
    saveDates(visaExpiry, val)
  }

  async function addAbsence() {
    if (!uid) return
    const { data } = await supabase.from('visa_absences').insert({
      user_id: uid, depart_date: '', return_date: '', reason: '',
    }).select().single()
    if (data) setAbsences(prev => [...prev, data])
  }

  async function updateAbsence(id, field, val) {
    setAbsences(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a))
    await supabase.from('visa_absences').update({ [field]: val || null }).eq('id', id)
  }

  async function deleteAbsence(id) {
    setAbsences(prev => prev.filter(a => a.id !== id))
    await supabase.from('visa_absences').delete().eq('id', id)
  }

  // ── calculations ──
  const now = new Date(); now.setHours(0, 0, 0, 0)

  let visaDays = null, visaStatus = null
  if (visaExpiry) {
    visaDays = daysBetween(now, new Date(visaExpiry))
    if (visaDays > 180) visaStatus = { label: '✓ Comfortable window', color: '#1a6b2e', bg: '#e6f4ea' }
    else if (visaDays > 84) visaStatus = { label: '⚠ Begin renewal preparation', color: '#7a5a00', bg: '#fff8e6' }
    else visaStatus = { label: '🔴 Urgent — act now', color: '#8b0000', bg: '#fde8e8' }
  }

  let ilrDays = null, ilrDate = null
  if (residenceStart) {
    ilrDate = new Date(residenceStart)
    ilrDate.setFullYear(ilrDate.getFullYear() + ilrYears)
    ilrDays = daysBetween(now, ilrDate)
  }

  const validTrips = absences.filter(a => a.depart_date && a.return_date)
  const worst = rollingWorst(validTrips)
  const pct = Math.min(100, (worst / 180) * 100)
  const barColor = worst > 180 ? '#cc2222' : worst > 150 ? '#cc2222' : worst > 120 ? T.gold : '#1a6b2e'

  let absenceResult = null
  if (validTrips.length === 0) {
    absenceResult = { text: '✓ No absences logged yet. Log every trip to keep this accurate.', color: '#1a5c1a', bg: '#e6f4ea' }
  } else if (worst > 180) {
    absenceResult = { text: `🔴 Over the 180-day limit (${worst} days). Seek regulated immigration advice before your ILR application.`, color: '#8b0000', bg: '#fde8e8' }
  } else if (worst > 150) {
    absenceResult = { text: `⚠ ${worst} days — dangerously close to the 180-day limit. Avoid further travel in this window.`, color: '#8b0000', bg: '#fde8e8' }
  } else if (worst > 120) {
    absenceResult = { text: `⚠ ${worst} days in your worst window. ${180 - worst} days of headroom remaining — plan travel carefully.`, color: '#7a5a00', bg: '#fff8e6' }
  } else {
    absenceResult = { text: `✓ ${worst} days in your worst rolling window — comfortably within the 180-day limit.`, color: '#1a5c1a', bg: '#e6f4ea' }
  }

  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center', color: T.muted, fontSize: '13px' }}>
      Loading tracker…
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg3, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div>
      {/* Date setup */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: T.gold, letterSpacing: '0.06em', marginBottom: '12px' }}>
          YOUR DATES {saving && <span style={{ color: T.muted, fontWeight: '400' }}>· saving…</span>}
        </p>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Visa expiry date
          </label>
          <input type="date" value={visaExpiry} onChange={e => handleExpiryChange(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Continuous residence start date
          </label>
          <input type="date" value={residenceStart} onChange={e => handleStartChange(e.target.value)} style={inputStyle} />
          <p style={{ fontSize: '11px', color: T.mutedDk, marginTop: '4px' }}>
            Track {track} — ILR route is {ilrYears} years from this date
          </p>
        </div>
      </div>

      {/* Countdown cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        {/* Visa */}
        <div style={{ background: '#1B2D5B', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '38px', fontWeight: '800', color: T.gold, lineHeight: 1 }}>
            {visaDays !== null ? (visaDays < 0 ? '0' : visaDays) : '—'}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '5px', lineHeight: 1.4 }}>
            days until visa expiry
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginTop: '7px' }}>
            {visaExpiry ? formatDate(visaExpiry) : 'Set your expiry date above'}
          </div>
          {visaStatus && (
            <div style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '10px',
              display: 'inline-block', marginTop: '8px', background: visaStatus.bg, color: visaStatus.color }}>
              {visaStatus.label}
            </div>
          )}
        </div>
        {/* ILR */}
        <div style={{ background: '#2D1B45', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '38px', fontWeight: '800', color: T.gold, lineHeight: 1 }}>
            {ilrDays !== null ? (ilrDays <= 0 ? '0' : ilrDays) : '—'}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '5px', lineHeight: 1.4 }}>
            days until ILR eligibility
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginTop: '7px' }}>
            {ilrDate ? (ilrDays <= 0 ? 'Eligible since ' : 'Eligible ') + formatDate(ilrDate) : 'Set your residence start date'}
          </div>
          {ilrDays !== null && (
            <div style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '10px',
              display: 'inline-block', marginTop: '8px',
              background: ilrDays <= 0 ? '#e6f4ea' : ilrDays < 365 ? '#fff8e6' : 'rgba(255,255,255,0.1)',
              color: ilrDays <= 0 ? '#1a5c1a' : ilrDays < 365 ? '#7a5a00' : 'rgba(255,255,255,0.75)' }}>
              {ilrDays <= 0 ? '🏆 ILR-eligible — apply when ready' : ilrDays < 365 ? '⚠ Within 12 months — prepare evidence' : 'Building qualifying residence'}
            </div>
          )}
        </div>
      </div>

      {/* Info box */}
      <div style={{ background: `${T.navy}22`, borderLeft: `3px solid ${T.navy || '#1B2D5B'}`,
        padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.6 }}>
          <strong style={{ color: T.white }}>Renewal reminders:</strong> Push notifications fire at 6 months, 3 months, and 6 weeks before visa expiry, and at 12 months and 3 months before ILR eligibility.
        </p>
      </div>

      {/* 180-day absence tracker */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: T.white, marginBottom: '4px' }}>
          180-day absence log
        </p>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.55, marginBottom: '14px' }}>
          For most ILR routes, you must not be absent more than 180 days in any rolling 12-month period. Log every trip — the tool calculates your worst rolling window automatically.
        </p>

        {absences.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 28px', gap: '6px', marginBottom: '6px' }}>
              {['Departure', 'Return', 'Reason (optional)', ''].map((h, i) => (
                <div key={i} style={{ fontSize: '10px', fontWeight: '700', color: T.mutedDk, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>
            {absences.map(a => (
              <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 28px', gap: '6px', marginBottom: '7px', alignItems: 'center' }}>
                <input type="date" value={a.depart_date || ''} onChange={e => updateAbsence(a.id, 'depart_date', e.target.value)}
                  style={{ ...inputStyle, fontSize: '12px', padding: '7px 8px' }} />
                <input type="date" value={a.return_date || ''} onChange={e => updateAbsence(a.id, 'return_date', e.target.value)}
                  style={{ ...inputStyle, fontSize: '12px', padding: '7px 8px' }} />
                <input type="text" value={a.reason || ''} placeholder="e.g. Family visit"
                  onChange={e => updateAbsence(a.id, 'reason', e.target.value)}
                  style={{ ...inputStyle, fontSize: '12px', padding: '7px 8px' }} />
                <button onClick={() => deleteAbsence(a.id)}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${T.bg4}`,
                    background: '#fff5f5', color: '#a04040', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={addAbsence}
          style={{ background: 'none', border: 'none', color: T.gold, fontSize: '12px',
            fontWeight: '700', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
          + Add trip
        </button>

        {/* Rolling window bar */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ background: T.bg4, borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '10px', background: barColor,
              width: `${pct}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: T.mutedDk, marginTop: '5px' }}>
            <span>0 days</span>
            <span>Worst rolling 12-month total: <strong style={{ color: T.white }}>{worst} days</strong></span>
            <span>180 limit</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', padding: '10px 12px', borderRadius: '8px',
            marginTop: '8px', background: absenceResult.bg, color: absenceResult.color }}>
            {absenceResult.text}
          </div>
        </div>
      </div>

      {/* Track-specific note */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '8px', padding: '12px 14px' }}>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.6 }}>
          <strong style={{ color: T.white }}>Track-specific notes:</strong>{' '}
          {track === 'D' && 'BN(O): the 180-day rule applies across your full 5 years. Confirm eVisa is linked to your current passport before any travel.'}
          {track === 'E' && 'Refugee travel document holders: never travel to your country of origin. Seek regulated advice before any international travel — additional rules apply.'}
          {track === 'F' && 'Global Talent: the same 180-day rule applies. Absence can also affect endorsement renewal — your primary activity must remain in the UK.'}
          {track === 'G' && 'Innovator Founder: absences matter beyond the 180-day rule — your business must remain your primary UK activity throughout. Your endorsing body monitors this.'}
          {track === 'B' && 'Student: time on a Student visa may not count toward ILR unless you switch to an eligible route first. Check with your institution\'s International Student Support office.'}
          {(track === 'A' || track === 'C' || track === 'H') && 'Standard 180-day rule applies in any rolling 12-month period. Log every trip including short weekend travel — days accumulate quickly.'}
        </p>
      </div>
    </div>
  )
}
