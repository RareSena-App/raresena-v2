import { useState } from 'react'
import { T } from '../App.jsx'

const PATHS = [
  {
    key: 'employment',
    icon: '💼',
    label: 'Employment',
    desc: 'Securing a role at or above your pre-arrival level',
    examples: [
      'In the next 90 days I will secure a role in my sector at or above my pre-arrival level.',
      'In the next 90 days I will send 3 targeted applications per week and receive at least one offer.',
      'In the next 90 days I will complete my professional registration and apply to employers in my specialism.',
    ],
  },
  {
    key: 'business',
    icon: '🚀',
    label: 'Business',
    desc: 'Starting or growing a business or self-employment income',
    examples: [
      'In the next 90 days I will generate my first £1,000 from my own business or service.',
      'In the next 90 days I will register my business and sign my first paying client.',
      'In the next 90 days I will launch my product or service and make my first sale.',
    ],
  },
  {
    key: 'financial',
    icon: '💷',
    label: 'Financial sovereignty',
    desc: 'Building savings, credit, clearing debt, financial independence',
    examples: [
      'In the next 90 days I will save £500 and move my credit score into the fair band.',
      'In the next 90 days I will clear my highest-interest debt and open a savings account.',
      'In the next 90 days I will build a one-month emergency fund and open my first investment account.',
    ],
  },
  {
    key: 'qualification',
    icon: '🎓',
    label: 'Professional qualification',
    desc: 'UK registration, ENIC, retraining, exams',
    examples: [
      'In the next 90 days I will submit my ENIC application and complete the first stage of my UK registration.',
      'In the next 90 days I will pass my [professional exam] and apply for chartered membership.',
      'In the next 90 days I will complete [course] and receive my UK-recognised qualification.',
    ],
  },
  {
    key: 'network',
    icon: '🤝',
    label: 'Network & visibility',
    desc: 'Building professional contacts, LinkedIn presence, sector visibility',
    examples: [
      'In the next 90 days I will attend 3 networking events and build 10 meaningful professional connections.',
      'In the next 90 days I will rebuild my LinkedIn profile and connect with 20 contacts in my sector.',
      'In the next 90 days I will become visible in one professional community and secure one meaningful introduction.',
    ],
  },
  {
    key: 'wellbeing',
    icon: '🌿',
    label: 'Wellbeing & stability',
    desc: 'Mental health, housing, family, health systems, stability',
    examples: [
      'In the next 90 days I will maintain my daily routine, complete my 30-day streak, and stabilise my mental health.',
      'In the next 90 days I will resolve my housing situation and register with a GP and dentist.',
      'In the next 90 days I will access the mental health support I have been avoiding and build one new grounding practice.',
    ],
  },
]

