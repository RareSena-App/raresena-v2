import { useState, useEffect } from 'react'
import { useApp, T, css, Btn, Card, PageHeader, EmptyState, supabase } from '../App.jsx'

export default function AdminPanel({ onLogout }) {
  const [screen, setScreen] = useState('admin-home')
  const [pendingBrands, setPendingBrands] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [activeCampaigns, setActiveCampaigns] = useState([])
  const [announcement, setAnnouncement] = useState('')
  const [announcementTarget, setAnnouncementTarget] = useState('all')
  const [announcementSent, setAnnouncementSent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [disputes, setDisputes] = useState([])
  const [resolvingId, setResolvingId] = useState(null)
  const [resolutionNote, setResolutionNote] = useState('')
  const { user } = useApp()

  useEffect(() => {
    fetchData()
    fetchDisputes()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: brands }, { data: posts }, { data: campaigns }] = await Promise.all([
      supabase.from('brand_enquiries').select('*')
        .eq('status', 'pending_approval').order('created_at', { ascending: false }),
      supabase.from('circle_posts').select('*, rebuilders!circle_posts_user_id_fkey(name)')
        .eq('is_removed', false).order('created_at', { ascending: false }).limit(50),
      supabase.from('campaigns').select('*, brand_rebuilder:rebuilders!brand_user_id(name), creator_rebuilder:rebuilders!creator_user_id(name)')
        .eq('status', 'active'),
    ])
    setPendingBrands(brands || [])
    setAllPosts(posts || [])
    setActiveCampaigns(campaigns || [])
    setLoading(false)
  }

  async function approveBrand(brand) {
    const res = await fetch('/api/approve-brand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enquiryId: brand.id,
        email: brand.email,
        companyName: brand.company_name,
      }),
    })
    if (res.ok) {
      setPendingBrands(prev => prev.filter(b => b.id !== brand.id))
    } else {
      const err = await res.json()
      alert('Approval failed: ' + (err.error || 'Unknown error'))
    }
  }

  async function declineBrand(brand) {
    const res = await fetch('/api/decline-brand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enquiryId: brand.id,
        email: brand.email,
        companyName: brand.company_name,
      }),
    })
    if (res.ok) {
      setPendingBrands(prev => prev.filter(b => b.id !== brand.id))
    } else {
      const err = await res.json()
      alert('Decline failed: ' + (err.error || 'Unknown error'))
    }
  }

  async function removePost(postId) {
    await supabase.from('circle_posts').update({ is_removed: true }).eq('id', postId)
    setAllPosts(prev => prev.filter(p => p.id !== postId))
  }

  async function fetchDisputes() {
    const { data, error } = await supabase
      .from('disputes')
      .select('*, raised_by:rebuilders!raised_by_user_id(name), application:brief_applications(proposed_rate, pitch, brief:brand_briefs(campaign_name))')
      .order('created_at', { ascending: false })
      .limit(50)
    if (!error) setDisputes(data || [])
  }

  async function resolveDispute(disputeId, note) {
    setResolvingId(disputeId)
    await supabase.from('disputes').update({
      status: 'resolved',
      resolution_note: note,
      resolved_at: new Date().toISOString(),
    }).eq('id', disputeId)
    setDisputes(prev => prev.map(d => d.id === disputeId
      ? { ...d, status: 'resolved', resolution_note: note }
      : d
    ))
    setResolvingId(null)
    setResolutionNote('')
  }

  async function dismissDispute(disputeId) {
    setResolvingId(disputeId)
    await supabase.from('disputes').update({ status: 'dismissed' }).eq('id', disputeId)
    setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: 'dismissed' } : d))
    setResolvingId(null)
  }

  async function sendAnnouncement() {
    if (!announcement.trim()) return
    await supabase.from('circle_posts').insert({
      user_id: user.supabaseId,
      content: `📢 Announcement from Sena:\n\n${announcement}`,
      group_name: announcementTarget === 'creators' ? 'Rare Studio Creators' : 'Reset',
      stage: user.stage || 'Realize',
      is_pinned: true,
    })
    setAnnouncement('')
    setAnnouncementSent(true)
    setTimeout(() => setAnnouncementSent(false), 3000)
  }

  const pendingCount = pendingBrands.length

  const openDisputeCount = disputes.filter(d => d.status === 'open').length

  function AdminNav() {
    const nav = [
      { id: 'admin-home', icon: '📊', label: 'Dashboard' },
      { id: 'approvals', icon: '✓', label: 'Approvals' },
      { id: 'moderation', icon: '🛡️', label: 'Moderate' },
      { id: 'disputes', icon: '⚖️', label: 'Disputes' },
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
            {n.id === 'disputes' && openDisputeCount > 0 && (
              <div style={{ position: 'absolute', top: '6px', right: '12px', width: '16px', height: '16px',
                background: T.orange, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: T.white }}>
                {openDisputeCount}
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
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Hello, {user.name.split(' ')[0]} 🌿</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          ['✓', pendingCount, 'Brand approvals', 'red', () => setScreen('approvals')],
          ['🛡️', allPosts.length, 'Posts to moderate', 'orange', () => setScreen('moderation')],
          ['⚖️', openDisputeCount, 'Open disputes', openDisputeCount > 0 ? 'orange' : 'green', () => setScreen('disputes')],
          ['💰', '—', 'Commission this month', 'gold', null],
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
        sub={pendingCount > 0 ? `${pendingCount} pending review` : 'All caught up'} />
      {pendingBrands.length === 0 ? (
        <EmptyState icon="✓" title="No pending brands"
          sub="All brand enquiries have been reviewed." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingBrands.map(brand => (
            <div key={brand.id} style={{ background: T.bg2, border: `1px solid ${T.bg4}`,
              borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px' }}>{brand.company_name}</p>
                  <p style={{ color: T.muted, fontSize: '12px' }}>{brand.contact_name} · {brand.email}</p>
                </div>
                <span style={{ background: `${T.gold}22`, color: T.gold,
                  padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                  PENDING
                </span>
              </div>

              <p style={{ fontSize: '13px', lineHeight: '1.6', color: T.white, marginBottom: '12px' }}>
                {brand.description}
              </p>

              {[['Type', brand.campaign_type], ['Budget', brand.budget_range],
                ['Target audience', brand.target_audience], ['Website', brand.website]].map(([label, val]) => val && (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0', borderBottom: `1px solid ${T.bg4}` }}>
                  <p style={{ color: T.muted, fontSize: '12px' }}>{label}</p>
                  <p style={{ fontSize: '12px', color: T.white }}>{val}</p>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button onClick={() => approveBrand(brand)}
                  style={{ flex: 1, background: T.green, color: T.white, border: 'none',
                    borderRadius: '8px', padding: '12px', fontWeight: '600', fontSize: '14px',
                    cursor: 'pointer', fontFamily: 'inherit' }}>✓ Approve</button>
                <button onClick={() => declineBrand(brand)}
                  style={{ flex: 1, background: 'none', color: T.red, border: `1px solid ${T.red}44`,
                    borderRadius: '8px', padding: '12px', fontWeight: '600', fontSize: '14px',
                    cursor: 'pointer', fontFamily: 'inherit' }}>✕ Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── COMMUNITY MODERATION ──
  if (screen === 'moderation') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <PageHeader title="Community Moderation"
        sub={`${allPosts.length} posts in community`} />
      {allPosts.length === 0 ? (
        <EmptyState icon="🛡️" title="No posts"
          sub="The community feed is empty." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allPosts.map(post => (
            <Card key={post.id}>
              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>
                  {post.rebuilders?.name || 'Rebuilder'}
                </p>
                <span style={{ color: T.mutedDk, fontSize: '11px' }}>{post.group_name}</span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: T.white, marginBottom: '14px' }}>
                {post.content}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => removePost(post.id)}
                  style={{ flex: 1, background: T.red, color: T.white, border: 'none',
                    borderRadius: '8px', padding: '10px', fontWeight: '600', fontSize: '13px',
                    cursor: 'pointer', fontFamily: 'inherit' }}>Remove post</button>
                <button style={{ flex: 1, background: 'none', color: T.muted,
                  border: `1px solid ${T.bg4}`, borderRadius: '8px', padding: '10px',
                  fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Keep post
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // ── DISPUTE MANAGEMENT ──
  if (screen === 'disputes') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <PageHeader title="Dispute Management"
        sub={openDisputeCount > 0 ? `${openDisputeCount} open dispute${openDisputeCount !== 1 ? 's' : ''}` : 'No open disputes'} />
      {disputes.length === 0 ? (
        <EmptyState icon="⚖️" title="No disputes"
          sub="Disputes raised by creators or brands will appear here for review." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {disputes.map(dispute => {
            const statusCol = dispute.status === 'resolved' ? T.green : dispute.status === 'dismissed' ? T.mutedDk : T.orange
            const d = new Date(dispute.created_at)
            const daysSince = Math.floor((Date.now() - d) / 86400000)
            const dateStr = daysSince === 0 ? 'today' : daysSince === 1 ? 'yesterday' : `${daysSince} days ago`
            return (
              <Card key={dispute.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>
                      {dispute.application?.brief?.campaign_name || 'Dispute'}
                    </p>
                    <p style={{ color: T.muted, fontSize: '12px' }}>
                      Raised by {dispute.raised_by?.name || 'User'} · {dateStr}
                    </p>
                  </div>
                  <span style={{ background: `${statusCol}22`, color: statusCol,
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
                    fontWeight: '600', textTransform: 'uppercase' }}>{dispute.status}</span>
                </div>
                <div style={{ background: T.bg3, borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                  <p style={{ color: T.muted, fontSize: '11px', marginBottom: '4px' }}>Issue</p>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: T.white }}>{dispute.description}</p>
                </div>
                {dispute.application?.proposed_rate && (
                  <p style={{ color: T.muted, fontSize: '12px', marginBottom: '10px' }}>
                    Campaign value: {dispute.application.proposed_rate}
                  </p>
                )}
                {dispute.resolution_note && (
                  <div style={{ background: `${T.green}11`, border: `1px solid ${T.green}33`,
                    borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                    <p style={{ color: T.muted, fontSize: '11px', marginBottom: '4px' }}>Resolution</p>
                    <p style={{ fontSize: '13px', color: T.white }}>{dispute.resolution_note}</p>
                  </div>
                )}
                {dispute.status === 'open' && (
                  resolvingId === dispute.id ? (
                    <div>
                      <textarea style={{ ...css.input, height: '70px', resize: 'none', marginBottom: '8px', display: 'block' }}
                        placeholder="Describe your resolution or decision..."
                        value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => resolveDispute(dispute.id, resolutionNote)}
                          disabled={!resolutionNote.trim()}
                          style={{ flex: 1, background: T.green, color: T.white, border: 'none',
                            borderRadius: '8px', padding: '10px', fontWeight: '600', fontSize: '13px',
                            cursor: resolutionNote.trim() ? 'pointer' : 'default',
                            opacity: resolutionNote.trim() ? 1 : 0.5, fontFamily: 'inherit' }}>
                          Mark resolved
                        </button>
                        <button onClick={() => { setResolvingId(null); setResolutionNote('') }}
                          style={{ background: 'none', border: `1px solid ${T.bg4}`, color: T.muted,
                            borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
                            cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setResolvingId(dispute.id)}
                        style={{ flex: 2, background: T.green, color: T.white, border: 'none',
                          borderRadius: '8px', padding: '10px', fontWeight: '600', fontSize: '13px',
                          cursor: 'pointer', fontFamily: 'inherit' }}>Resolve</button>
                      <button onClick={() => dismissDispute(dispute.id)}
                        style={{ flex: 1, background: 'none', color: T.muted,
                          border: `1px solid ${T.bg4}`, borderRadius: '8px', padding: '10px',
                          fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Dismiss
                      </button>
                    </div>
                  )
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  // ── CAMPAIGNS OVERVIEW ──
  if (screen === 'campaigns-admin') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <AdminNav />
      <PageHeader title="All Campaigns" sub={`${activeCampaigns.length} active`} />
      {activeCampaigns.length === 0 ? (
        <EmptyState icon="🚀" title="No active campaigns"
          sub="Campaigns appear here once a brand selects a creator for a brief." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeCampaigns.map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontWeight: '700', fontSize: '14px' }}>
                  {c.brand_rebuilder?.name || 'Brand'}
                </p>
                <span style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>
                  {c.campaign_value || '—'}
                </span>
              </div>
              <p style={{ color: T.muted, fontSize: '13px', marginBottom: '6px' }}>
                Creator: {c.creator_rebuilder?.name || 'Creator'}
              </p>
              <span style={{ background: `${T.green}22`, color: T.green,
                padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                {c.status}
              </span>
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
      {announcementSent && (
        <p style={{ color: T.green, fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>
          ✓ Announcement posted to community
        </p>
      )}
      <Btn onClick={sendAnnouncement} disabled={!announcement.trim()}>
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
