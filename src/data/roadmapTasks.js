// src/data/roadmapTasks.js
// Full task content for all 5 stages × 5 tasks = 25 tasks
// whatToDo can be an array (same for all tracks) or an object keyed by track ID (A-H)
// completionPrompt types: 'text_response' | 'field_entry' | 'checklist' | 'reflection' | 'upload_link'

export const VISA_TRACKS = [
  { id: 'A', label: 'Skilled Worker', desc: 'Employer-sponsored work visa (Tier 2 / Skilled Worker)' },
  { id: 'B', label: 'International Student', desc: 'Student visa — studying at a UK institution' },
  { id: 'C', label: 'Family / Spouse', desc: 'Joining a partner or family member in the UK' },
  { id: 'D', label: 'BN(O) — Hong Konger', desc: 'British National (Overseas) 5-year route to settlement' },
  { id: 'E', label: 'Refugee / Asylum Seeker', desc: 'Granted refugee status or currently awaiting decision' },
  { id: 'F', label: 'Global Talent', desc: 'Endorsed by a recognised UK body in your field' },
  { id: 'G', label: 'Innovator Founder', desc: 'Building a business endorsed by a UK endorsing body' },
  { id: 'H', label: 'Self-Sponsored (own company)', desc: 'Skilled Worker visa via your own sponsor licence' },
]

export const STAGE_META = {
  1: {
    title: 'RESET',
    tagline: 'Before anything can grow, the ground must be secure.',
    timeline: 'Days 1–90',
    do: 'Open a bank account. Register with a GP. Locate every immigration deadline. Secure shelter. Establish one daily stabilising habit. Connect with one person who understands this journey.',
    feel: 'Acknowledge that disorientation is not failure. Reduce shame around starting over. Give yourself permission to not have everything figured out.',
    know: 'Your specific visa conditions. The banking/address catch-22 and how to break it. Where emergency help is. That UK credit history starts from zero and takes 6–12 months to build.',
  },
  2: {
    title: 'REDISCOVER',
    tagline: 'The crisis has passed. Now: who are you here?',
    timeline: 'Months 1–6',
    do: 'Inventory your skills. Map your professional identity to the UK. Name one cultural anchor. Find your community. Define what sovereignty means to you.',
    feel: 'Process identity loss and the grief of starting over. Rebuild self-worth separate from your former title. Begin to feel belonging. Counter isolation actively.',
    know: 'How UK qualification recognition works. How UK CV conventions differ. That underemployment is widespread and not a personal failing. Where culturally competent mental health support exists.',
  },
  3: {
    title: 'ROUTINE',
    tagline: 'You know what you want. Now build the daily architecture.',
    timeline: 'Months 3–12',
    do: 'Design a sustainable morning routine. Identify your 5 core daily habits. Build a weekly review practice. Complete 30 consecutive days without breaking your streak. Create a basic financial tracking system.',
    feel: 'Regain a sense of control and predictability. Reduce Home Office anxiety through systems. Develop early belonging through routine and place.',
    know: 'Tenant rights and how to challenge discrimination. How to read your credit report. Employment rights in the UK. For tied-visa holders: the 60-day rule and where to get urgent help.',
  },
  4: {
    title: 'RISE',
    tagline: 'The foundation holds. Apply structure to deliberate growth.',
    timeline: 'Months 6–24',
    do: 'Define your 90-day direction. Identify and start your primary income stream. Build your professional network in the UK. Begin the Sovereignty Programme assessment. Complete one project that demonstrates your direction.',
    feel: 'Rebuild professional confidence and ambition. Counter the prove-myself-twice fatigue. Experience belonging through meaningful work.',
    know: 'Sector entry routes and shortage areas. How to leverage charity employment programmes. How to evidence skills employers do not immediately recognise. The personal and economic value of skill-matching.',
  },
  5: {
    title: 'REALIZE',
    tagline: 'You are not surviving. You are living — on your own terms.',
    timeline: 'Years 2–5+',
    do: 'Document your full rebuild journey. Build one income stream that works without you. Mentor one person in an earlier stage. Complete your sovereignty plan. Define and begin giving back.',
    feel: 'Security, belonging, agency, and a future orientation. Integration of old and new identity into a coherent self.',
    know: 'The ILR/settlement pathway and which route applies to you. Steps from ILR to citizenship. Long-term financial planning principles. That rules change and require active monitoring.',
  },
}

