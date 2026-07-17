import { useState, useEffect } from 'react'
import { useApp, T, supabase } from '../App.jsx'

const PRESET_HABITS = [
  { id: 'journal', icon: '📓', name: 'Morning journal', desc: '5 minutes of free writing on waking' },
  { id: 'walk', icon: '🚶', name: '10-minute walk', desc: 'Outside, phone away' },
  { id: 'task', icon: '✅', name: 'One task before 10am', desc: 'Complete one thing before anything else' },
  { id: 'gratitude', icon: '🙏', name: 'Gratitude note', desc: 'One thing, written down' },
  { id: 'water', icon: '💧', name: 'Drink water on waking', desc: 'Before coffee, before the phone' },
  { id: 'read', icon: '📖', name: 'Read for 10 minutes', desc: 'Not news, not social media' },
  { id: 'breathe', icon: '🧘', name: '5-minute breathing', desc: 'Box breathing or simple stillness' },
  { id: 'plan', icon: '📋', name: 'Review your day', desc: '2 minutes on what matters today' },
]

export default function HabitSelector({ onSelect }) {
  const { user } = useApp()
  const uid = user?.supabaseId

  const [selected, setSelected] = useState(null)
  const [customHabit, setCustomHabit] = useState('')
  const [habitTime, setHabitTime] = useState('')
  const [saved, setSaved] = useState(false)
  const [existingId, setExistingId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    supabase.from('habit_streaks').select('*').eq('user_id', uid).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setExistingId(data.id)
          setHabitTime(data.habit_time || '')
          const preset = PRESET_HABITS.find(h => h.name === data.habit_name)
          if (preset) {
            setSelected(preset.id)
          } else {
            setSelected('custom')
            setCustomHabit(data.habit_name || '')
          }
          setSaved(true)
        }
        setLoading(false)
      })
  }, [uid])

  const habitName = selected === 'custom'
    ? customHabit.trim()
    : PRESET_HABITS.find(h => h.id === selected)?.name || ''

  async function saveHabit() {
    if (!habitName || !habitTime || !uid) return
    const payload = { user_id: uid, habit_name: habitName, habit_time: habitTime }
    if (existingId) {
      await supabase.from('habit_streaks').update(payload).eq('id', existingId)
    } else {
      const { data } = await supabase.from('habit_streaks').insert(payload).select().single()
      if (data) setExistingId(data.id)
    }
    setSaved(true)
    if (onSelect) onSelect(habitName, habitTime)
  }

  function handleSelect(id) {
    setSelected(id)
    setSaved(false)
    if (onSelect && id !== 'custom') {
      const name = PRESET_HABITS.find(h => h.id === id)?.name || ''
      if (habitTime) onSelect(name, habitTime)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg3, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  if (loading) return <div style={{ padding: '16px', color: T.muted, fontSize: '13px' }}>Loading…</div>

  return (
    <div>
      {saved && habitName && (
        <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}44`,
          borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px' }}>✓</span>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: T.green }}>{habitName}</p>
            <p style={{ fontSize: '12px', color: T.muted }}>Daily at {habitTime} · Streak tracker seeded</p>
          </div>
        </div>
      )}

      {/* Pre-set grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {PRESET_HABITS.map(h => {
          const isSelected = selected === h.id
          return (
            <button key={h.id} onClick={() => handleSelect(h.id)}
              style={{ background: isSelected ? `${T.gold}18` : T.bg3,
                border: `1.5px solid ${isSelected ? T.gold : T.bg4}`,
                borderRadius: '10px', padding: '12px', textAlign: 'left',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>{h.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '700',
                  color: isSelected ? T.gold : T.white }}>{h.name}</span>
              </div>
              <p style={{ fontSize: '11px', color: T.mutedDk, lineHeight: 1.4 }}>{h.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Custom habit */}
      <div style={{ marginBottom: '12px' }}>
        <button onClick={() => handleSelect('custom')}
          style={{ background: selected === 'custom' ? `${T.gold}18` : T.bg3,
            border: `1.5px solid ${selected === 'custom' ? T.gold : T.bg4}`,
            borderRadius: '10px', padding: '12px', width: '100%', textAlign: 'left',
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700',
            color: selected === 'custom' ? T.gold : T.muted }}>
            ✏ Define your own habit
          </span>
        </button>
        {selected === 'custom' && (
          <input type="text" value={customHabit} onChange={e => { setCustomHabit(e.target.value); setSaved(false) }}
            placeholder="e.g. Cold shower, 20-min run, evening reflection…"
            style={inputStyle} />
        )}
      </div>

      {/* Time picker */}
      {selected && (
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: T.muted, display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            What time will you do it each day?
          </label>
          <input type="text" value={habitTime}
            onChange={e => { setHabitTime(e.target.value); setSaved(false); if (onSelect && habitName) onSelect(habitName, e.target.value) }}
            placeholder="e.g. 7:30am, After morning coffee, Before bed"
            style={inputStyle} />
        </div>
      )}

      {/* Save button */}
      {selected && habitName && habitTime && !saved && (
        <button onClick={saveHabit}
          style={{ width: '100%', padding: '12px', borderRadius: '10px',
            background: T.gold, border: 'none', color: T.white,
            fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
          Save anchor habit → seeds streak tracker
        </button>
      )}
    </div>
  )
}
