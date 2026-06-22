import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { brandDeclinedEmail } from './emails.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { enquiryId, email, companyName } = req.body

  if (!enquiryId || !email || !companyName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // 1. Mark enquiry as declined
    await supabase.from('brand_enquiries').update({
      status: 'declined',
    }).eq('id', enquiryId)

    // 2. Send decline email
    const { subject, html } = brandDeclinedEmail({ companyName })
    await resend.emails.send({
      from: 'RareSena <hello@raresena.com>',
      to: email,
      subject,
      html,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Brand decline error:', err)
    return res.status(500).json({ error: err.message })
  }
}
