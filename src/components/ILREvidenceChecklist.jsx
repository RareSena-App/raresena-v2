import { useState, useEffect } from 'react'
import { useApp, T, supabase } from '../App.jsx'

const CATEGORIES = [
  {
    id: 'identity',
    icon: '🛂',
    title: 'Identity and immigration history',
    items: [
      { key: 'id_passport', label: 'Current passport (and all previous passports covering your UK residence)', note: 'Old passports show your entry stamps and travel history — never discard them.' },
      { key: 'id_evisa', label: 'eVisa access confirmed / BRP records saved', note: 'Screenshot your eVisa status page periodically. Keep expired BRP card images.' },
      { key: 'id_letters', label: 'All previous visa grant letters and decision letters', note: 'Every Home Office letter you have ever received — approvals, extensions, corrections.' },
      { key: 'id_travel', label: 'Complete travel/absence log with dates', note: 'Use the Visa & ILR Countdown Tracker — export the absence log annually.' },
      { key: 'id_police', label: 'Police registration certificate (if it applied to your nationality historically)', note: 'The scheme ended in 2022 — but if you registered, keep the certificate.' },
    ],
  },
  {
    id: 'employment',
    icon: '💼',
    title: 'Employment and income',
    items: [
      { key: 'emp_payslips', label: 'All payslips (monthly, every employer, every year)', note: 'Download PDFs monthly — payroll portals close when you leave an employer.' },
      { key: 'emp_p60', label: 'P60s for every tax year', note: 'Issued each April by your employer. One page per year proves annual income.' },
      { key: 'emp_contracts', label: 'Employment contracts and job change letters', note: 'Especially important for Tracks A and H where role and salary are visa conditions.' },
      { key: 'emp_selfassess', label: 'Self-assessment returns and SA302s (if self-employed)', note: 'Download from your HMRC account after each filing.' },
      { key: 'emp_sponsor', label: 'Sponsor correspondence (Tracks A, H) or endorsing body records (Tracks F, G)', note: 'CoS references, sponsor letters, endorsement letters, checkpoint meeting records.' },
    ],
  },
  {
    id: 'residence',
    icon: '🏠',
    title: 'Residence and address',
    items: [
      { key: 'res_tenancy', label: 'All tenancy agreements (every property, every renewal)', note: 'Continuous address history is core residence evidence.' },
      { key: 'res_council', label: 'Council tax bills or exemption letters (annual)', note: 'One per year per address. Councils can reissue but it takes weeks.' },
      { key: 'res_utility', label: 'Utility bills — a sample from each year', note: 'Two or three per year is enough. Download PDFs; suppliers purge old accounts.' },
      { key: 'res_bank', label: 'Bank statements — a sample from each year showing UK address and activity', note: 'Quarterly statements per year showing regular UK transactions.' },
      { key: 'res_gp', label: 'GP registration and NHS records confirmation', note: 'Registration letters and appointment history support continuous residence.' },
    ],
  },
  {
    id: 'application',
    icon: '📚',
    title: 'Application requirements',
    items: [
      { key: 'app_lifeuk', label: 'Life in the UK test — pass certificate', note: 'Book at gov.uk/life-in-the-uk-test (£50). Valid indefinitely once passed — take it early.' },
      { key: 'app_english', label: 'English language evidence (B1 minimum — degree taught in English or approved test)', note: 'Degree-holders: get your ENIC English proficiency confirmation alongside comparability.' },
      { key: 'app_fee', label: 'ILR application fee saved (£3,029 per person — check current rate)', note: 'Fees change; verify at gov.uk before budgeting. Add this to your Task 3.5 financial goals.' },
      { key: 'app_marriage', label: 'Marriage/civil partnership certificate and relationship evidence (Track C and dependants)', note: 'Cohabitation evidence across the qualifying period: joint bills, joint tenancy, correspondence to the same address.' },
      { key: 'app_children', label: 'Children\'s documents (birth certificates, school letters) if applying with dependants', note: 'School attendance letters double as residence evidence for the whole family.' },
    ],
  },
  {
    id: 'character',
    icon: '⚖️',
    title: 'Good character and compliance',
    items: [
      { key: 'char_record', label: 'Clean driving and court record — or full disclosure documents if not', note: 'Even minor issues must be declared. Non-disclosure is treated more seriously than the issue itself.' },
      { key: 'char_hmrc', label: 'HMRC record clean — no outstanding tax issues', note: 'Check your personal tax account annually. Resolve discrepancies immediately.' },
      { key: 'char_nrpf', label: 'No public funds claimed (where visa conditions prohibit)', note: 'If NRPF applies to your route, keep evidence you have not claimed — benefit records can be checked.' },
      { key: 'char_adviser', label: 'Regulated adviser review booked (recommended, 2–3 months before application)', note: 'A single review consultation is a fraction of the cost of a refused application. The Sovereignty Programme includes this.' },
    ],
  },
]

