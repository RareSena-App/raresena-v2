// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RareSena — Complete Web Application v2.0
// Rebuild Portal + Rare Studio Creator Portal + Brand Portal + Admin Panel
// React + Supabase + Stripe | Deploy to Vercel (free)
// Built from the RareSena Complete Functional Specification
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState, useEffect, useContext, createContext, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import OnboardingFlow from './screens/Onboarding.jsx'
import RebuildPortal from './screens/Rebuild.jsx'
import StudioPortal from './screens/Studio.jsx'
import BrandPortal from './screens/Brand.jsx'
import AdminPanel from './screens/Admin.jsx'

// ── ENVIRONMENT ──────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const STRIPE_MONTHLY_PRICE = import.meta.env.VITE_STRIPE_REBUILD_MONTHLY_PRICE_ID
export const STRIPE_ANNUAL_PRICE = import.meta.env.VITE_STRIPE_REBUILD_ANNUAL_PRICE_ID
export const STRIPE_CREATOR_ONETIME = import.meta.env.VITE_STRIPE_CREATOR_ONETIME_PRICE_ID
export const STRIPE_CREATOR_MONTHLY = import.meta.env.VITE_STRIPE_CREATOR_MONTHLY_PRICE_ID
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.raresena.com'

// ── SUPABASE ─────────────────────────────────────────────────────────────────
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const T = {
  bg: '#1A1A16', bg2: '#222220', bg3: '#2C2C28', bg4: '#383834',
  gold: '#B8962E', goldLt: '#F0E8C8', goldDim: 'rgba(184,150,46,0.12)',
  white: '#FFFFFF', muted: '#888780', mutedDk: '#555551',
  green: '#2ECC71', red: '#E74C3C', purple: '#9B59B6',
  blue: '#3498DB', teal: '#1ABC9C', orange: '#E67E22',
}

// ── STAGES ────────────────────────────────────────────────────────────────────
export const STAGES = ['Reset', 'Rediscover', 'Routine', 'Rise', 'Realize']

export const STAGE_DATA = {
  Reset: { col: '#E74C3C', icon: '⚓', idx: 0, tagline: 'Before anything can grow, the ground must be secure.' },
  Rediscover: { col: '#9B59B6', icon: '🔭', idx: 1, tagline: 'The crisis has passed. Now: who are you here?' },
  Routine: { col: '#F39C12', icon: '⚙️', idx: 2, tagline: 'You know what you want. Now build the daily architecture.' },
  Rise: { col: '#B8962E', icon: '📈', idx: 3, tagline: 'The foundation holds. Apply structure to deliberate growth.' },
  Realize: { col: '#2ECC71', icon: '🌿', idx: 4, tagline: 'You are not surviving. You are living — on your own terms.' },
}

// ── RARE CIRCLE GROUPS ────────────────────────────────────────────────────────
export const CIRCLE_GROUPS = {
  stage: ['Reset', 'Rediscover', 'Routine', 'Rise', 'Realize'],
  interest: [
    'Local Communities', 'Faith Communities', 'Housing and Accommodation',
    'Financial Literacy', 'Family and Parenting', 'NHS and Healthcare',
    'Education and Qualifications', 'Jobs and Employment',
    'Legal and Immigration', 'Business and Entrepreneurship',
  ],
  creator: ['Rare Studio Creators'],
}

export const STAGE_GROUP_PRESELECT = {
  Reset: ['Housing and Accommodation', 'Legal and Immigration', 'Financial Literacy'],
  Rediscover: ['Education and Qualifications', 'Jobs and Employment'],
  Routine: ['Jobs and Employment', 'Financial Literacy'],
  Rise: ['Business and Entrepreneurship', 'Jobs and Employment'],
  Realize: ['Business and Entrepreneurship'],
}

