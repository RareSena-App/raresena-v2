import { useState } from 'react'
import { T } from '../App.jsx'

const DIMENSIONS = [
  {
    key: 'finances',
    icon: '💷',
    label: 'Finances',
    question: 'How well did you manage your money this week?',
    placeholder: 'Did you stick to your budget? Any unexpected expenses? Progress toward your goal?',
  },
  {
    key: 'career',
    icon: '💼',
    label: 'Career progress',
    question: 'Did you move forward professionally this week?',
    placeholder: 'Applications, networking, skill building, registration steps — what actually moved?',
  },
  {
    key: 'connection',
    icon: '🤝',
    label: 'Connection',
    question: 'How connected did you feel this week?',
    placeholder: 'Community, friendships, belonging — where did you show up, where did you pull back?',
  },
  {
    key: 'wellbeing',
    icon: '🌿',
    label: 'Wellbeing',
    question: 'How well did you look after yourself?',
    placeholder: 'Sleep, movement, mental space, your anchor habit — what held, what slipped?',
  },
]

const RATING_LABELS = ['', 'Struggling', 'Difficult', 'Steady', 'Good', 'Strong']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function WeeklyReviewTemplate({ onComplete }) {
  const [ratings, setRatings] = useState({ finances: 0, career: 0, connection: 0, wellbeing: 0 })
  const [notes, setNotes] = useState({ finances: '', career: '', connection: '', wellbeing: '' })
  const [nextAction, setNextAction] = useState('')
  const [biggestWin, setBiggestWin] = useState('')
  const [biggestGap, setBiggestGap] = useState('')
  const [reviewDay, setReviewDay] = useState('')
  const [reviewTime, setReviewTime] = useState('')
  const [done, setDone] = useState(false)

  const allRated = DIMENSIONS.every(d => ratings[d.key] > 0)
  const canComplete = allRated && biggestWin.trim().length > 5 && biggestGap.trim().length > 5

  function complete() {
    const summary = `Biggest win: ${biggestWin.trim()} Biggest gap: ${biggestGap.trim()}`
    setDone(true)
    if (onComplete) onComplete(summary)
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1.5px solid ${T.bg4}`, background: T.bg2, color: T.white,
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', resize: 'vertical',
  }

  return (
    <div>
      {/* Notification setup */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
        borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
        <p style={{ fontSize: '12px', fontWeight: '800', color: T.gold,
          letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Set your weekly review day & time
        </p>
        <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '12px' }}>
          This seeds your weekly reminder notification so you never skip a review.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: T.mutedDk,
              letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
              Day
            </label>
            <select value={reviewDay} onChange={e => setReviewDay(e.target.value)}
              style={{ ...inputStyle, resize: 'none', cursor: 'pointer' }}>
              <option value="">Choose day…</option>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: T.mutedDk,
              letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
              Time
            </label>
            <input type="text" value={reviewTime} onChange={e => setReviewTime(e.target.value)}
              placeholder="e.g. 8pm, 7:30am"
              style={{ ...inputStyle, resize: 'none' }} />
          </div>
        </div>
      </div>

      {/* 4 rated dimensions */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
        This week's review
      </p>

      {DIMENSIONS.map(d => {
        const r = ratings[d.key]
        return (
          <div key={d.key} style={{ background: T.bg3, border: `1px solid ${r > 0 ? T.bg4 : T.bg4}`,
            borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px' }}>{d.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '800', color: T.white }}>{d.label}</p>
                <p style={{ fontSize: '12px', color: T.muted }}>{d.question}</p>
              </div>
              {r > 0 && (
                <span style={{ fontSize: '11px', fontWeight: '700', color: ratingColor(r),
                  background: `${ratingColor(r)}20`, padding: '3px 8px', borderRadius: '20px' }}>
                  {RATING_LABELS[r]}
                </span>
              )}
            </div>

            {/* 5-dot rating */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setRatings(prev => ({ ...prev, [d.key]: n }))}
                  style={{ flex: 1, height: '28px', borderRadius: '6px', border: 'none',
                    background: n <= r ? ratingColor(r) : T.bg4,
                    cursor: 'pointer', transition: 'all 0.15s',
                    opacity: n <= r ? 1 : 0.35 }} />
              ))}
            </div>

            <textarea value={notes[d.key]}
              onChange={e => setNotes(prev => ({ ...prev, [d.key]: e.target.value }))}
              placeholder={d.placeholder}
              rows={2}
              style={{ ...inputStyle, minHeight: '60px' }} />
          </div>
        )
      })}

      {/* One action forward */}
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
        borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '16px' }}>➜</span>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '800', color: T.white }}>One action forward</p>
            <p style={{ fontSize: '12px', color: T.muted }}>The one thing you will do differently or better next week</p>
          </div>
        </div>
        <textarea value={nextAction} onChange={e => setNextAction(e.target.value)}
          placeholder="Not a list — one specific thing. E.g. 'Send my NMC application on Wednesday morning.'"
          rows={2}
          style={{ ...inputStyle, minHeight: '60px' }} />
      </div>

      {/* Summary */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Weekly summary
      </p>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: T.mutedDk,
          letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
          Biggest win this week
        </label>
        <textarea value={biggestWin} onChange={e => setBiggestWin(e.target.value)}
          placeholder="One honest sentence. What actually moved forward?"
          rows={2}
          style={{ ...inputStyle, minHeight: '60px' }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', color: T.mutedDk,
          letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
          Biggest gap this week
        </label>
        <textarea value={biggestGap} onChange={e => setBiggestGap(e.target.value)}
          placeholder="One honest sentence. What did you intend that didn't happen?"
          rows={2}
          style={{ ...inputStyle, minHeight: '60px' }} />
      </div>

      {done ? (
        <div style={{ background: `${T.green}15`, border: `1px solid ${T.green}44`,
          borderRadius: '8px', padding: '12px 14px',
          display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>✓</span>
          <p style={{ fontSize: '13px', color: T.green, fontWeight: '700' }}>
            Week one review complete — completion prompt pre-filled below
          </p>
        </div>
      ) : (
        <button onClick={complete} disabled={!canComplete}
          style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
            background: canComplete ? T.gold : T.bg4,
            color: canComplete ? T.white : T.mutedDk,
            fontSize: '14px', fontWeight: '700',
            cursor: canComplete ? 'pointer' : 'default', fontFamily: 'inherit' }}>
          {canComplete
            ? 'Submit week one review →'
            : `Rate all 4 dimensions + add win and gap to continue`}
        </button>
      )}
    </div>
  )
}

function ratingColor(r) {
  if (r <= 1) return '#E05252'
  if (r === 2) return '#E08C30'
  if (r === 3) return '#C9B84C'
  if (r === 4) return '#5BA65B'
  return '#3EC47A'
}