export default function NinetyDayDirectionWorksheet({ onSave }) {
  const [selectedPath, setSelectedPath] = useState(null)
  const [direction, setDirection] = useState('')
  const [milestones, setMilestones] = useState({ d30: '', d60: '', d90: '' })
  const [saved, setSaved] = useState(false)

  const path = PATHS.find(p => p.key === selectedPath)
  const canSave = direction.trim().length > 20
    && milestones.d30.trim().length > 3
    && milestones.d60.trim().length > 3
    && milestones.d90.trim().length > 3

  function save() {
    setSaved(true)
    if (onSave) onSave(direction.trim())
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg2, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
  }
  const labelStyle = {
    fontSize: '11px', fontWeight: '700', color: T.mutedDk,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    display: 'block', marginBottom: '6px',
  }

  return (
    <div>
      {/* Step 1: Path selector */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
        1 — Choose your primary path
      </p>
      <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '12px' }}>
        Where does your primary energy go for the next 90 days? You are not abandoning the others — you are choosing your focus.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {PATHS.map(p => {
          const sel = selectedPath === p.key
          return (
            <button key={p.key} onClick={() => { setSelectedPath(p.key); setDirection('') }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px', textAlign: 'left',
                cursor: 'pointer', fontFamily: 'inherit',
                border: `1.5px solid ${sel ? T.gold : T.bg4}`,
                background: sel ? `${T.gold}15` : T.bg3 }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '700',
                  color: sel ? T.gold : T.white, marginBottom: '2px' }}>{p.label}</p>
                <p style={{ fontSize: '12px', color: T.mutedDk }}>{p.desc}</p>
              </div>
              {sel && <span style={{ color: T.gold, fontSize: '16px', flexShrink: 0 }}>✓</span>}
            </button>
          )
        })}
      </div>

      {/* Step 2: Example statements */}
      {path && (
        <>
          <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
            2 — Example direction statements
          </p>
          <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '10px' }}>
            Select one that resonates or use it as a starting point. Edit it until it is precisely yours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {path.examples.map((ex, i) => (
              <button key={i} onClick={() => setDirection(ex)}
                style={{ padding: '12px 14px', borderRadius: '10px', textAlign: 'left',
                  cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.5,
                  border: `1.5px solid ${direction === ex ? T.gold : T.bg4}`,
                  background: direction === ex ? `${T.gold}12` : T.bg3,
                  color: direction === ex ? T.gold : T.muted, fontSize: '13px' }}>
                {ex}
              </button>
            ))}
          </div>

          {/* Step 3: Direction builder */}
          <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
            3 — Write your direction statement
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Your 90-day direction — one precise sentence</label>
            <div style={{ position: 'relative' }}>
              <textarea value={direction} onChange={e => setDirection(e.target.value)}
                placeholder="In the next 90 days I will…"
                rows={3}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', lineHeight: 1.6,
                  border: `1.5px solid ${direction.length > 20 ? T.gold + '66' : T.bg4}` }} />
            </div>
            {direction.trim() && !direction.trim().toLowerCase().startsWith('in the next') && (
              <p style={{ fontSize: '11px', color: '#E08C30', marginTop: '5px' }}>
                Start with "In the next 90 days I will…" — specificity is the point.
              </p>
            )}
          </div>

          {/* Step 4: Milestones */}
          <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
            4 — Set three milestones
          </p>
          <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '12px' }}>
            What will you have achieved at each checkpoint? Be specific — not "make progress" but "have done X."
          </p>

          {[
            { key: 'd30', label: '30-day checkpoint', placeholder: 'What will you have done or completed by day 30?' },
            { key: 'd60', label: '60-day checkpoint', placeholder: 'What milestone marks the halfway point?' },
            { key: 'd90', label: '90-day checkpoint', placeholder: 'What does success look like on day 90?' },
          ].map(m => (
            <div key={m.key} style={{ background: T.bg3, border: `1px solid ${milestones[m.key].trim() ? T.gold + '44' : T.bg4}`,
              borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
              <label style={{ ...labelStyle, color: milestones[m.key].trim() ? T.gold : T.mutedDk }}>
                {m.label}
              </label>
              <input type="text" value={milestones[m.key]}
                onChange={e => setMilestones(prev => ({ ...prev, [m.key]: e.target.value }))}
                placeholder={m.placeholder}
                style={inputStyle} />
            </div>
          ))}

          <div style={{ marginTop: '6px' }}>
            {saved ? (
              <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}44`,
                borderRadius: '8px', padding: '12px 14px',
                display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <p style={{ fontSize: '13px', color: T.green, fontWeight: '700' }}>
                  Direction saved — appears on your Stage 4 dashboard
                </p>
              </div>
            ) : (
              <button onClick={save} disabled={!canSave}
                style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                  background: canSave ? T.gold : T.bg4,
                  color: canSave ? T.white : T.mutedDk,
                  fontSize: '14px', fontWeight: '700',
                  cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                {canSave ? 'Save my 90-day direction →' : 'Complete direction + all 3 milestones to save'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
