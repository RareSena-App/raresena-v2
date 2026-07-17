import { useState } from 'react'
import { T } from '../App.jsx'

const CHECKLIST = [
  { key: 'headline', label: 'Professional headline updated for UK market', desc: 'Clear role title + value, not just your last job' },
  { key: 'photo', label: 'Professional photo uploaded', desc: 'UK hiring managers expect a clear headshot' },
  { key: 'about', label: 'About section rewritten with UK voice', desc: 'First-person, concise, ends with what you are looking for' },
  { key: 'experience', label: 'Experience section updated with UK job titles', desc: 'Use standard UK equivalents where needed' },
  { key: 'skills', label: 'Top 5 skills pinned', desc: 'Recruiters filter by these — make them searchable' },
  { key: 'url', label: 'Custom LinkedIn URL set', desc: 'linkedin.com/in/yourname — looks professional in applications' },
  { key: 'open_to', label: '"Open to Work" set to recruiters only', desc: 'Invisible to public but visible to all recruiters' },
  { key: 'connections', label: 'Connected with 10+ UK professionals in your field', desc: 'Warm connections outperform cold applications' },
]

const STRATEGIES = [
  { icon: '🎯', title: 'The warm DM formula', body: 'Hi [Name], I came across your profile while researching [sector/role] in the UK. I am originally from [country] and currently rebuilding my career here. I would love 15 minutes to hear about your journey — specifically [specific question]. No pressure at all.' },
  { icon: '💬', title: 'Comment before you connect', body: 'Leave a thoughtful comment on someone\'s post before sending a connection. It warms the connection and raises your acceptance rate significantly.' },
  { icon: '📝', title: 'The "I just arrived" post', body: 'Share a brief post about your journey — where you are from, what you did, and what you are building now. Authenticity drives engagement and incoming connections.' },
  { icon: '🏢', title: 'Follow target companies first', body: 'Follow 10 companies you want to work for. Their posts surface in your feed. React and comment consistently — hiring managers notice regular names.' },
  { icon: '🔁', title: 'Reconnect with past colleagues', body: 'UK recruiters value social proof. A brief "It\'s great to reconnect — I am now based in the UK and open to new opportunities" message can unlock referrals.' },
  { icon: '🌐', title: 'Join sector-specific UK groups', body: 'LinkedIn groups for your profession in the UK are still active. Engage in them — it surfaces your profile to people who are not in your direct network.' },
]

export default function LinkedInNetworkBuilder({ onSave }) {
  const [checked, setChecked] = useState({})
  const [contacts, setContacts] = useState([
    { id: 1, name: '', role: '', company: '', status: 'not sent' },
    { id: 2, name: '', role: '', company: '', status: 'not sent' },
    { id: 3, name: '', role: '', company: '', status: 'not sent' },
  ])
  const [saved, setSaved] = useState(false)

  const completedItems = Object.values(checked).filter(Boolean).length
  const pct = (completedItems / CHECKLIST.length) * 100

  function toggle(key) {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    if (onSave) {
      const completedKeys = Object.keys(next).filter(k => next[k])
      onSave(completedKeys.join(', '), completedItems + 1)
    }
  }

  function updateContact(id, field, val) {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c))
  }

  function addContact() {
    const nextId = Math.max(...contacts.map(c => c.id)) + 1
    setContacts(prev => [...prev, { id: nextId, name: '', role: '', company: '', status: 'not sent' }])
  }

  const STATUS_OPTS = ['not sent', 'connected', 'replied', 'meeting booked']
  const STATUS_COL = { 'not sent': T.mutedDk, 'connected': T.gold, 'replied': '#7CB9E8', 'meeting booked': T.green }

  const inputStyle = {
    flex: 1, padding: '7px 10px', borderRadius: '6px',
    border: `1px solid ${T.bg4}`, background: T.bg2, color: T.white,
    fontSize: '12px', fontFamily: 'inherit', outline: 'none',
  }

  return (
    <div>
      {/* Profile checklist */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Profile audit checklist
      </p>

      {/* Progress bar */}
      <div style={{ background: '#1B2D5B', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
          height: '6px', marginBottom: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: T.gold,
            borderRadius: '10px', transition: 'width 0.3s' }} />
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
          {completedItems} of {CHECKLIST.length} items complete
        </p>
      </div>

      {CHECKLIST.map(item => {
        const isChecked = !!checked[item.key]
        return (
          <button key={item.key} onClick={() => toggle(item.key)}
            style={{ display: 'flex', gap: '12px', alignItems: 'flex-start',
              background: isChecked ? `${T.gold}10` : T.bg3,
              border: `1px solid ${isChecked ? T.gold + '44' : T.bg4}`,
              borderRadius: '8px', padding: '11px 12px', width: '100%',
              textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              marginBottom: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px',
              border: `1.5px solid ${isChecked ? T.gold : T.mutedDk}`,
              background: isChecked ? T.gold : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '1px' }}>
              {isChecked && <span style={{ color: '#000', fontSize: '10px', fontWeight: '900' }}>✓</span>}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600',
                color: isChecked ? T.gold : T.white, marginBottom: '2px',
                textDecoration: isChecked ? 'line-through' : 'none' }}>
                {item.label}
              </p>
              <p style={{ fontSize: '11px', color: T.mutedDk, lineHeight: 1.4 }}>{item.desc}</p>
            </div>
          </button>
        )
      })}

      {/* Outreach strategies */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginTop: '24px', marginBottom: '10px' }}>
        Outreach strategies
      </p>
      <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '12px' }}>
        Pick one strategy this week. Run it for 7 days before evaluating.
      </p>

      {STRATEGIES.map((s, i) => (
        <div key={i} style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
          borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: T.white, marginBottom: '6px' }}>
            {s.icon} {s.title}
          </p>
          <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.55 }}>{s.body}</p>
        </div>
      ))}

      {/* Contact tracker */}
      <p style={{ fontSize: '11px', fontWeight: '800', color: T.gold,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginTop: '24px', marginBottom: '8px' }}>
        Connection tracker
      </p>
      <p style={{ fontSize: '12px', color: T.mutedDk, lineHeight: 1.5, marginBottom: '12px' }}>
        Track your outreach. Aim for 5 meaningful connections this week.
      </p>

      {contacts.map((c, i) => (
        <div key={c.id} style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
          borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <input type="text" placeholder="Full name"
              value={c.name} onChange={e => updateContact(c.id, 'name', e.target.value)}
              style={{ ...inputStyle }} />
            <input type="text" placeholder="Role / company"
              value={c.company} onChange={e => updateContact(c.id, 'company', e.target.value)}
              style={{ ...inputStyle }} />
          </div>
          <select value={c.status} onChange={e => updateContact(c.id, 'status', e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px',
              border: `1px solid ${STATUS_COL[c.status]}55`,
              background: `${STATUS_COL[c.status]}15`,
              color: STATUS_COL[c.status],
              fontSize: '12px', fontFamily: 'inherit', outline: 'none' }}>
            {STATUS_OPTS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        </div>
      ))}

      <button onClick={addContact}
        style={{ fontSize: '12px', color: T.gold, fontWeight: '700',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', padding: 0, marginTop: '2px' }}>
        + Add contact
      </button>
    </div>
  )
}
