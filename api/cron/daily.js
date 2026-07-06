// api/cron/daily.js — Vercel cron job, runs daily at 08:00 UTC
// Handles: habit check-ins, inactivity nudges, visa reminders
// Secured by CRON_SECRET env var (Vercel sets Authorization header automatically)

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import {
  habitCheckinEmail,
  inactivityNudgeEmail,
  visaReminderEmail,
} from '../emails.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'RareSena <hello@raresena.com>'

const STAGE_NAMES = { 1: 'Reset', 2: 'Rediscover', 3: 'Routine', 4: 'Rise', 5: 'Realize' }

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let sent = 0

  // ── 1. Fetch all notification preferences ────────────────────────────────
  const { data: allPrefs } = await supabase
    .from('notification_prefs')
    .select('user_id, habit_checkins, inactivity_nudges, visa_reminders')

  if (!allPrefs?.length) return res.json({ sent: 0 })

  const userIds = allPrefs.map(p => p.user_id)

  // ── 2. Fetch rebuilder profiles for those users ──────────────────────────
  const { data: rebuilders } = await supabase
    .from('rebuilders')
    .select('user_id, email, name, stage')
    .in('user_id', userIds)
    .not('email', 'is', null)

  const rebuilderMap = Object.fromEntries((rebuilders || []).map(r => [r.user_id, r]))

  // ── 3. Fetch last task completion per user (for inactivity) ─────────────
  const { data: lastCompletions } = await supabase
    .from('task_completions')
    .select('user_id, completed_at')
    .in('user_id', userIds)
    .eq('is_complete', true)
    .order('completed_at', { ascending: false })

  // Keep only the most recent completion per user
  const lastActivityMap = {}
  for (const c of (lastCompletions || [])) {
    if (!lastActivityMap[c.user_id]) lastActivityMap[c.user_id] = new Date(c.completed_at)
  }

  // ── 4. Fetch task 1.1 completions for visa expiry ────────────────────────
  const { data: visaCompletions } = await supabase
    .from('task_completions')
    .select('user_id, prompt_response')
    .in('user_id', userIds)
    .eq('stage_number', 1)
    .eq('task_number', 1)
    .eq('is_complete', true)

  const visaMap = Object.fromEntries((visaCompletions || []).map(c => [c.user_id, c.prompt_response]))

  // ── 5. Process each user ─────────────────────────────────────────────────
  for (const prefs of allPrefs) {
    const user = rebuilderMap[prefs.user_id]
    if (!user?.email) continue

    const name = user.name || 'there'
    const stageName = STAGE_NAMES[user.stage] || 'Reset'

    // Habit check-ins — send every day
    if (prefs.habit_checkins) {
      try {
        await resend.emails.send({ from: FROM, to: user.email, ...habitCheckinEmail({ name }) })
        sent++
      } catch (e) { console.error('habit_checkin error', user.user_id, e.message) }
    }

    // Inactivity nudges — send at 7, 14, 30 days of no activity
    if (prefs.inactivity_nudges) {
      const lastActive = lastActivityMap[prefs.user_id]
      if (lastActive) {
        const daysSince = Math.floor((today - lastActive) / 86400000)
        if (daysSince === 7 || daysSince === 14 || daysSince === 30) {
          try {
            await resend.emails.send({ from: FROM, to: user.email, ...inactivityNudgeEmail({ name, stageName }) })
            sent++
          } catch (e) { console.error('inactivity error', user.user_id, e.message) }
        }
      }
    }

    // Visa reminders — send at ~6, ~3, ~1 month before expiry
    if (prefs.visa_reminders) {
      const response = visaMap[prefs.user_id]
      if (response) {
        let parsed = response
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed) } catch { parsed = null }
        }
        if (parsed?.visa_expiry) {
          const expiry = new Date(parsed.visa_expiry)
          const daysUntil = Math.floor((expiry - today) / 86400000)
          // Fire on the day closest to 180, 90, or 30 days before (±1 day window)
          if ([180, 90, 30].some(d => Math.abs(daysUntil - d) <= 1)) {
            const monthsLeft = Math.round(daysUntil / 30)
            try {
              await resend.emails.send({ from: FROM, to: user.email, ...visaReminderEmail({ name, monthsLeft }) })
              sent++
            } catch (e) { console.error('visa_reminder error', user.user_id, e.message) }
          }
        }
      }
    }
  }

  return res.json({ sent, processed: allPrefs.length })
}
