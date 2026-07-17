import { useState } from 'react'
import { T } from '../App.jsx'

const PILLARS = [
  {
    key: 'financial', icon: '💰', title: 'Financial sovereignty',
    desc: 'You control your income and are not dependent on a single employer or benefit.',
    prompts: [
      'What income streams do you currently have or are actively building?',
      'What is your financial floor — the minimum monthly income you need to feel stable?',
      'What is your 12-month financial target?',
    ],
    examples: ['Emergency fund of £3,000 built', 'Two income streams: employment + freelance', 'No reliance on a single employer for >80% of income'],
  },
  {
    key: 'immigration', icon: '🛂', title: 'Immigration sovereignty',
    desc: 'Your immigration status is stable, understood, and not a source of anxiety.',
    prompts: [
      'What is your current immigration status and when does it expire?',
      'What is your ILR or citizenship target date?',
      'What is the one immigration action you will take in the next 90 days?',
    ],
    examples: ['ILR application submitted', 'eVisa checked and renewal date in diary', 'Solicitor booked for next renewal'],
  },
  {
    key: 'professional', icon: '🏢', title: 'Professional sovereignty',
    desc: 'Your skills and career direction are yours — not dictated by desperation.',
    prompts: [
      'What role or field do you want to be in 3 years from now?',
      'What professional qualification, recognition, or project will get you there?',
      'What is one professional boundary you now hold that you could not hold before?',
    ],
    examples: ['Professional qualification pathway identified', 'UK CV up to date and tailored', '3 meaningful roles applied for this quarter'],
  },
  {
    key: 'network', icon: '🤝', title: 'Network sovereignty',
    desc: 'You have a community around you — people who know your name and your work.',
    prompts: [
      'Who are the 3 people most invested in your growth in the UK?',
      'What community do you actively participate in — online or offline?',
      'How do you give back to others earlier in their rebuild journey?',
    ],
    examples: ['Active in Rare Circle and 2 sector communities', 'Regular connection with 10+ UK professionals', 'Mentoring one person in an earlier stage'],
  },
  {
    key: 'wellbeing', icon: '🌿', title: 'Wellbeing sovereignty',
    desc: 'You protect your mental, physical, and emotional health as a non-negotiable.',
    prompts: [
      'What daily or weekly practice protects your wellbeing regardless of what else is happening?',
      'What is the earliest warning sign that your wellbeing is under strain — and what do you do when it shows?',
      'Who can you call at 2am?',
    ],
    examples: ['Daily anchor habit maintained for 90+ days', 'Weekly review practice active', 'At least one trusted person outside of work context'],
  },
]

const RHYTHM_OPTIONS = ['Weekly', 'Fortnightly', 'Monthly', 'Quarterly']

