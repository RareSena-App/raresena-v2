import { T } from '../App.jsx'

export default function GuideViewer({ guideFile, onClose }) {
  if (!guideFile) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
        background: '#1B2D5B', flexShrink: 0 }}>
        <button onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit', padding: 0, opacity: 0.8 }}>
          ← Back
        </button>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', flex: 1 }}>In-app guide</p>
      </div>
      {/* Guide content in iframe */}
      <iframe
        src={`/${guideFile}`}
        style={{ flex: 1, border: 'none', width: '100%' }}
        title="Guide"
      />
    </div>
  )
}
