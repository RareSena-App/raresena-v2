import { useState } from 'react'
import { T } from '../App.jsx'

const STAGES = [
  {
    num: 1, name: 'Reset', icon: '🌱',
    prompt: 'What was the single hardest thing about arriving in the UK — and what got you through it?',
    placeholder: 'The hardest thing was… What helped me was…',
  },
  {
    num: 2, name: 'Rediscover', icon: '🔍',
    prompt: 'What did you discover about yourself during Stage 2 that you did not expect?',
    placeholder: 'I discovered that…',
  },
  {
    num: 3, name: 'Routine', icon: '⚡',
    prompt: 'Which habit or routine from Stage 3 has had the biggest impact on your daily life?',
    placeholder: 'The habit that changed everything was…',
  },
  {
    num: 4, name: 'Rise', icon: '📈',
    prompt: 'What was the first moment in Stage 4 where you felt you were truly building — not just surviving?',
    placeholder: 'The moment I knew I was rising was…',
  },
  {
    num: 5, name: 'Realize', icon: '🏆',
    prompt: 'Looking at your full journey — what is the single biggest difference between the person who started and the person reading this?',
    placeholder: 'Then I was… Now I am…',
  },
]

export default function JourneyDocumentation({ onComplete }) {
  const [reflections, setReflections] = useState({})
  const [closing, setClosing] = useState('')
  const [saved, setSaved] = useState(false)

  const filledCount = Object.keys(reflections).filter(k => (reflections[k] || '').trim().length > 20).length
  const canSave = filledCount >= 4 && closing.trim().length > 20

  function setReflection(key, val) {
    setReflections(prev => ({ ...prev, [key]: val }))
  }

  function save() {
    setSaved(true)
    const summary = STAGES.map(s => {
      const r = reflections[s.name] || ''
      return r ? `${s.name}: ${r.slice(0, 80)}${r.length > 80 ? '…' : ''}` : ''
    }).filter(Boolean).join(' | ')
    if (onComplete) onComplete(summary)
  }

  const inputBase = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg3, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    resize: 'none', lineHeight: 1.6, boxSizing: 'border-box',
    display: 'block',
  }

  return (
    <div>
      <div style={{ background: `${T.gold}12`, border: `1px solid ${T.gold}44`,
        borderRadius: '10px', padding: '12px 14px', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: T.gold, fontWeight: '700', marginBottom: '4px' }}>
          Your rebuild story — in your own words
        </p>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.55 }}>
          One reflection per stage. Take your time. This becomes your Rebuild Record — a permanent document of what you survived and built.
        </p>
      </div>

      {/* Progress indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {STAGES.map(s => {
          const filled = (reflections[s.name] || '').trim().length > 20
          return (
            <div key={s.name} style={{ flex: 1, height: '4px', borderRadius: '2px',
              background: filled ? T.gold : T.bg4, transition: 'background 0.3s' }} />
          )
        })}
      </div>

      {STAGES.map(s => {
        const val = reflections[s.name] || ''
        const filled = val.trim().length > 20
        return (
          <div key={s.name} style={{ background: T.bg3,
            border: `1px solid ${filled ? T.gold + '44' : T.bg4}`,
            borderRadius: '10px', padding: '14px 16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px' }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '800', color: filled ? T.gold : T.mutedDk,
                  letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Stage {s.num} — {s.name}
                </p>
              </div>
              {filled && <span style={{ marginLeft: 'auto', color: T.gold, fontSize: '12px' }}>✓</span>}
            </div>
            <p style={{ fontSize: '13px', color: T.white, lineHeight: 1.55, marginBottom: '10px', fontWeight: '500' }}>
              {s.prompt}
            </p>
            <textarea
              rows={3}
              value={val}
              onChange={e => setReflection(s.name, e.target.value)}
              placeholder={s.placeholder}
              style={{ ...inputBase, borderColor: filled ? `${T.gold}44` : T.bg4 }}
            />
            {val.length > 0 && (
              <p style={{ fontSize: '11px', color: filled ? T.green : T.mutedDk, marginTop: '4px' }}>
                {val.length} chars {filled ? '✓' : `— write at least ${20 - val.trim().length} more`}
              </p>
            )}
          </div>
        )
      })}

      {/* Closing statement */}
      <div style={{ background: `${T.gold}12`, border: `1px solid ${T.gold}44`,
        borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
        <p style={{ fontSize: '12px', fontWeight: '800', color: T.gold,
          letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Closing statement
        </p>
        <p style={{ fontSize: '13px', color: T.white, fontWeight: '500', lineHeight: 1.55, marginBottom: '10px' }}>
          Complete the sentence: "The rebuild taught me that I am someone who…"
        </p>
        <textarea
          rows={3}
          value={closing}
          onChange={e => setClosing(e.target.value)}
          placeholder="…can rebuild even when the ground disappears. I am someone who…"
          style={inputBase}
        />
      </div>

      <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5,
        textAlign: 'center', marginBottom: '14px' }}>
        {filledCount}/5 stage reflections filled · {closing.trim().length > 20 ? 'Closing ✓' : 'Closing needed'}
      </p>

      {saved ? (
        <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}44`,
          borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>✓</span>
          <p style={{ fontSize: '13px', color: T.green, fontWeight: '700' }}>
            Journey documented — completion prompt pre-filled below
          </p>
        </div>
      ) : (
        <button onClick={save} disabled={!canSave}
          style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
            background: canSave ? T.gold : T.bg4,
            color: canSave ? T.white : T.mutedDk,
            fontSize: '14px', fontWeight: '700',
            cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit' }}>
          {canSave ? 'Save my journey documentation →' : `Complete ${5 - filledCount > 0 ? `${5 - filledCount} more stage${5 - filledCount > 1 ? 's' : ''}` : 'closing statement'} to save`}
        </button>
      )}
    </div>
  )
}
