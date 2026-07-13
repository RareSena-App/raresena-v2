import { useState, useEffect } from 'react'
import { useApp, T, supabase } from '../App.jsx'

const STAGE_OPTIONS = ['Applied', 'Screening', 'Interview', 'Final round', 'Offer', 'Rejected', 'Withdrawn']
const SPONSOR_OPTIONS = ['Sponsored role', 'Sponsorship not needed', 'Sponsor status unknown']

const SAMPLE_REGISTER = [
  'NHS ENGLAND', 'BARCHESTER HEALTHCARE LTD', 'TESCO STORES LIMITED', 'HSBC BANK PLC',
  'DELOITTE LLP', 'PRICEWATERHOUSECOOPERS LLP', 'UNIVERSITY OF MANCHESTER',
  'AMAZON UK SERVICES LTD', 'CAPGEMINI UK PLC', 'BUPA CARE HOMES', 'GOOGLE UK LIMITED',
  'KPMG LLP', 'HC-ONE LIMITED', 'ACCENTURE (UK) LIMITED', 'JP MORGAN CHASE BANK',
  'BARCLAYS BANK PLC', 'LLOYDS BANKING GROUP', 'ROYAL BANK OF SCOTLAND',
  'MARKS AND SPENCER PLC', 'UNILEVER UK LIMITED', 'BRITISH AIRWAYS PLC',
  'SAINSBURYS SUPERMARKETS LTD', 'ASOS.COM LIMITED', 'VODAFONE LIMITED',
]

function checkSponsor(q) {
  const upper = q.trim().toUpperCase()
  if (!upper) return null
  const exact = SAMPLE_REGISTER.find(n => n === upper)
  if (exact) return { type: 'found', name: exact }
  const partial = SAMPLE_REGISTER.filter(n => n.includes(upper) || upper.includes(n.split(' ')[0]))
  if (partial.length > 0) return { type: 'partial', matches: partial.slice(0, 3) }
  return { type: 'notfound', query: q.trim() }
}

const SOURCES = [
  { name: 'The register as a target list', desc: 'Download the register CSV from gov.uk, filter to your city and sector — you now have a list of every employer in your area that CAN sponsor. Approach them directly.', url: 'gov.uk — search "register of licensed sponsors workers"' },
  { name: 'UKHired', desc: 'Job board listing only visa-sponsoring roles, filterable by salary threshold and occupation eligibility.', url: 'ukhired.com' },
  { name: 'LinkedIn — keyword technique', desc: 'Search your role + "visa sponsorship" OR "Skilled Worker visa" in quotes. Set alerts with these keywords.', url: 'linkedin.com/jobs' },
  { name: 'NHS Jobs (health professionals)', desc: 'The NHS is the UK\'s largest sponsor. Trusts state sponsorship availability on listings; most clinical roles at Band 3+ are eligible.', url: 'jobs.nhs.uk' },
]

