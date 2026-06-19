import { useState } from 'react'
import { useApp, T, css, Btn, Card, GoldCTA, StudioNav, PageHeader,
  EmptyState, StageBadge, createStripeCheckout,
  STRIPE_CREATOR_ONETIME, STRIPE_CREATOR_MONTHLY } from '../App.jsx'

const SAMPLE_BRIEFS = [
  { id: 1, brand: 'NaturalGlow Beauty', niche: 'Beauty and Skincare', budget: '£350',
    deliverables: '3 × UGC videos (30-60 seconds)', deadline: '5 days left',
    description: 'We are looking for authentic creators to showcase our new vitamin C serum. We want real reactions and honest reviews that resonate with a diverse UK audience.', applicants: 4 },
  { id: 2, brand: 'FreshMart UK', niche: 'Food and Lifestyle', budget: '£500',
    deliverables: '5 × UGC videos + 3 Instagram posts', deadline: '8 days left',
    description: 'Seeking creators from immigrant and diaspora backgrounds to showcase how our products fit into multicultural UK kitchens.', applicants: 7 },
  { id: 3, brand: 'TechStart London', niche: 'Tech and Productivity', budget: '£420',
    deliverables: '2 × YouTube-style reviews + 4 TikTok clips', deadline: '12 days left',
    description: 'Looking for creators who can explain our project management app to young professionals and entrepreneurs in an authentic, relatable way.', applicants: 2 },
]

const SAMPLE_APPLICATIONS = [
  { id: 1, briefId: 1, brand: 'NaturalGlow Beauty', status: 'submitted', date: '2 days ago', rate: '£320' },
  { id: 2, briefId: 2, brand: 'FreshMart UK', status: 'shortlisted', date: '5 days ago', rate: '£480' },
]

const SAMPLE_CAMPAIGNS = [
  { id: 1, brand: 'HomeBase Essentials', status: 'active', deadline: '3 days',
    deliverable: '4 × 30-second UGC videos', value: '£380' },
]