const ALL_ITEMS = CATEGORIES.flatMap(c => c.items)
const TOTAL = ALL_ITEMS.length

export default function ILREvidenceChecklist() {
  const { user } = useApp()
  const uid = user?.supabaseId

  const [checked, setChecked] = useState({})
  const [open, setOpen] = useState({ identity: true, employment: false, residence: false, application: false, character: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    supabase.from('ilr_evidence').select('item_key, checked').eq('user_id', uid)
      .then(({ data }) => {
        if (data) {
          const map = {}
          data.forEach(r => { map[r.item_key] = r.checked })
          setChecked(map)
        }
        setLoading(false)
      })
  }, [uid])

  async function toggleItem(key) {
    if (!uid) return
    const next = !checked[key]
    setChecked(prev => ({ ...prev, [key]: next }))
    await supabase.from('ilr_evidence').upsert({
      user_id: uid,
      item_key: key,
      checked: next,
      checked_date: next ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,item_key' })
  }

  function toggleCategory(id) {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const doneCount = Object.values(checked).filter(Boolean).length
  const pct = Math.round((doneCount / TOTAL) * 100)

  if (loading) return <div style={{ padding: '16px', color: T.muted, fontSize: '13px' }}>Loading checklist…</div>

  return (
    <div>
      {/* Info */}
      <div style={{ background: `#1B2D5B22`, borderLeft: `3px solid #1B2D5B`,
        padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.65 }}>
          <strong style={{ color: T.white }}>Why this exists:</strong> ILR applications fail on evidence gaps more often than on eligibility. Start this file today. Tick items as you secure them. Your future self, at the ILR application, will be working from a complete folder.
        </p>
      </div>

      {/* Progress header */}
      <div style={{ background: '#1B2D5B', borderRadius: '12px', padding: '16px',
        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '36px', fontWeight: '800', color: T.gold, lineHeight: 1, flexShrink: 0 }}>
          {pct}%
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: T.white, marginBottom: '3px' }}>
            Evidence file completeness
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
            {doneCount} of {TOTAL} items secured
          </p>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '10px', background: T.gold,
              width: `${pct}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Warning */}
      <div style={{ background: '#fff0f0', border: '1.5px solid #cc2222', borderRadius: '8px',
        padding: '11px 14px', fontSize: '12px', color: '#8b0000', lineHeight: 1.6, marginBottom: '14px' }}>
        <strong>Golden rule:</strong> keep everything in at least two places — one physical folder and one cloud folder (clearly organised by year). A document you cannot find is a document you do not have.
      </div>

      {/* Categories */}
      {CATEGORIES.map(cat => {
        const catDone = cat.items.filter(item => checked[item.key]).length
        const isOpen = open[cat.id]
        return (
          <div key={cat.id} style={{ background: T.bg3, border: `1px solid ${T.bg4}`,
            borderRadius: '10px', marginBottom: '10px', overflow: 'hidden' }}>
            {/* Category header */}
            <button onClick={() => toggleCategory(cat.id)}
              style={{ width: '100%', padding: '13px 16px', display: 'flex', alignItems: 'center',
                gap: '10px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: isOpen ? `1px solid ${T.bg4}` : 'none', fontFamily: 'inherit' }}>
              <span style={{ fontSize: '16px' }}>{cat.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: T.white, flex: 1, textAlign: 'left' }}>
                {cat.title}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: catDone === cat.items.length ? '#1a6b2e' : T.gold }}>
                {catDone}/{cat.items.length}
              </span>
              <span style={{ fontSize: '11px', color: T.mutedDk, marginLeft: '4px' }}>
                {isOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Items */}
            {isOpen && (
              <div style={{ padding: '10px 14px' }}>
                {cat.items.map(item => {
                  const done = !!checked[item.key]
                  return (
                    <button key={item.key} onClick={() => toggleItem(item.key)}
                      style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '9px 10px', background: done ? '#e6f4ea' : T.bg,
                        border: `1px solid ${done ? '#1a6b2e' : T.bg4}`,
                        borderRadius: '7px', marginBottom: '7px', cursor: 'pointer',
                        fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '5px',
                        border: `1.5px solid ${done ? '#1a6b2e' : T.bg4}`,
                        background: done ? '#1a6b2e' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '1px', transition: 'all 0.15s' }}>
                        {done && <span style={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: done ? '#1a3d1a' : T.white, lineHeight: 1.4 }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: '11px', color: done ? '#2a5c2a' : T.mutedDk, marginTop: '2px', lineHeight: 1.4 }}>
                          {item.note}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
