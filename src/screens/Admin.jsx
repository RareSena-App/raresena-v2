import { useState } from 'react'
import { useApp, T, css, Btn, Card, PageHeader, EmptyState } from '../App.jsx'

const PENDING_BRANDS = [
  { id: 1, company: 'GlowLife UK', contact: 'Sarah Mitchell', email: 'sarah@glowlife.co.uk',
    website: 'glowlife.co.uk', type: 'Beauty and Wellness', budget: '£500–£1,000/campaign',
    audience: 'Women 25–45, UK-wide', description: 'We are a UK wellness brand looking for authentic immigrant and diaspora creators to showcase our products.' },
  { id: 2, company: 'TechBridge London', contact: 'James Okafor', email: 'james@techbridge.io',
    website: 'techbridge.io', type: 'Tech and SaaS', budget: '£300–£600/campaign',
    audience: 'Professionals 22–35, London and major cities', description: 'We build tools for remote and distributed teams and want creators who understand multicultural workplaces.' },
]

const FLAGGED_POSTS = [
  { id: 1, author: 'Anonymous User', content: 'This post has been reported for inappropriate content.', group: 'Financial Literacy', reports: 2 },
]

const ACTIVE_CAMPAIGNS_DATA = [
  { id: 1, brand: 'HomeBase Essentials', creator: 'Kofi A.', value: '£380', status: 'In progress', days: '3 days to deadline' },
]

