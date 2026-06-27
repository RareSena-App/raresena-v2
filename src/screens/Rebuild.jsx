import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp, STAGE_DATA, STAGES, CIRCLE_GROUPS, STAGE_GROUP_PRESELECT, T, css,
  Btn, Card, GoldCTA, StageBadge, RebuildNav, PageHeader,
  EmptyState, today, getDaysSince, createStripeCheckout,
  STRIPE_MONTHLY_PRICE, STRIPE_ANNUAL_PRICE, supabase } from '../App.jsx'

// Sample circle posts
const SAMPLE_POSTS = [
  { id: 1, author: 'Adaeze O.', initials: 'AO', stage: 'Reset', time: '2h ago',
    content: "Day 11. Filed the FLR today with the fee waiver. I didn't know it was possible until I found this community. If you're in Reset — the fee waiver is real. You are not alone.",
    likes: 47, replies: 12, groupName: 'Reset' },
  { id: 2, author: 'Priya M.', initials: 'PM', stage: 'Rediscover', time: '5h ago',
    content: "Six months ago I couldn't answer 'what do you do?' without shame. Today I answered it proudly at a networking event. The Rediscover work is slow. It is real. Don't skip it.",
    likes: 89, replies: 23, groupName: 'Rediscover' },
  { id: 3, author: 'Kofi A.', initials: 'KA', stage: 'Routine', time: '1d ago',
    content: "30-day streak. The habit that held everything together: 7am journal, three sentences, before anything else. Find your anchor habit and protect it like you protect your documents.",
    likes: 134, replies: 41, groupName: 'Routine' },
  { id: 4, author: 'Fatima B.', initials: 'FB', stage: 'Rise', time: '2d ago',
    content: "Company registered. Sponsor Licence application started. IFV endorsing body identified. One year ago I was in Reset with 11 days left. The stages are real. Keep going.",
    likes: 203, replies: 67, groupName: 'Rise' },
  { id: 5, author: 'Emmanuel T.', initials: 'ET', stage: 'Realize', time: '3d ago',
    content: "To every Reset rebuilder reading this at 2am: I see you. I was you. The ground will stabilise. The identity will return. And then — one day — you will be here. Keep going.",
    likes: 312, replies: 89, groupName: 'Realize' },
]

const ROADMAP_DATA = {
  Reset: { milestones: ['Understand your visa options and deadlines', 'Identify your most pressing financial gap and one way to close it', 'Secure stable housing', 'Build your first daily anchor habit', 'Connect with one person who understands this journey'],
    resources: [{ title: '5R Rebuild Workbook', url: 'https://raresena.com/shop', price: '£22' }, { title: 'Crisis Navigation Programme', url: 'https://raresena.com/crisis', price: '£2,600' }] },
  Rediscover: { milestones: ['Complete the values identification exercise', 'Map your professional identity to the UK market', 'Name one cultural anchor you will always maintain', 'Find your community', 'Define what sovereignty means to you personally'],
    resources: [{ title: '5R Rebuild Workbook', url: 'https://raresena.com/shop', price: '£22' }, { title: 'Stage Worksheets Bundle', url: 'https://raresena.com/shop', price: '£25' }] },
  Routine: { milestones: ['Design a morning routine you can genuinely keep', 'Identify your 5 core daily habits', 'Build a weekly review practice', 'Complete 30 consecutive days without breaking your streak', 'Create a basic financial tracking system'],
    resources: [{ title: 'Habit and Routine Planner', url: 'https://raresena.com/shop', price: '£12' }, { title: 'Ultimate Planner', url: 'https://raresena.com/shop', price: '£19' }] },
  Rise: { milestones: ['Define your 90-day direction in one sentence', 'Identify and start your primary income stream', 'Build your professional network in the UK', 'Begin the Sovereignty Programme assessment', 'Complete one project that demonstrates your direction'],
    resources: [{ title: 'Sovereignty Programme', url: 'https://raresena.com/sovereignty', price: '£3,500' }, { title: 'RareStack', url: 'https://raresena.com/rarestack', price: 'Free / £39/mo' }] },
  Realize: { milestones: ['Document your full rebuild journey', 'Build one income stream that works without you daily', 'Mentor one person in an earlier stage', 'Complete your sovereignty plan', 'Define what you are giving back — and begin giving it'],
    resources: [{ title: 'Sovereignty Programme — Graduate', url: 'https://raresena.com/sovereignty', price: '£3,000' }, { title: 'Rare Studio', url: 'https://raresena.com/studio', price: 'From £27/mo' }] },
}

