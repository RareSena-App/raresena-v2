import { useState, useEffect } from 'react'
import { useApp, T, css, Btn, Card, StudioNav, PageHeader,
  EmptyState, createStripeCheckout, supabase,
  STRIPE_CREATOR_ONETIME, STRIPE_CREATOR_MONTHLY } from '../App.jsx'

export default function StudioPortal({ onLogout }) {
  const [screen, setScreen] = useState('studio-home')
  const [activeBrief, setActiveBrief] = useState(null)
  const [briefs, setBriefs] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [briefsLoading, setBriefsLoading] = useState(true)
  const [pitch, setPitch] = useState('')
  const [proposedRate, setProposedRate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [profileForm, setProfileForm] = useState({ bio: '', niche: '', tiktok: '', instagram: '', audience: '', rate: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [raiseDisputeBriefId, setRaiseDisputeBriefId] = useState(null)
  const [disputeText, setDisputeText] = useState('')
  const [disputeSent, setDisputeSent] = useState(false)
  const [studioPosts, setStudioPosts] = useState([])
  const [studioPostText, setStudioPostText] = useState('')
  const [studioPostsLoading, setStudioPostsLoading] = useState(false)
  const [studioLikedIds, setStudioLikedIds] = useState(new Set())
  const { user } = useApp()

  useEffect(() => {
    if (!user.supabaseId) return
    fetchBriefs()
    fetchMyApplications()
    loadProfile()
  }, [user.supabaseId])

  useEffect(() => {
    if (screen === 'studio-community' && user.supabaseId) {
      fetchStudioPosts()
      fetchStudioLikedPosts()
    }
  }, [screen, user.supabaseId])

  async function fetchBriefs() {
    setBriefsLoading(true)
    const { data } = await supabase
      .from('brand_briefs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
    setBriefs(data || [])
    setBriefsLoading(false)
  }

  async function fetchMyApplications() {
    const { data } = await supabase
      .from('brief_applications')
      .select('*, brief:brand_briefs(campaign_name, budget, deliverables)')
      .eq('creator_user_id', user.supabaseId)
      .order('created_at', { ascending: false })
    setMyApplications(data || [])
  }

  async function loadProfile() {
    const { data } = await supabase
      .from('rebuilders')
      .select('creator_bio, creator_niche, creator_tiktok, creator_instagram, creator_audience_size, creator_rate_range')
      .eq('id', user.supabaseId)
      .single()
    if (data) {
      setProfileForm({
        bio: data.creator_bio || '',
        niche: data.creator_niche || '',
        tiktok: data.creator_tiktok || '',
        instagram: data.creator_instagram || '',
        audience: data.creator_audience_size || '',
        rate: data.creator_rate_range || '',
      })
    }
  }

  async function saveProfile() {
    setProfileSaving(true)
    await supabase.from('rebuilders').update({
      creator_bio: profileForm.bio,
      creator_niche: profileForm.niche,
      creator_tiktok: profileForm.tiktok,
      creator_instagram: profileForm.instagram,
      creator_audience_size: profileForm.audience,
      creator_rate_range: profileForm.rate,
      updated_at: new Date().toISOString(),
    }).eq('id', user.supabaseId)
    setProfileSaving(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function applyToBrief() {
    if (!pitch.trim() || !proposedRate.trim() || !activeBrief) return
    setSubmitting(true)
    const { error } = await supabase.from('brief_applications').insert({
      brief_id: activeBrief.id,
      creator_user_id: user.supabaseId,
      pitch,
      proposed_rate: proposedRate,
      status: 'submitted',
    })
    if (!error) {
      await fetchMyApplications()
      setPitch('')
      setProposedRate('')
      setScreen('my-applications')
    }
    setSubmitting(false)
  }

  async function raiseDispute(appId) {
    if (!disputeText.trim()) return
    const { error } = await supabase.from('disputes').insert({
      application_id: appId,
      raised_by_user_id: user.supabaseId,
      description: disputeText,
      status: 'open',
    })
    if (!error) {
      setDisputeText('')
      setRaiseDisputeBriefId(null)
      setDisputeSent(true)
      setTimeout(() => setDisputeSent(false), 3000)
    }
  }

  async function fetchStudioPosts() {
    setStudioPostsLoading(true)
    const { data } = await supabase
      .from('circle_posts')
      .select('*, rebuilders!circle_posts_user_id_fkey(name)')
      .eq('group_name', 'studio')
      .order('created_at', { ascending: false })
    setStudioPosts(data || [])
    setStudioPostsLoading(false)
  }

  async function fetchStudioLikedPosts() {
    const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', user.supabaseId)
    setStudioLikedIds(new Set((data || []).map(r => r.post_id)))
  }

  async function submitStudioPost() {
    if (!studioPostText.trim()) return
    const { data, error } = await supabase.from('circle_posts').insert({
      user_id: user.supabaseId,
      group_name: 'studio',
      content: studioPostText.trim(),
      likes: 0,
    }).select('*, rebuilders!circle_posts_user_id_fkey(name)')
    if (!error && data?.[0]) {
      setStudioPosts(prev => [data[0], ...prev])
      setStudioPostText('')
    }
  }

  async function toggleStudioLike(postId) {
    const isLiked = studioLikedIds.has(postId)
    setStudioLikedIds(prev => {
      const next = new Set(prev)
      isLiked ? next.delete(postId) : next.add(postId)
      return next
    })
    setStudioPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes: (p.likes || 0) + (isLiked ? -1 : 1) } : p
    ))
    await supabase.rpc('toggle_like', { p_post_id: postId, p_user_id: user.supabaseId })
  }

  const appliedBriefIds = new Set(myApplications.map(a => a.brief_id))
  const activeCampaigns = myApplications.filter(a => a.status === 'selected')

  // ── DASHBOARD ──
  if (screen === 'studio-home') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="studio-home" setScreen={setScreen} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p style={{ color: T.muted, fontSize: '12px' }}>Rare Studio</p>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Hello, {user.name.split(' ')[0]} 🎬</h1>
        </div>
        <button onClick={() => setScreen('creator-profile')}
          style={{ background: T.bg3, border: 'none', borderRadius: '8px',
            padding: '8px 12px', color: T.muted, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          My Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {[['📋', briefsLoading ? '…' : briefs.length, 'Briefs available'],
          ['📝', myApplications.length, 'Applications'],
          ['🚀', activeCampaigns.length, 'Active campaigns'],
          ['💰', '£0', 'Total earnings']].map(([icon, val, label]) => (
          <Card key={label} style={{ textAlign: 'center', marginBottom: 0 }}>
            <p style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: T.gold }}>{val}</p>
            <p style={{ color: T.muted, fontSize: '11px' }}>{label}</p>
          </Card>
        ))}
      </div>

      {activeCampaigns.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Active campaigns</p>
          {activeCampaigns.map(app => (
            <div key={app.id}
              style={{ background: T.bg2, border: `1px solid ${T.gold}44`,
                borderRadius: '10px', padding: '14px 16px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{app.brief?.campaign_name || 'Campaign'}</p>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>ACTIVE</span>
              </div>
              {app.brief?.deliverables && (
                <p style={{ color: T.muted, fontSize: '12px', marginTop: '4px' }}>{app.brief.deliverables}</p>
              )}
              <p style={{ color: T.gold, fontSize: '12px', marginTop: '4px' }}>{app.proposed_rate}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <p style={{ fontWeight: '600', fontSize: '15px' }}>Latest briefs</p>
          <button onClick={() => setScreen('briefs')}
            style={{ background: 'none', border: 'none', color: T.gold,
              fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>View all →</button>
        </div>
        {briefsLoading ? (
          <p style={{ color: T.muted, fontSize: '13px', padding: '20px 0', textAlign: 'center' }}>Loading...</p>
        ) : briefs.length === 0 ? (
          <EmptyState icon="📋" title="No briefs yet"
            sub="Brand campaign briefs will appear here once posted." />
        ) : (
          briefs.slice(0, 2).map(brief => (
            <BriefCard key={brief.id} brief={brief} isApplied={appliedBriefIds.has(brief.id)}
              onClick={() => { setActiveBrief(brief); setScreen('brief-detail') }} />
          ))
        )}
      </div>
    </div>
  )

  // ── BRIEF BOARD ──
  if (screen === 'briefs') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="briefs" setScreen={setScreen} />
      <PageHeader title="Brief Board"
        sub={briefsLoading ? 'Loading...' : `${briefs.length} active brief${briefs.length !== 1 ? 's' : ''}`} />
      {briefsLoading ? (
        <p style={{ color: T.muted, textAlign: 'center', padding: '40px 0' }}>Loading briefs...</p>
      ) : briefs.length === 0 ? (
        <EmptyState icon="📋" title="No briefs yet"
          sub="Brand campaign briefs appear here once posted. Check back soon." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {briefs.map(brief => (
            <BriefCard key={brief.id} brief={brief} isApplied={appliedBriefIds.has(brief.id)}
              onClick={() => { setActiveBrief(brief); setScreen('brief-detail') }} />
          ))}
        </div>
      )}
    </div>
  )

  // ── BRIEF DETAIL ──
  if (screen === 'brief-detail' && activeBrief) {
    const myApp = myApplications.find(a => a.brief_id === activeBrief.id)
    const alreadyApplied = !!myApp
    return (
      <div style={{ ...css.screen, ...css.padded }}>
        <StudioNav screen="briefs" setScreen={setScreen} />
        <PageHeader title={activeBrief.campaign_name} onBack={() => setScreen('briefs')} />
        <Card>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {activeBrief.niche_required && <span style={{ ...css.tag(T.purple) }}>{activeBrief.niche_required}</span>}
            {activeBrief.budget && <span style={{ ...css.tag(T.gold) }}>{activeBrief.budget}</span>}
            {activeBrief.deadline && <span style={{ ...css.tag(T.red) }}>⏱ {activeBrief.deadline}</span>}
          </div>
          {activeBrief.description && (
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: T.white, marginBottom: '14px' }}>
              {activeBrief.description}
            </p>
          )}
          {[['Deliverables', activeBrief.deliverables],
            ['Budget', activeBrief.budget],
            ['Timeline', activeBrief.timeline],
            ['Usage rights', activeBrief.usage_rights],
          ].filter(([, v]) => v).map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: `1px solid ${T.bg4}` }}>
              <p style={{ color: T.muted, fontSize: '13px' }}>{label}</p>
              <p style={{ fontSize: '13px', color: T.white, fontWeight: '500',
                textAlign: 'right', maxWidth: '58%' }}>{val}</p>
            </div>
          ))}
        </Card>

        {!alreadyApplied ? (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Your application</p>
            <div style={{ marginBottom: '12px' }}>
              <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>Your pitch (why you're right for this brief)</p>
              <textarea style={{ ...css.input, height: '100px', resize: 'none' }}
                placeholder="Tell the brand why your content style fits their campaign..."
                value={pitch} onChange={e => setPitch(e.target.value)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>Your proposed rate</p>
              <input style={css.input} type="text" placeholder="e.g. £350"
                value={proposedRate} onChange={e => setProposedRate(e.target.value)} />
            </div>
            <Btn onClick={applyToBrief}
              disabled={!pitch.trim() || !proposedRate.trim() || submitting}>
              {submitting ? 'Submitting...' : 'Submit application →'}
            </Btn>
          </div>
        ) : myApp?.status === 'selected' ? (
          <div style={{ marginTop: '16px' }}>
            <div style={{ background: `${T.green}22`, border: `1px solid ${T.green}44`,
              borderRadius: '10px', padding: '14px', marginBottom: '12px', textAlign: 'center' }}>
              <p style={{ color: T.green, fontWeight: '600', fontSize: '14px' }}>🎉 You've been selected!</p>
              <p style={{ color: T.muted, fontSize: '12px', marginTop: '4px' }}>
                The brand has chosen you for this campaign. Expect to hear from them soon.
              </p>
            </div>
            {raiseDisputeBriefId === myApp.id ? (
              <div>
                <textarea style={{ ...css.input, height: '70px', resize: 'none', marginBottom: '8px', display: 'block' }}
                  placeholder="Describe the issue with this campaign..."
                  value={disputeText} onChange={e => setDisputeText(e.target.value)} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn sm onClick={() => raiseDispute(myApp.id)} disabled={!disputeText.trim()}>
                    Submit dispute →
                  </Btn>
                  <button onClick={() => { setRaiseDisputeBriefId(null); setDisputeText('') }}
                    style={{ background: 'none', border: 'none', color: T.muted,
                      cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setRaiseDisputeBriefId(myApp.id)}
                style={{ background: 'none', border: 'none', color: T.mutedDk,
                  fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Raise a dispute →
              </button>
            )}
            {disputeSent && (
              <div style={{ background: `${T.green}22`, border: `1px solid ${T.green}`, borderRadius: '10px',
                padding: '12px', marginTop: '10px', textAlign: 'center' }}>
                <p style={{ color: T.green, fontSize: '13px' }}>✓ Dispute raised — Sena will review within 48 hours</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: `${T.green}22`, border: `1px solid ${T.green}44`,
            borderRadius: '10px', padding: '14px', marginTop: '16px', textAlign: 'center' }}>
            <p style={{ color: T.green, fontWeight: '600', fontSize: '14px' }}>✓ Application submitted</p>
            <p style={{ color: T.muted, fontSize: '12px', marginTop: '4px' }}>
              The brand will review your application and be in touch if selected.
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── MY APPLICATIONS ──
  if (screen === 'my-applications') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="briefs" setScreen={setScreen} />
      <PageHeader title="My Applications" sub={`${myApplications.length} total`} />
      {myApplications.length === 0 ? (
        <EmptyState icon="📝" title="No applications yet"
          sub="Browse the Brief Board and apply for campaigns that match your niche."
          cta="Browse briefs →" onCta={() => setScreen('briefs')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myApplications.map(app => {
            const statusCol = app.status === 'shortlisted' ? T.gold
              : app.status === 'selected' ? T.green
              : app.status === 'rejected' ? T.red
              : T.muted
            const d = new Date(app.created_at)
            const daysSince = Math.floor((Date.now() - d) / 86400000)
            const dateStr = daysSince === 0 ? 'today' : daysSince === 1 ? 'yesterday' : `${daysSince} days ago`
            return (
              <Card key={app.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{app.brief?.campaign_name || 'Campaign'}</p>
                  <span style={{ background: `${statusCol}22`, color: statusCol,
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
                    fontWeight: '600', textTransform: 'uppercase' }}>{app.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {app.proposed_rate && <p style={{ color: T.muted, fontSize: '12px' }}>Proposed: {app.proposed_rate}</p>}
                  <p style={{ color: T.mutedDk, fontSize: '12px' }}>Applied {dateStr}</p>
                </div>
                {app.status === 'selected' && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${T.bg4}` }}>
                    {raiseDisputeBriefId === app.id ? (
                      <div>
                        <textarea style={{ ...css.input, height: '70px', resize: 'none', marginBottom: '8px', display: 'block' }}
                          placeholder="Describe the issue with this campaign..."
                          value={disputeText} onChange={e => setDisputeText(e.target.value)} />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Btn sm onClick={() => raiseDispute(app.id)} disabled={!disputeText.trim()}>
                            Submit dispute →
                          </Btn>
                          <button onClick={() => { setRaiseDisputeBriefId(null); setDisputeText('') }}
                            style={{ background: 'none', border: 'none', color: T.muted,
                              cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setRaiseDisputeBriefId(app.id)}
                        style={{ background: 'none', border: 'none', color: T.mutedDk,
                          fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Raise a dispute →
                      </button>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
          {disputeSent && (
            <div style={{ background: `${T.green}22`, border: `1px solid ${T.green}`, borderRadius: '10px',
              padding: '12px', textAlign: 'center' }}>
              <p style={{ color: T.green, fontSize: '13px' }}>✓ Dispute raised — Sena will review within 48 hours</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // ── ACTIVE CAMPAIGNS ──
  if (screen === 'campaigns') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="campaigns" setScreen={setScreen} />
      <PageHeader title="My Campaigns" />
      {activeCampaigns.length === 0 ? (
        <EmptyState icon="🚀" title="No active campaigns"
          sub="Once a brand selects you for a brief, your campaign appears here."
          cta="Browse briefs →" onCta={() => setScreen('briefs')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeCampaigns.map(app => (
            <Card key={app.id} gold>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>{app.brief?.campaign_name || 'Campaign'}</p>
                <span style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>{app.proposed_rate}</span>
              </div>
              {app.brief?.deliverables && (
                <p style={{ color: T.muted, fontSize: '13px', marginBottom: '8px' }}>{app.brief.deliverables}</p>
              )}
              <span style={{ background: `${T.green}22`, color: T.green,
                padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>SELECTED</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // ── RESOURCES ──
  if (screen === 'resources') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="resources" setScreen={setScreen} />
      <PageHeader title="Creator Resources" />
      {[{ icon: '🎓', title: 'UGC Mastery Course', sub: 'Your complete UGC income guide', url: 'https://raresena.com/courses' },
        { icon: '📄', title: 'Creator Contract Template', sub: 'Protect every deal legally', url: '#' },
        { icon: '💷', title: 'Rate Card Guide', sub: 'What to charge as a UK creator', url: '#' },
        { icon: '📧', title: 'Brand Pitch Email Templates', sub: '5 pitch templates for every scenario', url: '#' },
        { icon: '⚖️', title: 'Creator Legal Guide (UK Visa)', sub: 'Know your rights on every visa type', url: '#' },
        { icon: '🚩', title: 'Brand Red Flag Checklist', sub: '10 contract warning signs to watch for', url: '#' },
      ].map(resource => (
        <Card key={resource.title} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', flexShrink: 0 }}>{resource.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px' }}>{resource.title}</p>
              <p style={{ color: T.muted, fontSize: '13px' }}>{resource.sub}</p>
            </div>
            <span style={{ background: `${T.green}22`, color: T.green,
              padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', flexShrink: 0 }}>
              Included
            </span>
          </div>
        </Card>
      ))}
    </div>
  )

  // ── STUDIO COMMUNITY ──
  if (screen === 'studio-community') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="studio-community" setScreen={setScreen} />
      <PageHeader title="Rare Studio Creators" sub="Your creator community" />
      <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`,
        borderRadius: '10px', padding: '14px', marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ color: T.goldLt, fontSize: '13px', lineHeight: '1.6' }}>
          This is your space — share wins, ask questions, learn from other creators in the Rare Studio network. Brands cannot see or access this community.
        </p>
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <textarea
          style={{ ...css.input, height: '80px', resize: 'none', marginBottom: '10px' }}
          placeholder="Share a win, ask a question, or start a conversation..."
          value={studioPostText}
          onChange={e => setStudioPostText(e.target.value)}
        />
        <Btn onClick={submitStudioPost} disabled={!studioPostText.trim()}>
          Post to community →
        </Btn>
      </Card>

      {studioPostsLoading ? (
        <p style={{ color: T.muted, textAlign: 'center', padding: '30px 0' }}>Loading...</p>
      ) : studioPosts.length === 0 ? (
        <EmptyState icon="💬" title="Be the first to post"
          sub="Start a conversation with the Rare Studio creator community." />
      ) : (
        studioPosts.map(post => (
          <StudioPostCard key={post.id} post={post} user={user}
            liked={studioLikedIds.has(post.id)}
            onLike={() => toggleStudioLike(post.id)} />
        ))
      )}
    </div>
  )

  // ── CREATOR PROFILE ──
  if (screen === 'creator-profile') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="studio-home" setScreen={setScreen} />
      <PageHeader title="My Creator Profile" onBack={() => setScreen('studio-home')}
        sub="This is what brands see in the creator directory" />
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%',
            background: `${T.purple}33`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px', fontWeight: '700',
            color: T.purple, flexShrink: 0 }}>{user.name[0]}</div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>{user.name}</p>
            <p style={{ color: T.muted, fontSize: '13px' }}>Creator Member</p>
          </div>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <p style={{ color: T.muted, fontSize: '12px', marginBottom: '5px' }}>Bio</p>
          <textarea style={{ ...css.input, height: '80px', resize: 'none' }}
            placeholder="Tell brands who you are and what you create..."
            value={profileForm.bio}
            onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} />
        </div>
        {[
          ['Primary niche', 'niche', 'e.g. Lifestyle, Beauty, Food, Tech'],
          ['TikTok', 'tiktok', '@yourhandle'],
          ['Instagram', 'instagram', '@yourhandle'],
          ['Audience size', 'audience', 'e.g. 5,000–10,000'],
          ['Rate range', 'rate', 'e.g. £250–£500 per campaign'],
        ].map(([label, key, placeholder]) => (
          <div key={key} style={{ marginBottom: '14px' }}>
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '5px' }}>{label}</p>
            <input style={css.input} type="text" placeholder={placeholder}
              value={profileForm[key]}
              onChange={e => setProfileForm(p => ({ ...p, [key]: e.target.value }))} />
          </div>
        ))}
        {profileSaved && (
          <p style={{ color: T.green, fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>
            ✓ Profile saved — brands can now find you
          </p>
        )}
        <Btn onClick={saveProfile} disabled={profileSaving}>
          {profileSaving ? 'Saving...' : 'Save profile →'}
        </Btn>
      </Card>
    </div>
  )

  return null
}

function StudioPostCard({ post, user, liked, onLike }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState([])
  const [replyCount, setReplyCount] = useState(0)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    supabase.from('post_replies').select('id', { count: 'exact', head: true }).eq('post_id', post.id)
      .then(({ count }) => setReplyCount(count || 0))
  }, [post.id])

  async function loadReplies() {
    const { data } = await supabase
      .from('post_replies')
      .select('*, rebuilders!post_replies_user_id_fkey(name)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    setReplies(data || [])
  }

  async function toggleReplies() {
    if (!showReplies) await loadReplies()
    setShowReplies(p => !p)
  }

  async function submitReply() {
    if (!replyText.trim()) return
    const { data, error } = await supabase.from('post_replies').insert({
      post_id: post.id,
      user_id: user.supabaseId,
      content: replyText.trim(),
    }).select('*, rebuilders!post_replies_user_id_fkey(name)')
    if (!error && data?.[0]) {
      setReplies(p => [...p, data[0]])
      setReplyCount(p => p + 1)
      setReplyText('')
    }
  }

  const name = post.rebuilders?.name || 'Creator'
  const date = post.created_at
    ? new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : ''

  return (
    <Card style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${T.purple}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.purple, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>{name[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <p style={{ fontWeight: '600', fontSize: '14px' }}>{name}</p>
            <p style={{ color: T.muted, fontSize: '11px' }}>{date}</p>
          </div>
          <p style={{ color: T.fg, fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: `1px solid ${T.bg4}` }}>
        <button onClick={onLike} style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: liked ? T.red : T.muted, fontSize: '13px', fontFamily: 'inherit', padding: 0 }}>
          {liked ? '❤️' : '🤍'} {post.likes || 0}
        </button>
        <button onClick={toggleReplies} style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: T.muted, fontSize: '13px', fontFamily: 'inherit', padding: 0 }}>
          💬 {replyCount} {showReplies ? '▲' : '▼'}
        </button>
      </div>
      {showReplies && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${T.bg4}` }}>
          {replies.map(r => (
            <div key={r.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${T.gold}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.gold, fontWeight: '700', fontSize: '11px', flexShrink: 0 }}>
                {(r.rebuilders?.name || 'C')[0]}
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '12px' }}>{r.rebuilders?.name || 'Creator'}</p>
                <p style={{ color: T.fg, fontSize: '13px', lineHeight: '1.4' }}>{r.content}</p>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input style={{ ...css.input, flex: 1, padding: '8px 10px' }}
              placeholder="Write a reply..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitReply()} />
            <button onClick={submitReply}
              style={{ background: T.gold, border: 'none', borderRadius: '8px',
                padding: '8px 14px', color: '#000', fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Post
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

function BriefCard({ brief, isApplied, onClick }) {
  return (
    <div onClick={onClick} style={{ background: T.bg2,
      border: `1px solid ${isApplied ? T.green + '44' : T.bg4}`,
      borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
        <p style={{ fontWeight: '600', fontSize: '14px', flex: 1, marginRight: '8px' }}>{brief.campaign_name}</p>
        {brief.budget && <span style={{ color: T.gold, fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{brief.budget}</span>}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        {brief.niche_required && <span style={{ ...css.tag(T.purple) }}>{brief.niche_required}</span>}
        {brief.deadline && <span style={{ ...css.tag(T.red) }}>⏱ {brief.deadline}</span>}
        {isApplied && <span style={{ ...css.tag(T.green) }}>✓ Applied</span>}
      </div>
      {brief.deliverables && (
        <p style={{ color: T.muted, fontSize: '12px' }}>{brief.deliverables}</p>
      )}
    </div>
  )
}