export default function AdminPanel({ onLogout }) {
  const [screen, setScreen] = useState('admin-home')
  const [activeBrand, setActiveBrand] = useState(null)
  const [brandStatuses, setBrandStatuses] = useState({})
  const [announcement, setAnnouncement] = useState('')
  const [announcementTarget, setAnnouncementTarget] = useState('all')
  const { user } = useApp()

  const pendingCount = PENDING_BRANDS.filter(b => !brandStatuses[b.id]).length

  function AdminNav() {
    const nav = [
      { id: 'admin-home', icon: '📊', label: 'Dashboard' },
      { id: 'approvals', icon: '✓', label: 'Approvals' },
      { id: 'moderation', icon: '🛡️', label: 'Moderate' },
      { id: 'campaigns-admin', icon: '🚀', label: 'Campaigns' },
      { id: 'announce', icon: '📢', label: 'Announce' },
    ]
    return (
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: T.bg2,
        borderTop: `1px solid ${T.bg4}`, display: 'flex', zIndex: 100 }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)}
            style={{ flex: 1, padding: '10px 4px 12px', background: 'none', border: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              cursor: 'pointer', position: 'relative' }}>
            <span style={{ fontSize: '18px' }}>{n.icon}</span>
            {n.id === 'approvals' && pendingCount > 0 && (
              <div style={{ position: 'absolute', top: '6px', right: '12px', width: '16px', height: '16px',
                background: T.red, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: T.white }}>
                {pendingCount}
              </div>
            )}
            <span style={{ fontSize: '10px', fontWeight: '500',
              color: screen === n.id ? T.gold : T.muted }}>{n.label}</span>
          </button>
        ))}
      </div>
    )
  }

  // ── ADMIN DASHBOARD ──
  if (screen === 'admin-home') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: T.gold, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin Panel</p>
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Hello, Sena 🌿</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          ['✓', pendingCount, 'Brand approvals', 'red', () => setScreen('approvals')],
          ['🛡️', FLAGGED_POSTS.length, 'Flagged posts', 'orange', () => setScreen('moderation')],
          ['🚀', ACTIVE_CAMPAIGNS_DATA.length, 'Active campaigns', 'green', () => setScreen('campaigns-admin')],
          ['💰', '£95', 'Commission this month', 'gold', null],
        ].map(([icon, val, label, col, action]) => (
          <div key={label} onClick={action || undefined}
            style={{ background: T.bg2, border: `1px solid ${T.bg4}`, borderRadius: '12px',
              padding: '16px', textAlign: 'center', cursor: action ? 'pointer' : 'default',
              position: 'relative' }}>
            {col === 'red' && pendingCount > 0 && (
              <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px',
                background: T.red, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: T.white }}>!</div>
            )}
            <p style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</p>
            <p style={{ fontSize: '22px', fontWeight: '800',
              color: col === 'gold' ? T.gold : col === 'green' ? T.green : col === 'red' && pendingCount > 0 ? T.red : T.white }}>
              {val}
            </p>
            <p style={{ color: T.muted, fontSize: '11px' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`, borderRadius: '12px',
        padding: '16px', marginBottom: '16px' }}>
        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>Quick actions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Btn sm ghost onClick={() => setScreen('approvals')}>
            Review {pendingCount} pending brand{pendingCount !== 1 ? 's' : ''} →
          </Btn>
          <Btn sm ghost onClick={() => setScreen('announce')}>Send community announcement →</Btn>
        </div>
      </div>
    </div>
  )

  // ── BRAND APPROVALS ──
  if (screen === 'approvals') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <PageHeader title="Brand Approvals"
        sub={`${pendingCount} pending · ${Object.values(brandStatuses).filter(s => s === 'approved').length} approved`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {PENDING_BRANDS.map(brand => {
          const status = brandStatuses[brand.id]
          return (
            <div key={brand.id} style={{ background: T.bg2,
              border: `1px solid ${status === 'approved' ? T.green + '44' : status === 'declined' ? T.red + '44' : T.bg4}`,
              borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px' }}>{brand.company}</p>
                  <p style={{ color: T.muted, fontSize: '12px' }}>{brand.contact} · {brand.email}</p>
                </div>
                {status ? (
                  <span style={{ background: status === 'approved' ? `${T.green}22` : `${T.red}22`,
                    color: status === 'approved' ? T.green : T.red,
                    padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    {status.toUpperCase()}
                  </span>
                ) : (
                  <span style={{ background: `${T.gold}22`, color: T.gold,
                    padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    PENDING
                  </span>
                )}
              </div>

              <p style={{ fontSize: '13px', lineHeight: '1.6', color: T.white, marginBottom: '12px' }}>
                {brand.description}
              </p>

              {[['Type', brand.type], ['Budget', brand.budget],
                ['Target audience', brand.audience], ['Website', brand.website]].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0', borderBottom: `1px solid ${T.bg4}` }}>
                  <p style={{ color: T.muted, fontSize: '12px' }}>{label}</p>
                  <p style={{ fontSize: '12px', color: T.white }}>{val}</p>
                </div>
              ))}

              {!status && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button onClick={() => setBrandStatuses(prev => ({ ...prev, [brand.id]: 'approved' }))}
                    style={{ flex: 1, background: T.green, color: T.white, border: 'none',
                      borderRadius: '8px', padding: '12px', fontWeight: '600', fontSize: '14px',
                      cursor: 'pointer', fontFamily: 'inherit' }}>✓ Approve</button>
                  <button onClick={() => setBrandStatuses(prev => ({ ...prev, [brand.id]: 'declined' }))}
                    style={{ flex: 1, background: 'none', color: T.red, border: `1px solid ${T.red}44`,
                      borderRadius: '8px', padding: '12px', fontWeight: '600', fontSize: '14px',
                      cursor: 'pointer', fontFamily: 'inherit' }}>✕ Decline</button>
                </div>
              )}
              {status === 'approved' && (
                <div style={{ marginTop: '10px', padding: '10px', background: `${T.green}11`,
                  borderRadius: '6px', textAlign: 'center' }}>
                  <p style={{ color: T.green, fontSize: '12px' }}>
                    ✓ Welcome email sent automatically to {brand.email}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── COMMUNITY MODERATION ──
  if (screen === 'moderation') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <PageHeader title="Community Moderation"
        sub={`${FLAGGED_POSTS.length} reported post${FLAGGED_POSTS.length !== 1 ? 's' : ''}`} />
      {FLAGGED_POSTS.length === 0 ? (
        <EmptyState icon="🛡️" title="No flagged posts"
          sub="The community is looking healthy. No posts require your review." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FLAGGED_POSTS.map(post => (
            <Card key={post.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{post.author}</p>
                <span style={{ background: `${T.red}22`, color: T.red,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  {post.reports} report{post.reports !== 1 ? 's' : ''}
                </span>
              </div>
              <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>
                Group: {post.group}
              </p>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: T.white, marginBottom: '14px' }}>
                {post.content}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ flex: 1, background: T.red, color: T.white, border: 'none',
                  borderRadius: '8px', padding: '10px', fontWeight: '600', fontSize: '13px',
                  cursor: 'pointer', fontFamily: 'inherit' }}>Remove post</button>
                <button style={{ flex: 1, background: 'none', color: T.muted,
                  border: `1px solid ${T.bg4}`, borderRadius: '8px', padding: '10px',
                  fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Dismiss report
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // ── CAMPAIGNS OVERVIEW ──
  if (screen === 'campaigns-admin') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <PageHeader title="All Campaigns"
        sub={`${ACTIVE_CAMPAIGNS_DATA.length} active`} />
      {ACTIVE_CAMPAIGNS_DATA.length === 0 ? (
        <EmptyState icon="🚀" title="No active campaigns"
          sub="Campaigns appear here once a brand selects a creator for a brief." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ACTIVE_CAMPAIGNS_DATA.map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontWeight: '700', fontSize: '14px' }}>{c.brand}</p>
                <span style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>{c.value}</span>
              </div>
              <p style={{ color: T.muted, fontSize: '13px', marginBottom: '6px' }}>Creator: {c.creator}</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  {c.status}
                </span>
                <span style={{ color: T.red, fontSize: '12px' }}>⏱ {c.days}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // ── ANNOUNCEMENTS ──
  if (screen === 'announce') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <PageHeader title="Community Announcement"
        sub="Send a message to rebuilders, creators, or the full community" />
      <div style={{ marginBottom: '14px' }}>
        <p style={{ color: T.muted, fontSize: '12px', marginBottom: '8px' }}>Send to:</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[['all', 'All users'], ['rebuilders', 'Rebuilders only'], ['creators', 'Creators only']].map(([val, label]) => (
            <button key={val} onClick={() => setAnnouncementTarget(val)}
              style={{ padding: '8px 16px', borderRadius: '20px',
                border: `1px solid ${announcementTarget === val ? T.gold : T.bg4}`,
                background: announcementTarget === val ? T.goldDim : T.bg2,
                color: announcementTarget === val ? T.gold : T.muted,
                fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>Your message</p>
        <textarea style={{ ...css.input, height: '140px', resize: 'none' }}
          placeholder="Write your announcement — this will appear as a pinned post in the community..."
          value={announcement} onChange={e => setAnnouncement(e.target.value)} />
      </div>
      <Btn onClick={() => {
        if (!announcement.trim()) return
        setAnnouncement('')
        alert('Announcement sent to ' + announcementTarget + ' users.')
      }} disabled={!announcement.trim()}>
        Send announcement →
      </Btn>
      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${T.bg4}` }}>
        <button onClick={onLogout}
          style={{ background: 'none', border: `1px solid ${T.red}33`, borderRadius: '10px',
            padding: '12px 16px', color: T.red, fontSize: '14px',
            cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>Sign out</button>
      </div>
    </div>
  )

  return null
}
