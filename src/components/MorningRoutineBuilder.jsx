import { useState } from 'react'
import { T } from '../App.jsx'

const DURATION_OPTS = [5, 10, 15, 20, 25, 30, 45, 60]

function fmt(totalMins) {
  const h = Math.floor(totalMins / 60) % 24
  const m = totalMins % 60
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`
}

export default function MorningRoutineBuilder({ onSave }) {
  const [wakeTime, setWakeTime] = useState('06:30')
  const [slots, setSlots] = useState([
    { id: 1, duration: 0,  activity: 'Wake up' },
    { id: 2, duration: 10, activity: '' },
    { id: 3, duration: 15, activity: '' },
    { id: 4, duration: 20, activity: '' },
    { id: 5, duration: 15, activity: '' },
  ])
  const [nn, setNn] = useState(['', '', ''])
  const [saved, setSaved] = useState(false)
  const nextId = () => Math.max(...slots.map(s => s.id)) + 1

  function calcTimes() {
    const [h, m] = wakeTime.split(':').map(Number)
    let total = h * 60 + m
    return slots.map((s, i) => {
      const t = fmt(total)
      if (i > 0) total += s.duration
      return t
    })
  }

  const times = calcTimes()

  function updateSlot(id, field, val) {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s))
  }

  function addSlot() {
    setSlots(prev => [...prev, { id: nextId(), duration: 10, activity: '' }])
  }

  function removeSlot(id) {
    if (slots.length <= 2) return
    setSlots(prev => prev.filter(s => s.id !== id))
  }

  const previewItems = slots.filter((s, i) => s.activity.trim()).map((s, i) => ({
    time: times[slots.indexOf(s)],
    activity: s.activity,
  }))

  const canSave = slots.some(s => s.activity.trim()) && nn.every(n => n.trim().length > 2)

  function save() {
    const startTime = wakeTime
    const firstThree = previewItems.slice(0, 3).map(p => p.activity).join(', ')
    setSaved(true)
    if (onSave) onSave(startTime, firstThree)
  }

  const inputStyle = {
    flex: 1, padding: '7px 10px', borderRadius: '6px',
    border: `1px solid ${T.bg4}`, background: T.bg2, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
  }

  return (
    <div>
      {/* Carry-forward note */}
      <div style={{ background: `${T.gold}15`, border: `1px solid ${T.gold}44`,
        borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: T.gold, marginBottom: '3px' }}>
          ⚓ Your Stage 1 anchor habit carries into this routine
        </p>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.5 }}>
          The habit you set in Task 1.4 becomes one of the blocks below — not replaced, built around.
        </p>
      </div>

      {/* Wake time */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: T.mutedDk,
          letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
          Wake-up time
        </label>
        <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
          style={{ ...inputStyle, flex: 'none', width: '130px', padding: '9px 12px' }} />
      </div>

      {/* Routine slots */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Build your morning — block by block
      </p>

      {slots.map((s, i) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '8px', padding: '9px 12px', background: T.bg3,
          borderRadius: '8px', border: `1px solid ${T.bg4}` }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: T.gold,
            minWidth: '46px', flexShrink: 0 }}>{times[i]}</span>

          {i === 0 ? (
            <span style={{ fontSize: '12px', color: T.mutedDk, minWidth: '70px', flexShrink: 0 }}>Start</span>
          ) : (
            <select value={s.duration} onChange={e => updateSlot(s.id, 'duration', Number(e.target.value))}
              style={{ width: '80px', flexShrink: 0, padding: '6px 8px', borderRadius: '6px',
                border: `1px solid ${T.bg4}`, background: T.bg2, color: T.muted,
                fontSize: '12px', fontFamily: 'inherit' }}>
              {DURATION_OPTS.map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          )}

          <input type="text" value={s.activity}
            onChange={e => updateSlot(s.id, 'activity', e.target.value)}
            placeholder={i === 0 ? 'Wake up / alarm off'
              : i === 2 ? '⚓ Your anchor habit — e.g. Morning journal 5 min'
              : 'Add activity…'}
            style={inputStyle} />

          {i > 1 && (
            <button onClick={() => removeSlot(s.id)}
              style={{ background: 'none', border: 'none', color: T.mutedDk,
                cursor: 'pointer', fontSize: '16px', flexShrink: 0, padding: 0 }}>×</button>
          )}
        </div>
      ))}

      <button onClick={addSlot}
        style={{ fontSize: '12px', color: T.gold, fontWeight: '700',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', marginBottom: '16px', padding: 0 }}>
        + Add a block
      </button>

      {/* Preview */}
      {previewItems.length > 0 && (
        <div style={{ background: '#1B2D5B', borderRadius: '10px',
          padding: '14px 16px', marginBottom: '18px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
            Your morning at a glance
          </p>
          {previewItems.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px',
              paddingBottom: '7px', marginBottom: '7px',
              borderBottom: i < previewItems.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                minWidth: '46px', marginTop: '1px' }}>{p.time}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: T.white }}>{p.activity}</span>
            </div>
          ))}
        </div>
      )}

      {/* Non-negotiables */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
        Your three non-negotiables on a bad day
      </p>
      <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '12px' }}>
        When everything is running late — what three things will you still do, even in their smallest form?
      </p>
      {nn.map((v, i) => (
        <input key={i} type="text" value={v}
          onChange={e => setNn(prev => prev.map((x, j) => j === i ? e.target.value : x))}
          placeholder={i === 0 ? 'Non-negotiable 1 — e.g. Drink water before anything else'
            : i === 1 ? 'Non-negotiable 2 — e.g. My anchor habit, even for 2 minutes'
            : 'Non-negotiable 3 — e.g. Set one intention for the day'}
          style={{ ...inputStyle, flex: 'none', width: '100%', marginBottom: '8px',
            boxSizing: 'border-box', display: 'block', padding: '9px 12px', borderRadius: '8px' }} />
      ))}

      <div style={{ marginTop: '16px' }}>
        {saved ? (
          <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}44`,
            borderRadius: '8px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>✓</span>
            <p style={{ fontSize: '13px', color: T.green, fontWeight: '700' }}>
              Routine saved — completion prompt pre-filled below
            </p>
          </div>
        ) : (
          <button onClick={save} disabled={!canSave}
            style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
              background: canSave ? T.gold : T.bg4,
              color: canSave ? T.white : T.mutedDk,
              fontSize: '14px', fontWeight: '700',
              cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            {canSave ? 'Save my morning routine →' : 'Add activities and all 3 non-negotiables to save'}
          </button>
        )}
      </div>
    </div>
  )
}
