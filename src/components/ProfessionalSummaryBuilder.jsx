import { useState } from 'react'
import { T } from '../App.jsx'

const REGULATED_PROFESSIONS = [
  { label: 'Medicine (GMC)', body: 'General Medical Council — gmc-uk.org' },
  { label: 'Nursing / Midwifery (NMC)', body: 'Nursing & Midwifery Council — nmc.org.uk' },
  { label: 'Dentistry (GDC)', body: 'General Dental Council — gdc-uk.org' },
  { label: 'Pharmacy (GPhC)', body: 'General Pharmaceutical Council — pharmacyregulation.org' },
  { label: 'Law (SRA / Bar Standards)', body: 'Solicitors: SRA — sra.org.uk | Barristers: Bar Standards Board — barstandardsboard.org.uk' },
  { label: 'Teaching (TRA)', body: 'Teacher Regulation Agency — apply for QTS — gov.uk/guidance/qualified-teacher-status-qts' },
  { label: 'Social Work (SWE)', body: 'Social Work England — socialworkengland.org.uk' },
  { label: 'Architecture (ARB)', body: 'Architects Registration Board — arb.org.uk' },
  { label: 'Engineering (various)', body: 'Check with your specific Chartered Engineering body (ICE, IET, IMechE, etc.)' },
  { label: 'Accountancy (ICAEW / ACCA)', body: 'ICAEW — icaew.com | ACCA — accaglobal.com' },
  { label: 'Not on this list / Not regulated', body: '' },
]

function buildSummary({ skills, qualification, targetRole, lookingFor, needsEnic, regulatedProf }) {
  const filledSkills = skills.filter(s => s.name.trim())
  if (!filledSkills.length || !qualification.trim() || !targetRole.trim()) return ''

  const skillStr = filledSkills.length === 1
    ? filledSkills[0].name
    : filledSkills.length === 2
    ? `${filledSkills[0].name} and ${filledSkills[1].name}`
    : `${filledSkills[0].name}, ${filledSkills[1].name}, and ${filledSkills[2].name}`

  let para = `I am a ${targetRole.trim()} with expertise in ${skillStr}. My highest qualification is ${qualification.trim()}.`

  const barriers = []
  if (needsEnic === 'yes') barriers.push('a UK ENIC Statement of Comparability for my qualification')
  if (regulatedProf && !regulatedProf.includes('Not regulated') && !regulatedProf.includes('Not on')) {
    const body = regulatedProf.split('(')[1]?.replace(')', '') || 'the relevant UK regulatory body'
    barriers.push(`registration with ${body}`)
  }
  if (barriers.length) {
    para += ` I am in the process of completing ${barriers.join(' and ')} in order to fully practise in the UK.`
  }

  if (lookingFor.trim()) {
    para += ` I am looking for ${lookingFor.trim()}.`
  }

  return para
}

