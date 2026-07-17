import { useState } from 'react'
import { T } from '../App.jsx'

const CATEGORIES = [
  {
    key: 'body', icon: '🏃', label: 'Body', slot: 2,
    habits: [
      '10-minute walk outside',
      '15-min workout or stretch',
      'Sleep by fixed time nightly',
      'Drink 2 litres of water daily',
      'Cook one meal from scratch',
    ],
  },
  {
    key: 'finances', icon: '💰', label: 'Finances', slot: 3,
    habits: [
      'Log every expense same day',
      'Transfer to savings weekly',
      'Review budget every Sunday',
      'Check credit file monthly',
      'No impulse spend before 10am',
    ],
  },
  {
    key: 'connection', icon: '🤝', label: 'Connection', slot: 4,
    habits: [
      'Message one person in my network daily',
      'Engage in Rare Circle 3x per week',
      'Call family or close friends weekly',
      'Attend one community event per month',
      'Reply to one professional message daily',
    ],
  },
  {
    key: 'progress', icon: '🚀', label: 'Forward progress', slot: 5,
    habits: [
      '30 minutes on my primary goal daily',
      'Apply for one job or opportunity per day',
      'Learn one relevant thing daily',
      '20 min on professional registration daily',
      'Create or publish one piece of content',
    ],
  },
  {
    key: 'mind', icon: '🧠', label: 'Mind & wellbeing', slot: 5,
    habits: [
      '5 minutes of breathwork or meditation',
      'Read for 15 minutes',
      'No phone for first 20 minutes',
      'Evening gratitude note — one sentence',
      'Daily honest self check-in',
    ],
  },
]

export default function HabitLibrary({ onSelect }) {
  const [anchorHabit, setAnchorHabit] = useState('')
  const [selected, setSelected] = useState({})

  const allSelected = Object.keys(selected).length >= 4 // need 4 more besides anchor

  function pick(catKey, habit) {
    const prev = selected[catKey]
    setSelected(s => ({ ...s, [catKey]: habit }))
    if (onSelect) {
      const updated = { ...selected, [catKey]: habit }
      const habits = buildHabits(updated)
      habits.forEach((h, i) => onSelect(`habit_${i + 1}`, h))
    }
  }

  function buildHabits(sel) {
    const anchor = anchorHabit.trim() || 'Anchor habit (from Task 1.4)'
    const body = sel.body || ''
    const fin = sel.finances || ''
    const conn = sel.connection || ''
    const prog = sel.progress || sel.mind || ''
    return [anchor, body, fin, conn, prog]
  }

  const habits = buildHabits(selected)
  const filledCount = 1 + Object.keys(selected).length
  const pct = Math.min(filledCount, 5) / 5 * 100

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.gold}55`, background: T.bg3, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div>
      {/* Anchor habit */}
      <div style={{ background: `${T.gold}12`, border: `1px solid ${T.gold}44`,
        borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: T.gold, marginBottom: '6px' }}>
          ⚓ Habit 1 — your anchor (from Task 1.4)
        </p>
        <input type="text" value={anchorHabit}
          onChange={e => {
            setAnchorHabit(e.target.value)
            if (onSelect) onSelect('habit_1', e.target.value || 'Anchor habit')
          }}
          placeholder="e.g. Morning journal — 5 minutes"
          style={inputStyle} />
        <p style={{ fontSize: '11px', color: T.mutedDk, marginTop: '5px' }}>
          Pre-filled from Task 1.4 — edit if your habit has shifted.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#1B2D5B', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
          height: '6px', marginBottom: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: T.gold,
            borderRadius: '10px', transition: 'width 0.3s' }} />
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
          {Math.min(filledCount, 5)} of 5 set{filledCount >= 5 ? ' — confirm all five below' : ` — select ${5 - Math.min(filledCount, 5)} more`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
          {habits.map((h, i) => (
            <div key={i} style={{ background: h && h !== '' && !h.includes('Anchor habit (from')
              ? `${T.gold}30` : 'rgba(255,255,255,0.08)',
              borderRadius: '7px', padding: '9px 11px',
              border: h && !h.includes('Anchor habit (from') ? `1px solid ${T.gold}50` : 'none' }}>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)',
                marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Habit {i + 1}{i === 0 ? ' — Anchor' : i === 1 ? ' — Body' : i === 2 ? ' — Finances'
                  : i === 3 ? ' — Connection' : ' — Progress / Mind'}
              </p>
              <p style={{ fontSize: '12px', color: T.white, fontWeight: '600', lineHeight: 1.3 }}>
                {h || <span style={{ opacity: 0.35, fontStyle: 'italic' }}>Not yet selected</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category pickers */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Select one habit per dimension
      </p>

      {CATEGORIES.map(cat => (
        <div key={cat.key} style={{ background: T.bg3, border: `1px solid ${selected[cat.key] ? T.gold + '55' : T.bg4}`,
          borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: selected[cat.key] ? T.gold : T.white,
            marginBottom: '10px' }}>
            {cat.icon} {cat.label}
            {selected[cat.key] && <span style={{ fontSize: '11px', color: T.mutedDk,
              fontWeight: '500', marginLeft: '8px' }}>— {selected[cat.key]}</span>}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {cat.habits.map(h => {
              const isSel = selected[cat.key] === h
              return (
                <button key={h} onClick={() => pick(cat.key, h)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', borderRadius: '7px', textAlign: 'left',
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: `1.5px solid ${isSel ? T.gold : T.bg4}`,
                    background: isSel ? `${T.gold}18` : T.bg2 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px',
                    border: `1.5px solid ${isSel ? T.gold : T.bg4}`,
                    background: isSel ? T.gold : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '11px' }}>
                    {isSel && <span style={{ color: '#000' }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '13px', color: isSel ? T.gold : T.muted }}>{h}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