// ── ASSESSMENT QUESTIONS ──────────────────────────────────────────────────────
export const QUESTIONS = [
  { q: 'What best describes your situation right now?', opts: [
    { text: 'My visa, income, or housing feels at risk', stage: 'Reset' },
    { text: "I'm stable but lost my sense of who I am here", stage: 'Rediscover' },
    { text: "I know what I want but can't build consistent structure", stage: 'Routine' },
    { text: "I'm actively growing but need clearer direction", stage: 'Rise' },
    { text: "I'm building sustainably and thinking about legacy", stage: 'Realize' },
  ]},
  { q: 'How secure do you feel in the UK right now?', opts: [
    { text: 'Not at all — something could change at any moment', stage: 'Reset' },
    { text: 'Legally secure but emotionally adrift', stage: 'Rediscover' },
    { text: 'Secure enough to start building structure', stage: 'Routine' },
    { text: 'Confident and building deliberately', stage: 'Rise' },
    { text: "Very — I'm creating something that lasts", stage: 'Realize' },
  ]},
  { q: 'What does your daily life honestly look like?', opts: [
    { text: 'Survival mode — one crisis at a time', stage: 'Reset' },
    { text: 'Functional but disconnected from who I was', stage: 'Rediscover' },
    { text: 'Some structure, but it keeps collapsing', stage: 'Routine' },
    { text: 'Disciplined — I have systems that mostly hold', stage: 'Rise' },
    { text: 'Intentional — my days feel completely mine', stage: 'Realize' },
  ]},
  { q: 'What is your biggest challenge right now?', opts: [
    { text: 'Securing basic stability — visa, income, housing', stage: 'Reset' },
    { text: 'Finding out who I am in this country', stage: 'Rediscover' },
    { text: 'Building habits and structure that stick', stage: 'Routine' },
    { text: 'Turning effort into a clear direction', stage: 'Rise' },
    { text: "Making sure what I've built lasts", stage: 'Realize' },
  ]},
  { q: 'What would change everything for you?', opts: [
    { text: 'Knowing my right to stay is protected', stage: 'Reset' },
    { text: 'Feeling like myself again', stage: 'Rediscover' },
    { text: 'A daily system that works without willpower', stage: 'Routine' },
    { text: 'A clear path from here to sovereignty', stage: 'Rise' },
    { text: "Turning my rebuild into someone else's roadmap", stage: 'Realize' },
  ]},
]

// ── GLOBAL CONTEXT ────────────────────────────────────────────────────────────
export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

// ── UTILITIES ─────────────────────────────────────────────────────────────────
export function today() { return new Date().toDateString() }

export function getDaysSince(dateStr) {
  if (!dateStr) return 0
  return Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
}

export function getStageFromAnswers(answers) {
  const counts = {}
  STAGES.forEach(s => (counts[s] = 0))
  answers.forEach(a => { if (a) counts[a]++ })
  let max = 0, result = 'Reset'
  STAGES.forEach(s => { if (counts[s] > max) { max = counts[s]; result = s } })
  return result
}

export async function createStripeCheckout(priceId, email) {
  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, customerEmail: email,
      successUrl: `${APP_URL}?payment=success`,
      cancelUrl: `${APP_URL}?payment=cancelled` }),
  })
  const { url } = await res.json()
  if (url) window.location.href = url
}

// ── SHARED STYLE HELPERS ──────────────────────────────────────────────────────
export const css = {
  screen: { minHeight: '100vh', background: T.bg, color: T.white,
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif" },
  padded: { padding: '24px 20px 100px' },
  card: { background: T.bg2, borderRadius: '12px', padding: '16px',
    border: `1px solid ${T.bg4}`, marginBottom: '12px' },
  cardGold: { background: T.bg2, borderRadius: '12px', padding: '16px',
    border: `1px solid ${T.gold}`, marginBottom: '12px' },
  btn: (ghost = false, col = T.gold, sm = false) => ({
    background: ghost ? 'transparent' : col,
    color: ghost ? col : col === T.gold ? T.bg : T.white,
    padding: sm ? '10px 16px' : '14px 20px',
    borderRadius: '8px',
    border: ghost ? `1px solid ${col}` : 'none',
    fontWeight: '600', fontSize: sm ? '13px' : '15px',
    cursor: 'pointer', width: '100%', fontFamily: 'inherit',
  }),
  input: { background: T.bg3, color: T.white, border: `1px solid ${T.bg4}`,
    borderRadius: '8px', padding: '13px 16px', fontSize: '15px',
    width: '100%', outline: 'none', fontFamily: 'inherit' },
  tag: (col) => ({ display: 'inline-block', padding: '3px 10px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '600',
    background: `${col}22`, color: col }),
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
export function StageBadge({ stage }) {
  const d = STAGE_DATA[stage]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '20px',
      background: `${d.col}22`, color: d.col, fontSize: '12px', fontWeight: '600' }}>
      {d.icon} {stage}
    </span>
  )
}