export const ROADMAP_TASKS = {
  // ═══════════════════════════════════════
  // STAGE 1 — RESET
  // ═══════════════════════════════════════
  '1.1': {
    stage: 1,
    taskNumber: 1,
    title: 'Understand your visa options and deadlines',
    estimatedTime: '15–25 min',
    whyThisMatters: 'Your visa expiry date is not a suggestion — it is the thing that can undo everything you are building here. The system does not send you reminders. It does not care if you were busy, overwhelmed, or simply unaware. Most immigrants who miss critical immigration deadlines do not miss them because they were careless. They miss them because nobody told them to look on day one.\n\nThis task changes that. You are going to find every date, every condition, and every next action that applies to your specific visa — right now, before anything else gets in the way.',
    whatToDo: {
      A: [
        'Go to gov.uk/view-prove-immigration-status and log into your UKVI online account. Screenshot your eVisa status page and save it.',
        'Note your visa expiry date. Calculate your 60-day window: if your employer\'s sponsor licence were revoked today, you would have 60 days to find new sponsorship or leave. Know this number.',
        'Check your visa conditions: right to work, restrictions on job type or employer, whether NRPF applies. Write these down.',
        'Set four calendar reminders: 6 months before expiry (start renewal research), 3 months before (submit application), 1 month before (urgent action), 2 weeks before (final check).',
        'Find your employer\'s HR contact name and save it. In a Skilled Worker emergency, they are your first call.',
      ],
      B: [
        'Log into your UKVI online account. Find your Student visa expiry date. Screenshot it.',
        'Locate your CAS number from your offer letter or student portal. Keep it with your visa documents.',
        'Write your work limit clearly: 20 hours per week maximum during term time. Full-time in official vacation only. A single breach can cause visa curtailment — there is no warning system.',
        'Find your institution\'s International Student Support office contact and save it now.',
        'Set reminders: 6 months before visa expiry, 3 months before (submit extension or Graduate Route application), and at every new term start.',
      ],
      C: [
        'Log into your UKVI online account. Note your visa expiry date and your sponsor\'s (partner\'s) visa status — your visa is linked to theirs.',
        'Check your right to work conditions on your eVisa. Family visa holders typically have the right to work, but confirm this is stated.',
        'Confirm whether NRPF applies. If it does, you cannot access most benefits even in hardship. Note this clearly.',
        'If your relationship is under strain or you are unsafe: the Domestic Abuse destitution concession is a specific immigration route that does not require your sponsor\'s cooperation. Citizens Advice (0800 144 8848) or Rights of Women (020 7251 6577) can advise confidentially.',
        'Set reminders at 6 months, 3 months, and 1 month before visa expiry. Also note when you become eligible for ILR — typically 5 years after entry.',
      ],
      D: [
        'Activate your eVisa at gov.uk/view-prove-immigration-status immediately if not done. Your BRP is transitional only — do not rely on it for right-to-rent or right-to-work checks.',
        'Confirm your eVisa is linked to the correct passport. If you renew your passport, update the linkage in your UKVI account before any travel. Failure causes "no-board" errors at airports.',
        'Note your 5-year settlement date and the 180-day absence rule: you cannot spend more than 180 days outside the UK in any 12-month period during the 5-year qualifying period.',
        'Confirm all family members — including children — have activated their own eVisas linked to the correct passports. Each family member needs a separate UKVI account.',
        'Set reminders: 6 months before settlement date (ILR preparation), and immediately on any passport renewal.',
      ],
      E: [
        'If awaiting a decision: locate your ARC card. If lost, report to the Home Office via Migrant Help: 0808 8010 503 (free, 24/7).',
        'If just granted status: contact Migrant Help on the day of your grant letter. Within 7 days: contact local council housing, apply for Universal Credit, open a bank account using your BRP or eVisa, register with a GP.',
        'Note your BRP expiry date or activate your eVisa. Your status is tied to this document — keep it safe.',
        'If you have an active appeal: contact a regulated immigration adviser. Free legal aid is available for some asylum appeals. The Refugee Council (refugeecouncil.org.uk) can help find accredited support at no cost.',
      ],
      F: [
        'Log into your UKVI online account at gov.uk/view-prove-immigration-status. Note your visa expiry date and the length of your current grant (up to 5 years at a time, renewable). Take a screenshot and save it.',
        'Confirm your endorsing body and find your endorsement letter. Your endorsing body does not manage your ongoing visa, but knowing who endorsed you matters if you ever need to switch fields, extend, or apply for ILR.',
        'Note your ILR eligibility date. Global Talent visa holders can apply for ILR after 3 years (if endorsed as Exceptional Talent) or 5 years (if endorsed as Exceptional Promise). Calculate your date now.',
        'Understand your absence rule: you cannot spend more than 180 days outside the UK in any consecutive 12-month period during the qualifying period for ILR. Every trip matters. Start logging your travel dates now.',
        'Note the renewal process: your endorsing body is not involved in the renewal — it is handled directly with the Home Office. Set a reminder 6 months before your visa expiry date to begin the renewal process.',
        'Confirm whether your current work aligns with your endorsed field. You have freedom to work in any capacity — employment, self-employment, and running your own business. Maintaining credibility in your endorsed field is relevant if your endorsing body is ever asked to verify your status.',
      ],
      G: [
        'Log into your UKVI online account and note your visa expiry date. Your Innovator Founder visa is granted for 3 years. Take a screenshot of your eVisa and save it somewhere permanent.',
        'Locate your endorsement letter and the name of your endorsing body. Your ongoing relationship with this body is a legal requirement — not optional, not advisory. They will contact you for mandatory checkpoint meetings.',
        'Note your two mandatory contact point meetings: one at 12 months and one at 24 months after your visa grant. You pay £500 per meeting directly to your endorsing body. Missing them without explanation is a compliance failure that can affect your extension and ILR eligibility.',
        'Understand the ILR milestones you must meet after 3 years. The Home Office requires at least two of: £50,000 invested in and actively spent on your business; at least 2 UK full-time equivalent jobs paying minimum wage for at least 12 months; annual revenue of at least £1 million; a third-party contract active for at least 6 months.',
        'Confirm your endorsement can be withdrawn: if your endorsing body determines you are not progressing your business as required, they can withdraw your endorsement. This curtails your visa, giving you 60 days to find new endorsement or switch to another visa route.',
        'Set calendar reminders: 12-month contact point, 24-month contact point, 6 months before visa expiry (ILR application preparation or extension).',
      ],
      H: [
        'Log into your UKVI online account and note your visa expiry date. Also confirm your visa is linked to the correct passport — passport changes require updating the linkage. Take a screenshot and save it.',
        'Locate your Certificate of Sponsorship (CoS) reference number and your company\'s sponsor licence number. These are your two most important compliance documents. Keep them filed and accessible.',
        'Confirm your salary compliance: as of July 2025, the minimum salary threshold is £41,700 per year (or the going rate for your SOC code, whichever is higher), and your role must be at RQF Level 6 or above.',
        'Understand your sponsor licence compliance obligations: your company must report changes to the Home Office within 20 working days (salary changes, role changes, company address changes). If the licence is revoked, you have 60 days to find another sponsor or leave the UK.',
        'Confirm your role genuineness: your SOC code must accurately reflect your actual duties. If an audit finds a mismatch, the Home Office can curtail your visa. Review your CoS role description against what you are actually doing.',
        'Set reminders: salary changes (within 10 working days), company address changes (within 20 working days), 6 months before visa expiry (extension application), 5-year mark (ILR eligibility).',
      ],
    },
    resources: [
      { type: 'guide', title: 'Task 1.1 — Visa deadlines guide (Tracks A–E: Skilled Worker, Student, Family, BN(O), Refugee)', guideFile: 'Stages/STAGE 1/RareSena_Task1.1_Tracks_AE_All_Standard_Visas_2.html' },
      { type: 'guide', title: 'Task 1.1 — Visa deadlines guide (Tracks F, G, H: Global Talent, Innovator, Self-Sponsored)', guideFile: 'Stages/STAGE 1/RareSena_Task1.1_Tracks_FGH_Global_Talent_Innovator_SelfSponsor.html' },
      { type: 'guide', title: 'How to read your eVisa and find every key date', guideFile: 'Stages/STAGE 1/RareSena_Guide_Reading_Your_eVisa_Key_Dates.html' },
      { type: 'guide', title: 'How to create your UKVI account step-by-step', guideFile: 'Stages/STAGE 1/RareSena_Guide_Create_UKVI_Account_StepByStep.html' },
      { type: 'guide', title: 'Visa & ILR Countdown Tracker (interactive tool)', guideFile: 'Stages/files/RareSena_Tool_Visa_ILR_Countdown_Tracker.html' },
    ],
    whatToExpectToFeel: {
      A: 'Reading through visa conditions can trigger a specific anxiety — the feeling that your entire life here rests on a document. That feeling is real and reasonable. The system was designed to be managed, not to be kind. What this task does is move you from passive anxiety to active knowledge. Knowing your dates does not remove the pressure — but it removes the thing that makes pressure dangerous: not knowing.',
      B: 'Reading through visa conditions can trigger a specific anxiety — the feeling that your entire life here rests on a document. That feeling is real and reasonable. The system was designed to be managed, not to be kind. What this task does is move you from passive anxiety to active knowledge. Knowing your dates does not remove the pressure — but it removes the thing that makes pressure dangerous: not knowing.',
      C: 'Reading through visa conditions can trigger a specific anxiety — the feeling that your entire life here rests on a document. That feeling is real and reasonable. The system was designed to be managed, not to be kind. What this task does is move you from passive anxiety to active knowledge. Knowing your dates does not remove the pressure — but it removes the thing that makes pressure dangerous: not knowing.',
      D: 'Reading through visa conditions can trigger a specific anxiety — the feeling that your entire life here rests on a document. That feeling is real and reasonable. The system was designed to be managed, not to be kind. What this task does is move you from passive anxiety to active knowledge. Knowing your dates does not remove the pressure — but it removes the thing that makes pressure dangerous: not knowing.',
      E: 'Reading through visa conditions can trigger a specific anxiety — the feeling that your entire life here rests on a document. That feeling is real and reasonable. The system was designed to be managed, not to be kind. What this task does is move you from passive anxiety to active knowledge. Knowing your dates does not remove the pressure — but it removes the thing that makes pressure dangerous: not knowing.',
      F: 'The business and talent immigration routes were sold to you — rightly — as freedom routes. No employer tie. Control over your own future. And that is true. But freedom comes with compliance obligations that nobody fully explains until something goes wrong. Reading through conditions, milestones, and monitoring requirements can feel like the system is watching you. It is. That is the deal. Knowing the deal in detail is not paranoia — it is how you protect everything you are building.',
      G: 'The business and talent immigration routes were sold to you — rightly — as freedom routes. No employer tie. Control over your own future. And that is true. But freedom comes with compliance obligations that nobody fully explains until something goes wrong. Reading through conditions, milestones, and monitoring requirements can feel like the system is watching you. It is. That is the deal. Knowing the deal in detail is not paranoia — it is how you protect everything you are building.',
      H: 'The business and talent immigration routes were sold to you — rightly — as freedom routes. No employer tie. Control over your own future. And that is true. But freedom comes with compliance obligations that nobody fully explains until something goes wrong. Reading through conditions, milestones, and monitoring requirements can feel like the system is watching you. It is. That is the deal. Knowing the deal in detail is not paranoia — it is how you protect everything you are building.',
    },
    trackAlert: {
      E: 'Track E — time-sensitive: If you have just received a positive asylum decision, your move-on clock starts now. You have approximately 28 days before asylum support ends. Contact Migrant Help (0808 8010 503) today.',
    },
    trackIntro: {
      F: 'Global Talent visa — you have been endorsed by one of six designated bodies (Royal Society, Royal Academy of Engineering, British Academy, UKRI, Arts Council England, or Tech Nation) as an exceptional talent or exceptional promise in your field. You have no employer tie and significant flexibility — but your compliance obligations are different from what most people expect.',
      G: 'Innovator Founder visa — you have been endorsed by an approved endorsing body (as at April 2026: UK Endorsing Services, Innovator International, Envestors Limited, or the Global Entrepreneurs Programme) to establish an innovative, viable, and scalable UK business. Your visa is for 3 years with a route to ILR. But your endorsing body is actively monitoring your progress — and that changes everything about how you manage this visa.',
      H: 'Self-Sponsored Skilled Worker (own limited company) — you have incorporated a UK limited company, obtained a Skilled Worker sponsor licence for that company, assigned yourself a Certificate of Sponsorship (CoS), and applied for a Skilled Worker visa. You are both the employer and the employee. This is legal, growing in popularity, and scrutinised heavily by the Home Office. Your compliance obligations are significant.',
    },
    trackWarning: {
      F: 'Digital Technology track note (August 2025 change): From 4 August 2025, the Tech Nation application form was permanently withdrawn. New applications for the digital technology pathway now use the single GOV.UK Stage 1 form only. If you are on the digital technology track, confirm your eVisa is correctly linked to your UKVI account and that your endorsement records are filed.',
      G: 'Supplementary employment is permitted — up to 20 hours per week in a job outside your endorsed business, provided that job does not become your primary activity. Your endorsed business must always be your primary professional focus. If the Home Office or your endorsing body determines that your business has become secondary, your endorsement is at risk.',
      H: 'The 60-day rule applies to you too: If your sponsor licence is revoked — for any reason including non-compliance, company insolvency, or Home Office audit failure — your visa is curtailed and you have 60 days to either obtain a new sponsor or switch to another immigration route. Unlike a traditional Skilled Worker where the employer carries this risk, you carry it directly as both employer and employee. This is the most important risk to manage.',
    },
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Enter your visa expiry date and the single most important action you must take before that date.',
      fields: [
        { key: 'visa_expiry', label: 'Visa expiry date', inputType: 'date', required: true },
        { key: 'next_action', label: 'Your most important action before that date', inputType: 'text', required: true, placeholder: 'e.g. Apply for extension, find new sponsor...' },
      ],
    },
  },

  '1.2': {
    stage: 1,
    taskNumber: 2,
    title: 'Identify your most pressing financial gap and one way to close it',
    estimatedTime: '20–30 min',
    whyThisMatters: 'Financial instability is the number one reason immigrants cannot focus on rebuilding. Not because they are bad with money — but because they are navigating a system that was not built for them, with no credit history, often no recourse to public funds, and sometimes no certainty about what they are even entitled to claim.\n\nUntil you know exactly where the gap is, you cannot close it. You cannot plan around something you have not named. This task forces clarity before action — because vague financial anxiety is far more paralysing than a specific number on a page. Name the number. Then name one action.',
    whatToDo: [
      'Use the budget builder below to list every income source you currently have — employment, partner contribution, savings drawdown, any benefits you are eligible for. Include everything, even irregular or uncertain amounts. Estimate where you have to.',
      'List every essential monthly expense honestly. Rent, bills, food, transport, phone, childcare, any debt repayments. Do not leave things out because they feel embarrassing. The builder cannot help you if the numbers are not real.',
      'Look at the gap or surplus the builder calculates. Then identify the single most precarious item — the one thing that, if it changed or disappeared tomorrow, would most destabilise your situation right now.',
      'Name one specific action you will take this week to address it. Not a plan — one action. "I will open a Monzo account on Thursday." "I will call Citizens Advice on Monday about what I am entitled to on my visa." One thing. This week.',
    ],
    trackNotes: {
      A: 'If your employer pays you below the going rate for your occupation code, this may already be a compliance issue — not just a financial one. Check your CoS against your actual payslip.',
      B: 'Your income ceiling during term time is fixed by the 20-hour weekly work cap. Factor this into your calculations — you cannot simply work more to close a gap during term.',
      C: 'If No Recourse to Public Funds (NRPF) applies to your visa, you cannot access most benefits even in serious hardship. Note this as a hard constraint — it changes what your safety net options are.',
      D: 'You are entitled to access public funds and benefits on the same basis as a UK resident once you have settled status. If you have pre-settled status, some restrictions still apply — check your eVisa conditions.',
      E: 'If awaiting a decision, asylum support is £49.18 per week (£7.02 per day). If you have just been granted status, note the exact date your asylum support ends — this is your financial cliff edge. Your Universal Credit application must be submitted before that date, not after.',
      F: 'No employer tie and significant income flexibility — but no recourse to public funds typically applies. Your income calculation must account for any consultancy, self-employment, or employment income across all sources.',
      G: 'Your business may not yet be generating revenue. Calculate your personal runway — how many months of personal expenses can you cover from existing funds while the business is pre-revenue? This is your most critical financial number right now.',
      H: 'Your company must pay you the minimum salary threshold (£41,700 as of July 2025) to maintain compliance. If the company cannot yet sustain this, you have a compliance risk as well as a financial one. These are linked.',
    },
    resources: [
      { type: 'guide', title: 'Basic Budget Builder — income vs expenses for UK new arrivals', guideFile: 'Stages/STAGE 1/RareSena_Task1.2_Financial_Gap_Budget_Builder.html' },
      { type: 'guide', title: 'Breaking the banking catch-22: how to open a UK account with no credit history', guideFile: 'Stages/STAGE 1/RareSena_Guide_Banking_Catchup22_UK.html' },
      { type: 'guide', title: 'Building UK credit from zero: the 6-step sequence', guideFile: 'Stages/STAGE 1/RareSena_Guide_UK_Credit_Building_6_Steps.html' },
    ],
    whatToExpectToFeel: 'Writing down numbers that feel frightening makes them more frightening for about five minutes — and then something shifts. The anxiety moves from diffuse to specific. A specific problem is something you can act on. Vague financial dread is not. If the numbers look very difficult right now, that is real information — not a verdict on you, and not a permanent state. It tells you exactly where the work needs to start. That is more useful than not knowing.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'What is your most pressing financial gap right now, and what is the one action you are taking this week to address it?',
      minChars: 30,
    },
  },

  '1.3': {
    stage: 1,
    taskNumber: 3,
    title: 'Secure stable housing',
    estimatedTime: '20–35 min',
    whyThisMatters: 'Without stable housing, rebuilding is not possible. Everything else — your mental health, your ability to show up consistently, your job search, your capacity to think clearly about the future — depends on knowing where you will sleep tonight and next month.\n\nThe UK private rental market is one of the hardest to access as a new arrival. No UK credit history. No references. Often no guarantor. A Right to Rent regime that is documented to produce race-based discrimination. And landlords who can legally — and frequently do — demand deposits and advance rent that most new arrivals simply do not have.\n\nThis task is about knowing exactly where you stand and what your rights are — before you sign anything, before you hand over any money, and before someone takes advantage of the fact that you do not yet know the system.',
    whatToDo: [
      'Clarify your current housing status honestly: are you in your own tenancy? Staying with family or friends? In Home Office or NASS accommodation? In a temporary or unstable situation? Name it. You cannot address something you have not acknowledged.',
      'If you are renting: locate your tenancy agreement and note three things — the tenancy start date, your monthly rent amount, and your deposit amount. If you have not received a written tenancy agreement, this is itself a problem — your landlord has a legal obligation to provide one.',
      'If you paid a deposit: confirm it is protected in one of the three government-approved schemes — DPS (depositprotection.com), MyDeposits (mydeposits.co.uk), or TDS (tenancydepositscheme.com). Your landlord was legally required to protect it within 30 days of receipt. If they did not, you may be entitled to compensation of up to 3x the deposit amount.',
      'Understand Right to Rent: your landlord has a legal obligation to check your right to rent before you move in. Your eVisa or BRP satisfies this check. If a landlord refuses to rent to you based on your nationality rather than your actual immigration status, this is discrimination under the Equality Act 2010.',
      'If your housing is unstable, unsafe, or at immediate risk: contact Shelter now — their free helpline is 0808 800 4444. Do not wait until you are homeless. Early contact gives you options that emergency contact does not.',
    ],
    trackNotes: {
      E: 'If you are in NASS or Home Office accommodation and have just received a positive decision, your 28-day move-on clock started on the date of your grant letter. Contact your local council housing team and Migrant Help (0808 8010 503) on the same day. Do not wait for a second letter — the 28 days is not flexible.',
      C: 'If your living situation is unsafe or controlled, the MARAC route and specialist domestic abuse housing support exist for your situation. Southall Black Sisters (020 8571 9595) and Women\'s Aid (0808 2000 247) have specific experience with immigration-related housing situations.',
      G: 'If your business address and home address are the same, ensure your Companies House registered address is compliant and that you understand how this affects your right-to-rent documentation for any future moves.',
      H: 'If your business address and home address are the same, ensure your Companies House registered address is compliant and that you understand how this affects your right-to-rent documentation for any future moves.',
    },
    trackAlert: {
      E: 'Track E — urgent if you have just received your grant letter: Your 28-day move-on period has started. Today\'s actions: (1) Contact Migrant Help: 0808 8010 503. (2) Contact your local council housing team and tell them you have just been granted refugee status and need housing advice. (3) Apply for Universal Credit — you are now eligible and the application takes time to process. Do all three today, not tomorrow.',
    },
    keyRights: [
      'Your deposit must be protected in a government-approved scheme (DPS, MyDeposits, or TDS) within 30 days of payment — failure entitles you to up to 3× the deposit in compensation.',
      'You must receive a written copy of your tenancy agreement — this is a legal requirement.',
      'Discrimination based on nationality (not actual right to rent status) is illegal under the Equality Act 2010 and can be reported to the Equality and Human Rights Commission.',
      '"No fault" Section 21 evictions are being abolished under the Renters\' Rights Act — ask your landlord which tenancy type applies.',
      'Landlords cannot demand more than one month\'s rent in advance under the Renters\' Rights Act.',
      'Overcrowded or hazardous properties (damp, mould, no heating) can be reported to your local council\'s housing enforcement team.',
      'If your landlord enters without 24 hours\' written notice, this is a breach of your right to "quiet enjoyment" and can be reported.',
      'You may be entitled to a rent repayment order if your landlord has committed certain offences, including failure to protect your deposit.',
    ],
    resources: [
      { type: 'guide', title: 'Task 1.3 — Secure stable housing: full guide with rights and track notes', guideFile: 'Stages/STAGE 1/RareSena_Task1.3_Secure_Stable_Housing.html' },
      { type: 'guide', title: 'Renting in the UK as a new arrival: your rights and how to use them', guideFile: 'Stages/files2/RareSena_Guide_Renting_UK_New_Arrival_Rights.html' },
      { type: 'guide', title: 'How to check if your deposit is protected', guideFile: 'Stages/files2/RareSena_Guide_Deposit_Protection_Check.html' },
      { type: 'contacts', title: 'Emergency housing contacts: Shelter helpline, local council, Refugee Council' },
    ],
    whatToExpectToFeel: 'Housing in the UK as a new arrival involves navigating a market that was not designed to include you easily — and research confirms this is structural, not personal. The discrimination documented in this market is real. If you have experienced it, that is not a reflection of your worth, your capability, or your future here. It is a documented system problem. Knowing your rights does not solve everything — but it changes the power dynamic in every conversation with a landlord or letting agent. You are not asking for a favour. You are exercising rights.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Enter your current housing status and your tenancy or accommodation review date.',
      fields: [
        { key: 'housing_status', label: 'Current housing status', inputType: 'text', required: true, placeholder: 'e.g. Renting privately, temporary accommodation, own home...' },
        { key: 'review_date', label: 'Tenancy end date or next housing action date', inputType: 'text', required: true, placeholder: 'e.g. 31 March 2026, or "finding permanent accommodation by June"' },
      ],
    },
  },

  '1.4': {
    stage: 1,
    taskNumber: 4,
    title: 'Build your first daily anchor habit',
    estimatedTime: '10–15 min',
    whyThisMatters: 'Chaos is the default state of arrival. When everything is unfamiliar — the streets, the systems, the faces, the rules, the rhythms — the mind cannot rest because it has no ground beneath it. There is nowhere to return to at the end of each day that feels predictable.\n\nA single daily habit, done at the same time, in the same way, creates one point of certainty in an otherwise uncertain day. It anchors you to yourself when the outside world gives you no anchor. It does not need to be productive in any measurable sense. It does not need to impress anyone. It needs to be yours, and it needs to happen every day.\n\nThe habit you set here is the foundation for Stage 3, where you will build a full daily architecture. But a full architecture cannot be built yet. Right now, one habit is enough — and one habit done consistently is worth more than five abandoned after a week.',
    whatToDo: [
      'Choose one habit from the options below — or define your own. One. Not two. Not a morning routine. One thing.',
      'Attach it to something you already do — this is called habit stacking and it is the most effective way to make a new habit stick. "After I make my morning coffee" or "After I brush my teeth at night" or "When I sit down at my desk." Attach the new habit to an existing one.',
      'Set the time you will do it — every day, at that time. This is what you will enter in the completion prompt below, and it is what seeds your daily push notification in the app.',
      'Commit to 7 consecutive days before you evaluate whether the habit is right for you. Do not change it after day 2 because it feels too small. Small is the point. Consistency is the point. The streak tracker below starts counting from today.',
    ],
    streakMilestones: [
      { days: 7, label: 'One week — the habit is becoming real' },
      { days: 14, label: 'Two weeks — you are no longer deciding whether to do it' },
      { days: 21, label: 'Three weeks — this is who you are becoming' },
      { days: 30, label: 'One month — Task 3.4 in Stage 3 auto-completes at this milestone' },
    ],
    resources: [
      { type: 'guide', title: 'Task 1.4 — Daily anchor habit and streak tracker guide', guideFile: 'Stages/STAGE 1/RareSena_Task1.4_Daily_Anchor_Habit_Streak_Tracker.html' },
      { type: 'tracker', title: 'In-app streak tracker — current streak, best streak, last logged date' },
    ],
    whatToExpectToFeel: 'The urge to pick something ambitious is strong right now — something that signals to yourself that you are serious, that you are moving, that you are not falling behind. Resist it. A 30-minute workout you do twice is worth less than a 5-minute walk you do every single day for 90 days. The value of this task is not the habit you pick. It is the act of deciding and then keeping your decision. That is the muscle you are actually building — and it is the muscle every other stage of the rebuild runs on.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Name your daily anchor habit and the time you will do it each day.',
      fields: [
        { key: 'habit_name', label: 'Your daily anchor habit', inputType: 'text', required: true, placeholder: 'e.g. Morning journal, 10-min walk, one task before 10am...' },
        { key: 'habit_time', label: 'Time you will do it each day', inputType: 'text', required: true, placeholder: 'e.g. 7:30am, After morning coffee' },
      ],
    },
  },

  '1.5': {
    stage: 1,
    taskNumber: 5,
    title: 'Connect with one person who understands this journey',
    estimatedTime: '15–20 min',
    whyThisMatters: 'Loneliness in the first weeks after arrival is near-universal among new immigrants to the UK — and the research on what happens next is unambiguous. Loneliness predicts worse mental health outcomes, higher rates of anxiety and depression, and significantly slower integration over the following two years. Not might predict. Does predict.\n\nThis is not about having a social life. It is not about being an extrovert. It is about having one person who does not require you to explain yourself — who already knows, at some level, the specific weight of starting over in a country that did not design its systems for you. That kind of connection is not a comfort. It is infrastructure.\n\nYou do not need many. You need one. And you need to make contact this week — not when you feel ready, because waiting until you feel ready is how another month passes in isolation.',
    whatToDo: [
      'Think honestly: does this person already exist in your life? A friend from home who is also in the UK. A colleague who has been through something similar. Someone you met in your community of faith, your neighbourhood, or a diaspora space. If yes, reach out to them today. "I\'ve been thinking of you. How are you doing here?" is enough.',
      'If this person does not yet exist in your life: open Rare Circle and go to the Reset group. Read what others have shared. Then write one post introducing yourself. You do not need to share everything. You just need to show up and say you are here.',
      'Once you have made contact — whether in person, by message, in Rare Circle, or in any community space — note it. Who it was. What you said or shared. That evidence is what completes this task.',
      'This is the beginning of what will become your Rare Circle — the community of people who understand the specific weight of what you are navigating. It does not need to feel significant today. It just needs to happen.',
    ],
    starterScripts: [
      { label: 'Simple and open', text: '"Hi, I\'m new here and in Stage 1. Just arrived / settling in. Good to find a space where people get it."' },
      { label: 'Share where you are', text: '"Working through the Reset stage. Finding the financial / housing / visa side of things a lot right now. Anyone else in this spot?"' },
      { label: 'Ask a question', text: '"Does it get easier to feel at home here? I\'m [X months] in and still finding my feet. Interested to hear from anyone further along."' },
      { label: 'Just say hello', text: '"Hello from [city]. Stage 1. Happy to be here."' },
    ],
    resources: [
      { type: 'circle_link', title: 'Rare Circle — Reset group (Stage 1 members)', group: 'Reset' },
      { type: 'guide', title: 'Task 1.5 — Connect with one person: guide with Rare Circle prompts and starter scripts', guideFile: 'Stages/STAGE 1/RareSena_Task1.5_Connect_With_One_Person.html' },
      { type: 'guide', title: 'Finding diaspora communities near you in the UK', guideFile: 'Stages/files2/RareSena_Guide_Finding_Diaspora_Communities.html' },
    ],
    whatToExpectToFeel: 'Reaching out when you are low is one of the hardest things to do — it requires admitting that you need something, and that runs against every instinct you have been using to hold yourself together since you arrived. Do it anyway. The research on loneliness and immigrant wellbeing is clear: connection is not a comfort — it is infrastructure. One message this week. That is all this task asks. You are not being needy. You are being strategic about your own recovery.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'Who did you connect with, and what was one thing you said or shared?',
      minChars: 20,
      note: 'No name required — just evidence of the action.',
    },
  },

  // ═══════════════════════════════════════
  // STAGE 2 — REDISCOVER
  // ═══════════════════════════════════════
  '2.1': {
    stage: 2,
    taskNumber: 1,
    title: 'Complete the values identification exercise',
    estimatedTime: '30–45 min',
    whyThisMatters: 'When everything external has changed — country, job, status, community, daily rhythm, language of the street — your values are the only constant. They did not cross the border and get checked at customs. They came with you.\n\nBut without naming them deliberately, values drift. You begin to rebuild by default — chasing what seems most urgent, most practical, most acceptable to the new system. And then one day you look up and realise you have been building someone else\'s life in a new country.\n\nThis exercise names your values before that can happen. It takes them out of the background and makes them structural — so that every decision about work, community, money, and direction in the stages ahead is tested against something that actually belongs to you.',
    whatToDo: [
      'Work through the 50 values below and select up to 10 that feel most true to who you are. Do not overthink. Your first instinct is usually more accurate than a considered choice.',
      'Once you have your top 10, review them and identify your top 3 — the three you would refuse to compromise, even under pressure.',
      'For each of your top 3: write one sentence on how this value showed up in your life before you arrived in the UK. Then write one sentence on how you intend it to show up here, in this rebuild, going forward.',
      'Save your values to your profile. They will be visible on your dashboard throughout the rebuild as a reminder of what you are building toward — and why.',
    ],
    resources: [
      { type: 'guide', title: 'Task 2.1 — Values identification exercise: full guide', guideFile: 'Stages/STAGE 2/RareSena_Task2.1_Values_Identification.html' },
      { type: 'interactive', title: 'Values card sort — 50 values, select and save to profile' },
      { type: 'template', title: 'Reflection template pre-filled with your top 3 values' },
      { type: 'product', title: '5R Rebuild Workbook (£22)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Some people find this exercise energising — they recognise themselves clearly in what they select. Others find it quietly grief-inducing, because naming what you value makes visible how much of that has been stripped away or suppressed since you arrived. Both responses are valid. Both are information. The values you name here are not aspirational — they are descriptive. They describe who you already are. The rebuild is the work of expressing them in a new context.',
    completionPrompt: {
      type: 'reflection',
      prompt: 'What is your top value, and how will it guide the rebuild you are building here?',
      minChars: 40,
    },
  },

  '2.2': {
    stage: 2,
    taskNumber: 2,
    title: 'Map your professional identity to the UK market',
    estimatedTime: '45–60 min',
    whyThisMatters: 'Your qualifications and experience are real. The work you did, the problems you solved, the expertise you built — none of that disappeared when you crossed a border. But the UK market does not automatically recognise it. It has its own frameworks, its own conventions, and its own gatekeeping systems that were not designed with you in mind.\n\nUnderemployment is the defining professional struggle for immigrants in the UK. Research consistently shows that around a third of migrants are over-qualified for the jobs they hold — and that this is not about ability. It is about translation. The person who was a senior engineer, a practising lawyer, a hospital consultant, or a published academic in their home country can end up stacking shelves or working in a call centre — not because they lack the skills, but because nobody told them how the UK system works and what steps are needed to re-enter it.\n\nThis task tells you exactly what you are working with and what translation steps apply to your situation.',
    whatToDo: [
      'Use the skills inventory below to list your top 3 professional skills and your highest qualification. Be specific — not "management experience" but "managed a team of 12 engineers across two countries for three years."',
      'Check whether your qualification needs a UK ENIC Statement of Comparability — the official document that tells UK employers, universities, and professional bodies how your overseas qualification compares to UK standards. Cost: approximately £50–£100 + VAT. Apply at enic.org.uk.',
      'Check whether your profession requires UK registration before you can practise. Medicine, nursing, dentistry, law, teaching, engineering, social work, pharmacy, and architecture all have separate regulatory bodies with their own requirements.',
      'Use the professional summary builder below to draft your UK professional summary — a paragraph that describes who you are, what you do, and what you are looking for, in UK language and conventions.',
    ],
    resources: [
      { type: 'guide', title: 'Task 2.2 — Map your professional identity to the UK market: full guide', guideFile: 'Stages/STAGE 2/RareSena_Task2.2_Professional_Identity_UK.html' },
      { type: 'guide', title: 'UK CV conventions: what to include, exclude, and never say', guideFile: 'Stages/files2/RareSena_Guide_UK_CV_Conventions_2.html' },
      { type: 'guide', title: 'Is my qualification recognised in the UK? The complete sector guide', guideFile: 'Stages/files2/RareSena_Guide_Qualification_Recognition_Sector_Guide.html' },
      { type: 'external', title: 'UK ENIC Statement of Comparability application', url: 'https://www.enic.org.uk' },
      { type: 'interactive', title: 'UK professional summary builder' },
      { type: 'product', title: 'Stage Worksheets Bundle (£25)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Mapping your professional identity to a new market can bring up something close to grief. You built expertise over years. You were good at what you did. And now you are being asked to translate, re-qualify, and prove yourself again to a system that does not yet know you. That is not failure. That is the cost of arrival — and it is a cost that says nothing about your capability and everything about the system\'s lack of portability. The work you do in this task starts building the bridge.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Enter your top professional skill and the one UK-specific barrier or translation step that stands between you and practising it here.',
      fields: [
        { key: 'top_skill', label: 'Your top professional skill', inputType: 'text', required: true, placeholder: 'e.g. Clinical nursing, structural engineering, corporate law...' },
        { key: 'uk_barrier', label: 'The one UK-specific barrier or translation step', inputType: 'text', required: true, placeholder: 'e.g. NMC registration, UK ENIC comparability, SRA requalification...' },
      ],
    },
  },

  '2.3': {
    stage: 2,
    taskNumber: 3,
    title: 'Name one cultural anchor you will always maintain',
    estimatedTime: '20–30 min',
    whyThisMatters: 'The pressure to assimilate in a new country is real, constant, and largely unspoken. It arrives through small moments — the way people look at you when you speak your first language in public, the advice to "anglicise" your name for job applications, the slow drift away from food, music, celebration, and ritual that once held your life together.\n\nThe research on this is clear and consistent: immigrants who maintain a meaningful connection to their heritage culture while building in the new one have measurably better mental health outcomes than those who abandon it entirely in pursuit of belonging. This is not nostalgia — it is protective. The parts of you that existed before you arrived are not obstacles to rebuilding. They are resources.\n\nThis task asks you to name one thing deliberately — before it gets lost in the noise of survival — and to make a commitment about how it stays present in your life here.',
    researchEvidence: 'Clinical research on cultural bereavement (Bhugra; Eisenbruch) and acculturation theory (Berry\'s model) consistently shows that immigrants who maintain heritage cultural connections alongside UK integration — rather than abandoning one for the other — experience lower rates of depression, stronger sense of identity, and faster social integration. The concept of "continuing bonds" from grief theory also applies: maintaining connection to who you were does not prevent you from becoming who you are becoming. It supports it.',
    anchorCategories: [
      { icon: '🗣️', label: 'Language', examples: 'Mother tongue, dialect, code-switching, reading in your first language' },
      { icon: '🍲', label: 'Food and cooking', examples: 'Recipes, ingredients, Sunday meals, fasting, celebration foods' },
      { icon: '🙏', label: 'Faith and spiritual practice', examples: 'Prayer, mosque, church, temple, devotional reading, fasting, ritual' },
      { icon: '🎵', label: 'Music and arts', examples: 'Listening, playing, dancing, traditional arts, storytelling' },
      { icon: '👨‍👩‍👧', label: 'Family traditions', examples: 'Celebrations, anniversaries, naming, greetings, family calls' },
      { icon: '🤝', label: 'Community', examples: 'Diaspora groups, mutual aid, elder relationships, collective celebration' },
      { icon: '👗', label: 'Dress and appearance', examples: 'Traditional clothing, head coverings, cultural dress on specific occasions' },
      { icon: '💭', label: 'Values and philosophy', examples: 'Ubuntu, filial piety, collectivism, hospitality as duty, specific ethical frameworks' },
      { icon: '✨', label: 'Something else', examples: 'Anything that does not fit a category above' },
    ],
    whatToDo: [
      'Reflect on this question: What one practice, tradition, language, food, ritual, music, or community connection do you refuse to give up — the thing that, if you stopped, would feel like losing a part of yourself? Take a moment with it. Do not pick something aspirational. Pick something true.',
      'Name it. Select a category below that resonates, then describe your specific anchor.',
      'Decide how it will remain present in your life in the UK specifically. Not "I will try to maintain it" — a concrete decision: what day, how often, with whom, in what form.',
      'Write it as a commitment statement using the builder below. This is saved to your profile as a permanent reminder of what you are protecting alongside what you are building.',
    ],
    resources: [
      { type: 'guide', title: 'Task 2.3 — Name your cultural anchor: full guide', guideFile: 'Stages/STAGE 2/RareSena_Task2.3_Cultural_Anchor.html' },
    ],
    whatToExpectToFeel: 'Naming a cultural anchor can feel small and significant at the same time. Small because it is just one thing. Significant because saying it out loud — or writing it here — makes it real in a way that silent intention does not. You may also feel the weight of what you have already let slip since arriving, without even noticing. That is not failure — it is the cost of survival mode. This task is about moving out of survival mode, one deliberate decision at a time.',
    completionPrompt: {
      type: 'reflection',
      prompt: 'What is your cultural anchor, and how will it stay present in your life here?',
      minChars: 30,
    },
  },

  '2.4': {
    stage: 2,
    taskNumber: 4,
    title: 'Find your community',
    estimatedTime: 'This week',
    whyThisMatters: 'Research on immigrant wellbeing consistently identifies one finding above all others: belonging through work is the most reported route to feeling at home in the UK. But until work is established — until you are in a role that uses your skills, with colleagues who see what you bring — community is the bridge.\n\nBelonging does not happen passively. It does not arrive because you moved to a new country and started a new life. It happens because you make a decision, take an action, show up somewhere, and do it again. One community. One attendance. One introduction. That is what this task asks for — not a social life, not a network, just one deliberate move toward connection in the right direction.',
    whatToDo: [
      'Identify one community that is relevant to your life here — based on your background, profession, faith, interest, or simply your current stage in the rebuild. The directory below is organised by community type to help you find the right starting point.',
      'Join or attend once this week. Online counts. An in-person meetup counts. A Rare Circle post counts. The medium matters less than the action.',
      'Introduce yourself to one person in that space. One message, one conversation, one comment. That is all.',
      'Come back and complete the prompt below with what happened. What was the community? What did you do or say? What did you take from it?',
    ],
    resources: [
      { type: 'guide', title: 'Task 2.4 — Find your community: full guide with directory by city and background', guideFile: 'Stages/STAGE 2/RareSena_Task2.4_Find_Your_Community.html' },
      { type: 'circle_link', title: 'Rare Circle — Rediscover group', group: 'Rediscover' },
    ],
    whatToExpectToFeel: 'Walking into a new community — online or in person — requires a specific kind of courage that often goes unacknowledged: the courage to be new, to not yet belong, to be seen before you are known. Most people feel awkward. Most introductions feel clunky. Most first attendances feel slightly wrong. Go anyway. The awkwardness is the cost of entry — not a sign that it is the wrong place. Belonging is built through consistent exposure, not through a perfect first experience.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'Which community did you join or attend, and what was one thing you took from the experience?',
      minChars: 20,
    },
  },

  '2.5': {
    stage: 2,
    taskNumber: 5,
    title: 'Define what sovereignty means to you personally',
    estimatedTime: '30–45 min',
    whyThisMatters: 'Sovereignty is the end destination of the entire 5R framework. It is the word RareSena uses for a specific condition: a life that cannot be destabilised by a single letter — from an employer, from the Home Office, from a landlord, from a bank.\n\nBut sovereignty means something different for every person who arrives in the UK. For one person it is owning their own home so nobody can evict them. For another it is ILR and then citizenship, so no letter can ever threaten their right to stay. For another it is an income that does not depend on a single employer or a single visa condition. For another it is simply the freedom to call their mother without calculating the cost of the call.\n\nDefining what sovereignty means to you — specifically, concretely — gives every stage that follows a direction. Without a destination, rebuilding has no shape. With one, every task in every stage becomes a step toward something. That is the difference between surviving and building.',
    sovereigntyDefinition: 'Sovereignty is the condition in which a single letter — from an employer, from the Home Office, from a bank, from a landlord — can no longer destabilise the life you have built. It is not wealth. It is not perfection. It is structural security: a life built on enough independent foundations that no single institution holds the power to unravel it.',
    sovereigntyDimensions: [
      { icon: '🛡️', label: 'Legal and immigration security', desc: 'ILR, citizenship, or settled status — a status that cannot be revoked by an employer or relationship breakdown' },
      { icon: '💰', label: 'Financial independence', desc: 'Income that does not depend on a single employer, a single client, or a single visa condition' },
      { icon: '🏠', label: 'Housing security', desc: 'Owning or having secure tenancy — a home that cannot be taken away by a landlord\'s decision' },
      { icon: '💼', label: 'Professional recognition', desc: 'A role that uses your skills, in your field, at the level you are qualified for' },
      { icon: '👨‍👩‍👧', label: 'Family security and togetherness', desc: 'Family members joined, safe, and established — nobody left behind or at risk' },
      { icon: '🌍', label: 'Belonging and identity', desc: 'Feeling genuinely at home here without having erased who you were before you arrived' },
      { icon: '🚀', label: 'Business and legacy', desc: 'A business or platform built on your terms, generating value independently of any employer' },
      { icon: '💚', label: 'Wellbeing and peace', desc: 'A daily life with enough stability and enough freedom that anxiety is no longer the background noise' },
    ],
    sovereigntyExamples: [
      'Sovereignty for me means British citizenship, a mortgage in my own name, and an income I generate myself — so that no employer, no landlord, and no Home Office letter can ever again determine where my children live.',
      'My sovereignty is the day I practise medicine again — not as a locum filling gaps, but as a consultant in a department that values what I bring. That is the day I stop proving myself and start being myself here.',
      'Sovereignty is simpler for me: it is being able to call my mother without calculating the cost, to cook the food I grew up with without explaining it, and to know that my family\'s status in this country is not dependent on one piece of paper or one employer\'s goodwill.',
      'For me it is financial. Three income streams. None of them dependent on my visa status. That is the day no letter can touch me — not a P45, not a visa refusal, not a landlord\'s notice.',
    ],
    whatToDo: [
      'Read the RareSena definition of sovereignty in the app. Sit with it. Notice which parts land and which parts feel distant from your current reality.',
      'Select the dimensions of sovereignty that matter most to you personally — what does a sovereign life look like in your specific situation? Select all that apply and add detail for each one.',
      'Write your personal sovereignty definition using the builder below. It should be 2–3 sentences, specific to your life, and concrete enough that you will recognise when you have arrived.',
      'This definition is saved to your profile and displayed on your dashboard throughout the rebuild as a north star. Every stage is designed to move you closer to it.',
    ],
    resources: [
      { type: 'guide', title: 'Task 2.5 — What sovereignty means: the RareSena framework', guideFile: 'Stages/STAGE 2/RareSena_Task2.5_Define_Sovereignty.html' },
    ],
    whatToExpectToFeel: 'Defining sovereignty when you are still in Reset or early Rediscover can feel presumptuous — like you are not yet in a position to claim it as a destination. That feeling is wrong. The definition is not a claim. It is a compass. You do not need to be close to sovereignty to name what it looks like. In fact, the further you are from it, the more important it is to name it — because without a destination, survival becomes the goal. And survival is not what you came here for.',
    completionPrompt: {
      type: 'reflection',
      prompt: 'Describe your version of sovereignty in 2–3 sentences. What does it look, feel, and mean for you?',
      minChars: 60,
      note: 'Your answer is saved to your profile and visible on your dashboard.',
    },
  },

  // ═══════════════════════════════════════
  // STAGE 3 — ROUTINE
  // ═══════════════════════════════════════
  '3.1': {
    stage: 3,
    taskNumber: 1,
    title: 'Design a morning routine you can genuinely keep',
    estimatedTime: '20–30 min',
    whyThisMatters: 'You made it through Stage 1 and Stage 2. You have stabilised the foundations, named your values, mapped your professional identity, and defined what you are building toward. Now comes the stage that separates the people who rebuild from the people who stay stuck in reset mode indefinitely.\n\nRoutine is not productivity theatre. It is not a 5am wake-up and a cold shower. A routine is the daily architecture that makes sustained progress possible without requiring willpower every single morning. Willpower is finite. Systems are not.\n\nThe morning routine you design in this task is specific to your life — your hours, your dependants, your commute, your visa obligations, your mental health on a bad day. It is not borrowed from someone else\'s life. It is yours, and it is designed to survive the difficult weeks, not just the easy ones.',
    carryForwardNote: 'In Task 1.4 you chose one daily anchor habit and began building your streak. That habit does not disappear in Stage 3 — it becomes the foundation your morning routine is built around. When you design your routine below, your Stage 1 habit is already in it. Stage 3 adds structure around it, not instead of it.',
    survivabilityRule: 'A 30-minute run becomes a 5-minute walk on a bad day. A 20-minute journal becomes one sentence. The routine stays alive. The identity — "I am someone who does this every morning" — stays intact. Broken streaks come from all-or-nothing thinking, not from bad days.',
    whatToDo: [
      'Be honest about your real morning — not an ideal one. What time do you actually wake up? Do you have children to get ready? A commute? A shift pattern? Build around the life you have, not the life you want to have eventually.',
      'Use the routine builder below to map out your morning in 15–30 minute blocks from wake-up to the start of your working day. Include your Stage 1 anchor habit as one of the blocks.',
      'Apply the one rule that makes routines survivable: the 2-minute minimum. Every item in your routine should have a 2-minute version — the smallest possible version of that activity that still counts. On a terrible morning, the 2-minute version is what keeps the routine alive.',
      'Decide what your routine looks like on a bad day — when everything is running late, when you are anxious, when the visa anxiety is loud. Name the three things that are non-negotiable even then. Everything else is optional on bad days.',
    ],
    resources: [
      { type: 'guide', title: 'Task 3.1 — Design a morning routine you can genuinely keep: full guide', guideFile: 'Stages/STAGE 3/RareSena_Task3.1_Morning_Routine_Builder.html' },
      { type: 'interactive', title: 'Morning routine builder — time slots, habit categories, custom items' },
      { type: 'guide', title: 'Nutrition Calculator — World Foods Edition (interactive tool)', guideFile: 'Stages/files/RareSena_Tool_Nutrition_Calculator_World_Foods.html' },
      { type: 'product', title: 'Habit and Routine Planner (£12)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Designing a routine feels easier than running one. The first week often goes well — novelty carries you. The second week is when the system is actually tested, because the novelty is gone and real life has reasserted itself. If week two is hard, that is not a sign the routine is wrong. It is the system working as it should — showing you which parts need to flex and which parts need to hold. Adjust, do not abandon.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Describe your morning routine: what time it starts and the first three things you do.',
      fields: [
        { key: 'start_time', label: 'What time does your morning routine start?', inputType: 'text', required: true, placeholder: 'e.g. 6:30am' },
        { key: 'first_three', label: 'The first three things you do', inputType: 'text', required: true, placeholder: 'e.g. Drink water, 5-min journal, check task list' },
      ],
    },
  },

  '3.2': {
    stage: 3,
    taskNumber: 2,
    title: 'Identify your 5 core daily habits',
    estimatedTime: '20–30 min',
    whyThisMatters: 'One habit — your Stage 1 anchor — gave you a point of certainty in an uncertain day. Five habits give you an architecture. The difference between a person rebuilding and a person thriving is almost always visible in their daily structure — not their talent, not their opportunity, not their visa track. Their structure.\n\nThe five habits you identify here are not aspirational. They are not the habits of a person who has already arrived. They are the habits of a person who is building — deliberately, consistently, on a foundation that survives a bad week. Each one is chosen to address a specific dimension of the rebuild: body, mind, finances, connection, and forward progress. One per dimension. Five total. Every day.',
    carryForwardNote: 'The habit you chose in Task 1.4 is Habit 1 in your Stage 3 architecture. It does not get replaced — it gets joined by four more. You are not starting again. You are building on what already exists. If your anchor habit has shifted since Stage 1, you can update it here before adding the remaining four.',
    whatToDo: [
      'Your anchor habit from Stage 1 is already Habit 1. You need four more — one from each remaining dimension: body, finances, connection, and forward progress.',
      'Select one habit from each category below. Choose the one that is most honest for your life right now — not the most impressive. You can always upgrade later. A kept simple habit beats an abandoned ambitious one every time.',
      'Confirm all five in the completion checklist at the bottom. Each must be ticked before the task can be marked done — this is not a self-certification. It is a commitment.',
      'Your five habits will seed the in-app daily tracker. Each morning you log them. The streak tracker counts consecutive days across all five. Stage 3, Task 3.4 auto-completes when you reach 30 consecutive days.',
    ],
    resources: [
      { type: 'guide', title: 'Task 3.2 — Identify your 5 core daily habits: full guide', guideFile: 'Stages/STAGE 3/RareSena_Task3.2_Five_Core_Daily_Habits.html' },
      { type: 'interactive', title: 'Habit library — 30 pre-set habits by category with custom input' },
      { type: 'tracker', title: 'In-app streak tracker' },
      { type: 'guide', title: 'Nutrition Calculator — World Foods Edition (interactive tool)', guideFile: 'Stages/files/RareSena_Tool_Nutrition_Calculator_World_Foods.html' },
      { type: 'product', title: 'Ultimate Planner (£19)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Five habits sounds like a lot when you are already carrying the weight of a rebuild. It is not five new burdens — it is five anchors. Each one addresses a part of your life that, without deliberate attention, tends to drift during rebuilding: your body, your finances, your relationships, your progress, and your mind. When all five are running, you will notice something that is hard to describe until you feel it: a quiet confidence that comes not from having solved everything, but from knowing that the fundamentals are being tended to every day.',
    completionPrompt: {
      type: 'checklist',
      prompt: 'Select and confirm your 5 core daily habits. All 5 must be confirmed to complete this task.',
      items: [
        { key: 'habit_1', label: 'Habit 1', inputType: 'text', placeholder: 'Name your first habit' },
        { key: 'habit_2', label: 'Habit 2', inputType: 'text', placeholder: 'Name your second habit' },
        { key: 'habit_3', label: 'Habit 3', inputType: 'text', placeholder: 'Name your third habit' },
        { key: 'habit_4', label: 'Habit 4', inputType: 'text', placeholder: 'Name your fourth habit' },
        { key: 'habit_5', label: 'Habit 5', inputType: 'text', placeholder: 'Name your fifth habit' },
      ],
    },
  },

  '3.3': {
    stage: 3,
    taskNumber: 3,
    title: 'Build a weekly review practice',
    estimatedTime: '20–30 min',
    whyThisMatters: 'The weekly review is the most underrated practice in any rebuild. Not because it produces insight — though it does. Because it creates the discipline of honest self-assessment at regular intervals, before problems compound into crises.\n\nMost immigrants rebuilding in the UK are in reactive mode for months — responding to the next urgent thing, never stepping back to assess whether the direction is right and whether the fundamentals are holding. The weekly review is the antidote to that. Fifteen minutes, once a week, across five dimensions: finances, career progress, connection, wellbeing, and one action forward. That is all it takes to move from reactive to deliberate.\n\nThe review you complete below is your first one. You will complete it every week from here — same day, same time, same five dimensions. This week\'s responses become the baseline everything else is measured against.',
    whatToDo: [
      'Set your weekly review day and time in the notification setup below. This seeds your weekly push notification — the prompt that arrives every week to bring you back to the review.',
      'Complete your first review using the five-dimension template below. Be honest. The review is private. Its value comes entirely from accuracy, not from sounding good.',
      'After your first review, respond to the completion prompt. Your biggest win and your biggest gap this week — two honest sentences. That is what marks this task done.',
    ],
    resources: [
      { type: 'guide', title: 'Task 3.3 — Build a weekly review practice: full guide', guideFile: 'Stages/STAGE 3/RareSena_Task3.3_Weekly_Review.html' },
      { type: 'template', title: 'Weekly Review template — embedded and fillable' },
    ],
    whatToExpectToFeel: 'The first weekly review is the most uncomfortable one. You are looking honestly at a week that probably had gaps — things you said you would do and did not, money that went somewhere you did not plan, connection you intended to make but did not. That discomfort is the point. A review that only acknowledges what went well is not a review — it is a performance. The value is in the gap between intention and reality, because the gap tells you exactly what needs to change.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'Complete your first weekly review using the template. What was your biggest win and your biggest gap this week?',
      minChars: 40,
    },
  },

  '3.4': {
    stage: 3,
    taskNumber: 4,
    title: 'Complete 30 consecutive days without breaking your streak',
    estimatedTime: 'Ongoing — 30 days',
    whyThisMatters: 'This task does not require you to do anything new. It requires you to keep doing what you have already committed to — every single day, for thirty consecutive days.\n\nThat sounds simple. It is not. Thirty consecutive days is long enough to encounter at least one bad week, at least one crisis, at least one day when everything feels too heavy for a morning routine and five habits. The value of this task is not the streak number. It is what you discover about yourself when the streak is threatened and you choose to protect it anyway.\n\nThis task auto-completes. There is no prompt, no submission, no button to press. When the streak tracker records 30 consecutive logged days, the task marks itself done and Stage 3 moves one step closer to complete. All you have to do is show up.',
    autoCompleteNote: 'This task is connected to your in-app streak tracker from Tasks 1.4 and 3.2. Every day you log your habits, the streak counter increments. When it reaches 30 consecutive days, this task automatically marks as complete in your profile — no action required from you. Miss a day and the counter resets to zero.',
    streakMilestones: [
      { days: '7', label: 'One week — the habit is becoming real' },
      { days: '14', label: 'Two weeks — you are no longer deciding' },
      { days: '21', label: 'Three weeks — this is who you are becoming' },
      { days: '30', label: 'One month — Task 3.4 auto-completes ✓' },
    ],
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Task 3.4 — 30-day streak: how it works and what to do when it breaks', guideFile: 'Stages/STAGE 3/RareSena_Task3.4_30Day_Streak_AutoComplete.html' },
      { type: 'tracker', title: 'In-app streak tracker with daily notification' },
    ],
    whatToExpectToFeel: 'Around day 10 to 14 the novelty is gone and something harder sets in — the question of whether this is worth it when nothing has dramatically changed yet. Keep going. The change that thirty days of consistent habits creates is not dramatic. It is structural. You will not wake up on day 31 transformed. You will wake up as someone who has proved to themselves that they keep their commitments for thirty days. That proof is more valuable than almost anything else you could have done with those thirty days.',
    completionPrompt: {
      type: 'auto',
      prompt: 'This task completes automatically when the streak tracker records 30 consecutive days.',
    },
  },

  '3.5': {
    stage: 3,
    taskNumber: 5,
    title: 'Create your financial tracking system and set your first goal',
    estimatedTime: '30–45 min',
    whyThisMatters: 'In Stage 1 you identified your most pressing financial gap and named one action to address it. That was triage — the emergency response. Stage 3 is where triage becomes system. A financial tracking system is not about spreadsheets or deprivation. It is about visibility. You cannot build toward financial sovereignty without knowing exactly what is coming in, what is going out, and what the distance is between where you are now and the first concrete financial goal.\n\nThis task has two parts: tracking and direction. The tracker gives you the monthly picture. The goal builder gives the picture a destination. Together they turn financial survival mode into financial intention — and financial intention is the first step toward the kind of independence that makes you unstoppable.',
    whatToDo: [
      'Complete the monthly tracker below — income, essential expenses, and discretionary spending. This is the operational picture: where the money actually is.',
      'Use the goal builder to define your first financial goal — not "save more money" but a specific target, a specific date, and a specific plan for how you get there.',
      'Set a monthly tracker reminder. The tracker is only useful if you update it every month. Pick a date — the first of the month, or the last Sunday — and set it now.',
      'Complete the prompt with your three numbers: monthly income, monthly expenses, and your financial goal target. All three required.',
    ],
    resources: [
      { type: 'guide', title: 'Task 3.5 — Build a financial tracking system: full guide', guideFile: 'Stages/STAGE 3/RareSena_Task3.5_Financial_Tracker_Goals.html' },
      { type: 'guide', title: 'Credit Score Tracker (interactive tool)', guideFile: 'Stages/files/RareSena_Tool_Credit_Score_Tracker.html' },
      { type: 'template', title: 'Monthly income vs expenses tracker — pre-filled with UK categories' },
      { type: 'guide', title: 'Reading your UK credit report: Experian, Equifax, TransUnion', guideFile: 'Stages/files2/RareSena_Guide_Reading_UK_Credit_Report.html' },
      { type: 'guide', title: 'How rent reporting tools build your credit score', guideFile: 'Stages/files2/RareSena_Guide_Rent_Reporting_Credit_Building.html' },
    ],
    savingsStrategies: [
      { title: 'The 1% rule', desc: 'Save 1% of your income the moment it arrives. Not what is left at the end of the month — 1% off the top, automatically transferred. On £1,500/month that is £15. Tiny but consistent.' },
      { title: 'Round-up saving', desc: 'Monzo, Starling, and Chase all offer round-up features. Every transaction rounds up to the nearest pound and the difference goes to savings. Painless and automatic.' },
      { title: 'No-spend days', desc: 'Designate 2–3 days per week as no-spend days. No discretionary purchases at all. Track them in your weekly review. Even £5 not spent is £5 toward your goal.' },
      { title: 'Bill audit once per quarter', desc: 'Every three months, review every direct debit and subscription. Cancel anything unused. Switch energy tariff. Downgrade mobile plan if possible. Small reductions compound significantly.' },
    ],
    whatToExpectToFeel: 'Setting a financial goal when money is tight can feel like cruelty — like being asked to dream about a destination when you are not sure you can afford the bus. Do it anyway. The goal is not a fantasy. It is a structural device. It changes the relationship between income and expenditure from passive to intentional. Even if the first month you can only save £10 toward the goal — £10 toward something is categorically different from £10 spent on nothing. Direction matters more than speed.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Enter your three numbers. All three required before this task can be marked done.',
      fields: [
        { key: 'monthly_income', label: 'Monthly income total (£)', inputType: 'text', required: true, placeholder: 'e.g. £1,650' },
        { key: 'monthly_expenses', label: 'Monthly essential expenses total (£)', inputType: 'text', required: true, placeholder: 'e.g. £1,280' },
        { key: 'first_goal', label: 'Your first financial goal — target amount and date', inputType: 'text', required: true, placeholder: 'e.g. £2,400 emergency fund by March 2026 — saving £75/month' },
      ],
    },
  },

  // ═══════════════════════════════════════
  // STAGE 4 — RISE
  // ═══════════════════════════════════════
  '4.1': {
    stage: 4,
    taskNumber: 1,
    title: 'Define your 90-day direction in one sentence',
    estimatedTime: '30–45 min',
    sovereigntyCarryForwardNote: 'Your sovereignty definition from Task 2.5 is the north star for this task. What you wrote about what a sovereign life looks like for you — stable status, income that holds, a profession that uses your skills — is what your 90-day direction should be moving toward. Retrieve it now and keep it visible as you work through this task.',
    whyThisMatters: 'You have stabilised. You have rediscovered who you are beneath what changed. You have built a daily architecture that holds. Now comes the question that Stage 4 is built around: what are you actually building toward in the next 90 days?\n\nNot in your life generally. Not eventually. In the next 90 days, specifically. One direction. One sentence.\n\nThe 90-day window is deliberate. It is long enough to accomplish something real. Short enough to stay specific. And precise enough that at the end of it, you will know whether you moved or not — not by feeling, but by fact.\n\nStage 3 gave you a routine. Stage 4 gives that routine a direction. Without this task, everything you do consistently goes nowhere in particular. With it, every habit, every weekly review, every financial decision has a destination.',
    whatToDo: [
      'Select your primary path below — the one area where the next 90 days will be most focused. You are not abandoning the others. You are choosing what gets your primary energy and attention for this window.',
      'Read the example direction statements for your path. Select one that resonates or use it as a starting point to write your own.',
      'Use the direction builder to turn your focus area into one precise sentence starting with: "In the next 90 days I will..."',
      'Set three milestones — what you will have achieved at 30 days, 60 days, and 90 days. These become your Stage 4 checkpoints.',
      'Your direction statement saves to your profile dashboard. It appears at the top of your Stage 4 view every time you open the app — a constant reminder of what this window is for.',
    ],
    resources: [
      { type: 'guide', title: 'Task 4.1 — Define your 90-day direction: full guide', guideFile: 'Stages/STAGE 4/RareSena_Task4.1_90Day_Direction.html' },
      { type: 'template', title: '90-day direction framework — embedded worksheet' },
    ],
    whatToExpectToFeel: 'Naming a 90-day direction makes it real in a way that general ambition does not. It also makes failure more specific — if you do not move in this direction, you will know it. That accountability is uncomfortable before it is useful. Lean into it. The specificity is the point. A vague intention to "do better" cannot be measured, cannot be celebrated, and cannot be learned from. A 90-day direction can be all three.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Write your 90-day direction in one sentence. Start with: "In the next 90 days I will…"',
      fields: [
        { key: 'direction', label: 'Your 90-day direction', inputType: 'text', required: true, placeholder: 'In the next 90 days I will…' },
      ],
      note: 'Saved to your profile dashboard.',
    },
  },

  '4.2': {
    stage: 4,
    taskNumber: 2,
    title: 'Identify and start your primary income stream',
    estimatedTime: '45–60 min',
    whyThisMatters: 'By Stage 4 you have a routine, a direction, and a financial tracking system. Now comes the question that determines whether the rebuild becomes sovereign or stays precarious: where is your income coming from, and is it building toward independence or deepening dependence?\n\nMost immigrants in the UK reach Stage 4 with one income source — usually employment or a single employer — and no plan for what happens if that source disappears. A Skilled Worker who loses their sponsor. A student who graduates and enters the 60-day clock. A spouse whose relationship changes. A refugee whose Universal Credit is reviewed.\n\nThis task is about identifying the primary income stream that is right for your visa track and your stage — and taking the first concrete action to activate or grow it. Not a plan. An action. This week.',
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Task 4.2 — Identify and start your primary income stream: full guide', guideFile: 'Stages/STAGE 4/RareSena_Task4.2_Primary_Income_Stream.html' },
      { type: 'guide', title: 'Income stream guide by visa track — what is permitted and what is not', guideFile: 'Stages/files2/RareSena_Guide_Income_Options_By_Visa_Type.html' },
      { type: 'circle_link', title: 'Rare Studio — creator pathway', group: 'Rise' },
      { type: 'product', title: 'RareStack (£39/mo) — for business-builders', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Income anxiety in Stage 4 is different from income anxiety in Stage 1. In Stage 1 it was survival anxiety — will I have enough to eat and pay rent? In Stage 4 it is direction anxiety — am I building the right thing, am I moving fast enough, is this actually going anywhere? Both are real. Both require action rather than reassurance. The action this task asks for is small and specific — one thing, this week. That is enough for now.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'What is your primary income stream and what is the first action you have taken or will take this week to activate or grow it?',
      minChars: 30,
    },
  },

  '4.3': {
    stage: 4,
    taskNumber: 3,
    title: 'Build your professional network in the UK',
    estimatedTime: '45–60 min setup · Ongoing',
    networkingStrategies: [
      { title: 'The specific ask', body: 'When connecting with someone, always have a specific reason. "I am also navigating NMC registration and saw your post about the OSCE — would you be open to a 15-minute call?" is 10x more likely to get a response than a blank connection request.', action: 'Draft your specific ask before each connection' },
      { title: 'LinkedIn content visibility', body: 'Posting once a week about your professional journey — even briefly — increases profile views by 5–10x. You do not need to perform. Share what you are learning, what you are navigating, and what you know. Your perspective as an immigrant professional is distinctive.', action: 'One post per week. Authentic, not polished.' },
      { title: 'Alumni networks', body: 'If you studied in the UK or your university has a UK alumni chapter — use it. Alumni networks are the most frictionless professional community to enter because the shared connection already exists.', action: 'Search LinkedIn for your university alumni in the UK' },
      { title: 'Professional associations', body: 'Most UK professional bodies have local branches with networking events, mentorship programmes, and online communities. Even during registration, you can usually join as an associate member or attend events.', action: 'Find your professional body\'s local branch and attend once' },
      { title: 'Rare Circle Rise group', body: 'The Stage 4 community inside Rare Circle — people in Rise who are building professional networks, starting income streams, and navigating the same Stage 4 pressures. The most relevant peer network for where you are right now.', action: 'Open Rare Circle — Rise group' },
      { title: 'The follow-up', body: 'Most networking fails not at the first contact but at the follow-up. If someone agrees to a call — do it. If a call was useful — send a thank you and one specific thing you took from it within 24 hours. That is what turns a contact into a relationship.', action: 'Follow up within 24 hours. Always.' },
    ],
    whyThisMatters: 'Research on immigrant employment in the UK is consistent on one finding: professional networks are the single most powerful determinant of whether an immigrant rebuilds at their skill level or stays trapped below it. Not qualifications. Not language. Networks.\n\nMost immigrants in the UK are undernetworked relative to their UK-born peers — not because they are less capable of building relationships, but because they arrived without the inherited professional networks that UK-educated professionals accumulate over years of study and early career. Every connection you build deliberately in Stage 4 is closing a gap that the system created, not you.\n\nThis task is not about collecting LinkedIn connections. It is about building three things: visibility in your sector, relationships with people who can open doors, and a professional presence that accurately represents what you bring.',
    whatToDo: [
      'Complete the LinkedIn profile checklist below. A complete, accurate, UK-optimised LinkedIn profile is the foundation. Without it, every networking action you take lands on an incomplete surface.',
      'Make contact with at least 3 UK-based professionals in your sector this week. Not a mass connection request — a personal message with a specific reason for connecting.',
      'Register for or attend one professional networking event — online or in person — before this stage is complete.',
      'Log your contacts in the tracker below. Every meaningful professional contact logged is a relationship being managed deliberately rather than left to chance.',
    ],
    resources: [
      { type: 'guide', title: 'Task 4.3 — Build your professional network in the UK: full guide', guideFile: 'Stages/STAGE 4/RareSena_Task4.3_Professional_Network_UK.html' },
      { type: 'guide', title: 'UK CV conventions: what to include, exclude, and never say', guideFile: 'Stages/files2/RareSena_Guide_UK_CV_Conventions_2.html' },
      { type: 'guide', title: 'Application Pipeline & Sponsor Check (interactive tool)', guideFile: 'Stages/files/RareSena_Tool_Application_Pipeline_Sponsor_Check.html' },
      { type: 'guide', title: 'Networking in the UK without pretending to be someone else', guideFile: 'Stages/files2/RareSena_Guide_Networking_UK_Authentically.html' },
      { type: 'checklist', title: 'LinkedIn profile checklist' },
    ],
    whatToExpectToFeel: 'Professional networking as an immigrant in the UK carries a specific discomfort that does not get talked about enough: the feeling that you are asking for something you have not yet earned, in a language that is not always yours, in a culture whose unspoken rules you are still learning. That feeling is real — and it does not mean you do not belong in these spaces. It means you are doing something genuinely hard. The discomfort reduces with every contact you make. It does not go away — it just becomes less loud.',
    completionPrompt: {
      type: 'checklist',
      prompt: 'Confirm all three networking actions before marking this task done.',
      items: [
        { key: 'linkedin', label: 'LinkedIn profile updated with UK-relevant experience and summary', inputType: 'checkbox' },
        { key: 'connections', label: 'Connected with at least 3 UK-based professionals', inputType: 'checkbox' },
        { key: 'event', label: 'Attended or registered for one networking event or online community', inputType: 'checkbox' },
      ],
    },
  },

  '4.4': {
    stage: 4,
    taskNumber: 4,
    title: 'Begin the Sovereignty Programme assessment',
    estimatedTime: '30–40 min',
    programmeFeatures: [
      { title: 'Personal coaching', desc: 'One-to-one sessions with Sena — the person who built this framework from inside the experience.' },
      { title: 'Regulated adviser access', desc: 'OISC-regulated immigration advisers for situations that require formal legal guidance.' },
      { title: 'Cohort community', desc: 'Peers navigating similar immigration situations — structured, confidential, and focused.' },
      { title: 'Self-paced content', desc: 'Structured modules covering every major UK immigration route change, ILR preparation, and sovereignty planning.' },
    ],
    programmePrice: 'From £3,500',
    programmePriceNote: 'Price subject to review · Payment plans available · Contact for current cohort availability',
    whyThisMatters: 'The Sovereignty Programme exists for a specific situation: an immigrant who is navigating immigration complexity — a visa that is becoming precarious, a route that needs to change, a settlement application that needs expert guidance — and who needs someone to walk alongside them through it, not just point them to a website.\n\nNot every user in Stage 4 needs the Sovereignty Programme right now. But every user in Stage 4 should know it exists, understand what it does, and be honest with themselves about whether they are in a situation that needs this level of support.\n\nThis task is not a sales prompt. It is a readiness assessment — a structured way of asking yourself: is my immigration situation one that I can navigate alone with the knowledge I have built in this app, or is it one that requires expert, regulated, hand-held support? The answer to that question should drive your decision.',
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Task 4.4 — Sovereignty Programme assessment: full guide', guideFile: 'Stages/STAGE 4/RareSena_Task4.4_Sovereignty_Programme.html' },
      { type: 'product', title: 'Sovereignty Programme (£3,500) — assessment and overview', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'The Sovereignty Programme is a significant financial investment — and if you are in Stage 4 of a rebuild, that number lands differently than it would at a different point in your life. The question this task asks is not "can you afford it right now" but "is this the thing that, if resolved, changes the trajectory of everything else?" For some users the answer is clearly yes. For others it is not yet. Both are honest answers — and this task accepts both.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'What is the one thing you most want to resolve about your immigration situation — and what would need to be true for you to feel ready to begin the Sovereignty Programme? (If your situation is stable and you do not currently need it, say so.)',
      minChars: 40,
    },
  },

  '4.5': {
    stage: 4,
    taskNumber: 5,
    title: 'Complete one project that demonstrates your direction',
    estimatedTime: 'This stage',
    projectExamples: [
      { track: 'All tracks', title: 'Complete UK CV and LinkedIn profile', desc: 'A finished, reviewed, UK-formatted CV and fully optimised LinkedIn profile — ready to use, not just drafted.' },
      { track: 'All tracks — overseas qualified', title: 'Submit ENIC application', desc: 'The Statement of Comparability applied for and tracked. A concrete step in the professional recognition sequence.' },
      { track: 'Creator tracks', title: 'UGC portfolio — 5 pieces', desc: 'Five completed UGC pieces across at least two categories. A media kit with rates, niche, and contact information.' },
      { track: 'Tracks A, C, D, E, F', title: 'Submit professional registration', desc: 'The NMC, GMC, GDC, SRA, or equivalent application submitted with all documents in order. Not started — done.' },
      { track: 'Tracks C, D, F, G, H', title: 'First client or first invoice', desc: 'First revenue generated in your field. Not a plan for first revenue — actual money invoiced or received.' },
      { track: 'Tracks G, H', title: 'Business plan or endorsement application', desc: 'The Innovator Founder endorsement application or self-sponsorship business plan completed, reviewed, and submitted.' },
      { track: 'All tracks — professional routes', title: 'Qualification exam sat or programme enrolled', desc: 'The CBT, OSCE, SQE1, or equivalent sat — or a structured study programme formally enrolled and started.' },
      { track: 'Any track', title: 'Custom project', desc: 'Something specific to your direction that does not fit a category above. Define it in the project brief in the guide.' },
    ],
    whyThisMatters: 'Everything in Stage 4 has been about direction and intention — defining your 90 days, identifying your income stream, building your network, assessing your immigration support needs. Task 4.5 is where intention becomes evidence.\n\nA project is not a plan. It is a completed thing — something that exists at the end of this stage that did not exist at the beginning. Something that demonstrates, to yourself and to others, that the direction you named in Task 4.1 is real.\n\nThe project does not need to be large. It needs to be real and it needs to be done. A completed ENIC application. A published piece of content. A first invoice sent. A professional portfolio built. A business plan submitted. A qualification exam sat. The scale matters less than the completion — because completion is the proof that you are a person who moves, not just a person who plans.',
    whatToDo: [
      'Choose a project from the examples below or define your own. It must be directly connected to your 90-day direction from Task 4.1 and completable within the remaining time in Stage 4.',
      'Use the project brief to define exactly what done looks like — not "work on my CV" but "a completed, UK-formatted CV ready to send to employers, reviewed by one professional in my sector."',
      'Set a completion date. Not a rough timeframe — a specific date. Mark it in your calendar now.',
      'When complete, paste a link, upload evidence, or describe the completed project in the prompt below. That evidence is what marks this task done.',
    ],
    resources: [
      { type: 'guide', title: 'Task 4.5 — Complete one demonstration project: full guide', guideFile: 'Stages/STAGE 4/RareSena_Task4.5_Demonstration_Project.html' },
      { type: 'guide', title: 'Project brief template', guideFile: 'Stages/files2/RareSena_Guide_Project_Brief_Template.html' },
      { type: 'circle_link', title: 'Rare Circle — Rise group (accountability)', group: 'Rise' },
    ],
    whatToExpectToFeel: 'Completing something in Stage 4 — even one thing — creates a disproportionate shift in your sense of agency. Not because the project itself is transformative, but because completion breaks the cycle of planning without proving. After Task 4.5, you are no longer someone who is going to do something. You are someone who has done something. That shift is internal, and it is permanent. Nobody can take it from you.',
    completionPrompt: {
      type: 'upload_link',
      prompt: 'Paste a link to the project, or describe it in 2–3 sentences and upload one piece of evidence.',
      fields: [
        { key: 'project_url', label: 'Project link (optional)', inputType: 'url', required: false, placeholder: 'https://...' },
        { key: 'project_description', label: 'Describe your project in 2–3 sentences', inputType: 'text', required: true, placeholder: 'What did you build, create, or complete?' },
      ],
    },
  },

  // ═══════════════════════════════════════
  // STAGE 5 — REALIZE
  // ═══════════════════════════════════════
  '5.1': {
    stage: 5,
    taskNumber: 1,
    title: 'Document your full rebuild journey',
    estimatedTime: '60–90 min',
    journeyStages: [
      { icon: '⚓', name: 'Reset', note: 'When survival was the whole agenda' },
      { icon: '🔭', name: 'Rediscover', note: 'When you found yourself under the rubble' },
      { icon: '⚙️', name: 'Routine', note: 'When structure replaced survival mode' },
      { icon: '📈', name: 'Rise', note: 'When intention became evidence' },
      { icon: '🌟', name: 'Realize', note: 'Your final stage — the completion' },
    ],
    whyThisMatters: 'You have crossed four stages. You stabilised when everything was unstable. You rediscovered who you are beneath what changed. You built a daily architecture that holds. You rose — with direction, income, network, and proof.\n\nTask 5.1 asks you to look back deliberately — not out of nostalgia, but because the story of your rebuild is an asset. It is evidence for yourself on the days when the old doubt returns. It is a map for the people coming behind you. And it is the raw material of the identity you carry forward: not "an immigrant who survived" but "a person who rebuilt — deliberately, stage by stage, on their own terms."\n\nEvery completion prompt you have written since Task 1.1 is part of this story. This task pulls them together into one document — your Rebuild Record — written in your voice, owned by you, exportable and permanent.',
    whatToDo: [
      'Review your pulled completion responses below — the record of what you wrote at each stage. Read them slowly. Notice the distance between the person who wrote Task 1.2 and the person reading it now.',
      'Complete the five reflection sections — one per stage. Each asks what actually happened in that stage of your life, beyond what the tasks captured.',
      'Write your closing statement — the paragraph you would want the person who arrived on day one to eventually read.',
      'Export your Rebuild Record as a PDF. It is yours. Keep it somewhere permanent. You may also choose to share parts of it in Rare Circle — many members say reading someone else\'s full journey was the moment they believed their own was possible.',
    ],
    resources: [
      { type: 'guide', title: 'Task 5.1 — Document your full rebuild journey: full guide', guideFile: 'Stages/STAGE 5/RareSena_Task5.1_Document_Rebuild_Journey.html' },
      { type: 'template', title: 'Journey documentation template — pulls in all completion prompt responses from Stages 1–5' },
    ],
    whatToExpectToFeel: 'Reading your own Stage 1 responses from where you now stand is one of the most powerful moments in the entire rebuild — and it can be unexpectedly emotional. The person who wrote those early answers was carrying so much and knew so little about what was coming. You are allowed to feel grief for them and pride at the same time. Both are accurate. That distance between then and now — that is the rebuild, measured not in tasks completed but in who you became while completing them.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'Looking at your full journey from Task 1.1 to now — what is the single biggest difference between the person who started and the person reading this?',
      minChars: 60,
    },
  },

  '5.2': {
    stage: 5,
    taskNumber: 2,
    title: 'Build one income stream that works without you daily',
    estimatedTime: '45–60 min setup · Activation this stage',
    visaComplianceNote: 'Before activating any second income stream, confirm it is permitted on your visa. Tracks C, D, E (post-grant), and F have broad freedom. Track A (Skilled Worker) cannot be self-employed — selling products or services likely counts as self-employment; get regulated advice first. Track B (Student) cannot be self-employed at all. Tracks G and H have business-tied conditions. Re-read your track\'s rules from Task 4.2 before choosing.',
    incomeStreamOptions: [
      { icon: '📦', title: 'Digital products', desc: 'Templates, guides, planners built from your professional expertise. Create once, sell repeatedly on Etsy, Gumroad, or your own shop.', effortSetup: 'Medium setup', effortOngoing: 'Low maintenance', visaNote: '✓ Tracks C, D, E (post-grant), F · ⚠ Tracks A, B: counts as self-employment — seek advice first' },
      { icon: '📱', title: 'UGC and creator income', desc: 'Creating content for brands — paid per piece, no audience required. Your immigrant perspective is a genuine content asset.', effortSetup: 'Medium setup', effortOngoing: 'Ongoing effort', visaNote: '✓ Tracks C, D, E (post-grant), F · ⚠ Tracks A, B: self-employment rules apply — seek advice' },
      { icon: '📊', title: 'Stocks and shares ISA', desc: 'Up to £20,000/year tax-free investing. Low-cost index funds. Genuinely passive — but long-term wealth building, not monthly income.', effortSetup: 'Low setup', effortOngoing: 'Truly passive', visaNote: '✓ Generally permitted on all tracks as personal investment — must be UK tax resident. Capital at risk.' },
      { icon: '🎓', title: 'Tutoring and teaching', desc: 'Teaching your language, professional skill, or academic subjects. Platforms: Preply, Superprof, Tutorful.', effortSetup: 'Low setup', effortOngoing: 'Time for money', visaNote: '✓ Tracks C, D, E (post-grant), F freely · Tracks A, B: only as employed work within permitted hours' },
      { icon: '🎬', title: 'Online course', desc: 'A structured course teaching what you know professionally. Higher effort to create, lower effort to maintain.', effortSetup: 'High setup', effortOngoing: 'Low maintenance after', visaNote: '✓ Tracks C, D, E (post-grant), F · ⚠ Tracks A, B: counts as self-employment — seek advice' },
      { icon: '🛠️', title: 'Freelance services', desc: 'Consulting, design, writing, analysis sold by project on Upwork, Fiverr, or direct to your Stage 4 network.', effortSetup: 'Low setup', effortOngoing: 'Active effort', visaNote: '✓ Tracks C, D, E (post-grant), F · ✗ Tracks A, B: self-employment not permitted · Tracks G, H: within business conditions' },
      { icon: '🏦', title: 'Interest income', desc: 'Moving savings from 0% accounts to 4–5% easy-access savers or Cash ISAs. Ten minutes of admin, genuinely passive returns.', effortSetup: '10-minute setup', effortOngoing: 'Truly passive', visaNote: '✓ All tracks — personal savings income is permitted on every visa' },
      { icon: '✨', title: 'Custom stream', desc: 'Something specific to your skills or situation not listed above. Define it in the plan — and verify visa compliance first.', effortSetup: 'Varies', effortOngoing: '', visaNote: '⚠ Verify against your track\'s conditions from Task 4.2 first' },
    ],
    whyThisMatters: 'One income source is a single point of failure. You know this in your body — because a single point of failure is precisely what made your arrival so precarious. One employer. One sponsor. One decision letter. One thread holding everything.\n\nSovereignty — the destination of this entire framework — is structural, not aspirational. It means your life stands on enough independent foundations that no single institution can pull it down. Task 4.2 established your primary income stream. This task adds the second: a stream that runs alongside your primary one, that you control, and that continues generating even when your attention is elsewhere.\n\nRealistic expectations matter here. "Passive" income is rarely passive at the start — it is front-loaded effort that pays over time. The goal for this task is not £1,000 a month. It is a second stream that is live, legal, and generating anything at all. From there, it compounds.',
    whatToDo: [
      'Choose one second-stream category below that is permitted on your visa and matches a skill or asset you already have. Do not pick the one with the biggest theoretical ceiling — pick the one you can activate fastest with what you already know.',
      'Complete the activation plan: what you are building, the first three actions, the date it goes live, and a realistic 6-month monthly income target.',
      'Take the first action within 7 days. The gap between planning and starting is where most second streams die.',
      'Complete the prompt when your stream is activated — meaning it exists in the world and can receive money, even if it has not yet.',
    ],
    resources: [
      { type: 'guide', title: 'Task 5.2 — Build a passive income stream: full guide', guideFile: 'Stages/STAGE 5/RareSena_Task5.2_Passive_Income_Stream.html' },
      { type: 'guide', title: 'Income options by visa type — what is permitted and what is not', guideFile: 'Stages/files2/RareSena_Guide_Income_Options_By_Visa_Type.html' },
      { type: 'product', title: 'Rare Studio membership (from £19.99/mo)', url: 'https://raresena.com' },
      { type: 'product', title: 'Sovereignty Programme – Graduate (£3,000)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'The first pound your second stream earns will feel disproportionately significant — more than its face value in any rational accounting. That is because it is not really a pound. It is proof of concept for a different kind of life: one where your income does not depend on a single institution\'s continued goodwill. Expect the early months to be slow. Expect to wonder if it is worth it. It is — not because of what it earns in month two, but because of what it becomes by year two, and what it makes impossible: the single letter that takes everything.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Name your passive or semi-passive income stream and the monthly revenue it generates or is projected to generate in 90 days.',
      fields: [
        { key: 'income_stream', label: 'Your income stream name', inputType: 'text', required: true, placeholder: 'e.g. Digital course, rental income, affiliate...' },
        { key: 'monthly_revenue', label: 'Monthly revenue or 90-day projection', inputType: 'text', required: true, placeholder: 'e.g. £400/mo, or £800 projected in 90 days' },
      ],
    },
  },

  '5.3': {
    stage: 5,
    taskNumber: 3,
    title: 'Mentor one person in an earlier stage',
    estimatedTime: 'Ongoing this stage',
    mentoringModes: [
      { icon: '💬', title: 'Rare Circle presence', desc: 'Regular, substantive replies in the Reset and Rediscover groups. Answer the questions you once had. Consistency over grand gestures.' },
      { icon: '🤝', title: 'One-to-one Circle mentoring', desc: 'Connect directly with one earlier-stage member. Two or more conversations during this stage.' },
      { icon: '🏘️', title: 'Someone you already know', desc: 'A newer arrival in your community, workplace, faith group, or family network. The mentoring most immigrants actually receive comes from exactly this.' },
      { icon: '🎓', title: 'Formal volunteering', desc: 'Structured mentoring through organisations working with refugees and new arrivals — see resources below.' },
    ],
    mentoringPrinciples: [
      'Listen before advising. The person in Stage 1 needs to be heard at least as much as they need information. Ask what is heaviest right now — then respond to that.',
      'Share the specifics, not the summary. "It gets better" helps nobody. "Monzo accepted my BRP when three high-street banks would not — do that first" changes someone\'s week.',
      'Never give immigration advice. Share your experience of a process freely — but eligibility, applications, and legal questions go to OISC-regulated advisers. Signpost, do not advise.',
      'Do not perform success. Share what failed, what you got wrong, what took three attempts. The person behind you needs a real road, not a highlight reel.',
      'Protect your own capacity. One person, held well, is worth more than five held badly. Modelling boundaries is itself mentorship.',
      'Point them to the framework. You are not their only resource. The stages, the tasks, the guides can hold them. Your role is the human bridge, not a replacement.',
    ],
    whyThisMatters: 'There is a person right now in Stage 1 — sitting with a number they are afraid to write down, a visa letter they have read fifteen times, a loneliness they have not admitted to anyone. You know exactly what that feels like, because you were that person.\n\nYou now hold something that no book, no app, and no adviser can fully replicate: the lived knowledge of what the road actually looks like from inside. Not theory. Not policy. The real thing — which banking app actually accepted your documents, what the OSCE waiting period actually does to your sleep, which small habit actually held on the worst day.\n\nMentoring in Stage 5 is not charity, and it is not an obligation. It is the completion of a loop. The knowledge you fought for becomes infrastructure for the next person — and something happens to your own rebuild when you articulate it for someone else: it consolidates. You understand what you did only when you have to explain it. This task asks for one person. Not a programme. One.',
    whatToDo: [
      'Choose how you will mentor — the options below range from structured Circle mentoring to informal support of someone you already know. All count. The medium matters less than the consistency.',
      'Make the offer. In Rare Circle, that means posting in an earlier-stage group or responding to someone\'s question with real depth. Outside the app, it means telling one person: "I have been through this — if you want to talk it through, I am here."',
      'Hold at least two conversations with the person you are supporting during this stage. One conversation is a nice moment. Two is the beginning of a relationship.',
      'Complete the prompt: who you are supporting (no names needed), what stage they are in, and one thing you shared that you wish someone had told you.',
    ],
    resources: [
      { type: 'guide', title: 'Task 5.3 — Mentor one person in an earlier stage: full guide', guideFile: 'Stages/STAGE 5/RareSena_Task5.3_Mentor_Someone.html' },
      { type: 'circle_link', title: 'Rare Circle — Realize group', group: 'Realize' },
    ],
    whatToExpectToFeel: 'Two things tend to surprise people about this task. The first is how much you know — answers will come out of you that you did not realise you were carrying. The second is how much it moves you to watch someone take your hard-won knowledge and skip a struggle you had to endure. Some people also feel a quieter thing: grief that nobody did this for them. If that arrives, let it. Then notice what you are doing about it — you are becoming the person you needed. That is not a consolation prize. That is the whole point of Realize.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'Who are you supporting (role and stage, not name), how have you connected, and what is one thing you shared that you wish someone had told you?',
      minChars: 50,
    },
  },

  '5.4': {
    stage: 5,
    taskNumber: 4,
    title: 'Complete your sovereignty plan',
    estimatedTime: '60–90 min',
    sovereigntyPillars: [
      { icon: '🛡️', title: 'Legal status pathway', tag: 'ILR → Citizenship', desc: 'This pillar has dates fixed by law. Most routes reach ILR eligibility at 5 years. Know your exact qualifying date — everything else orbits around it. Keep your continuous residence evidence file live from today.' },
      { icon: '💰', title: 'Financial architecture', tag: 'Multiple foundations', desc: 'Six months of expenses in emergency savings. Two income streams where no single one is more than 70% of total. Credit score in the Good band. Pension contributions at minimum 8%.' },
      { icon: '🏠', title: 'Housing security', tag: 'Rent → Own or secure', desc: 'From renting to owning — or securing long-term tenancy stability as a stepping stone. Lifetime ISA, deposit fund, and mortgage readiness timeline.' },
      { icon: '💼', title: 'Professional standing', tag: 'Recognition → Leadership', desc: 'A position where your expertise, not your visa, defines your options. ILR removes sponsorship dependence — plan now for the roles that become available then.' },
      { icon: '🌳', title: 'Legacy and family', tag: 'Beyond yourself', desc: 'Who and what does your sovereignty protect beyond yourself? Family reunification, children\'s status, will and guardianship arrangements, community contribution.' },
    ],
    reviewRhythmItems: [
      'Every quarter: review all five pillars, update dates, mark milestones reached',
      'Every visa event (renewal, absence, job change): check impact against the legal pillar immediately',
      'Once a year: re-read your sovereignty definition from Task 2.5 — revise it if you have outgrown it',
    ],
    whyThisMatters: 'In Task 2.5 you defined what sovereignty means to you. That was a compass. This task builds the map.\n\nA sovereignty plan is the structural blueprint for a life that cannot be destabilised by a single letter — from an employer, from the Home Office, from a landlord, from a bank. It covers five pillars: your legal status pathway, your financial architecture, your housing security, your professional standing, and your legacy. For each pillar, it names where you are now, where sovereign looks like, and the dated milestones between the two.\n\nThis is the most consequential document you will create in the entire rebuild. Everything before it was preparation. This is the plan you will still be executing in three years — reviewed quarterly, updated as life moves, and owned entirely by you.',
    whatToDo: [
      'Work through the five pillars below. For each: state honestly where you are today, define what sovereign looks like for you, and set at least one dated milestone.',
      'Be specific about your legal pathway — this pillar has hard dates set by law, not by ambition. Know your ILR-eligible date. Write it down. Everything else in the plan orbits around it.',
      'Set your review rhythm — sovereignty plans decay without review. Quarterly is the standard. Put the first review date in your calendar before completing this task.',
      'Complete the prompt with your three most important sovereignty milestones and their dates. These save to your dashboard permanently.',
    ],
    resources: [
      { type: 'guide', title: 'Task 5.4 — Complete your sovereignty plan: full guide', guideFile: 'Stages/STAGE 5/RareSena_Task5.4_Sovereignty_Plan.html' },
      { type: 'guide', title: 'ILR Evidence File Checklist (interactive tool)', guideFile: 'Stages/files/RareSena_Tool_ILR_Evidence_File_Checklist.html' },
      { type: 'guide', title: 'The ILR evidence file — what to keep and how to organise it', guideFile: 'Stages/files2/RareSena_Guide_ILR_Evidence_File.html' },
      { type: 'product', title: 'Sovereignty Programme – Graduate (£3,000)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Writing dates next to sovereignty milestones does something uncomfortable: it makes the distance visible. Your ILR date might be years away. The deposit fund might look impossibly far from today\'s balance. Let the distance be visible anyway — because the alternative is not a shorter distance, it is an unmapped one. Every immigrant who reached sovereignty crossed this same distance. The only difference between drifting toward it and building toward it is the plan you are holding right now.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'Name your three most important sovereignty milestones with their target dates. Be specific — a general answer will not do.',
      minChars: 60,
    },
  },

  '5.5': {
    stage: 5,
    taskNumber: 5,
    title: 'Define what you are giving back — and begin',
    estimatedTime: 'This stage and beyond',
    contributionOptions: [
      { icon: '📝', title: 'Write the guide you needed', desc: 'The specific, practical guide that did not exist when you needed it — your banking sequence, your registration route, your city\'s resources. Post it where the next person will find it.' },
      { icon: '🎙️', title: 'Tell your story publicly', desc: 'Share your Rebuild Record — or part of it — in Rare Circle or with an organisation that amplifies immigrant voices. Someone in Stage 1 needs proof this road has an end.' },
      { icon: '🏢', title: 'Open a door where you now stand', desc: 'Advocate inside your workplace or professional body — a referral scheme, an inclusive hiring conversation, a policy question raised. Institutional doors open from inside.' },
      { icon: '🛠️', title: 'Volunteer your professional skill', desc: 'Your professional skill given to an organisation serving immigrants — accounting for a charity, design for a community group, language support at a welcome centre.' },
      { icon: '🌱', title: 'Build something in your community', desc: 'A recurring meetup, a group for new arrivals, a monthly welcome gathering. Small infrastructure, maintained, compounds into belonging for many.' },
      { icon: '✨', title: 'Your own contribution', desc: 'Something only you can give, shaped by your specific journey. The only requirement: it outlives the moment you give it.' },
    ],
    completionCardBody: 'Reset. Rediscover. Routine. Rise. Realize.\n\nTwenty-five tasks. Five stages. One rebuild — yours.\n\nWhen you mark this task done, you join the people who did not just survive arrival in the UK but rebuilt deliberately, stage by stage, and then turned around to make the road easier for the next person. Your Rebuild Record is yours forever.\n\nYou came too far to stop. And you did not stop.',
    whyThisMatters: 'This is the last task of the 5R Rebuild Method — and it is deliberately not about you.\n\nTask 5.3 asked you to mentor one person. This task asks something structurally different: to make one contribution that outlives the conversation — something that continues helping people you will never meet. A written guide. A resource added to a community. A recorded story. A volunteered skill. A door held open inside an institution you now belong to.\n\nHere is why this is the final task and not an optional epilogue: sovereignty that ends at your own front door is just comfort. The full realisation of a rebuild is reached when the knowledge you paid for in fear, error, and time becomes infrastructure — when the road behind you is measurably easier to walk because you walked it first. That is the difference between having arrived and having built. This framework asks you to build.',
    whatToDo: [
      'Choose one contribution from the options below — or define your own. The test: does it keep working when you are not in the room?',
      'Make it real during this stage. Not planned — made. A guide written, not a guide intended. A story recorded, not a story considered.',
      'Place it where it will be found — Rare Circle, your community organisation, your professional network, your platform if you have one.',
      'Complete the prompt describing what you contributed and where it lives. This marks Task 5.5 — and the entire 5R Rebuild Method — complete.',
    ],
    resources: [
      { type: 'guide', title: 'Task 5.5 — Define what you are giving back: full guide', guideFile: 'Stages/STAGE 5/RareSena_Task5.5_Giving_Back.html' },
      { type: 'circle_link', title: 'Rare Circle — share your giving back publicly', group: 'Realize' },
    ],
    whatToExpectToFeel: 'Finishing something this long is strangely quiet. There is no ceremony — just an ordinary day on which you happen to complete the final task of a framework you started in a very different chapter of your life. Let it be quiet, and mark it anyway: tell one person, cook the meal from home, take the walk. And expect one more thing — the question "what now?" arrives quickly. The answer is already in your hands: the sovereignty plan from Task 5.4 is your map for the years ahead. The rebuild ends. The building does not.',
    completionPrompt: {
      type: 'reflection',
      prompt: 'What did you contribute, where does it live, and who is it for?',
      minChars: 50,
    },
  },
}

// Helper: get all tasks for a stage as ordered array
export function getStageTaskList(stageNum) {
  return [1, 2, 3, 4, 5].map(n => ({
    key: `${stageNum}.${n}`,
    ...ROADMAP_TASKS[`${stageNum}.${n}`],
  }))
}

// Helper: get track-adapted whatToDo steps
export function getWhatToDo(task, visaTrack) {
  if (!task.whatToDo) return null
  if (Array.isArray(task.whatToDo)) return task.whatToDo
  return task.whatToDo[visaTrack] || task.whatToDo['A'] || null
}

// Helper: get track note if exists
export function getTrackNote(task, visaTrack) {
  if (!task.trackNotes) return null
  return task.trackNotes[visaTrack] || null
}

// Stage group mapping for Circle integration
export const STAGE_CIRCLE_GROUP = {
  1: 'Reset',
  2: 'Rediscover',
  3: 'Routine',
  4: 'Rise',
  5: 'Realize',
}
