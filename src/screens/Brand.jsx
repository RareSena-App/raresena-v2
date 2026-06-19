import { useState } from 'react'
import { useApp, T, css, Btn, Card, BrandNav, PageHeader, EmptyState } from '../App.jsx'

const SAMPLE_CREATORS = [
  { id: 1, name: 'Amara J.', initials: 'AJ', niche: 'Lifestyle and Wellness', audience: '12K', location: 'London', campaigns: 8, rate: '£300–£500', bio: 'Immigrant lifestyle creator sharing authentic UK life stories, wellness tips, and cultural experiences.' },
  { id: 2, name: 'Kofi A.', initials: 'KA', niche: 'Food and Culture', audience: '28K', location: 'Manchester', campaigns: 15, rate: '£450–£800', bio: 'West African cuisine meets UK living. Recipe videos, cultural storytelling, and honest product reviews.' },
  { id: 3, name: 'Priya S.', initials: 'PS', niche: 'Tech and Productivity', audience: '9K', location: 'Birmingham', campaigns: 5, rate: '£250–£400', bio: 'Software engineer turned content creator. Tech reviews, productivity tips, and career content for young professionals.' },
  { id: 4, name: 'Fatima B.', initials: 'FB', niche: 'Beauty and Skincare', audience: '45K', location: 'Leeds', campaigns: 22, rate: '£600–£1,200', bio: 'Melanin-rich beauty content. Honest skincare reviews, makeup tutorials, and brand partnerships that celebrate diversity.' },
]

export default function BrandPortal({ onLogout }) {
  const [screen, setScreen] = useState('brand-home')
  const [activeCreator, setActiveCreator] = useState(null)
  const [activeBrief, setActiveBrief] = useState(null)
  const [activeCampaign, setActiveCampaign] = useState(null)
  const [briefs, setBriefs] = useState([])
  const [briefForm, setBriefForm] = useState({ name: '', niche: '', deliverables: '', budget: '', timeline: '', rights: '', deadline: '' })
  const { user } = useApp()

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
        {[['📋', briefs.length, 'Active briefs'], ['👥', SAMPLE_CREATORS.length, 'Creators available'],
          ['🚀', 0, 'Campaigns active'], ['✓', 0, 'Campaigns complete']].map(([icon, val, label]) => (
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
          {briefs.map(b => (
            <Card key={b.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>{b.name}</p>
                  <p style={{ color: T.muted, fontSize: '12px', marginTop: '3px' }}>
                    {b.niche} · {b.budget}
                  </p>
                </div>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>OPEN</span>
              </div>
            </Card>
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
      <PageHeader title="Creator Directory" sub={`${SAMPLE_CREATORS.length} verified creators`} />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['All', 'Lifestyle', 'Beauty', 'Food', 'Tech'].map(filter => (
          <button key={filter}
            style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${T.bg4}`,
              background: filter === 'All' ? T.gold : T.bg2,
              color: filter === 'All' ? T.bg : T.muted,
              fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>{filter}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SAMPLE_CREATORS.map(creator => (
          <div key={creator.id} onClick={() => { setActiveCreator(creator); setScreen('creator-profile-view') }}
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
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>{creator.audience}</p>
                <p style={{ color: T.mutedDk, fontSize: '11px' }}>followers</p>
              </div>
            </div>
            <p style={{ color: T.muted, fontSize: '12px', lineHeight: '1.5', marginBottom: '8px' }}>
              {creator.bio.substring(0, 90)}...
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ ...css.tag(T.blue) }}>{creator.campaigns} campaigns</span>
              <span style={{ ...css.tag(T.gold) }}>{creator.rate}</span>
            </div>
          </div>
        ))}
      </div>
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
        {[['Niche', activeCreator.niche], ['Audience size', activeCreator.audience],
          ['Location', activeCreator.location], ['Rate range', activeCreator.rate],
          ['Campaigns completed', activeCreator.campaigns.toString()],
        ].map(([label, val]) => (
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
            placeholder="Tell creators what you're looking for and why your brand is worth their time..." />
        </div>
        <Btn onClick={() => {
          if (!briefForm.name.trim()) return
          setBriefs(prev => [...prev, { id: Date.now(), ...briefForm }])
          setBriefForm({ name: '', niche: '', deliverables: '', budget: '', timeline: '', rights: '', deadline: '' })
          setScreen('brand-home')
        }} disabled={!briefForm.name.trim()}>
          Post brief — notify matching creators →
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
      {briefs.length === 0 ? (
        <EmptyState icon="📋" title="No briefs posted yet"
          sub="Post your first brief and matching creators will be notified automatically."
          cta="Post a brief →" onCta={() => setScreen('post-brief')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {briefs.map(b => (
            <Card key={b.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{b.name}</p>
                <span style={{ background: `${T.green}22`, color: T.green,
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>OPEN</span>
              </div>
              <p style={{ color: T.muted, fontSize: '12px' }}>{b.niche} · {b.budget} · {b.deadline}</p>
            </Card>
          ))}
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
      {[['📞', 'Contact Sena', () => window.open('mailto:hello@raresena.com', '_blank')],
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
