import { useState } from 'react'
import { T } from '../App.jsx'

const VALUES = [
  'Achievement','Adventure','Balance','Belonging','Compassion',
  'Community','Courage','Creativity','Dignity','Discipline',
  'Empathy','Excellence','Faith','Family','Freedom',
  'Generosity','Gratitude','Growth','Health','Honesty',
  'Hope','Humility','Identity','Independence','Integrity',
  'Innovation','Justice','Kindness','Leadership','Learning',
  'Legacy','Loyalty','Love','Meaningful Work','Patience',
  'Perseverance','Pride','Purpose','Resilience','Respect',
  'Responsibility','Security','Self-reliance','Service','Simplicity',
  'Spiritual connection','Stability','Trust','Unity','Wisdom',
]

export default function ValuesExercise({ onComplete }) {
  const [phase, setPhase] = useState(1) // 1=pick10, 2=pick3, 3=reflect
  const [top10, setTop10] = useState([])
  const [top3, setTop3] = useState([])
  const [reflections, setReflections] = useState({}) // { value: { before, now } }

  // ── Phase 1: pick top 10 ──
  function toggleTop10(val) {
    setTop10(prev => {
      if (prev.includes(val)) return prev.filter(v => v !== val)
      if (prev.length >= 10) return prev
      return [...prev, val]
    })
  }

  // ── Phase 2: pick top 3 ──
  function toggleTop3(val) {
    setTop3(prev => {
      if (prev.includes(val)) return prev.filter(v => v !== val)
      if (prev.length >= 3) return prev
      return [...prev, val]
    })
  }

  // ── Phase 3: reflections ──
  function setReflection(value, field, text) {
    setReflections(prev => ({
      ...prev,
      [value]: { ...(prev[value] || {}), [field]: text }
    }))
  }

  function phase3Complete() {
    return top3.every(v => {
      const r = reflections[v] || {}
      return (r.before || '').trim().length > 5 && (r.now || '').trim().length > 5
    })
  }

  function finish() {
    const topValue = top3[0]
    const nowText = (reflections[topValue]?.now || '').trim()
    const summary = `My top value is ${topValue}. ${nowText}`
    if (onComplete) onComplete(summary, top3, reflections)
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg3, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', resize: 'vertical', minHeight: '70px',
  }

  // ── Render Phase 1 ──
  if (phase === 1) return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '13px', color: T.muted, lineHeight: 1.5 }}>
          Select your top 10 values. Take your time.
        </p>
        <span style={{ fontSize: '13px', fontWeight: '800',
          color: top10.length === 10 ? T.gold : T.mutedDk, flexShrink: 0, marginLeft: '12px' }}>
          {top10.length}/10
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {VALUES.map(v => {
          const selected = top10.includes(v)
          const disabled = top10.length >= 10 && !selected
          return (
            <button key={v} onClick={() => !disabled && toggleTop10(v)}
              style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
                border: `1.5px solid ${selected ? T.gold : T.bg4}`,
                background: selected ? `${T.gold}20` : T.bg3,
                color: selected ? T.gold : disabled ? T.bg4 : T.white,
                transition: 'all 0.15s' }}>
              {v}
            </button>
          )
        })}
      </div>

      <button onClick={() => setPhase(2)} disabled={top10.length < 10}
        style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
          background: top10.length === 10 ? T.gold : T.bg4,
          color: top10.length === 10 ? T.white : T.mutedDk,
          fontSize: '14px', fontWeight: '700', cursor: top10.length === 10 ? 'pointer' : 'default',
          fontFamily: 'inherit' }}>
        {top10.length === 10 ? 'Continue — choose your top 3 →' : `Select ${10 - top10.length} more to continue`}
      </button>
    </div>
  )

  // ── Render Phase 2 ──
  if (phase === 2) return (
    <div>
      <p style={{ fontSize: '13px', color: T.muted, lineHeight: 1.5, marginBottom: '4px' }}>
        From your 10, choose your top 3.
      </p>
      <p style={{ fontSize: '11px', color: T.mutedDk, marginBottom: '14px' }}>
        These are the values that are non-negotiable — the ones you would not sacrifice even in a rebuild.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {top10.map(v => {
          const selected = top3.includes(v)
          const rank = top3.indexOf(v) + 1
          const disabled = top3.length >= 3 && !selected
          return (
            <button key={v} onClick={() => !disabled && toggleTop3(v)}
              style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700',
                cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
                border: `2px solid ${selected ? T.gold : T.bg4}`,
                background: selected ? T.gold : T.bg3,
                color: selected ? '#000' : disabled ? T.bg4 : T.white,
                transition: 'all 0.15s', position: 'relative' }}>
              {selected && rank > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-6px',
                  background: '#1B2D5B', color: T.gold, fontSize: '10px', fontWeight: '800',
                  width: '18px', height: '18px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {rank}
                </span>
              )}
              {v}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setPhase(1)}
          style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${T.bg4}`,
            background: 'transparent', color: T.mutedDk, fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back
        </button>
        <button onClick={() => setPhase(3)} disabled={top3.length < 3}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
            background: top3.length === 3 ? T.gold : T.bg4,
            color: top3.length === 3 ? T.white : T.mutedDk,
            fontSize: '14px', fontWeight: '700', cursor: top3.length === 3 ? 'pointer' : 'default',
            fontFamily: 'inherit' }}>
          {top3.length === 3 ? 'Continue — reflect on your top 3 →' : `Choose ${3 - top3.length} more`}
        </button>
      </div>
    </div>
  )

  // ── Render Phase 3 ──
  return (
    <div>
      <p style={{ fontSize: '13px', color: T.muted, lineHeight: 1.5, marginBottom: '14px' }}>
        For each of your top 3 values, write one sentence for each question. Be honest — not impressive.
      </p>

      {top3.map((v, i) => {
        const r = reflections[v] || {}
        return (
          <div key={v} style={{ background: T.bg3, border: `1px solid ${i === 0 ? T.gold : T.bg4}`,
            borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: T.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '800', color: '#000', flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '15px', fontWeight: '800', color: i === 0 ? T.gold : T.white }}>{v}</p>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: T.mutedDk,
                letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                How did this value show up in your life before arrival?
              </label>
              <textarea value={r.before || ''} onChange={e => setReflection(v, 'before', e.target.value)}
                placeholder="One honest sentence…" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: T.mutedDk,
                letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                How do you want it to show up in your rebuild here?
              </label>
              <textarea value={r.now || ''} onChange={e => setReflection(v, 'now', e.target.value)}
                placeholder="One honest sentence…" style={inputStyle} />
            </div>
          </div>
        )
      })}

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button onClick={() => setPhase(2)}
          style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${T.bg4}`,
            background: 'transparent', color: T.mutedDk, fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back
        </button>
        <button onClick={finish} disabled={!phase3Complete()}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
            background: phase3Complete() ? T.gold : T.bg4,
            color: phase3Complete() ? T.white : T.mutedDk,
            fontSize: '14px', fontWeight: '700',
            cursor: phase3Complete() ? 'pointer' : 'default', fontFamily: 'inherit' }}>
          {phase3Complete() ? 'Save my values →' : 'Complete all reflections to continue'}
        </button>
      </div>
    </div>
  )
}
