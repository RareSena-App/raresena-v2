import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { supabase, T, css, Btn } from '../App.jsx'

const TOAST_STYLE = { style: { background: '#222220', color: '#fff', fontSize: '13px' } }

export default function LoginFlow({ onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function sendMagicLink() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
    })
    setLoading(false)
    if (error) {
      toast.error('No account found with that email.')
      return
    }
    setSent(true)
  }

  if (sent) return (
    <div style={{ ...css.screen, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
      textAlign: 'center', minHeight: '100vh' }}>
      <Toaster position="bottom-center" toastOptions={TOAST_STYLE} />
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>📧</div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>
        Check your email
      </h2>
      <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.7',
        maxWidth: '300px', marginBottom: '32px' }}>
        We sent a sign-in link to{' '}
        <strong style={{ color: T.white }}>{email}</strong>.
        Click it to access your account.
      </p>
      <Btn ghost onClick={() => { setSent(false); setEmail('') }}>
        Try a different email
      </Btn>
      <BackBtn onClick={onBack} />
    </div>
  )

  return (
    <div style={{ ...css.screen, padding: '56px 24px 40px', minHeight: '100vh' }}>
      <Toaster position="bottom-center" toastOptions={TOAST_STYLE} />
      <div style={{ fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>👋</div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
        Welcome back
      </h2>
      <p style={{ color: T.muted, fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>
        Enter your email and we'll send you a sign-in link.
      </p>
      <input
        style={css.input}
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && email.includes('@') && sendMagicLink()}
        autoFocus
      />
      <div style={{ marginTop: '20px' }}>
        <Btn onClick={sendMagicLink} disabled={!email.includes('@') || loading}>
          {loading ? 'Sending...' : 'Send sign-in link →'}
        </Btn>
      </div>
      <BackBtn onClick={onBack} />
    </div>
  )
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none',
      color: T.muted, fontSize: '13px', marginTop: '16px',
      cursor: 'pointer', display: 'block', fontFamily: 'inherit' }}>
      ← Back
    </button>
  )
}