export default function StudioPortal({ onLogout }) {
  const [screen, setScreen] = useState('studio-home')
  const [activeBrief, setActiveBrief] = useState(null)
  const [activeCampaign, setActiveCampaign] = useState(null)
  const [applied, setApplied] = useState([])
  const [pitch, setPitch] = useState('')
  const [rate, setRate] = useState('')
  const { user, saveUser } = useApp()

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
        {[['📋', SAMPLE_BRIEFS.length, 'Briefs available'],
          ['📝', SAMPLE_APPLICATIONS.length, 'Applications'],
          ['🚀', SAMPLE_CAMPAIGNS.length, 'Active campaigns'],
          ['💰', '£0', 'Total earnings']].map(([icon, val, label]) => (
          <Card key={label} style={{ textAlign: 'center', marginBottom: 0 }}>
            <p style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: T.gold }}>{val}</p>
            <p style={{ color: T.muted, fontSize: '11px' }}>{label}</p>
          </Card>
        ))}
      </div>

      {SAMPLE_CAMPAIGNS.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Active campaigns</p>
          {SAMPLE_CAMPAIGNS.map(c => (
            <div key={c.id} onClick={() => { setActiveCampaign(c); setScreen('campaign-detail') }}
              style={{ background: T.bg2, border: `1px solid ${T.gold}44`,
                borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{c.brand}</p>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>ACTIVE</span>
              </div>
              <p style={{ color: T.muted, fontSize: '12px', marginTop: '4px' }}>{c.deliverable}</p>
              <p style={{ color: T.red, fontSize: '12px', marginTop: '4px' }}>⏱ {c.deadline} remaining</p>
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
        {SAMPLE_BRIEFS.slice(0, 2).map(brief => (
          <BriefCard key={brief.id} brief={brief} applied={applied}
            onClick={() => { setActiveBrief(brief); setScreen('brief-detail') }} />
        ))}
      </div>
    </div>
  )

  // ── BRIEF BOARD ──
  if (screen === 'briefs') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="briefs" setScreen={setScreen} />
      <PageHeader title="Brief Board" sub={`${SAMPLE_BRIEFS.length} active briefs`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SAMPLE_BRIEFS.map(brief => (
          <BriefCard key={brief.id} brief={brief} applied={applied}
            onClick={() => { setActiveBrief(brief); setScreen('brief-detail') }} />
        ))}
      </div>
    </div>
  )

  // ── BRIEF DETAIL ──
  if (screen === 'brief-detail' && activeBrief) {
    const alreadyApplied = applied.includes(activeBrief.id)
    return (
      <div style={{ ...css.screen, ...css.padded }}>
        <StudioNav screen="briefs" setScreen={setScreen} />
        <PageHeader title={activeBrief.brand} onBack={() => setScreen('briefs')} />
        <Card>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ ...css.tag(T.purple) }}>{activeBrief.niche}</span>
            <span style={{ ...css.tag(T.gold) }}>{activeBrief.budget}</span>
            <span style={{ ...css.tag(T.red) }}>⏱ {activeBrief.deadline}</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: T.white, marginBottom: '14px' }}>
            {activeBrief.description}
          </p>
          {[['Deliverables', activeBrief.deliverables], ['Budget', activeBrief.budget],
            ['Applicants so far', `${activeBrief.applicants} creators`]].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: `1px solid ${T.bg4}` }}>
              <p style={{ color: T.muted, fontSize: '13px' }}>{label}</p>
              <p style={{ fontSize: '13px', color: T.white, fontWeight: '500' }}>{val}</p>
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
                value={rate} onChange={e => setRate(e.target.value)} />
            </div>
            <Btn onClick={() => {
              if (!pitch.trim() || !rate.trim()) return
              setApplied(prev => [...prev, activeBrief.id])
              setScreen('my-applications')
            }} disabled={!pitch.trim() || !rate.trim()}>
              Submit application →
            </Btn>
          </div>
        ) : (
          <div style={{ background: `${T.green}22`, border: `1px solid ${T.green}44`,
            borderRadius: '10px', padding: '14px', marginTop: '16px', textAlign: 'center' }}>
            <p style={{ color: T.green, fontWeight: '600', fontSize: '14px' }}>
              ✓ Application submitted
            </p>
            <p style={{ color: T.muted, fontSize: '12px', marginTop: '4px' }}>
              The brand will be in touch if they select you.
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
      <PageHeader title="My Applications" sub={`${SAMPLE_APPLICATIONS.length} total`} />
      {SAMPLE_APPLICATIONS.length === 0 ? (
        <EmptyState icon="📝" title="No applications yet"
          sub="Browse the Brief Board and apply for campaigns that match your niche."
          cta="Browse briefs →" onCta={() => setScreen('briefs')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAMPLE_APPLICATIONS.map(app => {
            const statusCol = app.status === 'shortlisted' ? T.gold : app.status === 'selected' ? T.green : T.muted
            return (
              <Card key={app.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{app.brand}</p>
                  <span style={{ background: `${statusCol}22`, color: statusCol,
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
                    fontWeight: '600', textTransform: 'uppercase' }}>{app.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <p style={{ color: T.muted, fontSize: '12px' }}>Proposed rate: {app.rate}</p>
                  <p style={{ color: T.mutedDk, fontSize: '12px' }}>Applied {app.date}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  // ── ACTIVE CAMPAIGNS ──
  if (screen === 'campaigns') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="campaigns" setScreen={setScreen} />
      <PageHeader title="My Campaigns" />
      {SAMPLE_CAMPAIGNS.length === 0 ? (
        <EmptyState icon="🚀" title="No active campaigns"
          sub="Once a brand selects you for a brief, your campaign appears here."
          cta="Browse briefs →" onCta={() => setScreen('briefs')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAMPLE_CAMPAIGNS.map(c => (
            <Card key={c.id} gold>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>{c.brand}</p>
                <span style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>{c.value}</span>
              </div>
              <p style={{ color: T.muted, fontSize: '13px', marginBottom: '8px' }}>{c.deliverable}</p>
              <p style={{ color: T.red, fontSize: '12px', marginBottom: '12px' }}>⏱ {c.deadline} to deliver</p>
              <Btn sm onClick={() => { setActiveCampaign(c); setScreen('campaign-detail') }}>
                View campaign →
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // ── CAMPAIGN DETAIL ──
  if (screen === 'campaign-detail' && activeCampaign) return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="campaigns" setScreen={setScreen} />
      <PageHeader title={activeCampaign.brand} onBack={() => setScreen('campaigns')} />
      <Card>
        {[['Deliverables', activeCampaign.deliverable],
          ['Campaign value', activeCampaign.value],
          ['Deadline', activeCampaign.deadline + ' remaining'],
          ['Status', 'Active — content in production']].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: `1px solid ${T.bg4}` }}>
            <p style={{ color: T.muted, fontSize: '13px' }}>{label}</p>
            <p style={{ fontSize: '13px', color: T.white, fontWeight: '500' }}>{val}</p>
          </div>
        ))}
      </Card>
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Messages</p>
        <Card>
          <p style={{ color: T.muted, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
            Message thread with {activeCampaign.brand} appears here.
          </p>
        </Card>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <input style={{ ...css.input, flex: 1 }} type="text" placeholder="Send a message..." />
          <button style={{ background: T.gold, color: T.bg, border: 'none',
            borderRadius: '8px', padding: '0 16px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'inherit' }}>Send</button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Btn onClick={() => {}}>Mark content as delivered →</Btn>
        <p style={{ textAlign: 'center', color: T.mutedDk, fontSize: '12px', marginTop: '8px' }}>
          Only mark delivered once the brand has received all content files.
        </p>
      </div>
    </div>
  )

  // ── RESOURCES ──
  if (screen === 'resources') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="resources" setScreen={setScreen} />
      <PageHeader title="Creator Resources" />
      {[{ icon: '🎓', title: 'UGC Mastery Course', sub: 'Your complete UGC income guide', tag: 'Included', url: 'https://raresena.com/courses' },
        { icon: '📄', title: 'Creator Contract Template', sub: 'Protect every deal legally', tag: 'Included', url: '#' },
        { icon: '💷', title: 'Rate Card Guide', sub: 'What to charge as a UK creator', tag: 'Included', url: '#' },
        { icon: '📧', title: 'Brand Pitch Email Templates', sub: '5 pitch templates for every scenario', tag: 'Included', url: '#' },
        { icon: '⚖️', title: 'Creator Legal Guide (UK Visa)', sub: 'Know your rights on every visa type', tag: 'Included', url: '#' },
        { icon: '🚩', title: 'Brand Red Flag Checklist', sub: '10 contract warning signs to watch for', tag: 'Included', url: '#' },
      ].map(resource => (
        <Card key={resource.title} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', flexShrink: 0 }}>{resource.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{resource.title}</p>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>
                  {resource.tag}
                </span>
              </div>
              <p style={{ color: T.muted, fontSize: '13px' }}>{resource.sub}</p>
            </div>
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
      <EmptyState icon="💬" title="Be the first to post"
        sub="Start a conversation with the Rare Studio creator community."
        cta="Write a post →" onCta={() => {}} />
    </div>
  )

  // ── CREATOR PROFILE ──
  if (screen === 'creator-profile') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <StudioNav screen="studio-home" setScreen={setScreen} />
      <PageHeader title="My Creator Profile" onBack={() => setScreen('studio-home')}
        sub="This is what brands see when they browse the creator directory" />
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
        {[['Bio', 'Add a bio — tell brands who you are and what you create'],
          ['Primary niche', 'e.g. Lifestyle, Beauty, Food, Tech'],
          ['TikTok', '@yourhandle'],
          ['Instagram', '@yourhandle'],
          ['Audience size', 'e.g. 5,000–10,000'],
          ['Rate range', 'e.g. £250–£500 per campaign'],
        ].map(([label, placeholder]) => (
          <div key={label} style={{ marginBottom: '14px' }}>
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '5px' }}>{label}</p>
            <input style={css.input} type="text" placeholder={placeholder} />
          </div>
        ))}
        <Btn onClick={() => setScreen('studio-home')}>Save profile</Btn>
      </Card>
    </div>
  )

  return null
}

function BriefCard({ brief, applied, onClick }) {
  const isApplied = applied.includes(brief.id)
  return (
    <div onClick={onClick} style={{ background: T.bg2,
      border: `1px solid ${isApplied ? T.green + '44' : T.bg4}`,
      borderRadius: '10px', padding: '14px 16px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
        <p style={{ fontWeight: '600', fontSize: '14px' }}>{brief.brand}</p>
        <span style={{ color: T.gold, fontSize: '13px', fontWeight: '700' }}>{brief.budget}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <span style={{ ...css.tag(T.purple) }}>{brief.niche}</span>
        <span style={{ ...css.tag(T.red) }}>⏱ {brief.deadline}</span>
        {isApplied && <span style={{ ...css.tag(T.green) }}>✓ Applied</span>}
      </div>
      <p style={{ color: T.muted, fontSize: '12px' }}>
        {brief.deliverables} · {brief.applicants} applicants
      </p>
    </div>
  )
}