export default function SovereigntyPlan({ onSave }) {
  const [open, setOpen] = useState(null)
  const [responses, setResponses] = useState({})
  const [milestone1, setMilestone1] = useState('')
  const [milestone2, setMilestone2] = useState('')
  const [milestone3, setMilestone3] = useState('')
  const [rhythm, setRhythm] = useState('Monthly')
  const [saved, setSaved] = useState(false)

  function setResponse(pillarKey, promptIdx, val) {
    const key = `${pillarKey}_${promptIdx}`
    setResponses(prev => ({ ...prev, [key]: val }))
  }

  function getResponse(pillarKey, promptIdx) {
    return responses[`${pillarKey}_${promptIdx}`] || ''
  }

  function pillarProgress(pillarKey) {
    return PILLARS.find(p => p.key === pillarKey).prompts
      .filter((_, i) => getResponse(pillarKey, i).trim().length > 5).length
  }

  const totalResponses = PILLARS.reduce((sum, p) => sum + pillarProgress(p.key), 0)
  const totalQuestions = PILLARS.reduce((sum, p) => sum + p.prompts.length, 0)
  const pct = (totalResponses / totalQuestions) * 100

  const canSave = totalResponses >= 6 && milestone1.trim() && milestone2.trim() && milestone3.trim()

  function save() {
    setSaved(true)
    const topMilestone = milestone1.trim()
    const summary = `Milestone 1: ${milestone1.trim()} | Milestone 2: ${milestone2.trim()} | Milestone 3: ${milestone3.trim()} | Review: ${rhythm}`
    if (onSave) onSave(topMilestone, summary)
  }

  const inputBase = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg2, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    resize: 'none', lineHeight: 1.6, boxSizing: 'border-box',
    display: 'block',
  }

  return (
    <div>
      {/* Intro */}
      <div style={{ background: `${T.gold}12`, border: `1px solid ${T.gold}44`,
        borderRadius: '10px', padding: '12px 14px', marginBottom: '18px' }}>
        <p style={{ fontSize: '13px', color: T.gold, fontWeight: '700', marginBottom: '4px' }}>
          Your Sovereignty Plan — five pillars
        </p>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.55 }}>
          Answer at least 2 prompts per pillar you care about most. This plan lives with you — not in a drawer.
        </p>
      </div>

      {/* Overall progress */}
      <div style={{ background: '#1B2D5B', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
          height: '6px', marginBottom: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: T.gold,
            borderRadius: '10px', transition: 'width 0.3s' }} />
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
          {totalResponses} of {totalQuestions} prompts answered
        </p>
      </div>

      {/* Pillars */}
      {PILLARS.map(pillar => {
        const isOpen = open === pillar.key
        const progress = pillarProgress(pillar.key)
        const allDone = progress === pillar.prompts.length

        return (
          <div key={pillar.key} style={{ marginBottom: '10px' }}>
            <button onClick={() => setOpen(isOpen ? null : pillar.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                background: allDone ? `${T.gold}12` : T.bg3,
                border: `1px solid ${allDone ? T.gold + '44' : T.bg4}`,
                borderRadius: isOpen ? '10px 10px 0 0' : '10px',
                padding: '13px 14px', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{pillar.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '700',
                  color: allDone ? T.gold : T.white, marginBottom: '2px' }}>
                  {pillar.title}
                </p>
                <p style={{ fontSize: '11px', color: T.mutedDk }}>
                  {progress}/{pillar.prompts.length} prompts answered
                </p>
              </div>
              <span style={{ color: T.mutedDk, fontSize: '16px', transition: 'transform 0.2s',
                transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
            </button>

            {isOpen && (
              <div style={{ background: T.bg2, border: `1px solid ${T.bg4}`,
                borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '14px 16px' }}>
                <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '14px' }}>
                  {pillar.desc}
                </p>

                {pillar.prompts.map((prompt, i) => {
                  const val = getResponse(pillar.key, i)
                  const filled = val.trim().length > 5
                  return (
                    <div key={i} style={{ marginBottom: '14px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '600',
                        color: filled ? T.gold : T.white, marginBottom: '6px', lineHeight: 1.4 }}>
                        {i + 1}. {prompt}
                      </p>
                      <textarea rows={2}
                        value={val}
                        onChange={e => setResponse(pillar.key, i, e.target.value)}
                        placeholder="Your answer…"
                        style={{ ...inputBase, borderColor: filled ? `${T.gold}44` : T.bg4 }} />
                    </div>
                  )
                })}

                <div style={{ marginTop: '6px', padding: '10px 12px',
                  background: T.bg3, borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: T.mutedDk,
                    fontWeight: '700', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Examples from other rebuilders
                  </p>
                  {pillar.examples.map((ex, i) => (
                    <p key={i} style={{ fontSize: '12px', color: T.muted,
                      lineHeight: 1.5, marginBottom: '3px' }}>· {ex}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Three milestones */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginTop: '24px', marginBottom: '8px' }}>
        Three most important sovereignty milestones
      </p>
      <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '12px' }}>
        What are the three moments you will know you are truly sovereign? Be specific and date them.
      </p>
      {[
        ['Milestone 1', milestone1, setMilestone1, 'e.g. ILR granted — target July 2026'],
        ['Milestone 2', milestone2, setMilestone2, 'e.g. £3,000 emergency fund reached — target Sept 2026'],
        ['Milestone 3', milestone3, setMilestone3, 'e.g. First client from my own business — target Dec 2026'],
      ].map(([label, val, setter, placeholder], i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <p style={{ fontSize: '12px', color: val.trim() ? T.gold : T.mutedDk,
            fontWeight: '600', marginBottom: '5px' }}>{label}</p>
          <input type="text" value={val} onChange={e => setter(e.target.value)}
            placeholder={placeholder}
            style={{ ...inputBase, height: 'auto', resize: 'none' }} />
        </div>
      ))}

      {/* Review rhythm */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginTop: '20px', marginBottom: '8px' }}>
        Review rhythm
      </p>
      <p style={{ fontSize: '12px', color: T.mutedDk, marginBottom: '10px' }}>
        How often will you return to this plan?
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {RHYTHM_OPTIONS.map(r => {
          const sel = rhythm === r
          return (
            <button key={r} onClick={() => setRhythm(r)}
              style={{ padding: '8px 16px', borderRadius: '20px', border: 'none',
                background: sel ? T.gold : T.bg3, color: sel ? T.bg : T.muted,
                fontWeight: sel ? '700' : '500', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit' }}>
              {r}
            </button>
          )
        })}
      </div>

      {saved ? (
        <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}44`,
          borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>✓</span>
          <p style={{ fontSize: '13px', color: T.green, fontWeight: '700' }}>
            Sovereignty Plan saved — completion prompt pre-filled below
          </p>
        </div>
      ) : (
        <button onClick={save} disabled={!canSave}
          style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
            background: canSave ? T.gold : T.bg4,
            color: canSave ? T.white : T.mutedDk,
            fontSize: '14px', fontWeight: '700',
            cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit' }}>
          {canSave ? 'Save my Sovereignty Plan →' : 'Answer at least 6 prompts and fill all 3 milestones to save'}
        </button>
      )}
    </div>
  )
}