export function Btn({ children, onClick, ghost, sm, col, disabled }) {
  return (
    <button style={{ ...css.btn(ghost, col || T.gold, sm), opacity: disabled ? 0.5 : 1 }}
      onClick={onClick} disabled={disabled}>{children}</button>
  )
}

export function Card({ children, gold, style = {} }) {
  return (
    <div style={{ ...(gold ? css.cardGold : css.card), ...style }}>{children}</div>
  )
}

export function GoldCTA({ text, sub, onClick }) {
  return (
    <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`,
      borderRadius: '10px', padding: '16px', textAlign: 'center', marginTop: '12px' }}>
      {sub && <p style={{ color: T.muted, fontSize: '12px', marginBottom: '8px' }}>{sub}</p>}
      <Btn onClick={onClick}>{text}</Btn>
    </div>
  )
}

export function Avatar({ initials, col, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%',
      background: `${col}33`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '13px', fontWeight: '700',
      color: col, flexShrink: 0 }}>{initials}</div>
  )
}

export function PageHeader({ title, sub, onBack, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none',
          color: T.muted, cursor: 'pointer', fontSize: '20px', fontFamily: 'inherit' }}>←</button>
      )}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{title}</h2>
        {sub && <p style={{ color: T.muted, fontSize: '13px', marginTop: '2px' }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon, title, sub, cta, onCta }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>{title}</p>
      {sub && <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6',
        marginBottom: '16px' }}>{sub}</p>}
      {cta && <Btn sm onClick={onCta}>{cta}</Btn>}
    </div>
  )
}

// ── BOTTOM NAVS ───────────────────────────────────────────────────────────────
export function RebuildNav({ screen, setScreen }) {
  const nav = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'habits', icon: '⚡', label: 'Habits' },
    { id: 'circle', icon: '💬', label: 'Circle' },
    { id: 'roadmap', icon: '🗺️', label: 'Roadmap' },
    { id: 'book', icon: '📞', label: 'Book Sena' },
  ]
  return <BottomNav nav={nav} screen={screen} setScreen={setScreen}
    onSpecial={() => window.open('https://raresena.com/book', '_blank')} specialId="book" />
}

export function StudioNav({ screen, setScreen }) {
  const nav = [
    { id: 'studio-home', icon: '🎬', label: 'Dashboard' },
    { id: 'briefs', icon: '📋', label: 'Briefs' },
    { id: 'campaigns', icon: '🚀', label: 'Campaigns' },
    { id: 'resources', icon: '📚', label: 'Resources' },
    { id: 'studio-community', icon: '💬', label: 'Community' },
  ]
  return <BottomNav nav={nav} screen={screen} setScreen={setScreen} />
}

export function BrandNav({ screen, setScreen }) {
  const nav = [
    { id: 'brand-home', icon: '🏢', label: 'Dashboard' },
    { id: 'creators', icon: '👥', label: 'Creators' },
    { id: 'brand-briefs', icon: '📋', label: 'Briefs' },
    { id: 'brand-campaigns', icon: '🚀', label: 'Campaigns' },
    { id: 'brand-settings', icon: '⚙️', label: 'Settings' },
  ]
  return <BottomNav nav={nav} screen={screen} setScreen={setScreen} />
}

function BottomNav({ nav, screen, setScreen, onSpecial, specialId }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0,
      background: T.bg2, borderTop: `1px solid ${T.bg4}`,
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {nav.map(n => (
        <button key={n.id}
          onClick={() => n.id === specialId && onSpecial ? onSpecial() : setScreen(n.id)}
          style={{ flex: 1, padding: '10px 4px 12px', background: 'none',
            border: 'none', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>{n.icon}</span>
          <span style={{ fontSize: '10px', fontWeight: '500',
            color: screen === n.id ? T.gold : T.muted }}>{n.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── STUDIO UPSELL ─────────────────────────────────────────────────────────────
function StudioUpsell({ userData }) {
  const [plan, setPlan] = useState('monthly')
  const priceId = plan === 'monthly' ? STRIPE_CREATOR_MONTHLY : STRIPE_CREATOR_ONETIME
  return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: '44px', marginBottom: '12px' }}>🎬</p>
      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Rare Studio</h2>
      <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
        Get discovered by brands, access paid campaigns, and build your content career.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
        {[['monthly', 'Monthly', '£27/mo'], ['onetime', 'One-off', '£97']].map(([id, label, price]) => (
          <button key={id} onClick={() => setPlan(id)}
            style={{ flex: 1, maxWidth: '140px', padding: '12px', borderRadius: '10px', border: 'none',
              background: plan === id ? T.gold : T.bg2,
              color: plan === id ? T.bg : T.muted,
              fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
            <p style={{ fontWeight: '700' }}>{label}</p>
            <p style={{ fontSize: '12px', marginTop: '2px' }}>{price}</p>
          </button>
        ))}
      </div>
      <button onClick={() => createStripeCheckout(priceId, userData.email)}
        style={{ background: T.gold, color: T.bg, border: 'none', borderRadius: '10px',
          padding: '14px 32px', fontWeight: '700', fontSize: '15px',
          cursor: 'pointer', fontFamily: 'inherit', width: '100%', maxWidth: '280px' }}>
        Become a creator →
      </button>
    </div>
  )
}

// ── PORTAL TOGGLE (for users who are both rebuilder and creator) ───────────────
function PortalToggle({ portal, setPortal, isCreator }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0,
      background: T.bg2, borderBottom: `1px solid ${T.bg4}`,
      display: 'flex', zIndex: 99, padding: '8px 20px' }}>
      <div style={{ display: 'flex', background: T.bg3,
        borderRadius: '8px', padding: '3px', gap: '2px', width: '100%' }}>
        {[['rebuild', '🌿 Rebuild', true], ['studio', '🎬 Rare Studio', isCreator]].map(([id, label, unlocked]) => (
          <button key={id} onClick={() => setPortal(id)}
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
              background: portal === id ? T.gold : 'transparent',
              color: portal === id ? T.bg : unlocked ? T.muted : T.mutedDk,
              fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'inherit' }}>
            {!unlocked && '🔒 '}{label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── APP PROVIDER ──────────────────────────────────────────────────────────────
function AppProvider({ children, initialUser, initialHabits }) {
  const [user, setUser] = useState(initialUser)
  const [habits, setHabits] = useState(initialHabits)
  const [notifications, setNotifications] = useState([])

  function saveUser(updated) {
    setUser(updated)
    syncUser(updated)
  }

  async function syncUser(u) {
    if (!u.supabaseId) return
    try {
      await supabase.from('rebuilders').upsert({
        id: u.supabaseId, email: u.email, name: u.name,
        stage: u.stage, is_premium: u.isPremium || false,
        is_creator: u.isCreator || false,
        streak: u.streak || 0,
        last_check_in: u.lastCheckIn || null,
        join_date: u.joinDate,
        location: u.location || null,
        groups: u.groups || [],
        milestones_completed: u.milestonesCompleted || {},
        updated_at: new Date().toISOString(),
      })
    } catch (e) { console.error('Supabase sync error:', e) }
  }

  function toggleHabit(habitId) {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== habitId) return h
        const dates = h.completedDates || []
        const t = today()
        const newDates = dates.includes(t) ? dates.filter(d => d !== t) : [...dates, t]
        supabase.from('habits').update({ completed_dates: newDates }).eq('id', habitId)
        return { ...h, completedDates: newDates }
      })
      return updated
    })
  }

  function addHabit(name) {
    const h = { id: `${user.supabaseId}_h_${Date.now()}`, name,
      completedDates: [], createdAt: new Date().toISOString() }
    supabase.from('habits').insert({
      id: h.id, user_id: user.supabaseId, name: h.name, completed_dates: [],
    })
    setHabits(prev => [...prev, h])
  }

  function removeHabit(id) {
    supabase.from('habits').delete().eq('id', id)
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  function toggleMilestone(key) {
    const updated = {
      ...user,
      milestonesCompleted: {
        ...(user.milestonesCompleted || {}),
        [key]: !(user.milestonesCompleted || {})[key],
      },
    }
    saveUser(updated)
  }

  function addNotification(msg) {
    setNotifications(prev => [{ id: Date.now(), msg, time: new Date() }, ...prev.slice(0, 19)])
  }

  return (
    <AppContext.Provider value={{ user, habits, notifications, saveUser,
      toggleHabit, addHabit, removeHabit, toggleMilestone, addNotification }}>
      {children}
    </AppContext.Provider>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [appState, setAppState] = useState('loading')
  const [userData, setUserData] = useState(null)
  const [habitsData, setHabitsData] = useState([])
  const [portal, setPortal] = useState('rebuild')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setAppState('onboard'); return }

      const [{ data: userData }, { data: habitsData }] = await Promise.all([
        supabase.from('rebuilders').select('*').eq('id', session.user.id).single(),
        supabase.from('habits').select('*').eq('user_id', session.user.id),
      ])

      if (!userData) { setAppState('onboard'); return }

      const u = buildUserFromSupabase(userData)
      const habits = (habitsData || []).map(h => ({
        id: h.id, name: h.name,
        completedDates: h.completed_dates || [],
        createdAt: h.created_at,
      }))

      setUserData(u)
      setHabitsData(habits)
      if (u.accountType === 'brand') setAppState('brand')
      else if (u.accountType === 'admin') setAppState('admin')
      else setAppState('main')
    })
  }, [])

  function buildUserFromSupabase(data) {
    return {
      supabaseId: data.id, email: data.email, name: data.name,
      stage: data.stage, isPremium: data.is_premium,
      isCreator: data.is_creator, accountType: data.account_type || 'rebuilder',
      streak: data.streak, lastCheckIn: data.last_check_in,
      joinDate: data.join_date, location: data.location,
      groups: data.groups || [], milestonesCompleted: data.milestones_completed || {},
      stripeCustomerId: data.stripe_customer_id,
    }
  }

  function handleOnboardComplete(newUser, newHabits) {
    setUserData(newUser)
    setHabitsData(newHabits)
    setAppState('main')
  }

  function handleLogout() {
    supabase.auth.signOut()
    setUserData(null)
    setHabitsData([])
    setAppState('onboard')
  }

  if (appState === 'loading') return (
    <div style={{ ...css.screen, display: 'flex', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌿</div>
        <p style={{ color: T.muted, fontSize: '14px' }}>Loading your rebuild...</p>
      </div>
    </div>
  )

  if (appState === 'onboard') return (
    <OnboardingFlow onComplete={handleOnboardComplete} />
  )

  if (appState === 'brand' && userData) return (
    <AppProvider initialUser={userData} initialHabits={[]}>
      <BrandPortal onLogout={handleLogout} />
    </AppProvider>
  )

  if (appState === 'admin' && userData) return (
    <AppProvider initialUser={userData} initialHabits={[]}>
      <AdminPanel onLogout={handleLogout} />
    </AppProvider>
  )

  if (appState === 'main' && userData) {
    const isCreator = userData.isCreator
    return (
      <AppProvider initialUser={userData} initialHabits={habitsData}>
        <div style={{ background: T.bg, minHeight: '100vh', maxWidth: '480px', margin: '0 auto' }}>
          <PortalToggle portal={portal} setPortal={setPortal} isCreator={isCreator} />
          <div style={{ paddingTop: '56px' }}>
            {portal === 'rebuild' && <RebuildPortal onLogout={handleLogout} />}
            {portal === 'studio' && isCreator && <StudioPortal onLogout={handleLogout} />}
            {portal === 'studio' && !isCreator && (
              <StudioUpsell userData={userData} />
            )}
          </div>
        </div>
      </AppProvider>
    )
  }

  return null
}
