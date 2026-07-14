import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp, STAGE_DATA, STAGES, CIRCLE_GROUPS, STAGE_GROUP_PRESELECT, T, css,
  Btn, Card, GoldCTA, StageBadge, RebuildNav, PageHeader,
  EmptyState, today, getDaysSince, createStripeCheckout,
  STRIPE_MONTHLY_PRICE, STRIPE_ANNUAL_PRICE, supabase } from '../App.jsx'
import { ROADMAP_TASKS, getStageTaskList, getWhatToDo, getTrackNote, STAGE_META, VISA_TRACKS } from '../data/roadmapTasks.js'
import { generateRebuildPDF } from '../utils/generateRebuildPDF.js'
import VisaCountdownTracker from '../components/VisaCountdownTracker.jsx'
import CreditScoreTracker from '../components/CreditScoreTracker.jsx'
import ApplicationPipelineTracker from '../components/ApplicationPipelineTracker.jsx'
import ILREvidenceChecklist from '../components/ILREvidenceChecklist.jsx'
import GuideViewer from '../components/GuideViewer.jsx'

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
    resources: [{ title: 'Sovereignty Programme — Graduate', url: 'https://raresena.com/sovereignty', price: '£3,000' }, { title: 'Rare Studio', url: 'https://raresena.com/studio', price: 'From £19.99/mo' }] },
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
  const [selectedTag, setSelectedTag] = useState(null)
  const [activeTask, setActiveTask] = useState(null)
  const [taskCompletions, setTaskCompletions] = useState({})
  const [unlockedStages, setUnlockedStages] = useState({})
  const [showTrackSelector, setShowTrackSelector] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState({
    visa_reminders: true, habit_checkins: true, streak_alerts: true,
    stage_celebrations: true, inactivity_nudges: true,
    circle_activity: true, announcements: true,
  })
  const [emergencyFlags, setEmergencyFlags] = useState({ jobLoss: false, domesticConcern: false, sponsorRevoked: false })
  const [task11Complete, setTask11Complete] = useState(null)

  useEffect(() => {
    if (screen === 'circle') { fetchCirclePosts(); fetchLikedPosts() }
    if (screen === 'roadmap') loadRoadmapProgress()
    if (screen === 'settings') loadNotifPrefs()
  }, [screen])

  useEffect(() => { fetchEmergencyState() }, [])

  async function fetchEmergencyState() {
    const [{ data: rb }, { data: t11 }] = await Promise.all([
      supabase.from('rebuilders')
        .select('job_loss_reported_at, domestic_concern_flagged_at, sponsor_revocation_reported_at')
        .eq('id', user.supabaseId).single(),
      supabase.from('task_completions')
        .select('is_complete').eq('user_id', user.supabaseId)
        .eq('stage_number', 1).eq('task_number', 1).single(),
    ])
    setEmergencyFlags({
      jobLoss: !!rb?.job_loss_reported_at,
      domesticConcern: !!rb?.domestic_concern_flagged_at,
      sponsorRevoked: !!rb?.sponsor_revocation_reported_at,
    })
    setTask11Complete(!!(t11?.is_complete))
  }

  async function setEmergencyFlag(column, value) {
    await supabase.from('rebuilders')
      .update({ [column]: value ? new Date().toISOString() : null })
      .eq('id', user.supabaseId)
    await fetchEmergencyState()
  }

  async function loadNotifPrefs() {
    const { data } = await supabase
      .from('notification_prefs')
      .select('*')
      .eq('user_id', user.supabaseId)
      .single()
    if (data) setNotifPrefs(data)
  }

  async function toggleNotifPref(key) {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] }
    setNotifPrefs(updated)
    await supabase.from('notification_prefs').upsert({
      user_id: user.supabaseId,
      ...updated,
    }, { onConflict: 'user_id' })
  }

  async function loadRoadmapProgress() {
    const [{ data: completions }, { data: progress }] = await Promise.all([
      supabase.from('task_completions')
        .select('stage_number,task_number,is_complete,prompt_response')
        .eq('user_id', user.supabaseId),
      supabase.from('stage_progress')
        .select('stage_number,is_unlocked')
        .eq('user_id', user.supabaseId),
    ])
    const map = {}
    ;(completions || []).forEach(r => {
      map[`${r.stage_number}.${r.task_number}`] = {
        isComplete: r.is_complete,
        promptResponse: r.prompt_response,
      }
    })
    const unlocks = {}
    ;(progress || []).forEach(r => { unlocks[r.stage_number] = r.is_unlocked })
    setTaskCompletions(map)
    setUnlockedStages(unlocks)
  }

  async function saveTaskCompletion(taskKey, promptResponse) {
    const [stageNum, taskNum] = taskKey.split('.').map(Number)
    await supabase.from('task_completions').upsert({
      user_id: user.supabaseId,
      stage_number: stageNum,
      task_number: taskNum,
      visa_track: user.visaTrack || 'A',
      prompt_response: JSON.stringify(promptResponse),
      prompt_type: ROADMAP_TASKS[taskKey].completionPrompt.type,
      is_complete: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,stage_number,task_number' })

    const updatedCompletions = {
      ...taskCompletions,
      [taskKey]: { isComplete: true, promptResponse },
    }
    setTaskCompletions(updatedCompletions)

    const stageComplete = [1,2,3,4,5].every(n =>
      updatedCompletions[`${stageNum}.${n}`]?.isComplete
    )

    if (stageComplete) {
      await supabase.from('stage_progress').upsert({
        user_id: user.supabaseId,
        stage_number: stageNum,
        visa_track: user.visaTrack || 'A',
        is_complete: true,
        is_unlocked: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,stage_number' })
      if (stageNum < 5) {
        await supabase.from('stage_progress').upsert({
          user_id: user.supabaseId,
          stage_number: stageNum + 1,
          visa_track: user.visaTrack || 'A',
          is_unlocked: true,
        }, { onConflict: 'user_id,stage_number' })
      }
      // Fire stage celebration email (non-blocking)
      fetch('/api/notify-stage-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.supabaseId, stage_number: stageNum }),
      }).catch(() => {})
      return { stageComplete: true }
    }
    return { stageComplete: false }
  }

  async function resetTaskCompletion(taskKey) {
    const [stageNum, taskNum] = taskKey.split('.').map(Number)
    await supabase.from('task_completions')
      .update({ is_complete: false, prompt_response: null, completed_at: null })
      .eq('user_id', user.supabaseId)
      .eq('stage_number', stageNum)
      .eq('task_number', taskNum)
    const updated = { ...taskCompletions }
    delete updated[taskKey]
    setTaskCompletions(updated)
  }

  function isStageUnlocked(stageNum) {
    const userStageNum = STAGE_DATA[user.stage].idx + 1
    if (stageNum <= userStageNum) return true
    if (unlockedStages[stageNum]) return true
    return [1,2,3,4,5].every(n => taskCompletions[`${stageNum - 1}.${n}`]?.isComplete)
  }

  const { user, habits, saveUser, toggleHabit, addHabit, removeHabit, toggleMilestone } = useApp()
  const d = STAGE_DATA[user.stage]
  const daysSince = getDaysSince(user.joinDate)
  const checkedToday = user.lastCheckIn && new Date(user.lastCheckIn).toDateString() === today()
  const todayHabits = habits.map(h => ({ ...h, done: (h.completedDates || []).includes(today()) }))
  const doneCount = todayHabits.filter(h => h.done).length

  const showTrackABanner = user.visaTrack === 'A' && emergencyFlags.jobLoss
  const showTrackCBanner = user.visaTrack === 'C' && emergencyFlags.domesticConcern
  const showTrackEBanner = user.visaTrack === 'E' && daysSince >= 14 && task11Complete === false
  const showTrackHBanner = user.visaTrack === 'H' && emergencyFlags.sponsorRevoked

  function renderEmergencyBanners() {
    const result = []
    const linkBtn = (label, url) => (
      <button key={label} onClick={() => window.open(url, '_blank')}
        style={{ background: '#E8974A18', border: '1px solid #E8974A55', borderRadius: '6px',
          padding: '6px 12px', color: '#E8974A', fontSize: '12px', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'inherit' }}>{label} ›</button>
    )
    if (showTrackABanner) result.push(
      <div key="a" style={{ background: '#E8974A0D', border: '1px solid #E8974A',
        borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        <p style={{ color: '#E8974A', fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>⚠️ 60-day window started</p>
        <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
          Your visa is tied to your employer. Following a job loss, you have 60 days to find a new sponsor or change your route. Act now.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {linkBtn('Citizens Advice', 'https://www.citizensadvice.org.uk/immigration/')}
          {linkBtn('Find a solicitor', 'https://solicitors.lawsociety.org.uk/')}
          {linkBtn('Your eVisa', 'https://www.gov.uk/view-prove-immigration-status')}
        </div>
        <button onClick={() => setEmergencyFlag('job_loss_reported_at', false)}
          style={{ background: 'none', border: 'none', color: T.mutedDk, fontSize: '12px',
            cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          Mark as resolved · dismiss
        </button>
      </div>
    )
    if (showTrackHBanner) result.push(
      <div key="h" style={{ background: '#E8974A0D', border: '1px solid #E8974A',
        borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        <p style={{ color: '#E8974A', fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>⚠️ Sponsor licence concern flagged</p>
        <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
          If your sponsor licence has been revoked or suspended, your 60-day curtailment window may apply. Get immigration legal advice immediately.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {linkBtn('Citizens Advice', 'https://www.citizensadvice.org.uk/immigration/')}
          {linkBtn('Find a solicitor', 'https://solicitors.lawsociety.org.uk/')}
          {linkBtn('Your eVisa', 'https://www.gov.uk/view-prove-immigration-status')}
        </div>
        <button onClick={() => setEmergencyFlag('sponsor_revocation_reported_at', false)}
          style={{ background: 'none', border: 'none', color: T.mutedDk, fontSize: '12px',
            cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          Mark as resolved · dismiss
        </button>
      </div>
    )
    if (showTrackCBanner) result.push(
      <div key="c" style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
        borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        <p style={{ color: T.white, fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>🤝 Confidential support available</p>
        <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
          If your home situation has changed, specialist support is available. You do not need to explain yourself to access it. This is private and not visible to anyone else.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <button key="sbs" onClick={() => window.open('https://southallblacksisters.org.uk/', '_blank')}
            style={{ background: T.bg4, border: `1px solid ${T.bg4}`, borderRadius: '6px',
              padding: '6px 12px', color: T.white, fontSize: '12px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit' }}>Southall Black Sisters ›</button>
          <button key="nrpf" onClick={() => window.open('https://www.nrpfnetwork.org.uk/', '_blank')}
            style={{ background: T.bg4, border: `1px solid ${T.bg4}`, borderRadius: '6px',
              padding: '6px 12px', color: T.white, fontSize: '12px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit' }}>NRPF Network ›</button>
          <button key="row" onClick={() => window.open('https://rightsofwomen.org.uk/', '_blank')}
            style={{ background: T.bg4, border: `1px solid ${T.bg4}`, borderRadius: '6px',
              padding: '6px 12px', color: T.white, fontSize: '12px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit' }}>Rights of Women ›</button>
        </div>
        <button onClick={() => setEmergencyFlag('domestic_concern_flagged_at', false)}
          style={{ background: 'none', border: 'none', color: T.mutedDk, fontSize: '12px',
            cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          Dismiss
        </button>
      </div>
    )
    if (showTrackEBanner) result.push(
      <div key="e" style={{ background: `${T.gold}0D`, border: `1px solid ${T.gold}`,
        borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        <p style={{ color: T.gold, fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>⏱ Your 28-day window is running</p>
        <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
          Asylum support ends approximately 28 days after your grant letter. Complete Task 1.1 now to identify your key deadlines and next steps.
        </p>
        <button onClick={async () => { await loadRoadmapProgress(); setActiveTask('1.1'); setScreen('task-detail') }}
          style={{ background: T.gold, color: T.bg, border: 'none', borderRadius: '8px',
            padding: '10px 18px', fontWeight: '700', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit' }}>
          Complete Task 1.1 →
        </button>
      </div>
    )
    return result
  }

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
      tag: selectedTag,
    })
    setNewPostText('')
    setShowPostComposer(false)
    setPostingGroup(null)
    setSelectedTag(null)
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

      {renderEmergencyBanners()}

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
          ['📞', 'Book Sena', 'Get personalised guidance', () => window.open('https://raresena.com/book/', '_blank')],
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
          <Btn sm onClick={() => setScreen('upgrade')}>See your full trajectory — from £9.99/mo →</Btn>
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
          <Btn onClick={() => window.open('https://raresena.com/book/', '_blank')}>
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
          <Btn sm onClick={() => setScreen('upgrade')}>Unlock progress tracking — from £9.99/mo →</Btn>
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
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {[['💬', 'General'], ['🏆', 'Win'], ['❓', 'Question'], ['💪', 'Accountability']].map(([icon, label]) => (
                  <button key={label} onClick={() => setSelectedTag(selectedTag === label ? null : label)}
                    style={{ padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                      fontSize: '12px', fontWeight: '600', fontFamily: 'inherit',
                      background: selectedTag === label ? T.gold : T.bg3,
                      color: selectedTag === label ? T.bg : T.muted }}>
                    {icon} {label}
                  </button>
                ))}
              </div>
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
                <button onClick={() => { setShowPostComposer(false); setNewPostText(''); setSelectedTag(null) }}
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
      {renderEmergencyBanners()}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {STAGES.map(stage => {
          const sd = STAGE_DATA[stage]
          const stageNum = sd.idx + 1
          const isCurrent = stage === user.stage
          const isPast = sd.idx < STAGE_DATA[user.stage].idx
          const locked = !isStageUnlocked(stageNum)
          const stageTasks = getStageTaskList(stageNum)
          const completedCount = stageTasks.filter(t => taskCompletions[t.key]?.isComplete).length
          const allDone = completedCount === 5
          return (
            <div key={stage} style={{ background: isCurrent ? `${sd.col}18` : T.bg2,
              border: `1px solid ${isCurrent ? sd.col : T.bg4}`, borderRadius: '12px',
              overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                  background: allDone ? `${T.green}33` : isCurrent ? `${sd.col}33` : T.bg3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {allDone ? <span style={{ color: T.green, fontSize: '16px' }}>✓</span>
                    : locked ? <span style={{ fontSize: '16px' }}>🔒</span>
                    : <span style={{ fontSize: '18px' }}>{sd.icon}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: locked ? T.mutedDk : T.white }}>
                      {stage}
                    </p>
                    {isCurrent && (
                      <span style={{ background: sd.col, color: T.bg, padding: '2px 7px',
                        borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>YOU ARE HERE</span>
                    )}
                  </div>
                  <p style={{ color: T.mutedDk, fontSize: '12px', marginTop: '2px' }}>
                    {locked ? 'Complete the previous stage to unlock' : `${completedCount}/5 tasks complete`}
                  </p>
                </div>
                {!locked && (
                  <div style={{ width: '36px', height: '4px', background: T.bg4, borderRadius: '2px', position: 'relative' }}>
                    <div style={{ width: `${(completedCount/5)*100}%`, height: '100%', background: allDone ? T.green : sd.col, borderRadius: '2px' }} />
                  </div>
                )}
              </div>
              {!locked && (
                <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${isCurrent ? sd.col : T.bg4}33` }}>
                  <p style={{ color: T.muted, fontSize: '13px', marginTop: '12px', marginBottom: '14px', lineHeight: '1.6', fontStyle: 'italic' }}>
                    {sd.tagline}
                  </p>
                  {stageTasks.map(({ key, title, estimatedTime }) => {
                    const isComplete = taskCompletions[key]?.isComplete
                    return (
                      <button key={key}
                        onClick={() => { setActiveTask(key); setScreen('task-detail') }}
                        style={{ display: 'flex', gap: '12px', alignItems: 'center',
                          background: 'none', border: 'none', cursor: 'pointer',
                          width: '100%', textAlign: 'left', marginBottom: '12px',
                          padding: 0, fontFamily: 'inherit' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%',
                          border: `1.5px solid ${isComplete ? T.gold : sd.col}`,
                          background: isComplete ? T.gold : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0 }}>
                          {isComplete && <span style={{ color: T.bg, fontSize: '10px', fontWeight: '800' }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', color: isComplete ? T.muted : T.white, lineHeight: '1.4',
                            textDecoration: isComplete ? 'line-through' : 'none' }}>{title}</p>
                          <p style={{ fontSize: '11px', color: T.mutedDk, marginTop: '2px' }}>⏱ {estimatedTime}</p>
                        </div>
                        {!isComplete && <span style={{ color: T.mutedDk, fontSize: '14px' }}>›</span>}
                      </button>
                    )
                  })}
                  {allDone && (
                    <div style={{ marginTop: '8px', padding: '12px 14px',
                      background: `${T.green}11`, border: `1px solid ${T.green}44`,
                      borderRadius: '10px', textAlign: 'center' }}>
                      <p style={{ fontWeight: '700', fontSize: '13px', color: T.green, marginBottom: '4px' }}>
                        🏆 {stage} stage complete
                      </p>
                      <Btn sm onClick={() => setScreen('stage-complete')}>
                        Claim your certificate →
                      </Btn>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── TASK DETAIL ──
  if (screen === 'task-detail' && activeTask && ROADMAP_TASKS[activeTask]) {
    const task = ROADMAP_TASKS[activeTask]
    const stageNum = task.stage
    const stageName = STAGES[stageNum - 1]
    const sd = STAGE_DATA[stageName]
    const steps = getWhatToDo(task, user.visaTrack)
    const trackNote = getTrackNote(task, user.visaTrack)
    const alreadyComplete = taskCompletions[activeTask]?.isComplete
    return (
      <TaskDetailView
        task={task}
        taskKey={activeTask}
        stageNum={stageNum}
        stageName={stageName}
        stageCol={sd.col}
        steps={steps}
        trackNote={trackNote}
        alreadyComplete={alreadyComplete}
        isPremium={user.isPremium}
        onBack={() => setScreen('roadmap')}
        onComplete={async (values) => {
          const result = await saveTaskCompletion(activeTask, values)
          return result
        }}
        onAdvanceStage={() => setScreen('stage-complete')}
        onExportPDF={() => generateRebuildPDF(taskCompletions, user.name || 'Your')}
        onRedo={() => resetTaskCompletion(activeTask)}
      />
    )
  }

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
        {[['monthly', 'Monthly', '£9.99', 'per month', ''], ['annual', 'Annual', '£99.99', 'per year', 'SAVE £19.89']].map(([id, label, price, sub, badge]) => (
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
          Start Rebuild Premium — £{premiumPlan === 'monthly' ? '9.99/mo' : '99.99/yr'} →
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
        <Btn ghost onClick={() => window.open('https://raresena.com/book/', '_blank')}>
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

      {/* Visa Track */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: showTrackSelector ? '16px' : 0 }}>
          <div>
            <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>🛂 Visa track</p>
            <p style={{ color: T.muted, fontSize: '13px' }}>
              {user.visaTrack
                ? `Track ${user.visaTrack} — ${VISA_TRACKS.find(t => t.id === user.visaTrack)?.label || ''}`
                : 'Not set'}
            </p>
          </div>
          <button onClick={() => setShowTrackSelector(v => !v)}
            style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '6px',
              padding: '7px 12px', color: T.muted, fontSize: '12px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit' }}>
            {showTrackSelector ? 'Cancel' : 'Change'}
          </button>
        </div>
        {showTrackSelector && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ color: T.mutedDk, fontSize: '12px', marginBottom: '4px' }}>
              Switching track updates uncompleted tasks only — completed tasks are unchanged.
            </p>
            {VISA_TRACKS.map(track => {
              const selected = user.visaTrack === track.id
              return (
                <button key={track.id}
                  onClick={() => {
                    saveUser({ ...user, visaTrack: track.id })
                    setShowTrackSelector(false)
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px',
                    background: selected ? T.goldDim : T.bg3,
                    border: `1px solid ${selected ? T.gold : T.bg4}`,
                    borderRadius: '8px', padding: '10px 14px',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%',
                    border: `2px solid ${selected ? T.gold : T.mutedDk}`,
                    background: selected ? T.gold : 'transparent', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600',
                      color: selected ? T.white : T.muted, margin: 0 }}>{track.label}</p>
                    <p style={{ fontSize: '11px', color: T.mutedDk, margin: '2px 0 0' }}>{track.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </Card>

      {['A', 'C', 'H'].includes(user.visaTrack) && (<>
        <p style={{ color: T.muted, fontSize: '12px', fontWeight: '600',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: '24px', marginBottom: '10px' }}>Situation flags</p>
        <Card style={{ marginBottom: '16px' }}>
          <p style={{ color: T.mutedDk, fontSize: '12px', marginBottom: '14px', lineHeight: '1.6' }}>
            Use these to activate emergency guidance on your home screen. Private — not visible to others.
          </p>
          {user.visaTrack === 'A' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: T.white, marginBottom: '2px' }}>⚠️ Report a job loss</p>
                <p style={{ fontSize: '11px', color: T.mutedDk }}>Activates the 60-day action plan on your home screen</p>
              </div>
              <button onClick={() => setEmergencyFlag('job_loss_reported_at', !emergencyFlags.jobLoss)}
                style={{ width: '42px', height: '24px', borderRadius: '12px', border: 'none',
                  background: emergencyFlags.jobLoss ? '#E8974A' : T.bg4,
                  cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: T.white,
                  position: 'absolute', top: '3px', left: emergencyFlags.jobLoss ? '21px' : '3px', transition: 'left 0.2s' }} />
              </button>
            </div>
          )}
          {user.visaTrack === 'C' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: T.white, marginBottom: '2px' }}>🤝 Flag a change in my situation</p>
                <p style={{ fontSize: '11px', color: T.mutedDk }}>Activates confidential support resources — private</p>
              </div>
              <button onClick={() => setEmergencyFlag('domestic_concern_flagged_at', !emergencyFlags.domesticConcern)}
                style={{ width: '42px', height: '24px', borderRadius: '12px', border: 'none',
                  background: emergencyFlags.domesticConcern ? T.gold : T.bg4,
                  cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: T.white,
                  position: 'absolute', top: '3px', left: emergencyFlags.domesticConcern ? '21px' : '3px', transition: 'left 0.2s' }} />
              </button>
            </div>
          )}
          {user.visaTrack === 'H' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: T.white, marginBottom: '2px' }}>⚠️ Report a sponsor licence concern</p>
                <p style={{ fontSize: '11px', color: T.mutedDk }}>Activates the 60-day action plan — get legal advice now</p>
              </div>
              <button onClick={() => setEmergencyFlag('sponsor_revocation_reported_at', !emergencyFlags.sponsorRevoked)}
                style={{ width: '42px', height: '24px', borderRadius: '12px', border: 'none',
                  background: emergencyFlags.sponsorRevoked ? '#E8974A' : T.bg4,
                  cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: T.white,
                  position: 'absolute', top: '3px', left: emergencyFlags.sponsorRevoked ? '21px' : '3px', transition: 'left 0.2s' }} />
              </button>
            </div>
          )}
        </Card>
      </>)}

      {[['📞', 'Book a consultation', () => window.open('https://raresena.com/book/', '_blank')],
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
      {/* Notification Preferences */}
      <p style={{ color: T.muted, fontSize: '12px', fontWeight: '600',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginTop: '24px', marginBottom: '10px' }}>Email notifications</p>
      <Card style={{ marginBottom: '16px', padding: '4px 0' }}>
        {[
          ['visa_reminders', '🛂', 'Visa deadline reminders', 'At 6mo, 3mo, 1mo, 2wk, 1wk before expiry'],
          ['habit_checkins', '⚡', 'Daily habit check-in', 'Reminder at your chosen time each day'],
          ['streak_alerts', '🔥', 'Streak alerts', 'Milestone and at-risk streak notifications'],
          ['stage_celebrations', '🏆', 'Stage completions', 'Email when you complete a stage'],
          ['inactivity_nudges', '💬', 'Inactivity nudges', 'After 7 days of no task activity'],
          ['circle_activity', '💬', 'Rare Circle activity', 'When someone replies to your post'],
          ['announcements', '📢', 'Announcements', 'Messages from Sena to the community'],
        ].map(([key, icon, label, desc]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px',
            padding: '13px 16px', borderBottom: `1px solid ${T.bg4}` }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: T.white, marginBottom: '1px' }}>{label}</p>
              <p style={{ fontSize: '11px', color: T.mutedDk }}>{desc}</p>
            </div>
            <button onClick={() => toggleNotifPref(key)}
              style={{ width: '42px', height: '24px', borderRadius: '12px', border: 'none',
                background: notifPrefs[key] ? T.gold : T.bg4,
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 0.2s' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%',
                background: T.white, position: 'absolute', top: '3px',
                left: notifPrefs[key] ? '21px' : '3px',
                transition: 'left 0.2s' }} />
            </button>
          </div>
        ))}
      </Card>

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
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px',
              fontSize: '11px', fontWeight: '600', background: `${sd.col}22`, color: sd.col }}>
              {stage}
            </span>
            {post.tag && (
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px',
                fontSize: '11px', fontWeight: '600', background: `${T.gold}22`, color: T.gold }}>
                {post.tag === 'Win' ? '🏆' : post.tag === 'Question' ? '❓' : post.tag === 'Accountability' ? '💪' : '💬'} {post.tag}
              </span>
            )}
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

// ── TASK DETAIL VIEW ─────────────────────────────────────────────
function TaskDetailView({ task, taskKey, stageNum, stageName, stageCol, steps, trackNote, alreadyComplete, isPremium, onBack, onComplete, onAdvanceStage, onExportPDF, onRedo }) {
  const [promptValues, setPromptValues] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [activeGuide, setActiveGuide] = useState(null)

  const p = task.completionPrompt

  function setField(key, val) {
    setPromptValues(prev => ({ ...prev, [key]: val }))
  }

  function isPromptComplete() {
    if (p.type === 'auto') return true
    if (alreadyComplete || justCompleted) return true
    if (p.type === 'text_response' || p.type === 'reflection') {
      return (promptValues.text || '').length >= (p.minChars || 20)
    }
    if (p.type === 'field_entry' || p.type === 'upload_link') {
      return (p.fields || []).filter(f => f.required).every(f => (promptValues[f.key] || '').trim())
    }
    if (p.type === 'checklist') {
      return (p.items || []).every(item =>
        item.inputType === 'checkbox' ? promptValues[item.key] === true : (promptValues[item.key] || '').trim()
      )
    }
    return false
  }

  async function handleComplete() {
    if (!isPromptComplete() || submitting) return
    setSubmitting(true)
    const result = await onComplete(promptValues)
    setSubmitting(false)
    setJustCompleted(true)
    if (result?.stageComplete) {
      setTimeout(() => onAdvanceStage(), 1800)
    } else {
      setTimeout(() => onBack(), 1800)
    }
  }

  if (justCompleted) {
    return (
      <div style={{ ...css.screen, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
        minHeight: '100vh', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Task complete</h2>
        <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.7', maxWidth: '280px', marginBottom: '6px' }}>
          {task.title}
        </p>
        <p style={{ color: T.gold, fontSize: '13px' }}>Returning to your roadmap…</p>
      </div>
    )
  }

  return (
    <div style={{ ...css.screen, padding: 0, minHeight: '100vh' }}>
      <GuideViewer guideFile={activeGuide} onClose={() => setActiveGuide(null)} />
      {/* Sticky header */}
      <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${T.bg4}`,
        display: 'flex', alignItems: 'center', gap: '12px',
        background: T.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none',
          color: T.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', color: stageCol, fontWeight: '700', letterSpacing: '0.06em' }}>
            STAGE {stageNum} · {stageName.toUpperCase()} · TASK {task.taskNumber}
          </p>
        </div>
        {(alreadyComplete || justCompleted) && (
          <span style={{ background: `${T.green}22`, color: T.green, fontSize: '11px',
            fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>✓ DONE</span>
        )}
      </div>

      <div style={{ padding: '24px 20px 100px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1.3', marginBottom: '6px' }}>
          {task.title}
        </h1>
        <p style={{ color: T.mutedDk, fontSize: '12px', marginBottom: '28px' }}>
          ⏱ {task.estimatedTime}
        </p>

        {/* 1. WHY THIS MATTERS */}
        {task.whyThisMatters && (
          <TaskSection label="WHY THIS MATTERS" color={stageCol}>
            <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.75' }}>
              {task.whyThisMatters}
            </p>
          </TaskSection>
        )}

        {/* 2. WHAT TO DO */}
        {steps && (
          <TaskSection label="WHAT TO DO" color={stageCol}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%',
                  background: `${stageCol}22`, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: stageCol, fontSize: '11px', fontWeight: '800' }}>{i + 1}</span>
                </div>
                <p style={{ color: T.white, fontSize: '14px', lineHeight: '1.65', flex: 1 }}>{step}</p>
              </div>
            ))}
            {trackNote && (
              <div style={{ background: `${stageCol}11`, border: `1px solid ${stageCol}33`,
                borderRadius: '8px', padding: '10px 14px', marginTop: '6px' }}>
                <p style={{ color: stageCol, fontSize: '11px', fontWeight: '700',
                  letterSpacing: '0.06em', marginBottom: '4px' }}>YOUR TRACK NOTE</p>
                <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6' }}>{trackNote}</p>
              </div>
            )}
          </TaskSection>
        )}

        {/* 2b. INTERACTIVE TRACKER */}
        {taskKey === '1.1' && (
          <TaskSection label="VISA & ILR COUNTDOWN TRACKER" color={stageCol}>
            <VisaCountdownTracker />
          </TaskSection>
        )}
        {taskKey === '1.2' && (
          <TaskSection label="CREDIT SCORE TRACKER" color={stageCol}>
            <CreditScoreTracker />
          </TaskSection>
        )}
        {taskKey === '4.2' && (
          <TaskSection label="APPLICATION PIPELINE & SPONSOR CHECK" color={stageCol}>
            <ApplicationPipelineTracker />
          </TaskSection>
        )}
        {taskKey === '5.4' && (
          <TaskSection label="ILR EVIDENCE FILE CHECKLIST" color={stageCol}>
            <ILREvidenceChecklist />
          </TaskSection>
        )}

        {/* 3. TOOLS & RESOURCES */}
        {task.resources?.length > 0 && (
          <TaskSection label="TOOLS & RESOURCES" color={stageCol}>
            {task.resources.map((r, i) => {
              const isGuide = r.type === 'guide' && r.guideFile
              const icon = r.type === 'guide' ? '📖' : r.type === 'download' || r.type === 'template' ? '📄'
                : r.type === 'product' ? '🌿' : r.type === 'interactive' ? '⚡'
                : r.type === 'circle_link' ? '💬' : r.type === 'tracker' ? '📊' : '📌'
              return (
                <div key={i} onClick={isGuide ? () => setActiveGuide(r.guideFile) : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 0', borderBottom: `1px solid ${T.bg4}`,
                    cursor: isGuide ? 'pointer' : 'default' }}>
                  <span style={{ fontSize: '14px' }}>{icon}</span>
                  <p style={{ flex: 1, fontSize: '13px', color: isGuide ? T.gold : T.white, lineHeight: '1.4' }}>
                    {r.title}
                  </p>
                  {isGuide && <span style={{ fontSize: '12px', color: T.gold }}>→</span>}
                </div>
              )
            })}
          </TaskSection>
        )}

        {/* 4. WHAT TO EXPECT TO FEEL */}
        {task.whatToExpectToFeel && (
          <TaskSection label="WHAT TO EXPECT TO FEEL" color={stageCol}>
            <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.75', fontStyle: 'italic' }}>
              {task.whatToExpectToFeel}
            </p>
          </TaskSection>
        )}

        {/* 5. COMPLETION PROMPT */}
        <TaskSection label="COMPLETION PROMPT" color={stageCol}>
          {alreadyComplete ? (
            <div style={{ background: `${T.green}11`, border: `1px solid ${T.green}44`,
              borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <p style={{ color: T.green, fontSize: '14px', fontWeight: '600' }}>
                ✓ You've already completed this task
              </p>
            </div>
          ) : (
            <CompletionPromptUI prompt={p} values={promptValues} setField={setField} stageCol={stageCol} />
          )}
        </TaskSection>

        {/* 6. MARK AS DONE */}
        {alreadyComplete ? (
          <div>
            <div style={{ background: `${T.green}11`, border: `1px solid ${T.green}44`,
              borderRadius: '10px', padding: '16px', textAlign: 'center', marginBottom: '10px' }}>
              <p style={{ color: T.green, fontWeight: '700', fontSize: '15px' }}>✓ Task complete</p>
            </div>
            <button onClick={onRedo}
              style={{ width: '100%', padding: '13px', borderRadius: '10px',
                border: `1px solid ${T.bg4}`, background: 'transparent', color: T.mutedDk,
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Redo this task →
            </button>
          </div>
        ) : p.type === 'auto' ? (
          <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
            borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6' }}>
              This task completes automatically when the streak tracker reaches 30 consecutive days.
            </p>
          </div>
        ) : !isPremium ? (
          <Btn onClick={() => {}}>Upgrade to Rebuild Premium to complete tasks →</Btn>
        ) : (
          <Btn onClick={handleComplete} disabled={!isPromptComplete() || submitting}>
            {submitting ? 'Saving…' : 'Mark this task complete →'}
          </Btn>
        )}
        {taskKey === '5.1' && (alreadyComplete || justCompleted) && (
          <button onClick={onExportPDF}
            style={{ width: '100%', marginTop: '12px', padding: '14px', borderRadius: '10px',
              border: `1px solid ${T.gold}`, background: 'transparent', color: T.gold,
              fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
            Export Rebuild Record as PDF →
          </button>
        )}
      </div>
    </div>
  )
}

function TaskSection({ label, color, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{ fontSize: '11px', color, fontWeight: '700',
        letterSpacing: '0.08em', marginBottom: '12px' }}>{label}</p>
      {children}
    </div>
  )
}

function CompletionPromptUI({ prompt, values, setField, stageCol }) {
  const p = prompt

  if (p.type === 'text_response' || p.type === 'reflection') {
    const minChars = p.minChars || 20
    const current = values.text || ''
    const met = current.length >= minChars
    return (
      <div>
        <p style={{ color: T.white, fontSize: '14px', lineHeight: '1.7', marginBottom: '14px',
          fontWeight: '500' }}>{p.prompt}</p>
        <textarea
          style={{ ...css.input, height: '120px', resize: 'none' }}
          placeholder="Write your response here…"
          value={current}
          onChange={e => setField('text', e.target.value)}
        />
        {p.note && <p style={{ color: T.mutedDk, fontSize: '12px', marginTop: '6px' }}>{p.note}</p>}
        <p style={{ color: met ? T.green : T.mutedDk, fontSize: '12px', marginTop: '6px' }}>
          {current.length} / {minChars} characters minimum {met && '✓'}
        </p>
      </div>
    )
  }

  if (p.type === 'field_entry' || p.type === 'upload_link') {
    return (
      <div>
        <p style={{ color: T.white, fontSize: '14px', lineHeight: '1.7', marginBottom: '16px',
          fontWeight: '500' }}>{p.prompt}</p>
        {(p.fields || []).map(field => (
          <div key={field.key} style={{ marginBottom: '14px' }}>
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>
              {field.label}{field.required ? ' *' : ' (optional)'}
            </p>
            <input
              style={css.input}
              type={field.inputType === 'date' ? 'date' : field.inputType === 'url' ? 'url' : 'text'}
              placeholder={field.placeholder || ''}
              value={values[field.key] || ''}
              onChange={e => setField(field.key, e.target.value)}
            />
          </div>
        ))}
        {p.note && <p style={{ color: T.mutedDk, fontSize: '12px', marginTop: '4px' }}>{p.note}</p>}
      </div>
    )
  }

  if (p.type === 'checklist') {
    const hasCheckboxes = (p.items || []).some(i => i.inputType === 'checkbox')
    return (
      <div>
        <p style={{ color: T.white, fontSize: '14px', lineHeight: '1.7', marginBottom: '16px',
          fontWeight: '500' }}>{p.prompt}</p>
        {hasCheckboxes ? (
          (p.items || []).map(item => {
            const checked = values[item.key] === true
            return (
              <button key={item.key} onClick={() => setField(item.key, !checked)}
                style={{ display: 'flex', gap: '12px', alignItems: 'flex-start',
                  background: 'none', border: 'none', cursor: 'pointer',
                  width: '100%', textAlign: 'left', marginBottom: '12px',
                  padding: 0, fontFamily: 'inherit' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px',
                  border: `2px solid ${checked ? T.gold : T.mutedDk}`,
                  background: checked ? T.gold : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '2px' }}>
                  {checked && <span style={{ color: T.bg, fontSize: '11px', fontWeight: '800' }}>✓</span>}
                </div>
                <span style={{ fontSize: '14px', color: T.white, lineHeight: '1.5' }}>{item.label}</span>
              </button>
            )
          })
        ) : (
          (p.items || []).map((item, i) => (
            <div key={item.key} style={{ marginBottom: '10px' }}>
              <p style={{ color: T.muted, fontSize: '12px', marginBottom: '5px' }}>Habit {i + 1} *</p>
              <input
                style={{ ...css.input, fontSize: '13px' }}
                placeholder={item.placeholder || `Name habit ${i + 1}`}
                value={values[item.key] || ''}
                onChange={e => setField(item.key, e.target.value)}
              />
            </div>
          ))
        )}
      </div>
    )
  }

  if (p.type === 'auto') {
    return (
      <div style={{ background: T.bg3, border: `1px solid ${T.bg4}`, borderRadius: '8px',
        padding: '14px', textAlign: 'center' }}>
        <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.6' }}>{p.prompt}</p>
      </div>
    )
  }

  return null
}

// ─────────────────────────────────────────────────────────────────

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
