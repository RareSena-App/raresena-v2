import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { brandApprovedEmail } from './emails.js'

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
    // 1. Invite the brand via Supabase Auth — sends them a login email automatically
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: process.env.VITE_APP_URL,
    })

    let userId

    if (inviteError) {
      if (inviteError.message?.toLowerCase().includes('already') || inviteError.status === 422) {
        // User already has an auth account — look up their ID from rebuilders
        const { data: existing } = await supabase
          .from('rebuilders')
          .select('id')
          .eq('email', email)
          .single()
        userId = existing?.id
      } else {
        throw inviteError
      }
    } else {
      userId = inviteData.user.id
    }

    // 2. Create / update their rebuilders row as a brand
    if (userId) {
      await supabase.from('rebuilders').upsert({
        id: userId,
        email,
        name: companyName,
        account_type: 'brand',
        is_premium: false,
        is_creator: false,
        streak: 0,
        join_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    // 3. Mark the enquiry as approved
    await supabase.from('brand_enquiries').update({
      status: 'approved',
      approved_at: new Date().toISOString(),
    }).eq('id', enquiryId)

    // 4. Send welcome email
    const { subject, html } = brandApprovedEmail({ companyName })
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'RareSena <hello@raresena.com>',
      to: email,
      subject,
      html,
    })
    if (emailError) console.error('Email send error:', emailError)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Brand approval error:', err)
    return res.status(500).json({ error: err.message })
  }
}