export default function RebuildPortal({ onLogout }) {
  const [screen, setScreen] = useState('home')
  const [activeGroup, setActiveGroup] = useState(null)
  const [newHabitName, setNewHabitName] = useState('')
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [premiumPlan, setPremiumPlan] = useState('annual')
  const [postText, setPostText] = useState('')
  const [showDay30Share, setShowDay30Share] = useState(false)
  const [day30PostText, setDay30PostText] = useState('30 days of rebuilding. I am building something real. 🌿')
  const [circlePosts, setCirclePosts] = useState([])
  const [likedPostIds, setLikedPostIds] = useState(new Set())
  const [showPostComposer, setShowPostComposer] = useState(false)
  const [newPostText, setNewPostText] = useState('')
  const [postingGroup, setPostingGroup] = useState(null)

  useEffect(() => {
    if (screen === 'circle') { fetchCirclePosts(); fetchLikedPosts() }
  }, [screen])

  const { user, habits, saveUser, toggleHabit, addHabit, removeHabit, toggleMilestone } = useApp()
  const d = STAGE_DATA[user.stage]
  const daysSince = getDaysSince(user.joinDate)
  const checkedToday = user.lastCheckIn && new Date(user.lastCheckIn).toDateString() === today()
  const todayHabits = habits.map(h => ({ ...h, done: (h.completedDates || []).includes(today()) }))
  const doneCount = todayHabits.filter(h => h.done).length

  async function fetchCirclePosts() {
    const { data } = await supabase
      .from('circle_posts')
      .select('*, rebuilders!circle_posts_user_id_fkey(name, stage)')
      .eq('is_removed', false)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30)
    setCirclePosts((data || []).map(formatPost))
  }

  async function submitPost(groupName) {
    if (!newPostText.trim()) return
    await supabase.from('circle_posts').insert({
      user_id: user.supabaseId,
      content: newPostText,
      group_name: groupName || user.stage,
      stage: user.stage,
    })
    setNewPostText('')
    setShowPostComposer(false)
    setPostingGroup(null)
    fetchCirclePosts()
  }

  async function fetchLikedPosts() {
    const { data } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.supabaseId)
    setLikedPostIds(new Set((data || []).map(r => r.post_id)))
  }

  async function handleLike(postId) {
    await supabase.rpc('toggle_like', { p_post_id: postId, p_user_id: user.supabaseId })
    await Promise.all([fetchCirclePosts(), fetchLikedPosts()])
  }

  async function shareDay30ToCircle() {
    if (!day30PostText.trim()) return
    await supabase.from('circle_posts').insert({
      user_id: user.supabaseId,
      content: day30PostText,
      group_name: user.stage,
      stage: user.stage,
    })
    setShowDay30Share(false)
  }

  function doCheckIn() {
    if (checkedToday) return
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const wasYesterday = user.lastCheckIn &&
      new Date(user.lastCheckIn).toDateString() === yesterday.toDateString()
    const newStreak = wasYesterday ? (user.streak || 0) + 1 : 1
    saveUser({ ...user, lastCheckIn: new Date().toISOString(), streak: newStreak })
  }

  function handleAddHabit() {
    if (!newHabitName.trim()) return
    if (!user.isPremium && habits.length >= 3) { setScreen('upgrade'); return }
    addHabit(newHabitName.trim())
    setNewHabitName(''); setShowAddHabit(false)
  }

  // ── HOME ──
  if (screen === 'home') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <RebuildNav screen="home" setScreen={setScreen} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p style={{ color: T.muted, fontSize: '12px' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Hello, {user.name.split(' ')[0]} 🌿</h1>
        </div>
        <button onClick={() => setScreen('settings')} style={{ background: T.bg3, border: 'none',
          borderRadius: '50%', width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer' }}>⚙️</button>
      </div>
      <StageBadge stage={user.stage} />

      {/* Streak card */}
      <div style={{ background: `linear-gradient(135deg,${d.col}22,${T.bg2})`,
        border: `1px solid ${d.col}44`, borderRadius: '12px', padding: '18px',
        marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: T.muted, fontSize: '12px', marginBottom: '4px' }}>
            {daysSince === 0 ? 'Day 1 of your rebuild' : `Day ${daysSince} of your rebuild`}
          </p>
          <p style={{ fontSize: '30px', fontWeight: '800' }}>🔥 {user.streak || 0}</p>
          <p style={{ color: T.muted, fontSize: '12px' }}>day streak</p>
        </div>
        <button onClick={doCheckIn} disabled={checkedToday}
          style={{ background: checkedToday ? T.green : T.gold, color: T.bg,
            padding: '12px 16px', borderRadius: '8px', border: 'none',
            fontWeight: '600', fontSize: '13px',
            cursor: checkedToday ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          {checkedToday ? '✓ Checked in' : 'Check in today'}
        </button>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '20px' }}>
        {[
          ['📅', daysSince || 1, 'Days in rebuild'],
          ['⚡', `${doneCount}/${todayHabits.length}`, 'Habits today'],
          ['🗺️', `${STAGE_DATA[user.stage].idx + 1}/5`, 'Stage'],
        ].map(([icon, val, label]) => (
          <div key={label} style={{ background: T.bg2, border: `1px solid ${T.bg4}`,
            borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: T.gold }}>{val}</p>
            <p style={{ color: T.muted, fontSize: '10px', marginTop: '2px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Stage tagline */}
      <div style={{ background: `${d.col}11`, border: `1px solid ${d.col}33`,
        borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
        <p style={{ fontSize: '11px', color: d.col, fontWeight: '700', marginBottom: '6px', letterSpacing: '0.5px' }}>
          YOUR CURRENT STAGE
        </p>
        <p style={{ fontSize: '14px', color: T.white, lineHeight: '1.6' }}>{d.tagline}</p>
        <button onClick={() => setScreen('roadmap')}
          style={{ background: 'none', border: 'none', color: d.col, fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px', padding: 0 }}>
          View your roadmap →
        </button>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
        {[
          ['💬', 'Rare Circle', 'Connect with rebuilders', () => setScreen('circle')],
          ['🗺️', 'Roadmap', 'Your 5-stage journey', () => setScreen('roadmap')],
          ['⚡', 'Habits', 'Track your daily habits', () => setScreen('habits')],
          ['📞', 'Book Sena', 'Get personalised guidance', () => window.open('https://raresena.com/book', '_blank')],
        ].map(([icon, title, sub, onClick]) => (
          <div key={title} onClick={onClick}
            style={{ background: T.bg2, border: `1px solid ${T.bg4}`, borderRadius: '12px',
              padding: '14px', cursor: 'pointer' }}>
            <p style={{ fontSize: '22px', marginBottom: '6px' }}>{icon}</p>
            <p style={{ fontWeight: '600', fontSize: '13px', marginBottom: '2px' }}>{title}</p>
            <p style={{ color: T.muted, fontSize: '11px' }}>{sub}</p>
          </div>
        ))}
      </div>

      {user.streak >= 3 && !user.isPremium && (
        <Card gold style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>📊 Your rebuild trajectory</p>
          <div style={{ height: '80px', background: T.bg3, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px' }}>🔒</p>
              <p style={{ color: T.muted, fontSize: '12px', marginTop: '4px' }}>Premium unlocks this</p>
            </div>
          </div>
          <Btn sm onClick={() => setScreen('upgrade')}>See your full trajectory — from £5.99/mo →</Btn>
        </Card>
      )}

      {user.streak >= 7 && user.streak < 30 && (
        <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`,
          borderRadius: '12px', padding: '18px', marginTop: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', marginBottom: '8px' }}>🎯</p>
          <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>
            You have been rebuilding for {user.streak} days.
          </p>
          <p style={{ color: T.muted, fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>
            The fastest next step is 45 minutes with Sena — mapping your specific situation,
            your specific route, your specific next action.
          </p>
          <Btn onClick={() => window.open('https://raresena.com/book', '_blank')}>
            Book your £100 consultation →
          </Btn>
        </div>
      )}

      {user.streak >= 30 && (
        <div style={{ background: T.bg2, border: `1px solid ${T.green}`,
          borderRadius: '12px', padding: '18px', marginTop: '16px' }}>
          <p style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>🏆</p>
          <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px', textAlign: 'center' }}>
            30 days. You are building something real.
          </p>
          <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6',
            textAlign: 'center', marginBottom: '16px' }}>
            A month of showing up. That is rare. That is you.
          </p>
          {!showDay30Share ? (
            <Btn ghost col={T.green} sm onClick={() => setShowDay30Share(true)}>
              Share with your community →
            </Btn>
          ) : (
            <div>
              <textarea
                style={{ ...css.input, minHeight: '80px', resize: 'none',
                  marginBottom: '10px', display: 'block' }}
                value={day30PostText}
                onChange={e => setDay30PostText(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Btn sm onClick={shareDay30ToCircle}>Post to Circle →</Btn>
                <button onClick={() => setShowDay30Share(false)}
                  style={{ background: 'none', border: 'none', color: T.muted,
                    cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                  Not now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // ── HABITS ──
  if (screen === 'habits') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <RebuildNav screen="habits" setScreen={setScreen} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Habit Tracker</h2>
        {!user.isPremium && <span style={{ background: `${T.gold}22`, color: T.gold,
          padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
          {habits.length}/3 free
        </span>}
      </div>
      <p style={{ color: T.muted, fontSize: '13px', marginBottom: '20px' }}>
        The rebuild is built in daily reps.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {habits.map(habit => {
          const done = (habit.completedDates || []).includes(today())
          return (
            <div key={habit.id} style={{ background: T.bg2,
              border: `1px solid ${done ? d.col : T.bg4}`, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div onClick={() => toggleHabit(habit.id)}
                  style={{ width: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${done ? d.col : T.mutedDk}`,
                    background: done ? d.col : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0 }}>
                  {done && <span style={{ color: T.bg, fontSize: '13px', fontWeight: '800' }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: done ? T.white : T.muted }}>{habit.name}</p>
                  <p style={{ fontSize: '11px', color: T.mutedDk }}>
                    {(habit.completedDates || []).length} days completed
                  </p>
                </div>
                <button onClick={() => removeHabit(habit.id)}
                  style={{ background: 'none', border: 'none', color: T.mutedDk,
                    cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
              </div>
            </div>
          )
        })}
      </div>
      {!user.isPremium && habits.length >= 3 ? (
        <Card gold>
          <p style={{ fontWeight: '600', marginBottom: '6px' }}>⚡ Unlimited habits with Rebuild Premium</p>
          <p style={{ color: T.muted, fontSize: '13px', marginBottom: '12px', lineHeight: '1.6' }}>
            Free rebuilders track 3 habits. Premium rebuilders track as many as their stage requires.
          </p>
          <Btn onClick={() => setScreen('upgrade')}>Upgrade to Rebuild Premium →</Btn>
        </Card>
      ) : (
        showAddHabit ? (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input style={{ ...css.input, flex: 1 }} type="text" placeholder="Name this habit..."
              value={newHabitName} onChange={e => setNewHabitName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddHabit()} autoFocus />
            <button onClick={handleAddHabit} style={{ background: T.gold, color: T.bg,
              border: 'none', borderRadius: '8px', padding: '0 16px',
              fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
          </div>
        ) : (
          <button onClick={() => setShowAddHabit(true)}
            style={{ background: T.bg2, border: `1px dashed ${T.bg4}`, borderRadius: '10px',
              padding: '14px', width: '100%', color: T.muted,
              cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>+ Add a habit</button>
        )
      )}
      {user.isPremium && habits.length > 0 ? (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Progress this week</p>
          <Card>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={buildGraph(habits[0])}>
                <XAxis dataKey="day" stroke={T.mutedDk} tick={{ fill: T.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: T.bg2, border: `1px solid ${T.bg4}`,
                  borderRadius: '8px', color: T.white }} />
                <Line type="monotone" dataKey="done" stroke={d.col} strokeWidth={2}
                  dot={{ fill: d.col, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      ) : !user.isPremium && (
        <Card gold style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>📈 Progress graph</p>
          <div style={{ height: '120px', background: T.bg3, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '22px' }}>🔒</p>
              <p style={{ color: T.muted, fontSize: '12px', marginTop: '4px' }}>
                Unlock your rebuild trajectory
              </p>
            </div>
          </div>
          <Btn sm onClick={() => setScreen('upgrade')}>Unlock progress tracking — from £5.99/mo →</Btn>
        </Card>
      )}
    </div>
  )

  // ── RARE CIRCLE ──
  if (screen === 'circle') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <RebuildNav screen="circle" setScreen={setScreen} />
      {activeGroup ? (
        <GroupView group={activeGroup} user={user} posts={circlePosts} likedPostIds={likedPostIds} onBack={() => setActiveGroup(null)}
          onUpgrade={() => setScreen('upgrade')} onLike={handleLike} onPost={submitPost} />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Rare Circle</h2>
            {user.isPremium && (
              <button onClick={() => { setPostingGroup(null); setShowPostComposer(true) }}
                style={{ background: T.gold, color: T.bg, border: 'none',
                borderRadius: '6px', padding: '8px 14px', fontWeight: '600',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Post</button>
            )}
          </div>
          <p style={{ color: T.muted, fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>
            Your community of rebuilders — people who understand the specific weight of this.
          </p>

          {!user.isPremium && (
            <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`,
              borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: T.goldLt, fontSize: '13px' }}>Premium: post, reply, and connect</p>
              <button onClick={() => setScreen('upgrade')}
                style={{ background: T.gold, color: T.bg, border: 'none', borderRadius: '6px',
                  padding: '6px 12px', fontWeight: '600', fontSize: '12px',
                  cursor: 'pointer', fontFamily: 'inherit' }}>Upgrade</button>
            </div>
          )}

          {/* Groups */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: T.muted }}>
              Your groups
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(user.groups || []).map(group => (
                <button key={group} onClick={() => setActiveGroup(group)}
                  style={{ background: T.bg2, border: `1px solid ${T.bg4}`, borderRadius: '20px',
                    padding: '6px 14px', color: T.white, fontSize: '12px',
                    cursor: 'pointer', fontFamily: 'inherit' }}>{group}</button>
              ))}
              <button onClick={() => setScreen('group-directory')}
                style={{ background: 'transparent', border: `1px dashed ${T.bg4}`,
                  borderRadius: '20px', padding: '6px 14px', color: T.muted,
                  fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Browse all groups</button>
            </div>
          </div>

          {/* Post composer */}
          {showPostComposer && (
            <div style={{ background: T.bg2, border: `1px solid ${T.bg4}`,
              borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <textarea
                style={{ ...css.input, minHeight: '80px', resize: 'none',
                  marginBottom: '10px', display: 'block' }}
                placeholder="Share something with your community..."
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Btn sm onClick={() => submitPost(postingGroup)}>Post →</Btn>
                <button onClick={() => { setShowPostComposer(false); setNewPostText('') }}
                  style={{ background: 'none', border: 'none', color: T.muted,
                    cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {circlePosts.length === 0 ? (
              <EmptyState icon="💬" title="No posts yet"
                sub="Be the first to share something with your community." />
            ) : (
              circlePosts.map(post => (
                <PostCard key={post.id} post={post} user={user}
                  liked={likedPostIds.has(post.id)}
                  onUpgrade={() => setScreen('upgrade')}
                  onLike={() => handleLike(post.id)} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  )

  // ── GROUP DIRECTORY ──
  if (screen === 'group-directory') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <RebuildNav screen="circle" setScreen={setScreen} />
      <PageHeader title="All Groups" onBack={() => setScreen('circle')} />
      {[{ label: '5R Stage Groups', groups: CIRCLE_GROUPS.stage },
        { label: 'Interest Groups', groups: CIRCLE_GROUPS.interest }].map(section => (
        <div key={section.label} style={{ marginBottom: '24px' }}>
          <p style={{ color: T.muted, fontSize: '12px', fontWeight: '600',
            marginBottom: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {section.label}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {section.groups.map(group => {
              const joined = (user.groups || []).includes(group)
              return (
                <div key={group} style={{ background: T.bg2, border: `1px solid ${T.bg4}`,
                  borderRadius: '10px', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '14px', color: joined ? T.white : T.muted }}>{group}</p>
                  {joined ? (
                    <span style={{ color: T.green, fontSize: '12px' }}>✓ Joined</span>
                  ) : (
                    <button onClick={() => {
                      if (!user.isPremium) { setScreen('upgrade'); return }
                      saveUser({ ...user, groups: [...(user.groups || []), group] })
                    }} style={{ background: 'none', border: `1px solid ${T.gold}`, color: T.gold,
                      borderRadius: '6px', padding: '5px 12px', fontSize: '12px',
                      cursor: 'pointer', fontFamily: 'inherit' }}>Join</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  // ── ROADMAP ──
  if (screen === 'roadmap') return (
    <div style={{ ...css.screen, ...css.padded }}>
      <RebuildNav screen="roadmap" setScreen={setScreen} />
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>My Rebuild Roadmap</h2>
      <p style={{ color: T.muted, fontSize: '13px', marginBottom: '20px' }}>
        Five stages. One direction. Your pace.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {STAGES.map(stage => {
          const sd = STAGE_DATA[stage]
          const isCurrent = stage === user.stage
          const isPast = sd.idx < STAGE_DATA[user.stage].idx
          const rm = ROADMAP_DATA[stage]
          const allMilestonesComplete = isCurrent && user.isPremium &&
            rm.milestones.every((_, i) => (user.milestonesCompleted || {})[`${stage}_${i}`])
          return (
            <div key={stage} style={{ background: isCurrent ? `${sd.col}18` : T.bg2,
              border: `1px solid ${isCurrent ? sd.col : T.bg4}`, borderRadius: '12px',
              overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                  background: isPast ? `${T.green}33` : isCurrent ? `${sd.col}33` : T.bg3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isPast ? <span style={{ color: T.green, fontSize: '16px' }}>✓</span>
                    : <span style={{ fontSize: '18px' }}>{sd.icon}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: isCurrent ? T.white : T.muted }}>
                      {stage}
                    </p>
                    {isCurrent && (
                      <span style={{ background: sd.col, color: T.bg, padding: '2px 7px',
                        borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>YOU ARE HERE</span>
                    )}
                  </div>
                  <p style={{ color: T.mutedDk, fontSize: '12px', marginTop: '2px', lineHeight: '1.4' }}>
                    {sd.tagline.substring(0, 55)}...
                  </p>
                </div>
              </div>
              <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${isCurrent ? sd.col : T.bg4}33` }}>
                <p style={{ color: T.muted, fontSize: '13px', marginTop: '12px', marginBottom: '12px', lineHeight: '1.6' }}>
                  {sd.tagline}
                </p>
                {rm.milestones.map((m, mi) => {
                  const mKey = `${stage}_${mi}`
                  const done = isCurrent && user.isPremium && (user.milestonesCompleted || {})[mKey]
                  return (
                    <div key={mi} onClick={() => isCurrent && user.isPremium && toggleMilestone(mKey)}
                      style={{ display: 'flex', gap: '10px', alignItems: 'flex-start',
                        marginBottom: '10px', cursor: isCurrent && user.isPremium ? 'pointer' : 'default' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%',
                        border: `1.5px solid ${done ? sd.col : isCurrent ? sd.col : T.bg4}`,
                        background: done ? sd.col : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px' }}>
                        {done && <span style={{ color: T.bg, fontSize: '10px' }}>✓</span>}
                      </div>
                      <p style={{ fontSize: '13px', lineHeight: '1.5', color: T.white }}>
                        {m}
                      </p>
                    </div>
                  )
                })}
                {allMilestonesComplete && (
                  <div style={{ marginTop: '16px', padding: '14px 16px',
                    background: `${T.green}11`, border: `1px solid ${T.green}44`,
                    borderRadius: '10px', textAlign: 'center' }}>
                    <p style={{ fontSize: '22px', marginBottom: '6px' }}>🏆</p>
                    <p style={{ fontWeight: '700', fontSize: '14px', color: T.white, marginBottom: '4px' }}>
                      All {stage} milestones complete
                    </p>
                    <p style={{ color: T.muted, fontSize: '12px', marginBottom: '12px', lineHeight: '1.5' }}>
                      You have completed this stage. Claim your certificate and advance.
                    </p>
                    <Btn sm onClick={() => setScreen('stage-complete')}>
                      Claim your certificate →
                    </Btn>
                  </div>
                )}
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${T.bg4}` }}>
                  <p style={{ color: T.muted, fontSize: '12px', marginBottom: '10px' }}>Stage resources:</p>
                  {rm.resources.map((r, ri) => (
                    <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 0', borderBottom: `1px solid ${T.bg4}`, textDecoration: 'none' }}>
                      <p style={{ fontSize: '13px', color: T.white }}>{r.title}</p>
                      <span style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>{r.price}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── UPGRADE ──
  if (screen === 'upgrade') return (
    <div style={{ ...css.screen, padding: '28px 20px 48px', minHeight: '100vh' }}>
      <button onClick={() => setScreen('home')}
        style={{ background: 'none', border: 'none', color: T.muted, fontSize: '14px',
          cursor: 'pointer', marginBottom: '20px', display: 'block', fontFamily: 'inherit' }}>← Back</button>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '44px', marginBottom: '10px' }}>🌿</div>
        <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px' }}>Rebuild Premium</h2>
        <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.6' }}>
          The complete rebuild infrastructure — in your pocket.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[['monthly', 'Monthly', '£5.99', 'per month', ''], ['annual', 'Annual', '£47.99', 'per year', 'SAVE £23.89']].map(([id, label, price, sub, badge]) => (
          <button key={id} onClick={() => setPremiumPlan(id)}
            style={{ flex: 1, padding: '14px 12px', borderRadius: '8px',
              border: `1px solid ${premiumPlan === id ? T.gold : T.bg4}`,
              background: premiumPlan === id ? T.goldDim : T.bg2,
              color: premiumPlan === id ? T.gold : T.muted,
              fontWeight: '600', fontSize: '15px', cursor: 'pointer',
              fontFamily: 'inherit', position: 'relative' }}>
            {badge && (
              <div style={{ position: 'absolute', top: '-8px', left: '50%',
                transform: 'translateX(-50%)', background: T.green, color: T.bg,
                fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                borderRadius: '10px', whiteSpace: 'nowrap' }}>{badge}</div>
            )}
            <div>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: '800' }}>{price}</div>
            <div style={{ fontSize: '11px' }}>{sub}</div>
          </button>
        ))}
      </div>
      {[['🗺️', 'Full 5-stage roadmap', 'All milestones unlocked across every stage of your rebuild.'],
        ['⚡', 'Unlimited habit tracker', 'Build as many habits as your stage requires — with full progress graphs.'],
        ['💬', 'Full Rare Circle access', 'Post, reply, connect — become part of the conversation.'],
        ['📚', 'Stage resource library', 'Every RareSena product matched to your exact stage.'],
        ['🏆', 'Stage completion certificate', 'A shareable record of every stage you complete.'],
      ].map(([icon, title, desc]) => (
        <Card key={title} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
            <div>
              <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
              <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.55' }}>{desc}</p>
            </div>
          </div>
        </Card>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
        <Btn onClick={() => {
          saveUser({ ...user, pendingPaymentType: 'premium' })
          createStripeCheckout(
            premiumPlan === 'monthly' ? STRIPE_MONTHLY_PRICE : STRIPE_ANNUAL_PRICE,
            user.email
          )
        }}>
          Start Rebuild Premium — £{premiumPlan === 'monthly' ? '5.99/mo' : '47.99/yr'} →
        </Btn>
        <p style={{ textAlign: 'center', color: T.mutedDk, fontSize: '12px' }}>
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
      <Card gold style={{ marginTop: '20px' }}>
        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>📞 Or start with a session</p>
        <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6', marginBottom: '14px' }}>
          £100 · 45 minutes · Your specific situation · Your specific next step.
        </p>
        <Btn ghost onClick={() => window.open('https://raresena.com/book', '_blank')}>
          Book your £100 consultation →
        </Btn>
      </Card>
    </div>
  )

  // ── SETTINGS ──
  if (screen === 'settings') return (
    <div style={{ ...css.screen, padding: '24px 20px 80px', minHeight: '100vh' }}>
      <RebuildNav screen="settings" setScreen={setScreen} />
      <PageHeader title="Settings" onBack={() => setScreen('home')} />
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%',
            background: `${d.col}33`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{user.name[0]}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>{user.name}</p>
            <p style={{ color: T.muted, fontSize: '13px' }}>{user.email}</p>
            <div style={{ marginTop: '6px' }}><StageBadge stage={user.stage} /></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '14px', paddingTop: '14px',
          borderTop: `1px solid ${T.bg4}` }}>
          {[['🔥', user.streak || 0, 'day streak'], ['📅', getDaysSince(user.joinDate), 'days rebuilding'],
            ['⭐', STAGE_DATA[user.stage].idx + 1, 'of 5 stages']].map(([icon, val, label]) => (
            <div key={label} style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '20px', fontWeight: '800', color: T.gold }}>{val}</p>
              <p style={{ color: T.muted, fontSize: '11px' }}>{label}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card gold={!user.isPremium} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>Rebuild Premium</p>
            <p style={{ color: T.muted, fontSize: '13px' }}>
              {user.isPremium ? 'Active — all features unlocked' : 'Free tier active'}
            </p>
          </div>
          {user.isPremium ? (
            <span style={{ color: T.green, fontSize: '13px', fontWeight: '600' }}>✓ Active</span>
          ) : (
            <button onClick={() => setScreen('upgrade')}
              style={{ background: T.gold, color: T.bg, border: 'none', borderRadius: '6px',
                padding: '8px 14px', fontWeight: '600', fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit' }}>Upgrade</button>
          )}
        </div>
      </Card>
      {[['📞', 'Book a consultation', () => window.open('https://raresena.com/book', '_blank')],
        ['🌐', 'Visit raresena.com', () => window.open('https://raresena.com', '_blank')],
        ['💌', 'Contact Sena', () => window.open('mailto:hello@raresena.com', '_blank')],
        ['🔒', 'Privacy policy', () => window.open('https://raresena.com/privacy', '_blank')],
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

  // ── STAGE COMPLETE ──
  if (screen === 'stage-complete') {
    const nextIdx = STAGE_DATA[user.stage].idx + 1
    const nextStage = STAGES[nextIdx]
    const completedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const stageColor = STAGE_DATA[user.stage].col

    function advanceStage() {
      if (!nextStage) return
      const preselect = STAGE_GROUP_PRESELECT[nextStage] || []
      const existing = user.groups || []
      const newGroups = [...new Set([...existing, nextStage, ...preselect])]
      saveUser({ ...user, stage: nextStage, groups: newGroups })
      setScreen('roadmap')
    }

    return (
      <div style={{ ...css.screen, padding: '28px 20px 80px', minHeight: '100vh' }}>
        <RebuildNav screen="roadmap" setScreen={setScreen} />
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>🏆</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>
            Stage Complete
          </h2>
          <p style={{ color: T.muted, fontSize: '14px' }}>
            You have completed the {user.stage} stage of your rebuild.
          </p>
        </div>

        <div style={{ background: T.bg2, border: `2px solid ${stageColor}`,
          borderRadius: '16px', padding: '28px 24px', marginBottom: '20px',
          textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-1px', left: '50%',
            transform: 'translateX(-50%)',
            background: stageColor, padding: '4px 18px',
            borderRadius: '0 0 8px 8px', fontSize: '10px', fontWeight: '800',
            color: T.white, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            CERTIFICATE OF COMPLETION
          </div>
          <div style={{ marginTop: '16px' }}>
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '10px' }}>This certifies that</p>
            <p style={{ fontSize: '22px', fontWeight: '800', color: T.white, marginBottom: '10px' }}>
              {user.name}
            </p>
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '12px' }}>has completed the</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '30px' }}>{STAGE_DATA[user.stage].icon}</span>
              <p style={{ fontSize: '26px', fontWeight: '800', color: stageColor }}>{user.stage}</p>
            </div>
            <p style={{ color: T.muted, fontSize: '13px', marginBottom: '16px' }}>
              stage of the RareSena 5R Rebuild Programme
            </p>
            <p style={{ color: T.mutedDk, fontSize: '11px',
              borderTop: `1px solid ${T.bg4}`, paddingTop: '12px' }}>
              Completed {completedDate} · raresena.com
            </p>
          </div>
        </div>

        <button onClick={() => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(
              `I just completed the ${user.stage} stage of the RareSena 5R Rebuild Programme. ${STAGE_DATA[user.stage].icon}\n\nMy rebuild is real. #RareSena #5RRebuild`
            )
          }
        }} style={{ background: T.bg2, border: `1px solid ${T.bg4}`, borderRadius: '10px',
          padding: '14px', width: '100%', color: T.muted, fontSize: '13px',
          cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px' }}>
          📋 Copy achievement to share
        </button>

        {nextStage ? (
          <div>
            <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`,
              borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>Next stage</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{STAGE_DATA[nextStage].icon}</span>
                <p style={{ fontSize: '18px', fontWeight: '700', color: T.gold }}>{nextStage}</p>
              </div>
              <p style={{ color: T.muted, fontSize: '12px', marginTop: '6px', lineHeight: '1.5' }}>
                {STAGE_DATA[nextStage].tagline}
              </p>
            </div>
            <Btn onClick={advanceStage}>Enter {nextStage} stage →</Btn>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px' }}>
              All 5 stages complete. 🌿
            </p>
            <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.7' }}>
              You are not surviving. You are living — on your own terms.
            </p>
          </div>
        )}
      </div>
    )
  }

  return null
}

// ── SHARED SUB-COMPONENTS ──────────────────────────────────────────────────────

function PostCard({ post, user, onUpgrade, onLike, liked = false }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState([])
  const [replyCount, setReplyCount] = useState(0)
  const [replyText, setReplyText] = useState('')
  const [loadingReplies, setLoadingReplies] = useState(false)
  const stage = post.stage || 'Reset'
  const sd = STAGE_DATA[stage] || STAGE_DATA['Reset']

  useEffect(() => {
    supabase.from('post_replies').select('id', { count: 'exact', head: true })
      .eq('post_id', post.id)
      .then(({ count }) => setReplyCount(count || 0))
  }, [post.id])

  async function loadReplies() {
    setLoadingReplies(true)
    const { data } = await supabase
      .from('post_replies')
      .select('*, rebuilders!post_replies_user_id_fkey(name)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    setReplies(data || [])
    setLoadingReplies(false)
  }

  async function submitReply() {
    if (!replyText.trim()) return
    await supabase.from('post_replies').insert({
      post_id: post.id,
      user_id: user.supabaseId,
      content: replyText,
    })
    setReplyText('')
    setReplyCount(c => c + 1)
    loadReplies()
  }

  function toggleReplies() {
    if (!showReplies) loadReplies()
    setShowReplies(s => !s)
  }

  return (
    <Card style={{ borderLeft: post.is_pinned ? `3px solid ${T.gold}` : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%',
          background: `${sd.col}33`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '13px', fontWeight: '700',
          color: sd.col, flexShrink: 0 }}>{post.initials}</div>
        <div>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{post.author}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px',
              fontSize: '11px', fontWeight: '600', background: `${sd.col}22`, color: sd.col }}>
              {stage}
            </span>
            <span style={{ color: T.mutedDk, fontSize: '11px' }}>{post.time}</span>
            {post.is_pinned && <span style={{ color: T.gold, fontSize: '11px' }}>📌 Pinned</span>}
          </div>
        </div>
      </div>
      <p style={{ fontSize: '13px', lineHeight: '1.75', color: T.white, marginBottom: '12px' }}>
        {post.content}
      </p>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button onClick={onLike} style={{ background: 'none', border: 'none',
          color: liked ? T.red : T.muted,
          fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
          {liked ? '❤️' : '🤍'} {post.likes || 0}
        </button>
        <button onClick={toggleReplies} style={{ background: 'none', border: 'none', color: T.muted,
          fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
          💬 {replyCount > 0 ? replyCount : 'Reply'}
        </button>
      </div>
      {showReplies && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${T.bg4}` }}>
          {loadingReplies ? (
            <p style={{ color: T.muted, fontSize: '12px' }}>Loading...</p>
          ) : replies.length === 0 ? (
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '10px' }}>No replies yet. Be the first!</p>
          ) : (
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {replies.map(r => (
                <div key={r.id} style={{ background: T.bg3, borderRadius: '8px', padding: '10px 12px' }}>
                  <p style={{ fontWeight: '600', fontSize: '12px', color: T.white, marginBottom: '3px' }}>
                    {r.rebuilders?.name || 'Rebuilder'}
                  </p>
                  <p style={{ fontSize: '13px', color: T.muted, lineHeight: '1.5' }}>{r.content}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input style={{ ...css.input, flex: 1, padding: '8px 12px', fontSize: '13px' }}
              placeholder="Write a reply..."
              value={replyText} onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitReply()} />
            <button onClick={submitReply} disabled={!replyText.trim()}
              style={{ background: T.gold, border: 'none', borderRadius: '8px',
                padding: '8px 14px', color: T.bg, fontWeight: '600', fontSize: '13px',
                cursor: replyText.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
                opacity: replyText.trim() ? 1 : 0.5 }}>Send</button>
          </div>
        </div>
      )}
    </Card>
  )
}

function formatPost(p) {
  const name = p.rebuilders?.name || 'Rebuilder'
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const mins = Math.floor((Date.now() - new Date(p.created_at)) / 60000)
  const time = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.floor(mins / 60)}h ago` : `${Math.floor(mins / 1440)}d ago`
  return { ...p, author: name, initials, time }
}

function GroupView({ group, user, posts, likedPostIds = new Set(), onBack, onUpgrade, onLike, onPost }) {
  const [showComposer, setShowComposer] = useState(false)
  const [text, setText] = useState('')
  const groupPosts = posts.filter(p => p.group_name === group || p.groupName === group)

  async function handlePost() {
    if (!text.trim()) return
    await onPost(group)
    setText('')
    setShowComposer(false)
  }

  return (
    <div>
      <PageHeader title={group} sub={`${groupPosts.length} posts`} onBack={onBack}
        action={user.isPremium ? (
          <button onClick={() => setShowComposer(true)}
            style={{ background: T.gold, color: T.bg, border: 'none',
            borderRadius: '6px', padding: '8px 14px', fontWeight: '600',
            fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>+ Post</button>
        ) : null} />
      {showComposer && (
        <div style={{ background: T.bg2, border: `1px solid ${T.bg4}`,
          borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <textarea
            style={{ ...css.input, minHeight: '80px', resize: 'none',
              marginBottom: '10px', display: 'block' }}
            placeholder={`Share something with ${group}...`}
            value={text} onChange={e => setText(e.target.value)} autoFocus />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Btn sm onClick={handlePost}>Post →</Btn>
            <button onClick={() => { setShowComposer(false); setText('') }}
              style={{ background: 'none', border: 'none', color: T.muted,
                cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}
      {groupPosts.length === 0 ? (
        <EmptyState icon="💬" title="No posts yet"
          sub="Be the first to post in this group." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {groupPosts.map(post => (
            <PostCard key={post.id} post={post} user={user} onUpgrade={onUpgrade}
              liked={likedPostIds.has(post.id)} onLike={() => onLike(post.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function buildGraph(habit) {
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toDateString()
    last7.push({
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      done: (habit.completedDates || []).includes(dateStr) ? 1 : 0,
    })
  }
  return last7
}
