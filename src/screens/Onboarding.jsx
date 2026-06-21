import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { supabase, QUESTIONS, STAGES, STAGE_DATA, CIRCLE_GROUPS,
  STAGE_GROUP_PRESELECT, getStageFromAnswers, T, css, Btn, Card, APP_URL } from '../App.jsx'
import LoginFlow from './Login.jsx'

const STARTER_HABITS = [
  { id: 'h1', name: 'Morning journal (3 sentences)', completedDates: [], createdAt: new Date().toISOString() },
  { id: 'h2', name: 'Evening walk (20 minutes)', completedDates: [], createdAt: new Date().toISOString() },
  { id: 'h3', name: 'Read industry content (10 minutes)', completedDates: [], createdAt: new Date().toISOString() },
]

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState([])
  const [stage, setStage] = useState(null)
  const [location, setLocation] = useState('')
  const [selectedGroups, setSelectedGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showBrandEnquiry, setShowBrandEnquiry] = useState(false)

  if (showLogin) return <LoginFlow onBack={() => setShowLogin(false)} />
  if (showBrandEnquiry) return <BrandEnquiryForm onBack={() => setShowBrandEnquiry(false)} />

  function selectAnswer(stageAnswer) {
    const qIdx = step - 3
    const newAnswers = [...answers]
    newAnswers[qIdx] = stageAnswer
    setAnswers(newAnswers)
    if (step === 7) {
      const calculatedStage = getStageFromAnswers(newAnswers)
      setStage(calculatedStage)
      // Pre-select groups based on stage
      setSelectedGroups(STAGE_GROUP_PRESELECT[calculatedStage] || [])
      setStep(8)
    } else {
      setStep(s => s + 1)
    }
  }

  function toggleGroup(group) {
    setSelectedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    )
  }

  async function completeOnboarding() {
    setLoading(true)
    try {
      const password = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('')

      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error?.code === 'user_already_exists') {
        toast.error('An account with this email already exists. Please use a different email.')
        setLoading(false)
        return
      }
      if (error) throw error

      const userId = data.user.id
      const allGroups = [stage, ...selectedGroups]
      const now = new Date().toISOString()

      await supabase.from('rebuilders').upsert({
        id: userId, email, name, stage,
        is_premium: false, is_creator: false, account_type: 'rebuilder',
        streak: 0, join_date: now,
        location: location || null, groups: allGroups,
        milestones_completed: {}, updated_at: now,
      })

      const userHabits = STARTER_HABITS.map(h => ({
        id: `${userId}_${h.id}`, user_id: userId,
        name: h.name, completed_dates: [],
      }))
      await supabase.from('habits').insert(userHabits)

      const newUser = {
        supabaseId: userId, email, name, stage,
        isPremium: false, isCreator: false, accountType: 'rebuilder',
        streak: 0, lastCheckIn: null, joinDate: now,
        location, groups: allGroups, milestonesCompleted: {},
      }
      const newHabits = STARTER_HABITS.map(h => ({ ...h, id: `${userId}_${h.id}` }))

      toast.success('Welcome to RareSena! Setting up your rebuild...')
      onComplete(newUser, newHabits)
    } catch (e) {
      console.error('Onboarding error:', e)
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // ── STEP 0: WELCOME ──
  if (step === 0) return (
    <div style={{ ...css.screen, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
      textAlign: 'center', minHeight: '100vh' }}>
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#222220', color: '#fff', fontSize: '13px' } }} />
      <div style={{ fontSize: '56px', marginBottom: '20px' }}>🌿</div>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', lineHeight: '1.2' }}>
        RareSena<br />Rebuild
      </h1>
      <p style={{ color: T.muted, fontSize: '15px', lineHeight: '1.7', marginBottom: '10px',
        maxWidth: '300px' }}>
        The 5R Rebuild Method — built for every immigrant who came too far to stop now.
      </p>
      <p style={{ color: T.gold, fontSize: '13px', letterSpacing: '0.06em', marginBottom: '40px' }}>
        Reset · Rediscover · Routine · Rise · Realize
      </p>
      <div style={{ width: '100%', maxWidth: '340px' }}>
        <Btn onClick={() => setStep(1)}>Begin your rebuild →</Btn>
        <p style={{ color: T.mutedDk, fontSize: '12px', marginTop: '14px' }}>
          Free to start. Under 3 minutes to your stage.
        </p>
        <button onClick={() => setShowLogin(true)}
          style={{ background: 'none', border: 'none', color: T.muted,
            fontSize: '13px', marginTop: '20px', cursor: 'pointer',
            fontFamily: 'inherit', width: '100%' }}>
          Already a member? Sign in →
        </button>
        <button onClick={() => setShowBrandEnquiry(true)}
          style={{ background: 'none', border: 'none', color: T.mutedDk,
            fontSize: '12px', marginTop: '10px', cursor: 'pointer',
            fontFamily: 'inherit', width: '100%' }}>
          Are you a brand? Apply to partner →
        </button>
      </div>
    </div>
  )

  // ── STEP 1: NAME ──
  if (step === 1) return (
    <div style={{ ...css.screen, padding: '56px 24px 40px', minHeight: '100vh' }}>
      <p style={{ color: T.muted, fontSize: '13px', marginBottom: '8px' }}>Step 1 of 2</p>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>What's your name?</h2>
      <p style={{ color: T.muted, fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>
        The name you actually go by — not the one on your visa.
      </p>
      <input style={css.input} type="text" placeholder="Your name" value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)} autoFocus />
      <div style={{ marginTop: '20px' }}>
        <Btn onClick={() => setStep(2)} disabled={!name.trim()}>Continue →</Btn>
      </div>
      <Back onClick={() => setStep(0)} />
    </div>
  )

  // ── STEP 2: EMAIL ──
  if (step === 2) return (
    <div style={{ ...css.screen, padding: '56px 24px 40px', minHeight: '100vh' }}>
      <p style={{ color: T.muted, fontSize: '13px', marginBottom: '8px' }}>Step 2 of 2</p>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
        Hi {name}. Your email?
      </h2>
      <p style={{ color: T.muted, fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>
        Your rebuild roadmap goes here. No marketing. No spam.
      </p>
      <input style={css.input} type="email" placeholder="your@email.com" value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && email.includes('@') && setStep(3)} autoFocus />
      <div style={{ marginTop: '20px' }}>
        <Btn onClick={() => setStep(3)} disabled={!email.includes('@')}>Find my stage →</Btn>
      </div>
      <Back onClick={() => setStep(1)} />
    </div>
  )

  // ── STEPS 3-7: ASSESSMENT QUESTIONS ──
  const qIdx = step - 3
  const q = QUESTIONS[qIdx]
  if (q) return (
    <div style={{ ...css.screen, padding: '28px 20px 40px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '24px' }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px',
            background: i <= qIdx ? T.gold : T.bg4 }} />
        ))}
      </div>
      <h2 style={{ fontSize: '19px', fontWeight: '700', lineHeight: '1.4', marginBottom: '24px' }}>
        {q.q}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => selectAnswer(opt.stage)}
            style={{ background: answers[qIdx] === opt.stage ? T.goldDim : T.bg2,
              border: `1px solid ${answers[qIdx] === opt.stage ? T.gold : T.bg4}`,
              borderRadius: '10px', padding: '14px 16px',
              color: answers[qIdx] === opt.stage ? T.goldLt : T.white,
              textAlign: 'left', fontSize: '14px', cursor: 'pointer',
              lineHeight: '1.5', fontFamily: 'inherit' }}>
            {opt.text}
          </button>
        ))}
      </div>
      {qIdx > 0 && <Back onClick={() => setStep(s => s - 1)} />}
    </div>
  )

  // ── STEP 8: STAGE RESULT ──
  if (step === 8 && stage) {
    const d = STAGE_DATA[stage]
    return (
      <div style={{ ...css.screen, padding: '32px 24px 48px', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px', paddingTop: '16px' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>{d.icon}</div>
          <p style={{ color: T.muted, fontSize: '13px', marginBottom: '6px' }}>
            {name}, your 5R stage is
          </p>
          <h1 style={{ fontSize: '38px', fontWeight: '800', color: d.col, marginBottom: '10px' }}>
            {stage}
          </h1>
          <p style={{ color: T.muted, fontSize: '14px', fontStyle: 'italic',
            lineHeight: '1.7', maxWidth: '320px', margin: '0 auto' }}>{d.tagline}</p>
        </div>
        <Card gold style={{ background: T.goldDim }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '10px' }}>
            <p style={{ fontWeight: '600', fontSize: '14px' }}>🗺️ Your 7-day {stage} plan</p>
            <span style={{ background: T.gold, color: T.bg, padding: '2px 8px',
              borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>PREMIUM</span>
          </div>
          <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6', marginBottom: '14px' }}>
            Your personalised 7-day plan maps the exact actions for your {stage} stage —
            starting with the one that protects or advances everything else.
          </p>
          <Btn sm onClick={() => setStep(9)}>Unlock with Rebuild Premium →</Btn>
        </Card>
        <div style={{ marginTop: '16px' }}>
          <Btn ghost onClick={() => setStep(9)}>Continue free →</Btn>
          <p style={{ textAlign: 'center', color: T.mutedDk, fontSize: '12px', marginTop: '10px' }}>
            Free: 3 habits, stage overview, Rare Circle reading access
          </p>
        </div>
      </div>
    )
  }

  // ── STEP 9: LOCATION ──
  if (step === 9) return (
    <div style={{ ...css.screen, padding: '56px 24px 40px', minHeight: '100vh' }}>
      <div style={{ fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>📍</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
        Where in the UK are you?
      </h2>
      <p style={{ color: T.muted, fontSize: '14px', marginBottom: '28px',
        lineHeight: '1.6', textAlign: 'center' }}>
        This connects you to rebuilders in your area and local community groups.
      </p>
      <input style={css.input} type="text" placeholder="e.g. Manchester, London, Birmingham"
        value={location} onChange={e => setLocation(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && location.trim() && setStep(10)} autoFocus />
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Btn onClick={() => setStep(10)} disabled={!location.trim()}>Continue →</Btn>
        <Btn ghost onClick={() => setStep(10)}>Skip for now</Btn>
      </div>
    </div>
  )

  // ── STEP 10: GROUP SELECTION ──
  if (step === 10) return (
    <div style={{ ...css.screen, padding: '28px 20px 48px', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
        Choose your communities
      </h2>
      <p style={{ color: T.muted, fontSize: '13px', marginBottom: '20px', lineHeight: '1.6' }}>
        You have been placed in the <strong style={{ color: T.gold }}>{stage}</strong> group.
        Select any additional groups that are relevant to you.
      </p>

      <div style={{ background: T.goldDim, border: `1px solid ${T.gold}`,
        borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', color: T.goldLt }}>
          ✓ Auto-placed: <strong>{stage} stage group</strong>
          {location && ` · ${location} local community`}
        </p>
      </div>

      <p style={{ fontSize: '12px', color: T.muted, marginBottom: '10px' }}>
        Select additional interest groups (we've pre-selected based on your stage):
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {CIRCLE_GROUPS.interest.map(group => {
          const selected = selectedGroups.includes(group)
          return (
            <button key={group} onClick={() => toggleGroup(group)}
              style={{ background: selected ? T.goldDim : T.bg2,
                border: `1px solid ${selected ? T.gold : T.bg4}`,
                borderRadius: '10px', padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px',
                border: `2px solid ${selected ? T.gold : T.mutedDk}`,
                background: selected ? T.gold : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0 }}>
                {selected && <span style={{ color: T.bg, fontSize: '12px', fontWeight: '800' }}>✓</span>}
              </div>
              <span style={{ fontSize: '14px', color: selected ? T.white : T.muted }}>
                {group}
              </span>
            </button>
          )
        })}
      </div>
      <Btn onClick={completeOnboarding} disabled={loading}>
        {loading ? 'Setting up your rebuild...' : 'Enter my rebuild →'}
      </Btn>
      <Back onClick={() => setStep(2)} />
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#222220', color: '#fff', fontSize: '13px' } }} />
    </div>
  )

  return null
}

function Back({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none',
      color: T.muted, fontSize: '13px', marginTop: '16px',
      cursor: 'pointer', display: 'block', fontFamily: 'inherit' }}>← Back</button>
  )
}

function BrandEnquiryForm({ onBack }) {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '',
    website: '', campaign_type: '', budget_range: '', target_audience: '', description: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  async function submit() {
    if (!form.company_name.trim() || !form.contact_name.trim() || !form.email.includes('@')) return
    setLoading(true)
    const { error } = await supabase.from('brand_enquiries').insert({
      ...form, status: 'pending_approval', created_at: new Date().toISOString(),
    })
    if (error) {
      toast.error('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ ...css.screen, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
      textAlign: 'center', minHeight: '100vh' }}>
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#222220', color: '#fff', fontSize: '13px' } }} />
      <div style={{ fontSize: '52px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Application received</h2>
      <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.7', maxWidth: '300px', marginBottom: '32px' }}>
        Thank you, <strong>{form.contact_name.split(' ')[0]}</strong>. Sena will review your application and get back to you at <strong>{form.email}</strong> within 48 hours.
      </p>
      <Btn ghost onClick={onBack}>Back to home →</Btn>
    </div>
  )

  return (
    <div style={{ ...css.screen, padding: '48px 24px 48px', minHeight: '100vh' }}>
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#222220', color: '#fff', fontSize: '13px' } }} />
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted,
        fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px', display: 'block' }}>
        ← Back
      </button>
      <p style={{ color: T.gold, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
        Rare Studio
      </p>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Partner with us</h2>
      <p style={{ color: T.muted, fontSize: '13px', lineHeight: '1.6', marginBottom: '28px' }}>
        Tell us about your brand and campaign goals. We'll review and get back to you within 48 hours.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          ['Company name *', 'company_name', 'text', 'e.g. Bloom Skincare'],
          ['Your name *', 'contact_name', 'text', 'e.g. Sarah Ahmed'],
          ['Email address *', 'email', 'email', 'your@company.com'],
          ['Website', 'website', 'url', 'www.yourcompany.com'],
          ['Campaign type', 'campaign_type', 'text', 'e.g. Product launch, Brand awareness, UGC'],
          ['Budget range', 'budget_range', 'text', 'e.g. £500–£1,000 per campaign'],
          ['Target audience', 'target_audience', 'text', 'e.g. UK immigrants, 25–40, wellness-focused'],
        ].map(([label, key, type, placeholder]) => (
          <div key={key}>
            <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>{label}</p>
            <input style={css.input} type={type} placeholder={placeholder}
              value={form[key]} onChange={e => set(key, e.target.value)} />
          </div>
        ))}
        <div>
          <p style={{ color: T.muted, fontSize: '12px', marginBottom: '6px' }}>Tell us more about your campaign goals</p>
          <textarea style={{ ...css.input, height: '100px', resize: 'none' }}
            placeholder="What are you hoping to achieve? What makes your brand a good fit for the RareSena community?"
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <Btn onClick={submit}
          disabled={loading || !form.company_name.trim() || !form.contact_name.trim() || !form.email.includes('@')}>
          {loading ? 'Submitting...' : 'Submit application →'}
        </Btn>
        <p style={{ textAlign: 'center', color: T.mutedDk, fontSize: '12px' }}>
          We review all applications personally. No auto-approvals.
        </p>
      </div>
    </div>
  )
}
