// api/notify-stage-complete.js
// Called from the app immediately when a user completes a stage.
// Only sends if the user has stage_celebrations enabled in notification_prefs.

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { stageCelebrationEmail } from './emails.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'RareSena <hello@raresena.com>'

const STAGE_NAMES = { 1: 'Reset', 2: 'Rediscover', 3: 'Routine', 4: 'Rise', 5: 'Realize' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { user_id, stage_number } = req.body || {}
  if (!user_id || !stage_number) return res.status(400).json({ error: 'Missing user_id or stage_number' })

  // Check notification preference
  const { data: prefs } = await supabase
    .from('notification_prefs')
    .select('stage_celebrations')
    .eq('user_id', user_id)
    .single()

  if (!prefs?.stage_celebrations) return res.json({ sent: false, reason: 'opt_out' })

  // Get user email + name
  const { data: user } = await supabase
    .from('rebuilders')
    .select('email, name')
    .eq('user_id', user_id)
    .single()

  if (!user?.email) return res.json({ sent: false, reason: 'no_email' })

  const stageName = STAGE_NAMES[stage_number] || `Stage ${stage_number}`

  await resend.emails.send({
    from: FROM,
    to: user.email,
    ...stageCelebrationEmail({ name: user.name || 'there', stageName }),
  })

  return res.json({ sent: true })
}
