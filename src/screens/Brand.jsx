import { useState, useEffect } from 'react'
import { useApp, T, css, Btn, Card, BrandNav, PageHeader, EmptyState, supabase } from '../App.jsx'

export default function BrandPortal({ onLogout }) {
  const [screen, setScreen] = useState('brand-home')
  const [activeCreator, setActiveCreator] = useState(null)
  const [creators, setCreators] = useState([])
  const [loadingCreators, setLoadingCreators] = useState(true)
  const [briefs, setBriefs] = useState([])
  const [briefsLoading, setBriefsLoading] = useState(true)
  const [briefForm, setBriefForm] = useState({ name: '', niche: '', deliverables: '', budget: '', timeline: '', rights: '', deadline: '', description: '' })
  const [postingBrief, setPostingBrief] = useState(false)
  const [niicheFilter, setNicheFilter] = useState('All')
  const [activeBriefForApps, setActiveBriefForApps] = useState(null)
  const [briefApplications, setBriefApplications] = useState([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [updatingAppId, setUpdatingAppId] = useState(null)
  const { user } = useApp()

  useEffect(() => {
    fetchCreators()
  }, [])

  useEffect(() => {
    if (user.supabaseId) fetchBrandBriefs()
  }, [user.supabaseId])

  async function fetchCreators() {
    setLoadingCreators(true)
    const { data } = await supabase
      .from('rebuilders')
      .select('id, name, location, stage, creator_bio, creator_niche, creator_audience_size, creator_rate_range, creator_campaigns_count, creator_tiktok, creator_instagram')
      .eq('is_creator', true)
      .eq('creator_status', 'active')
      .order('creator_campaigns_count', { ascending: false })
    setCreators((data || []).map(formatCreator))
    setLoadingCreators(false)
  }

  function formatCreator(c) {
    const name = c.name || 'Creator'
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    return {
      ...c,
      initials,
      niche: c.creator_niche || c.stage || '—',
      bio: c.creator_bio || 'RareSena verified creator.',
      audience: c.creator_audience_size || '—',
      rate: c.creator_rate_range || '—',
      campaigns: c.creator_campaigns_count || 0,
      location: c.location || 'UK',
    }
  }

  async function fetchBrandBriefs() {
    setBriefsLoading(true)
    const { data } = await supabase
      .from('brand_briefs')
      .select('*')
      .eq('brand_user_id', user.supabaseId)
      .order('created_at', { ascending: false })
    setBriefs(data || [])
    setBriefsLoading(false)
  }

  async function fetchBriefApplications(briefId) {
    setAppsLoading(true)
    const { data } = await supabase
      .from('brief_applications')
      .select('*, creator:rebuilders!creator_user_id(name, creator_bio, creator_niche, creator_audience_size, creator_rate_range, creator_tiktok, creator_instagram)')
      .eq('brief_id', briefId)
      .order('created_at', { ascending: false })
    setBriefApplications(data || [])
    setAppsLoading(false)
  }

  async function updateApplicationStatus(appId, newStatus) {
    setUpdatingAppId(appId)
    await supabase.from('brief_applications').update({ status: newStatus }).eq('id', appId)
    setBriefApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
    setUpdatingAppId(null)
  }

  async function postBrief() {
    if (!briefForm.name.trim()) return
    setPostingBrief(true)
    await supabase.from('brand_briefs').insert({
      brand_user_id: user.supabaseId,
      campaign_name: briefForm.name,
      niche_required: briefForm.niche,
      deliverables: briefForm.deliverables,
      budget: briefForm.budget,
      timeline: briefForm.timeline,
      usage_rights: briefForm.rights,
      deadline: briefForm.deadline,
      description: briefForm.description,
      status: 'open',
    })
    await fetchBrandBriefs()
    setBriefForm({ name: '', niche: '', deliverables: '', budget: '', timeline: '', rights: '', deadline: '', description: '' })
    setPostingBrief(false)
    setScreen('brand-home')
  }

  const filteredCreators = niicheFilter === 'All'
    ? creators
    : creators.filter(c => c.niche?.toLowerCase().includes(niicheFilter.toLowerCase()))

  const niches = ['All', ...Array.from(new Set(creators.map(c => c.niche).filter(n => n && n !== '—')))]

  // ── BRAND DASHBOARD ──
  if (screen === 'brand-home') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <BrandNav screen="brand-home" setScreen={setScreen} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p style={{ color: T.muted, fontSize: '12px' }}>Rare Studio</p>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Welcome back 🏢</h1>
        </div>
        <button onClick={() => setScreen('brand-settings')}
          style={{ background: T.bg3, border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer' }}>⚙️</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          ['📋', briefsLoading ? '…' : briefs.length, 'Active briefs'],
          ['👥', loadingCreators ? '…' : creators.length, 'Creators available'],
          ['🚀', 0, 'Campaigns active'],
          ['✓', 0, 'Campaigns complete'],
        ].map(([icon, val, label]) => (
          <Card key={label} style={{ textAlign: 'center', marginBottom: 0 }}>
            <p style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: T.gold }}>{val}</p>
            <p style={{ color: T.muted, fontSize: '11px' }}>{label}</p>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <Btn onClick={() => setScreen('post-brief')}>+ Post a new brief</Btn>
        <Btn ghost onClick={() => setScreen('creators')}>Browse creators →</Btn>
      </div>

      {briefs.length > 0 && (
        <div>
          <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Your active briefs</p>
          {briefs.slice(0, 3).map(b => (
            <div key={b.id} onClick={() => {
              setActiveBriefForApps(b)
              fetchBriefApplications(b.id)
              setScreen('brief-applications')
            }} style={{ background: T.bg2, border: `1px solid ${T.bg4}`, borderRadius: '10px',
              padding: '14px 16px', marginBottom: '8px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{b.campaign_name}</p>
                  <p style={{ color: T.muted, fontSize: '12px', marginTop: '3px' }}>
                    {b.niche_required} · {b.budget}
                  </p>
                </div>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  {b.status?.toUpperCase() || 'OPEN'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`,
        borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', marginBottom: '8px' }}>💡</p>
        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>How Rare Studio works</p>
        <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6' }}>
          Post a brief → creators apply → you select → content delivered →
          you pay → RareSena takes 25% commission. Simple, transparent, automated.
        </p>
      </div>
    </div>
  )

  // ── CREATOR DIRECTORY ──
  if (screen === 'creators') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <BrandNav screen="creators" setScreen={setScreen} />
      <PageHeader title="Creator Directory"
        sub={loadingCreators ? 'Loading...' : `${creators.length} verified creator${creators.length !== 1 ? 's' : ''}`} />

      {niches.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {niches.slice(0, 5).map(filter => (
            <button key={filter} onClick={() => setNicheFilter(filter)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${niicheFilter === filter ? T.gold : T.bg4}`,
                background: niicheFilter === filter ? T.gold : T.bg2,
                color: niicheFilter === filter ? T.bg : T.muted,
                fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>{filter}</button>
          ))}
        </div>
      )}

      {loadingCreators ? (
        <p style={{ color: T.muted, textAlign: 'center', padding: '40px 0' }}>Loading creators...</p>
      ) : filteredCreators.length === 0 ? (
        <EmptyState icon="👥" title="No creators yet"
          sub="Creators will appear here once they join and activate their Rare Studio membership." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCreators.map(creator => (
            <div key={creator.id}
              onClick={() => { setActiveCreator(creator); setScreen('creator-profile-view') }}
              style={{ background: T.bg2, border: `1px solid ${T.bg4}`, borderRadius: '10px',
                padding: '14px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                  background: `${T.purple}33`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px', fontWeight: '700',
                  color: T.purple, flexShrink: 0 }}>{creator.initials}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{creator.name}</p>
                  <p style={{ color: T.muted, fontSize: '12px' }}>{creator.niche} · {creator.location}</p>
                </div>
                {creator.audience !== '—' && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>{creator.audience}</p>
                    <p style={{ color: T.mutedDk, fontSize: '11px' }}>followers</p>
                  </div>
                )}
              </div>
              <p style={{ color: T.muted, fontSize: '12px', lineHeight: '1.5', marginBottom: '8px' }}>
                {creator.bio.length > 90 ? creator.bio.substring(0, 90) + '...' : creator.bio}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {creator.campaigns > 0 && (
                  <span style={{ ...css.tag(T.blue) }}>{creator.campaigns} campaign{creator.campaigns !== 1 ? 's' : ''}</span>
                )}
                {creator.rate !== '—' && (
                  <span style={{ ...css.tag(T.gold) }}>{creator.rate}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── CREATOR PROFILE VIEW ──
  if (screen === 'creator-profile-view' && activeCreator) return (
    <div style={{ ...css.screen, ...css.padded }}>
      <BrandNav screen="creators" setScreen={setScreen} />
      <PageHeader title={activeCreator.name} onBack={() => setScreen('creators')}
        sub={activeCreator.niche} />
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%',
            background: `${T.purple}33`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px', fontWeight: '700',
            color: T.purple }}>{activeCreator.initials}</div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>{activeCreator.name}</p>
            <p style={{ color: T.muted, fontSize: '13px' }}>{activeCreator.location}</p>
          </div>
        </div>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: T.white, marginBottom: '16px' }}>
          {activeCreator.bio}
        </p>
        {[
          ['Niche', activeCreator.niche],
          ['Audience size', activeCreator.audience],
          ['Location', activeCreator.location],
          ['Rate range', activeCreator.rate],
          ['Campaigns completed', activeCreator.campaigns > 0 ? activeCreator.campaigns.toString() : '—'],
          ['TikTok', activeCreator.creator_tiktok],
          ['Instagram', activeCreator.creator_instagram],
        ].filter(([, val]) => val && val !== '—' && val !== 'undefined').map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: `1px solid ${T.bg4}` }}>
            <p style={{ color: T.muted, fontSize: '13px' }}>{label}</p>
            <p style={{ fontSize: '13px', color: T.white, fontWeight: '500' }}>{val}</p>
          </div>
        ))}
      </Card>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Btn onClick={() => setScreen('post-brief')}>Post a brief to match this creator →</Btn>
        <p style={{ textAlign: 'center', color: T.mutedDk, fontSize: '12px' }}>
          Direct contact is available after a campaign match is confirmed.
        </p>
      </div>
    </div>
  )

  // ── POST A BRIEF ──
  if (screen === 'post-brief') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <BrandNav screen="brand-briefs" setScreen={setScreen} />
      <PageHeader title="Post a Campaign Brief" onBack={() => setScreen('brand-home')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          ['Campaign name', 'name', 'e.g. Summer Glow Product Launch'],
          ['Niche required', 'niche', 'e.g. Beauty, Lifestyle, Food, Tech'],
          ['Content deliverables', 'deliverables', 'e.g. 3 × 30-second TikTok videos + 2 Instagram posts'],
          ['Budget', 'budget', 'e.g. £350'],
          ['Timeline', 'timeline', 'e.g. 2 weeks from campaign start'],
          ['Usage rights required', 'rights', 'e.g. Paid social ads for 6 months'],
          ['Application deadline', 'deadline', 'e.g. 7 days'],
        ].map(([label, key, placeholder]) => (
          <div key={key}>
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>{label}</p>
            <input style={css.input} type="text" placeholder={placeholder}
              value={briefForm[key]} onChange={e => setBriefForm(prev => ({ ...prev, [key]: e.target.value }))} />
          </div>
        ))}
        <div>
          <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>Campaign description</p>
          <textarea style={{ ...css.input, height: '100px', resize: 'none' }}
            placeholder="Tell creators what you're looking for and why your brand is worth their time..."
            value={briefForm.description}
            onChange={e => setBriefForm(prev => ({ ...prev, description: e.target.value }))} />
        </div>
        <Btn onClick={postBrief} disabled={!briefForm.name.trim() || postingBrief}>
          {postingBrief ? 'Posting...' : 'Post brief — notify matching creators →'}
        </Btn>
        <p style={{ textAlign: 'center', color: T.mutedDk, fontSize: '12px' }}>
          Matching creators are notified automatically when your brief is posted.
        </p>
      </div>
    </div>
  )

  // ── BRIEF MANAGEMENT ──
  if (screen === 'brand-briefs') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <BrandNav screen="brand-briefs" setScreen={setScreen} />
      <PageHeader title="My Briefs"
        action={<button onClick={() => setScreen('post-brief')}
          style={{ background: T.gold, color: T.bg, border: 'none', borderRadius: '6px',
            padding: '8px 14px', fontWeight: '600', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit' }}>+ New brief</button>} />
      {briefsLoading ? (
        <p style={{ color: T.muted, textAlign: 'center', padding: '40px 0' }}>Loading...</p>
      ) : briefs.length === 0 ? (
        <EmptyState icon="📋" title="No briefs posted yet"
          sub="Post your first brief and matching creators will be notified automatically."
          cta="Post a brief →" onCta={() => setScreen('post-brief')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {briefs.map(b => (
            <div key={b.id} onClick={() => {
              setActiveBriefForApps(b)
              fetchBriefApplications(b.id)
              setScreen('brief-applications')
            }} style={{ background: T.bg2, border: `1px solid ${T.bg4}`,
              borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{b.campaign_name}</p>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  {b.status?.toUpperCase() || 'OPEN'}
                </span>
              </div>
              <p style={{ color: T.muted, fontSize: '12px' }}>
                {b.niche_required} · {b.budget} · {b.deadline}
              </p>
              <p style={{ color: T.mutedDk, fontSize: '12px', marginTop: '4px' }}>
                Tap to view applications →
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── BRIEF APPLICATIONS (brand reviews creator applications) ──
  if (screen === 'brief-applications' && activeBriefForApps) return (
    <div style={{ ...css.screen, ...css.padded }}>
      <BrandNav screen="brand-briefs" setScreen={setScreen} />
      <PageHeader title={activeBriefForApps.campaign_name} onBack={() => setScreen('brand-briefs')}
        sub={appsLoading ? 'Loading...' : `${briefApplications.length} application${briefApplications.length !== 1 ? 's' : ''}`} />
      {appsLoading ? (
        <p style={{ color: T.muted, textAlign: 'center', padding: '40px 0' }}>Loading applications...</p>
      ) : briefApplications.length === 0 ? (
        <EmptyState icon="📝" title="No applications yet"
          sub="Creators will apply once they see your brief. Applications appear here automatically." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {briefApplications.map(app => {
            const statusCol = app.status === 'shortlisted' ? T.gold
              : app.status === 'selected' ? T.green
              : app.status === 'rejected' ? T.red
              : T.muted
            const isUpdating = updatingAppId === app.id
            return (
              <Card key={app.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                      background: `${T.purple}33`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '14px', fontWeight: '700',
                      color: T.purple, flexShrink: 0 }}>
                      {(app.creator?.name || 'C')[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>{app.creator?.name || 'Creator'}</p>
                      {app.creator?.creator_niche && (
                        <p style={{ color: T.muted, fontSize: '12px' }}>{app.creator.creator_niche}</p>
                      )}
                    </div>
                  </div>
                  <span style={{ background: `${statusCol}22`, color: statusCol,
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
                    fontWeight: '600', textTransform: 'uppercase' }}>{app.status}</span>
                </div>

                {app.creator?.creator_audience_size && (
                  <p style={{ color: T.muted, fontSize: '12px', marginBottom: '8px' }}>
                    Audience: {app.creator.creator_audience_size}
                  </p>
                )}

                <div style={{ background: T.bg3, borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                  <p style={{ color: T.muted, fontSize: '11px', marginBottom: '4px' }}>Pitch</p>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: T.white }}>{app.pitch}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: `1px solid ${T.bg4}`, marginBottom: '12px' }}>
                  <p style={{ color: T.muted, fontSize: '13px' }}>Proposed rate</p>
                  <p style={{ fontSize: '13px', color: T.gold, fontWeight: '600' }}>{app.proposed_rate}</p>
                </div>

                {app.status !== 'selected' && app.status !== 'rejected' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => updateApplicationStatus(app.id, 'selected')}
                      disabled={isUpdating}
                      style={{ flex: 1, background: T.green, color: T.white, border: 'none',
                        borderRadius: '8px', padding: '10px', fontWeight: '600', fontSize: '13px',
                        cursor: isUpdating ? 'default' : 'pointer', fontFamily: 'inherit',
                        opacity: isUpdating ? 0.6 : 1 }}>
                      ✓ Select
                    </button>
                    {app.status !== 'shortlisted' && (
                      <button onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                        disabled={isUpdating}
                        style={{ flex: 1, background: T.goldDim, color: T.gold,
                          border: `1px solid ${T.gold}44`, borderRadius: '8px', padding: '10px',
                          fontWeight: '600', fontSize: '13px',
                          cursor: isUpdating ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                        ★ Shortlist
                      </button>
                    )}
                    <button onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      disabled={isUpdating}
                      style={{ flex: 1, background: 'none', color: T.muted,
                        border: `1px solid ${T.bg4}`, borderRadius: '8px', padding: '10px',
                        fontWeight: '600', fontSize: '13px',
                        cursor: isUpdating ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                      ✕ Pass
                    </button>
                  </div>
                )}
                {app.status === 'selected' && (
                  <div style={{ background: `${T.green}11`, border: `1px solid ${T.green}33`,
                    borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <p style={{ color: T.green, fontSize: '13px', fontWeight: '600' }}>
                      ✓ Creator selected — they have been notified
                    </p>
                  </div>
                )}
                {app.status === 'rejected' && (
                  <button onClick={() => updateApplicationStatus(app.id, 'submitted')}
                    style={{ background: 'none', border: 'none', color: T.mutedDk,
                      fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0' }}>
                    Undo rejection
                  </button>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  // ── ACTIVE CAMPAIGNS ──
  if (screen === 'brand-campaigns') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <BrandNav screen="brand-campaigns" setScreen={setScreen} />
      <PageHeader title="Campaigns" />
      <EmptyState icon="🚀" title="No active campaigns"
        sub="Once you select a creator for a brief, your campaign appears here."
        cta="Post a brief →" onCta={() => setScreen('post-brief')} />
    </div>
  )

  // ── BRAND SETTINGS ──
  if (screen === 'brand-settings') return (
    <div style={{ ...css.screen, padding: '24px 20px 80px', minHeight: '100vh' }}>
      <BrandNav screen="brand-settings" setScreen={setScreen} />
      <PageHeader title="Settings" onBack={() => setScreen('brand-home')} />
      <Card style={{ marginBottom: '16px' }}>
        <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{user.name}</p>
        <p style={{ color: T.muted, fontSize: '13px' }}>{user.email}</p>
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${T.bg4}` }}>
          <p style={{ color: T.muted, fontSize: '12px' }}>Portal access</p>
          <p style={{ color: T.green, fontSize: '13px', fontWeight: '600', marginTop: '3px' }}>✓ Active — approved by Sena</p>
        </div>
      </Card>
      {[
        ['📞', 'Contact Sena', () => window.open('mailto:hello@raresena.com', '_blank')],
        ['🌐', 'Visit raresena.com', () => window.open('https://raresena.com', '_blank')],
      ].map(([icon, label, action]) => (
        <button key={label} onClick={action}
          style={{ background: T.bg2, border: `1px solid ${T.bg4}`, borderRadius: '10px',
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', width: '100%', textAlign: 'left',
            fontFamily: 'inherit', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px' }}>{icon}</span>
          <p style={{ color: T.white, fontSize: '14px', fontWeight: '500', flex: 1 }}>{label}</p>
          <span style={{ color: T.mutedDk, fontSize: '16px' }}>›</span>
        </button>
      ))}
      <button onClick={onLogout}
        style={{ background: 'none', border: `1px solid ${T.red}33`, borderRadius: '10px',
          padding: '14px 16px', color: T.red, fontSize: '14px',
          cursor: 'pointer', width: '100%', fontFamily: 'inherit', marginTop: '8px' }}>
        Sign out
      </button>
    </div>
  )

  return null
}