export default function ProfessionalSummaryBuilder({ onSave }) {
  const [skills, setSkills] = useState([
    { name: '', desc: '' },
    { name: '', desc: '' },
    { name: '', desc: '' },
  ])
  const [qualification, setQualification] = useState('')
  const [needsEnic, setNeedsEnic] = useState(null) // 'yes' | 'no'
  const [regulatedProf, setRegulatedProf] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [lookingFor, setLookingFor] = useState('')
  const [summary, setSummary] = useState('')
  const [generated, setGenerated] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateSkill(i, field, val) {
    setSkills(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
    setGenerated(false)
  }

  function generate() {
    const text = buildSummary({ skills, qualification, targetRole, lookingFor, needsEnic, regulatedProf })
    setSummary(text)
    setGenerated(true)
  }

  function save() {
    const topSkill = skills.find(s => s.name.trim())?.name || ''
    const barriers = []
    if (needsEnic === 'yes') barriers.push('UK ENIC comparability')
    if (regulatedProf && !regulatedProf.includes('Not regulated') && !regulatedProf.includes('Not on')) {
      barriers.push(regulatedProf.replace(/ \(.*\)/, '') + ' registration')
    }
    const ukBarrier = barriers[0] || 'None identified'
    setSaved(true)
    if (onSave) onSave(topSkill, ukBarrier)
  }

  const canGenerate = skills.some(s => s.name.trim()) && qualification.trim() && targetRole.trim()

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg3, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
  }
  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: T.mutedDk,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    display: 'block', marginBottom: '6px',
  }
  const sectionHead = {
    fontSize: '11px', fontWeight: '800', color: T.gold,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: '12px', marginTop: '4px',
  }

  return (
    <div>
      {/* ── Section 1: Skills inventory ── */}
      <p style={sectionHead}>1 — Skills inventory</p>

      {skills.map((s, i) => (
        <div key={i} style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
          borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: T.muted, marginBottom: '8px' }}>
            Skill {i + 1}{i === 0 ? ' — your strongest' : ''}
          </p>
          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>Skill name</label>
            <input type="text" value={s.name}
              onChange={e => updateSkill(i, 'name', e.target.value)}
              placeholder={i === 0 ? 'e.g. Clinical nursing, structural engineering, corporate law…'
                : i === 1 ? 'e.g. Patient communication, project delivery, contract negotiation…'
                : 'e.g. Research methodology, team leadership, financial modelling…'}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Specific description (be concrete)</label>
            <input type="text" value={s.desc}
              onChange={e => updateSkill(i, 'desc', e.target.value)}
              placeholder={i === 0 ? 'e.g. Managed ICU patients in a 400-bed hospital for 6 years'
                : i === 1 ? 'e.g. Led 3 cross-functional teams across Nigeria and South Africa'
                : 'e.g. Published 4 peer-reviewed papers on urban planning policy'}
              style={inputStyle} />
          </div>
        </div>
      ))}

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Highest qualification</label>
        <input type="text" value={qualification}
          onChange={e => { setQualification(e.target.value); setGenerated(false) }}
          placeholder="e.g. MBBS (University of Lagos), LLM (University of Nairobi), BEng (KNUST)…"
          style={inputStyle} />
      </div>

      {/* ── Section 2: ENIC check ── */}
      <p style={sectionHead}>2 — Qualification recognition check</p>

      <p style={{ fontSize: '13px', color: T.muted, lineHeight: 1.5, marginBottom: '10px' }}>
        Does your highest qualification come from outside the UK?
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {['yes', 'no'].map(opt => (
          <button key={opt} onClick={() => { setNeedsEnic(opt); setGenerated(false) }}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '700', fontFamily: 'inherit', cursor: 'pointer',
              border: `1.5px solid ${needsEnic === opt ? T.gold : T.bg4}`,
              background: needsEnic === opt ? `${T.gold}20` : T.bg3,
              color: needsEnic === opt ? T.gold : T.muted }}>
            {opt === 'yes' ? 'Yes — overseas qualification' : 'No — UK qualification'}
          </button>
        ))}
      </div>

      {needsEnic === 'yes' && (
        <div style={{ background: `${T.gold}12`, border: `1px solid ${T.gold}44`,
          borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: T.gold, marginBottom: '4px' }}>
            You likely need a UK ENIC Statement of Comparability
          </p>
          <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.5 }}>
            This is the official document that tells UK employers and universities how your overseas qualification compares to UK standards. Cost: approx £50–£100 + VAT. Apply at{' '}
            <span style={{ color: T.gold, fontWeight: '700' }}>enic.org.uk</span>
          </p>
        </div>
      )}

      {/* ── Regulated profession check ── */}
      <p style={{ fontSize: '13px', color: T.muted, lineHeight: 1.5, marginBottom: '10px' }}>
        Is your profession regulated in the UK?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
        {REGULATED_PROFESSIONS.map(p => (
          <button key={p.label} onClick={() => { setRegulatedProf(p.label); setGenerated(false) }}
            style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
              fontWeight: regulatedProf === p.label ? '700' : '500',
              fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
              border: `1.5px solid ${regulatedProf === p.label ? T.gold : T.bg4}`,
              background: regulatedProf === p.label ? `${T.gold}18` : T.bg3,
              color: regulatedProf === p.label ? T.gold : T.muted }}>
            {p.label}
          </button>
        ))}
      </div>

      {regulatedProf && !regulatedProf.includes('Not regulated') && !regulatedProf.includes('Not on') && (
        <div style={{ background: '#1B2D5B', border: `1px solid ${T.bg4}`,
          borderRadius: '8px', padding: '12px 14px', marginBottom: '18px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: T.white, marginBottom: '4px' }}>
            UK regulatory body
          </p>
          <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.5 }}>
            {REGULATED_PROFESSIONS.find(p => p.label === regulatedProf)?.body}
          </p>
        </div>
      )}

      {/* ── Section 3: Summary builder ── */}
      <p style={sectionHead}>3 — Build your UK professional summary</p>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>What role or title best describes you in the UK context?</label>
        <input type="text" value={targetRole}
          onChange={e => { setTargetRole(e.target.value); setGenerated(false) }}
          placeholder="e.g. registered nurse, practising solicitor, civil engineer, secondary school teacher…"
          style={inputStyle} />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>What are you looking for? (optional)</label>
        <input type="text" value={lookingFor}
          onChange={e => { setLookingFor(e.target.value); setGenerated(false) }}
          placeholder="e.g. a senior nursing role in an NHS trust, a solicitor position in a commercial law firm…"
          style={inputStyle} />
      </div>

      <button onClick={generate} disabled={!canGenerate}
        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
          background: canGenerate ? '#1B2D5B' : T.bg4,
          color: canGenerate ? T.gold : T.mutedDk,
          fontSize: '13px', fontWeight: '700', cursor: canGenerate ? 'pointer' : 'default',
          fontFamily: 'inherit', marginBottom: '12px',
          border: `1.5px solid ${canGenerate ? T.gold + '44' : 'transparent'}` }}>
        Generate my professional summary →
      </button>

      {generated && summary && (
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Your UK professional summary — edit freely</label>
          <textarea value={summary} onChange={e => setSummary(e.target.value)}
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', lineHeight: 1.6 }} />
          <p style={{ fontSize: '11px', color: T.mutedDk, marginTop: '6px', lineHeight: 1.4 }}>
            This summary uses UK conventions. Copy it into your LinkedIn About section, CV personal statement, or any professional intro.
          </p>
        </div>
      )}

      {saved && (
        <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}44`,
          borderRadius: '8px', padding: '10px 14px', marginBottom: '12px',
          display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>✓</span>
          <p style={{ fontSize: '13px', color: T.green, fontWeight: '700' }}>
            Saved to profile — completion prompt pre-filled below
          </p>
        </div>
      )}

      {generated && summary && !saved && (
        <button onClick={save}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
            background: T.gold, color: T.white,
            fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          Save to profile →
        </button>
      )}
    </div>
  )
}
