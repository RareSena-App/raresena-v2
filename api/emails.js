const APP_URL = process.env.VITE_APP_URL || 'https://app.raresena.com'
const ROADMAP_URL = `${APP_URL}/#roadmap`

function wrapper(content) {
  return `
    <div style="background:#111110;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:40px 32px;max-width:520px;margin:0 auto;border-radius:12px;">
      <p style="color:#C9A84C;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">RareSena</p>
      ${content}
      <div style="border-top:1px solid #222;margin-top:32px;padding-top:16px;">
        <p style="color:#444;font-size:12px;margin:0;">RareSena · <a href="mailto:hello@raresena.com" style="color:#444;">hello@raresena.com</a> · <a href="https://raresena.com" style="color:#444;">raresena.com</a></p>
      </div>
    </div>
  `
}

function btn(text, url) {
  return `<a href="${url}" style="background:#C9A84C;color:#111110;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;margin:24px 0;">${text}</a>`
}

function muted(text) {
  return `<p style="color:#aaa;font-size:15px;line-height:1.7;margin:0 0 16px;">${text}</p>`
}

export function brandApprovedEmail({ companyName }) {
  return {
    subject: 'Welcome to Rare Studio — Your application has been approved',
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">You're in, ${companyName} 🎉</h1>
      ${muted('Your brand application has been reviewed and approved by Sena. You now have full access to the Rare Studio brand portal.')}
      ${muted('From your portal you can:')}
      <ul style="color:#aaa;font-size:15px;line-height:1.9;margin:0 0 8px;padding-left:20px;">
        <li>Browse our verified creator directory</li>
        <li>Post campaign briefs</li>
        <li>Review creator applications</li>
        <li>Manage active campaigns</li>
      </ul>
      ${btn('Access your portal →', APP_URL)}
    `),
  }
}

export function brandDeclinedEmail({ companyName }) {
  return {
    subject: 'Your Rare Studio application — an update',
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">Thank you for applying, ${companyName}</h1>
      ${muted("After reviewing your application, we're unable to approve your brand for Rare Studio at this time.")}
      ${muted("This may be due to the current fit with our creator community or campaign type. You're welcome to reapply in 90 days.")}
      ${muted('If you have any questions, feel free to reach out to us directly.')}
      ${btn('Contact us →', 'mailto:hello@raresena.com')}
    `),
  }
}

export function rebuildWelcomeEmail({ name }) {
  return {
    subject: 'Welcome to Rebuild Premium — Your journey starts now',
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">You're in, ${name} 🌿</h1>
      ${muted('Your Rebuild Premium membership is now active. You have full access to everything inside the app.')}
      ${muted('Here\'s what\'s unlocked for you:')}
      <ul style="color:#aaa;font-size:15px;line-height:1.9;margin:0 0 8px;padding-left:20px;">
        <li>Full 5-stage roadmap with all milestones</li>
        <li>Unlimited habit tracker with progress graphs</li>
        <li>Full Rare Circle access — post, reply, connect</li>
        <li>Stage resource library matched to your exact stage</li>
        <li>Stage completion certificate</li>
      </ul>
      ${btn('Open your app →', APP_URL)}
    `),
  }
}

export function habitCheckinEmail({ name }) {
  return {
    subject: 'Your daily habits are waiting — 5 minutes is all it takes',
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">Good morning, ${name}</h1>
      ${muted('Your five core habits are waiting. Each one keeps the architecture of your rebuild standing.')}
      ${muted('It takes five minutes. Open the app, log your habits, and keep the streak alive.')}
      ${btn('Log your habits →', ROADMAP_URL)}
    `),
  }
}

export function streakAlertEmail({ name, streakDays }) {
  return {
    subject: `Your ${streakDays}-day streak is at risk — log today before midnight`,
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">Don't break it, ${name}</h1>
      ${muted(`You have a ${streakDays}-day habit streak. Today's habits haven't been logged yet.`)}
      ${muted('Log before midnight to keep it alive. One log is all it takes.')}
      ${btn('Log your habits now →', ROADMAP_URL)}
    `),
  }
}

export function inactivityNudgeEmail({ name, stageName }) {
  return {
    subject: "It's been a week — your rebuild is waiting",
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">Still here, ${name}</h1>
      ${muted(`You haven't been in the app for a week. Your ${stageName} stage tasks are still here — and so is your rebuild.`)}
      ${muted('You do not have to have everything figured out to come back. You just have to come back.')}
      ${btn('Pick up where you left off →', ROADMAP_URL)}
    `),
  }
}

export function stageCelebrationEmail({ name, stageName }) {
  return {
    subject: `Stage complete — you've finished ${stageName}`,
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">${stageName} complete, ${name} 🏆</h1>
      ${muted(`You have finished every task in the ${stageName} stage. That is not a small thing.`)}
      ${muted('Your certificate is ready to claim in the app. The next stage is now unlocked.')}
      ${btn('Claim your certificate →', ROADMAP_URL)}
    `),
  }
}

export function visaReminderEmail({ name, monthsLeft }) {
  const urgency = monthsLeft <= 1 ? 'in one month — act now' : `in ${monthsLeft} months`
  return {
    subject: `Visa reminder — your expiry date is ${urgency}`,
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">Visa deadline reminder, ${name}</h1>
      ${muted(`Your visa expires in approximately ${monthsLeft} month${monthsLeft === 1 ? '' : 's'}. This is your scheduled reminder.`)}
      ${muted('Log into the app to review your visa task and your next required actions.')}
      ${btn('Review your visa task →', ROADMAP_URL)}
    `),
  }
}

export function creatorWelcomeEmail({ name }) {
  return {
    subject: 'Welcome to Rare Studio — You\'re officially a creator',
    html: wrapper(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">Welcome to Rare Studio, ${name} 🌿</h1>
      ${muted('Your creator membership is now active. You have full access to the Rare Studio creator portal.')}
      ${muted('Here\'s what you can do now:')}
      <ul style="color:#aaa;font-size:15px;line-height:1.9;margin:0 0 8px;padding-left:20px;">
        <li>Complete your creator profile</li>
        <li>Browse brand briefs and apply</li>
        <li>Access creator resources and templates</li>
        <li>Join the Rare Studio Creators community</li>
      </ul>
      ${btn('Go to your portal →', APP_URL)}
    `),
  }
}