export default function ApplicationPipelineTracker() {
  const { user } = useApp()
  const uid = user?.supabaseId
  const track = user?.visaTrack || 'A'

  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [sponsorQuery, setSponsorQuery] = useState('')
  const [sponsorResult, setSponsorResult] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!uid) return
    supabase.from('applications').select('*').eq('user_id', uid).order('created_at')
      .then(({ data }) => { if (data) setApps(data); setLoading(false) })
  }, [uid])

  async function addApp() {
    if (!uid) return
    const { data } = await supabase.from('applications').insert({
      user_id: uid, role: '', company: '', sponsor_status: 'Sponsored role',
      applied_date: null, stage: 'Applied', notes: '',
    }).select().single()
    if (data) setApps(prev => [...prev, data])
  }

  function localUpdate(id, field, val) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a))
  }

  async function flushUpdate(id, field, val) {
    await supabase.from('applications').update({ [field]: val || null }).eq('id', id)
  }

  async function deleteApp(id) {
    setApps(prev => prev.filter(a => a.id !== id))
    await supabase.from('applications').delete().eq('id', id)
  }

  function handleSponsorCheck() {
    setSponsorResult(checkSponsor(sponsorQuery))
  }

  const visibleApps = apps.filter(a => {
    if (filter === 'sponsor') return a.sponsor_status === 'Sponsored role'
    if (filter === 'open') return a.sponsor_status !== 'Sponsored role'
    return true
  })

  const total = apps.length
  const active = apps.filter(a => !['Rejected', 'Withdrawn', 'Offer'].includes(a.stage)).length
  const interview = apps.filter(a => a.stage === 'Interview' || a.stage === 'Final round').length
  const offers = apps.filter(a => a.stage === 'Offer').length

  const inputStyle = {
    width: '100%', padding: '7px 10px', borderRadius: '6px',
    border: `1px solid ${T.bg4}`, background: T.bg3, color: T.white,
    fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  const stageColor = (s) => {
    if (s === 'Offer') return '#1a6b2e'
    if (s === 'Rejected' || s === 'Withdrawn') return '#8b0000'
    if (s === 'Interview' || s === 'Final round') return '#7a5a00'
    return T.mutedDk
  }

  if (loading) return <div style={{ padding: '16px', color: T.muted, fontSize: '13px' }}>Loading tracker…</div>

  return (
    <div>
      {/* Info */}
      <div style={{ background: `#1B2D5B22`, borderLeft: `3px solid #1B2D5B`,
        padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.65 }}>
          <strong style={{ color: T.white }}>The problem this solves:</strong> The most demoralising experience in immigrant job searching is the great interview followed by "unfortunately, we are not able to sponsor visas." The UK government publishes the Register of Licensed Sponsors — every organisation legally able to sponsor. Check <em>before</em> you apply.
        </p>
      </div>

      {/* Sponsor check */}
      <div style={{ background: '#1B2D5B', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', fontWeight: '700', color: T.white, marginBottom: '5px' }}>
          Check an employer before you apply
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, marginBottom: '12px' }}>
          Type the company name as registered at Companies House where possible.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={sponsorQuery}
            onChange={e => setSponsorQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSponsorCheck()}
            placeholder="e.g. Barchester Healthcare Ltd"
            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)', color: T.white, fontSize: '13px',
              fontFamily: 'inherit', outline: 'none' }}
          />
          <button onClick={handleSponsorCheck}
            style={{ padding: '10px 16px', background: T.gold, border: 'none', borderRadius: '8px',
              color: T.white, fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            Check
          </button>
        </div>

        {sponsorResult && (
          <div style={{ marginTop: '10px', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', lineHeight: 1.6,
            background: sponsorResult.type === 'found' ? 'rgba(26,107,46,0.35)' : sponsorResult.type === 'partial' ? 'rgba(184,150,46,0.3)' : 'rgba(204,34,34,0.3)',
            border: `1px solid ${sponsorResult.type === 'found' ? 'rgba(140,220,150,0.4)' : sponsorResult.type === 'partial' ? 'rgba(230,200,120,0.4)' : 'rgba(255,150,150,0.35)'}`,
            color: T.white }}>
            {sponsorResult.type === 'found' && `✅ ${sponsorResult.name} appears on the register. This employer holds a sponsor licence — verify the current licence type at the official register before relying on it.`}
            {sponsorResult.type === 'partial' && `⚠ Not an exact match, but similar names found: ${sponsorResult.matches.join(', ')}. Company names on the register often differ from trading names — check with variations (Ltd/Limited/PLC).`}
            {sponsorResult.type === 'notfound' && `❌ ${sponsorResult.query} was not found. If an employer is genuinely not on the register, they cannot sponsor a Skilled Worker visa — regardless of what a recruiter says. They can apply for a licence (4–8+ weeks) but only proceed if they confirm this in writing.`}
          </div>
        )}

        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '10px', lineHeight: 1.5 }}>
          Searching a sample dataset. Always verify at the official source:{' '}
          <span style={{ color: T.gold, fontWeight: '600' }}>gov.uk — Register of Licensed Sponsors (Workers)</span>
        </p>
      </div>

      {/* Track note */}
      {(track === 'C' || track === 'D' || track === 'F') && (
        <div style={{ background: `${T.gold}15`, border: `1px solid ${T.gold}44`, borderRadius: '8px',
          padding: '11px 14px', marginBottom: '16px', fontSize: '12px', color: T.muted, lineHeight: 1.6 }}>
          <strong style={{ color: T.gold }}>Track {track} note:</strong>{' '}
          {track === 'C' && 'Family visa holders typically have unrestricted work rights — mark applications as "Sponsorship not needed" in the pipeline below.'}
          {track === 'D' && 'BN(O) holders with settled or pre-settled status have unrestricted work rights — no sponsorship needed.'}
          {track === 'F' && 'Global Talent holders have unrestricted work rights — sponsorship not required for any UK employer.'}
        </div>
      )}

      {/* Where to find jobs */}
      <p style={{ fontSize: '11px', fontWeight: '700', color: T.gold, letterSpacing: '0.08em', marginBottom: '10px' }}>
        WHERE TO FIND SPONSORSHIP-FRIENDLY ROLES
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
        {SOURCES.map(s => (
          <div key={s.name} style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '8px', padding: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: T.white, marginBottom: '4px' }}>{s.name}</p>
            <p style={{ fontSize: '11px', color: T.muted, lineHeight: 1.5, marginBottom: '5px' }}>{s.desc}</p>
            <p style={{ fontSize: '11px', color: T.gold, fontWeight: '600' }}>{s.url}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
        {[['Total', total], ['Active', active], ['Interview', interview], ['Offers', offers]].map(([label, num]) => (
          <div key={label} style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: '800', color: num > 0 ? T.gold : T.mutedDk }}>{num}</p>
            <p style={{ fontSize: '10px', color: T.mutedDk, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '10px', padding: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: T.white, marginBottom: '12px' }}>Your applications</p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {[['all', 'All'], ['sponsor', 'Sponsored roles'], ['open', 'No sponsorship needed']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ padding: '5px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit', border: filter === val ? 'none' : `1px solid ${T.bg4}`,
                background: filter === val ? '#1B2D5B' : 'transparent',
                color: filter === val ? T.white : T.mutedDk }}>
              {label}
            </button>
          ))}
        </div>

        {visibleApps.map(a => (
          <div key={a.id} style={{ border: `1px solid ${T.bg4}`, borderRadius: '9px', padding: '12px', marginBottom: '10px', background: T.bg }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
              <input type="text" value={a.role || ''} placeholder="Role title"
                onChange={e => localUpdate(a.id, 'role', e.target.value)}
                onBlur={e => flushUpdate(a.id, 'role', e.target.value)} style={inputStyle} />
              <input type="text" value={a.company || ''} placeholder="Company"
                onChange={e => localUpdate(a.id, 'company', e.target.value)}
                onBlur={e => flushUpdate(a.id, 'company', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 28px', gap: '6px', alignItems: 'center' }}>
              <input type="date" value={a.applied_date || ''} title="Date applied"
                onChange={e => { localUpdate(a.id, 'applied_date', e.target.value); flushUpdate(a.id, 'applied_date', e.target.value) }}
                style={inputStyle} />
              <select value={a.sponsor_status || 'Sponsored role'}
                onChange={e => { localUpdate(a.id, 'sponsor_status', e.target.value); flushUpdate(a.id, 'sponsor_status', e.target.value) }}
                style={{ ...inputStyle }}>
                {SPONSOR_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={a.stage || 'Applied'}
                onChange={e => { localUpdate(a.id, 'stage', e.target.value); flushUpdate(a.id, 'stage', e.target.value) }}
                style={{ ...inputStyle, color: stageColor(a.stage || 'Applied') }}>
                {STAGE_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <button onClick={() => deleteApp(a.id)}
                style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${T.bg4}`,
                  background: '#fff5f5', color: '#a04040', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
                ✕
              </button>
            </div>
          </div>
        ))}

        {visibleApps.length === 0 && (
          <p style={{ fontSize: '13px', color: T.mutedDk, textAlign: 'center', padding: '16px 0' }}>
            {apps.length === 0 ? 'No applications yet — add your first below.' : 'No applications match this filter.'}
          </p>
        )}

        <button onClick={addApp}
          style={{ background: 'none', border: 'none', color: T.gold, fontSize: '12px',
            fontWeight: '700', cursor: 'pointer', padding: 0, fontFamily: 'inherit', marginTop: '4px' }}>
          + Add application
        </button>
      </div>
    </div>
  )
}
