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
    whyThisMatters: 'Your visa expiry date is not a suggestion — it is the thing that can undo everything you are building. Most immigrants miss key deadlines because nobody told them to look for them on arrival. This task is non-negotiable.',
    whatToDo: {
      A: [
        'Log into your UKVI online account at gov.uk/view-prove-immigration-status.',
        'Screenshot your eVisa and note the visa expiry date.',
        'Calculate your 60-day window — if your employer\'s sponsor licence were revoked today, when would you need to act by?',
        'Set calendar reminders at 6 months, 3 months, and 1 month before expiry.',
      ],
      B: [
        'Locate your CAS number and Student visa expiry in your UKVI account.',
        'Note your maximum weekly hours: 20 hours during term, full-time in vacation.',
        'Find your institution\'s International Student Support office contact.',
        'Set reminders 6 months before visa expiry and at each new term start.',
      ],
      C: [
        'Note your visa expiry and your sponsor\'s visa status.',
        'Confirm your right to work — check your eVisa conditions.',
        'If your relationship is in difficulty, note the Domestic Abuse destitution concession — this is a specific immigration route. Citizens Advice can help.',
        'Set calendar reminders at 6 months, 3 months, and 1 month before expiry.',
      ],
      D: [
        'Activate your eVisa immediately if not done — your BRP is transitional only.',
        'Note passport linkage: your eVisa is tied to the passport you registered with.',
        'Note your 5-year settlement date.',
        'Create a UKVI account for every family member separately.',
      ],
      E: [
        'If awaiting decision: locate your ARC card and Migrant Help contact (0808 8010 503).',
        'If just granted status: you have approximately 28 days before asylum support ends — contact Migrant Help on the day of your grant letter.',
        'Note your move-on deadline and trigger housing and benefits actions immediately.',
        'Set a reminder for every critical action in the next 28 days.',
      ],
      F: [
        'Log into your UKVI online account and confirm your Global Talent visa expiry.',
        'Note your ILR timeline: 3 years for Exceptional Talent, 5 years for Exceptional Promise.',
        'Track your 180-day absence allowance — exceeding this affects ILR eligibility.',
        'Confirm your endorsed body requirements are still being met.',
        'Set calendar reminders at 6 months, 3 months, and 1 month before visa expiry.',
      ],
      G: [
        'Log into your UKVI account and confirm your Innovator Founder visa expiry.',
        'Note your mandatory checkpoint meetings at 12 and 24 months (£500 per meeting).',
        'Review your ILR milestones: must meet at least 2 of 4 — £50k actively spent on business, 2 full-time UK jobs (12 months), £1m annual turnover, or active 3rd-party contract (6 months).',
        'Confirm your endorsing body contact and monitoring schedule.',
        'Set calendar reminders at 6 months, 3 months, and 1 month before visa expiry.',
      ],
      H: [
        'Log into your UKVI account and confirm your Skilled Worker visa expiry.',
        'Review your sponsor licence compliance obligations — you must report changes within 20 working days.',
        'Confirm your salary meets the £41,700 threshold (July 2025) and your role qualifies as RQF Level 6.',
        'Note the 60-day curtailment risk if your sponsor licence is revoked.',
        'Set calendar reminders at 6 months, 3 months, and 1 month before expiry.',
      ],
    },
    resources: [
      { type: 'guide', title: 'How to read your eVisa and find every key date' },
      { type: 'download', title: 'Visa Deadline Tracker template' },
      { type: 'guide', title: 'How to create your UKVI account (step-by-step)' },
    ],
    whatToExpectToFeel: 'Looking at this information can bring up a lot. The system was not designed to make this easy to navigate — and knowing that is not an excuse, but it is an explanation. Take it one step at a time.',
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
      B: 'Include the 20-hour work cap in your income calculations.',
      C: 'If NRPF applies to you, note what you are and are not entitled to.',
      E: 'Asylum support is £7.02/day — note the cliff-edge date when this stops.',
    },
    resources: [
      { type: 'template', title: 'Basic Budget Builder — income vs expenses for UK new arrivals' },
      { type: 'guide', title: 'Breaking the banking catch-22: how to open a UK account with no credit history' },
      { type: 'guide', title: 'Building UK credit from zero: the 6-step sequence' },
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
      E: 'If in NASS/Home Office accommodation, your 28-day move-on starts from grant date — contact Migrant Help and local council housing team immediately.',
      C: 'If your living situation is unsafe, note the MARAC route and specialist housing support.',
    },
    resources: [
      { type: 'guide', title: 'Renting in the UK as a new arrival: your rights and how to use them' },
      { type: 'guide', title: 'How to check if your deposit is protected' },
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
    resources: [
      { type: 'interactive', title: 'Habit selector — 8 pre-set options with custom input' },
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
    resources: [
      { type: 'circle_link', title: 'Rare Circle — Reset group (Stage 1 members)', group: 'Reset' },
      { type: 'guide', title: 'How to introduce yourself in Rare Circle without oversharing' },
      { type: 'guide', title: 'Finding diaspora communities near you in the UK' },
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
    estimatedTime: '20–30 min',
    whyThisMatters: 'When everything external has changed — country, job, status, community, daily rhythm, language of the street — your values are the only constant. They did not cross the border and get checked at customs. They came with you.\n\nBut without naming them deliberately, values drift. You begin to rebuild by default — chasing what seems most urgent, most practical, most acceptable to the new system. And then one day you look up and realise you have been building someone else\'s life in a new country.\n\nThis exercise names your values before that can happen. It takes them out of the background and makes them structural — so that every decision about work, community, money, and direction in the stages ahead is tested against something that actually belongs to you.',
    whatToDo: [
      'Work through the 50 values below and select up to 10 that feel most true to who you are. Do not overthink. Your first instinct is usually more accurate than a considered choice.',
      'Once you have your top 10, review them and identify your top 3 — the three you would refuse to compromise, even under pressure.',
      'For each of your top 3: write one sentence on how this value showed up in your life before you arrived in the UK. Then write one sentence on how you intend it to show up here, in this rebuild, going forward.',
      'Save your values to your profile. They will be visible on your dashboard throughout the rebuild as a reminder of what you are building toward — and why.',
    ],
    resources: [
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
    estimatedTime: '25–40 min',
    whyThisMatters: 'Your qualifications and experience are real. The work you did, the problems you solved, the expertise you built — none of that disappeared when you crossed a border. But the UK market does not automatically recognise it. It has its own frameworks, its own conventions, and its own gatekeeping systems that were not designed with you in mind.\n\nUnderemployment is the defining professional struggle for immigrants in the UK. Research consistently shows that around a third of migrants are over-qualified for the jobs they hold — and that this is not about ability. It is about translation. The person who was a senior engineer, a practising lawyer, a hospital consultant, or a published academic in their home country can end up stacking shelves or working in a call centre — not because they lack the skills, but because nobody told them how the UK system works and what steps are needed to re-enter it.\n\nThis task tells you exactly what you are working with and what translation steps apply to your situation.',
    whatToDo: [
      'Use the skills inventory below to list your top 3 professional skills and your highest qualification. Be specific — not "management experience" but "managed a team of 12 engineers across two countries for three years."',
      'Check whether your qualification needs a UK ENIC Statement of Comparability — the official document that tells UK employers, universities, and professional bodies how your overseas qualification compares to UK standards. Cost: approximately £50–£100 + VAT. Apply at enic.org.uk.',
      'Check whether your profession requires UK registration before you can practise. Medicine, nursing, dentistry, law, teaching, engineering, social work, pharmacy, and architecture all have separate regulatory bodies with their own requirements.',
      'Use the professional summary builder below to draft your UK professional summary — a paragraph that describes who you are, what you do, and what you are looking for, in UK language and conventions.',
    ],
    resources: [
      { type: 'guide', title: 'Is my qualification recognised in the UK? The complete sector guide' },
      { type: 'external', title: 'UK ENIC Statement of Comparability application', url: 'https://www.enic.org.uk' },
      { type: 'interactive', title: 'UK professional summary builder' },
      { type: 'guide', title: 'UK CV conventions: what to include, exclude, and never say' },
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
    estimatedTime: '15–20 min',
    whyThisMatters: 'The pressure to assimilate in a new country is real, constant, and largely unspoken. It arrives through small moments — the way people look at you when you speak your first language in public, the advice to "anglicise" your name for job applications, the slow drift away from food, music, celebration, and ritual that once held your life together.\n\nThe research on this is clear and consistent: immigrants who maintain a meaningful connection to their heritage culture while building in the new one have measurably better mental health outcomes than those who abandon it entirely in pursuit of belonging. This is not nostalgia — it is protective. The parts of you that existed before you arrived are not obstacles to rebuilding. They are resources.\n\nThis task asks you to name one thing deliberately — before it gets lost in the noise of survival — and to make a commitment about how it stays present in your life here.',
    whatToDo: [
      'Reflect on this question: What one practice, tradition, language, food, ritual, music, or community connection do you refuse to give up — the thing that, if you stopped, would feel like losing a part of yourself? Take a moment with it. Do not pick something aspirational. Pick something true.',
      'Name it. Select a category below that resonates, then describe your specific anchor.',
      'Decide how it will remain present in your life in the UK specifically. Not "I will try to maintain it" — a concrete decision: what day, how often, with whom, in what form.',
      'Write it as a commitment statement using the builder below. This is saved to your profile as a permanent reminder of what you are protecting alongside what you are building.',
    ],
    resources: [],
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
    estimatedTime: '20–30 min',
    whyThisMatters: 'Research on immigrant wellbeing consistently identifies one finding above all others: belonging through work is the most reported route to feeling at home in the UK. But until work is established — until you are in a role that uses your skills, with colleagues who see what you bring — community is the bridge.\n\nBelonging does not happen passively. It does not arrive because you moved to a new country and started a new life. It happens because you make a decision, take an action, show up somewhere, and do it again. One community. One attendance. One introduction. That is what this task asks for — not a social life, not a network, just one deliberate move toward connection in the right direction.',
    whatToDo: [
      'Identify one community that is relevant to your life here — based on your background, profession, faith, interest, or simply your current stage in the rebuild. The directory below is organised by community type to help you find the right starting point.',
      'Join or attend once this week. Online counts. An in-person meetup counts. A Rare Circle post counts. The medium matters less than the action.',
      'Introduce yourself to one person in that space. One message, one conversation, one comment. That is all.',
      'Come back and complete the prompt below with what happened. What was the community? What did you do or say? What did you take from it?',
    ],
    resources: [
      { type: 'guide', title: 'Where to find your people in the UK: a directory by city and background' },
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
    estimatedTime: '20–30 min',
    whyThisMatters: 'Sovereignty is the end destination of the entire 5R framework. It is the word RareSena uses for a specific condition: a life that cannot be destabilised by a single letter — from an employer, from the Home Office, from a landlord, from a bank.\n\nBut sovereignty means something different for every person who arrives in the UK. For one person it is owning their own home so nobody can evict them. For another it is ILR and then citizenship, so no letter can ever threaten their right to stay. For another it is an income that does not depend on a single employer or a single visa condition. For another it is simply the freedom to call their mother without calculating the cost of the call.\n\nDefining what sovereignty means to you — specifically, concretely — gives every stage that follows a direction. Without a destination, rebuilding has no shape. With one, every task in every stage becomes a step toward something. That is the difference between surviving and building.',
    whatToDo: [
      'Read the RareSena definition of sovereignty in the app. Sit with it. Notice which parts land and which parts feel distant from your current reality.',
      'Select the dimensions of sovereignty that matter most to you personally — what does a sovereign life look like in your specific situation? Select all that apply and add detail for each one.',
      'Write your personal sovereignty definition using the builder below. It should be 2–3 sentences, specific to your life, and concrete enough that you will recognise when you have arrived.',
      'This definition is saved to your profile and displayed on your dashboard throughout the rebuild as a north star. Every stage is designed to move you closer to it.',
    ],
    resources: [
      { type: 'guide', title: 'What sovereignty means: the RareSena framework' },
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
    estimatedTime: '15–20 min',
    whyThisMatters: 'You made it through Stage 1 and Stage 2. You have stabilised the foundations, named your values, mapped your professional identity, and defined what you are building toward. Now comes the stage that separates the people who rebuild from the people who stay stuck in reset mode indefinitely.\n\nRoutine is not productivity theatre. It is not a 5am wake-up and a cold shower. A routine is the daily architecture that makes sustained progress possible without requiring willpower every single morning. Willpower is finite. Systems are not.\n\nThe morning routine you design in this task is specific to your life — your hours, your dependants, your commute, your visa obligations, your mental health on a bad day. It is not borrowed from someone else\'s life. It is yours, and it is designed to survive the difficult weeks, not just the easy ones.',
    whatToDo: [
      'Be honest about your real morning — not an ideal one. What time do you actually wake up? Do you have children to get ready? A commute? A shift pattern? Build around the life you have, not the life you want to have eventually.',
      'Use the routine builder below to map out your morning in 15–30 minute blocks from wake-up to the start of your working day. Include your Stage 1 anchor habit as one of the blocks.',
      'Apply the one rule that makes routines survivable: the 2-minute minimum. Every item in your routine should have a 2-minute version — the smallest possible version of that activity that still counts. On a terrible morning, the 2-minute version is what keeps the routine alive.',
      'Decide what your routine looks like on a bad day — when everything is running late, when you are anxious, when the visa anxiety is loud. Name the three things that are non-negotiable even then. Everything else is optional on bad days.',
    ],
    resources: [
      { type: 'interactive', title: 'Morning routine builder — time slots, habit categories, custom items' },
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
    estimatedTime: '20–25 min',
    whyThisMatters: 'One habit — your Stage 1 anchor — gave you a point of certainty in an uncertain day. Five habits give you an architecture. The difference between a person rebuilding and a person thriving is almost always visible in their daily structure — not their talent, not their opportunity, not their visa track. Their structure.\n\nThe five habits you identify here are not aspirational. They are not the habits of a person who has already arrived. They are the habits of a person who is building — deliberately, consistently, on a foundation that survives a bad week. Each one is chosen to address a specific dimension of the rebuild: body, mind, finances, connection, and forward progress. One per dimension. Five total. Every day.',
    whatToDo: [
      'Your anchor habit from Stage 1 is already Habit 1. You need four more — one from each remaining dimension: body, finances, connection, and forward progress.',
      'Select one habit from each category below. Choose the one that is most honest for your life right now — not the most impressive. You can always upgrade later. A kept simple habit beats an abandoned ambitious one every time.',
      'Confirm all five in the completion checklist at the bottom. Each must be ticked before the task can be marked done — this is not a self-certification. It is a commitment.',
      'Your five habits will seed the in-app daily tracker. Each morning you log them. The streak tracker counts consecutive days across all five. Stage 3, Task 3.4 auto-completes when you reach 30 consecutive days.',
    ],
    resources: [
      { type: 'interactive', title: 'Habit library — 30 pre-set habits by category with custom input' },
      { type: 'tracker', title: 'In-app streak tracker' },
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
    whatToDo: null,
    resources: [
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
    title: 'Create a basic financial tracking system',
    estimatedTime: '20–30 min',
    whyThisMatters: 'In Stage 1 you identified your most pressing financial gap and named one action to address it. That was triage — the emergency response. Stage 3 is where triage becomes system. A financial tracking system is not about spreadsheets or deprivation. It is about visibility. You cannot build toward financial sovereignty without knowing exactly what is coming in, what is going out, and what the distance is between where you are now and the first concrete financial goal.\n\nThis task has two parts: tracking and direction. The tracker gives you the monthly picture. The goal builder gives the picture a destination. Together they turn financial survival mode into financial intention — and financial intention is the first step toward the kind of independence that makes you unstoppable.',
    whatToDo: [
      'Complete the monthly tracker below — income, essential expenses, and discretionary spending. This is the operational picture: where the money actually is.',
      'Use the goal builder to define your first financial goal — not "save more money" but a specific target, a specific date, and a specific plan for how you get there.',
      'Set a monthly tracker reminder. The tracker is only useful if you update it every month. Pick a date — the first of the month, or the last Sunday — and set it now.',
      'Complete the prompt with your three numbers: monthly income, monthly expenses, and your financial goal target. All three required.',
    ],
    resources: [
      { type: 'template', title: 'Monthly income vs expenses tracker — pre-filled with UK categories' },
      { type: 'guide', title: 'Reading your UK credit report: Experian, Equifax, TransUnion' },
      { type: 'guide', title: 'How rent reporting tools build your credit score' },
    ],
    whatToExpectToFeel: 'Setting a financial goal when money is tight can feel like cruelty — like being asked to dream about a destination when you are not sure you can afford the bus. Do it anyway. The goal is not a fantasy. It is a structural device. It changes the relationship between income and expenditure from passive to intentional. Even if the first month you can only save £10 toward the goal — £10 toward something is categorically different from £10 spent on nothing. Direction matters more than speed.',
    completionPrompt: {
      type: 'field_entry',
      prompt: 'Enter your monthly income total, monthly essential expenses total, and the gap or surplus.',
      fields: [
        { key: 'monthly_income', label: 'Monthly income total (£)', inputType: 'text', required: true, placeholder: 'e.g. £1,800' },
        { key: 'monthly_expenses', label: 'Monthly essential expenses total (£)', inputType: 'text', required: true, placeholder: 'e.g. £1,400' },
        { key: 'gap_surplus', label: 'Gap or surplus', inputType: 'text', required: true, placeholder: 'e.g. £400 surplus, or £200 gap' },
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
    estimatedTime: '15–20 min',
    whyThisMatters: 'You have stabilised. You have rediscovered who you are beneath what changed. You have built a daily architecture that holds. Now comes the question that Stage 4 is built around: what are you actually building toward in the next 90 days?\n\nNot in your life generally. Not eventually. In the next 90 days, specifically. One direction. One sentence.\n\nThe 90-day window is deliberate. It is long enough to accomplish something real. Short enough to stay specific. And precise enough that at the end of it, you will know whether you moved or not — not by feeling, but by fact.\n\nStage 3 gave you a routine. Stage 4 gives that routine a direction. Without this task, everything you do consistently goes nowhere in particular. With it, every habit, every weekly review, every financial decision has a destination.',
    whatToDo: [
      'Select your primary path below — the one area where the next 90 days will be most focused. You are not abandoning the others. You are choosing what gets your primary energy and attention for this window.',
      'Read the example direction statements for your path. Select one that resonates or use it as a starting point to write your own.',
      'Use the direction builder to turn your focus area into one precise sentence starting with: "In the next 90 days I will..."',
      'Set three milestones — what you will have achieved at 30 days, 60 days, and 90 days. These become your Stage 4 checkpoints.',
      'Your direction statement saves to your profile dashboard. It appears at the top of your Stage 4 view every time you open the app — a constant reminder of what this window is for.',
    ],
    resources: [
      { type: 'template', title: '90-day direction framework — embedded worksheet' },
      { type: 'guide', title: 'Example direction statements by sector and visa track' },
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
    estimatedTime: '30–45 min',
    whyThisMatters: 'By Stage 4 you have a routine, a direction, and a financial tracking system. Now comes the question that determines whether the rebuild becomes sovereign or stays precarious: where is your income coming from, and is it building toward independence or deepening dependence?\n\nMost immigrants in the UK reach Stage 4 with one income source — usually employment or a single employer — and no plan for what happens if that source disappears. A Skilled Worker who loses their sponsor. A student who graduates and enters the 60-day clock. A spouse whose relationship changes. A refugee whose Universal Credit is reviewed.\n\nThis task is about identifying the primary income stream that is right for your visa track and your stage — and taking the first concrete action to activate or grow it. Not a plan. An action. This week.',
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Income stream guide by visa track — what is permitted and what is not' },
      { type: 'circle_link', title: 'Rare Studio — creator pathway', group: 'Rise' },
      { type: 'guide', title: 'Employment pathway: Breaking Barriers, RefuAid, sector job boards' },
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
    estimatedTime: '30–45 min',
    whyThisMatters: 'Research on immigrant employment in the UK is consistent on one finding: professional networks are the single most powerful determinant of whether an immigrant rebuilds at their skill level or stays trapped below it. Not qualifications. Not language. Networks.\n\nMost immigrants in the UK are undernetworked relative to their UK-born peers — not because they are less capable of building relationships, but because they arrived without the inherited professional networks that UK-educated professionals accumulate over years of study and early career. Every connection you build deliberately in Stage 4 is closing a gap that the system created, not you.\n\nThis task is not about collecting LinkedIn connections. It is about building three things: visibility in your sector, relationships with people who can open doors, and a professional presence that accurately represents what you bring.',
    whatToDo: [
      'Complete the LinkedIn profile checklist below. A complete, accurate, UK-optimised LinkedIn profile is the foundation. Without it, every networking action you take lands on an incomplete surface.',
      'Make contact with at least 3 UK-based professionals in your sector this week. Not a mass connection request — a personal message with a specific reason for connecting.',
      'Register for or attend one professional networking event — online or in person — before this stage is complete.',
      'Log your contacts in the tracker below. Every meaningful professional contact logged is a relationship being managed deliberately rather than left to chance.',
    ],
    resources: [
      { type: 'guide', title: 'Networking in the UK without pretending to be someone else' },
      { type: 'checklist', title: 'LinkedIn profile checklist' },
      { type: 'guide', title: 'Directory of UK professional communities by sector' },
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
    estimatedTime: '20–30 min',
    whyThisMatters: 'The Sovereignty Programme exists for a specific situation: an immigrant who is navigating immigration complexity — a visa that is becoming precarious, a route that needs to change, a settlement application that needs expert guidance — and who needs someone to walk alongside them through it, not just point them to a website.\n\nNot every user in Stage 4 needs the Sovereignty Programme right now. But every user in Stage 4 should know it exists, understand what it does, and be honest with themselves about whether they are in a situation that needs this level of support.\n\nThis task is not a sales prompt. It is a readiness assessment — a structured way of asking yourself: is my immigration situation one that I can navigate alone with the knowledge I have built in this app, or is it one that requires expert, regulated, hand-held support? The answer to that question should drive your decision.',
    whatToDo: null,
    resources: [
      { type: 'product', title: 'Sovereignty Programme (£3,500) — assessment and overview', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'The Sovereignty Programme is a significant financial investment — and if you are in Stage 4 of a rebuild, that number lands differently than it would at a different point in your life. The question this task asks is not "can you afford it right now" but "is this the thing that, if resolved, changes the trajectory of everything else?" For some users the answer is clearly yes. For others it is not yet. Both are honest answers — and this task accepts both.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'What is the one thing you most want to solve by the end of the Sovereignty Programme? If you are not yet ready, what would need to be true for you to begin?',
      minChars: 30,
    },
  },

  '4.5': {
    stage: 4,
    taskNumber: 5,
    title: 'Complete one project that demonstrates your direction',
    estimatedTime: 'Ongoing',
    whyThisMatters: 'Everything in Stage 4 has been about direction and intention — defining your 90 days, identifying your income stream, building your network, assessing your immigration support needs. Task 4.5 is where intention becomes evidence.\n\nA project is not a plan. It is a completed thing — something that exists at the end of this stage that did not exist at the beginning. Something that demonstrates, to yourself and to others, that the direction you named in Task 4.1 is real.\n\nThe project does not need to be large. It needs to be real and it needs to be done. A completed ENIC application. A published piece of content. A first invoice sent. A professional portfolio built. A business plan submitted. A qualification exam sat. The scale matters less than the completion — because completion is the proof that you are a person who moves, not just a person who plans.',
    whatToDo: [
      'Choose a project from the examples below or define your own. It must be directly connected to your 90-day direction from Task 4.1 and completable within the remaining time in Stage 4.',
      'Use the project brief to define exactly what done looks like — not "work on my CV" but "a completed, UK-formatted CV ready to send to employers, reviewed by one professional in my sector."',
      'Set a completion date. Not a rough timeframe — a specific date. Mark it in your calendar now.',
      'When complete, paste a link, upload evidence, or describe the completed project in the prompt below. That evidence is what marks this task done.',
    ],
    resources: [
      { type: 'template', title: 'Project brief template' },
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
    estimatedTime: '30–45 min',
    whyThisMatters: 'You have crossed four stages. You stabilised when everything was unstable. You rediscovered who you are beneath what changed. You built a daily architecture that holds. You rose — with direction, income, network, and proof.\n\nTask 5.1 asks you to look back deliberately — not out of nostalgia, but because the story of your rebuild is an asset. It is evidence for yourself on the days when the old doubt returns. It is a map for the people coming behind you. And it is the raw material of the identity you carry forward: not "an immigrant who survived" but "a person who rebuilt — deliberately, stage by stage, on their own terms."\n\nEvery completion prompt you have written since Task 1.1 is part of this story. This task pulls them together into one document — your Rebuild Record — written in your voice, owned by you, exportable and permanent.',
    whatToDo: [
      'Review your pulled completion responses below — the record of what you wrote at each stage. Read them slowly. Notice the distance between the person who wrote Task 1.2 and the person reading it now.',
      'Complete the five reflection sections — one per stage. Each asks what actually happened in that stage of your life, beyond what the tasks captured.',
      'Write your closing statement — the paragraph you would want the person who arrived on day one to eventually read.',
      'Export your Rebuild Record as a PDF. It is yours. Keep it somewhere permanent. You may also choose to share parts of it in Rare Circle — many members say reading someone else\'s full journey was the moment they believed their own was possible.',
    ],
    resources: [
      { type: 'template', title: 'Journey documentation template — pulls in all completion prompt responses from Stages 1–5' },
    ],
    whatToExpectToFeel: 'Reading your own Stage 1 responses from where you now stand is one of the most powerful moments in the entire rebuild — and it can be unexpectedly emotional. The person who wrote those early answers was carrying so much and knew so little about what was coming. You are allowed to feel grief for them and pride at the same time. Both are accurate. That distance between then and now — that is the rebuild, measured not in tasks completed but in who you became while completing them.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'In 3–5 sentences, describe where you were when you started Reset and where you are now. What is the most important thing the journey taught you?',
      minChars: 80,
    },
  },

  '5.2': {
    stage: 5,
    taskNumber: 2,
    title: 'Build one income stream that works without you daily',
    estimatedTime: 'Ongoing',
    whyThisMatters: 'One income source is a single point of failure. You know this in your body — because a single point of failure is precisely what made your arrival so precarious. One employer. One sponsor. One decision letter. One thread holding everything.\n\nSovereignty — the destination of this entire framework — is structural, not aspirational. It means your life stands on enough independent foundations that no single institution can pull it down. Task 4.2 established your primary income stream. This task adds the second: a stream that runs alongside your primary one, that you control, and that continues generating even when your attention is elsewhere.\n\nRealistic expectations matter here. "Passive" income is rarely passive at the start — it is front-loaded effort that pays over time. The goal for this task is not £1,000 a month. It is a second stream that is live, legal, and generating anything at all. From there, it compounds.',
    whatToDo: [
      'Choose one second-stream category below that is permitted on your visa and matches a skill or asset you already have. Do not pick the one with the biggest theoretical ceiling — pick the one you can activate fastest with what you already know.',
      'Complete the activation plan: what you are building, the first three actions, the date it goes live, and a realistic 6-month monthly income target.',
      'Take the first action within 7 days. The gap between planning and starting is where most second streams die.',
      'Complete the prompt when your stream is activated — meaning it exists in the world and can receive money, even if it has not yet.',
    ],
    resources: [
      { type: 'guide', title: 'Digital product and passive income for immigrants: what is visa-compliant and how to build it' },
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
    estimatedTime: 'Ongoing',
    whyThisMatters: 'There is a person right now in Stage 1 — sitting with a number they are afraid to write down, a visa letter they have read fifteen times, a loneliness they have not admitted to anyone. You know exactly what that feels like, because you were that person.\n\nYou now hold something that no book, no app, and no adviser can fully replicate: the lived knowledge of what the road actually looks like from inside. Not theory. Not policy. The real thing — which banking app actually accepted your documents, what the OSCE waiting period actually does to your sleep, which small habit actually held on the worst day.\n\nMentoring in Stage 5 is not charity, and it is not an obligation. It is the completion of a loop. The knowledge you fought for becomes infrastructure for the next person — and something happens to your own rebuild when you articulate it for someone else: it consolidates. You understand what you did only when you have to explain it. This task asks for one person. Not a programme. One.',
    whatToDo: [
      'Choose how you will mentor — the options below range from structured Circle mentoring to informal support of someone you already know. All count. The medium matters less than the consistency.',
      'Make the offer. In Rare Circle, that means posting in an earlier-stage group or responding to someone\'s question with real depth. Outside the app, it means telling one person: "I have been through this — if you want to talk it through, I am here."',
      'Hold at least two conversations with the person you are supporting during this stage. One conversation is a nice moment. Two is the beginning of a relationship.',
      'Complete the prompt: who you are supporting (no names needed), what stage they are in, and one thing you shared that you wish someone had told you.',
    ],
    resources: [
      { type: 'circle_link', title: 'Rare Circle — Realize group', group: 'Realize' },
      { type: 'guide', title: 'Mentor introduction guide — how to support without overpromising' },
    ],
    whatToExpectToFeel: 'Two things tend to surprise people about this task. The first is how much you know — answers will come out of you that you did not realise you were carrying. The second is how much it moves you to watch someone take your hard-won knowledge and skip a struggle you had to endure. Some people also feel a quieter thing: grief that nobody did this for them. If that arrives, let it. Then notice what you are doing about it — you are becoming the person you needed. That is not a consolation prize. That is the whole point of Realize.',
    completionPrompt: {
      type: 'text_response',
      prompt: 'Who are you mentoring or supporting, what stage are they in, and what is one thing you have shared with them so far?',
      minChars: 30,
    },
  },

  '5.4': {
    stage: 5,
    taskNumber: 4,
    title: 'Complete your sovereignty plan',
    estimatedTime: '45–60 min',
    whyThisMatters: 'In Task 2.5 you defined what sovereignty means to you. That was a compass. This task builds the map.\n\nA sovereignty plan is the structural blueprint for a life that cannot be destabilised by a single letter — from an employer, from the Home Office, from a landlord, from a bank. It covers five pillars: your legal status pathway, your financial architecture, your housing security, your professional standing, and your legacy. For each pillar, it names where you are now, where sovereign looks like, and the dated milestones between the two.\n\nThis is the most consequential document you will create in the entire rebuild. Everything before it was preparation. This is the plan you will still be executing in three years — reviewed quarterly, updated as life moves, and owned entirely by you.',
    whatToDo: [
      'Work through the five pillars below. For each: state honestly where you are today, define what sovereign looks like for you, and set at least one dated milestone.',
      'Be specific about your legal pathway — this pillar has hard dates set by law, not by ambition. Know your ILR-eligible date. Write it down. Everything else in the plan orbits around it.',
      'Set your review rhythm — sovereignty plans decay without review. Quarterly is the standard. Put the first review date in your calendar before completing this task.',
      'Complete the prompt with your three most important sovereignty milestones and their dates. These save to your dashboard permanently.',
    ],
    resources: [
      { type: 'template', title: 'Sovereignty Plan framework — ILR timeline, financial targets, housing plan, legacy statement' },
      { type: 'product', title: 'Sovereignty Programme – Graduate (£3,000)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Writing dates next to sovereignty milestones does something uncomfortable: it makes the distance visible. Your ILR date might be years away. The deposit fund might look impossibly far from today\'s balance. Let the distance be visible anyway — because the alternative is not a shorter distance, it is an unmapped one. Every immigrant who reached sovereignty crossed this same distance. The only difference between drifting toward it and building toward it is the plan you are holding right now.',
    completionPrompt: {
      type: 'checklist',
      prompt: 'Confirm all four elements of your sovereignty plan are complete.',
      items: [
        { key: 'ilr', label: 'ILR/settlement pathway identified and key dates noted', inputType: 'checkbox' },
        { key: 'financial', label: 'Financial independence target set with a specific figure and date', inputType: 'checkbox' },
        { key: 'housing', label: 'Housing plan documented — own, rent long-term, or other', inputType: 'checkbox' },
        { key: 'legacy', label: 'Legacy statement written — what you are building beyond yourself', inputType: 'checkbox' },
      ],
    },
  },

  '5.5': {
    stage: 5,
    taskNumber: 5,
    title: 'Define what you are giving back — and begin',
    estimatedTime: '20–30 min',
    whyThisMatters: 'This is the last task of the 5R Rebuild Method — and it is deliberately not about you.\n\nTask 5.3 asked you to mentor one person. This task asks something structurally different: to make one contribution that outlives the conversation — something that continues helping people you will never meet. A written guide. A resource added to a community. A recorded story. A volunteered skill. A door held open inside an institution you now belong to.\n\nHere is why this is the final task and not an optional epilogue: sovereignty that ends at your own front door is just comfort. The full realisation of a rebuild is reached when the knowledge you paid for in fear, error, and time becomes infrastructure — when the road behind you is measurably easier to walk because you walked it first. That is the difference between having arrived and having built. This framework asks you to build.',
    whatToDo: [
      'Choose one contribution from the options below — or define your own. The test: does it keep working when you are not in the room?',
      'Make it real during this stage. Not planned — made. A guide written, not a guide intended. A story recorded, not a story considered.',
      'Place it where it will be found — Rare Circle, your community organisation, your professional network, your platform if you have one.',
      'Complete the prompt describing what you contributed and where it lives. This marks Task 5.5 — and the entire 5R Rebuild Method — complete.',
    ],
    resources: [
      { type: 'guide', title: 'Contribution ideas library — by background, skill, and capacity' },
      { type: 'circle_link', title: 'Rare Circle — share your giving back publicly', group: 'Realize' },
    ],
    whatToExpectToFeel: 'Finishing something this long is strangely quiet. There is no ceremony — just an ordinary day on which you happen to complete the final task of a framework you started in a very different chapter of your life. Let it be quiet, and mark it anyway: tell one person, cook the meal from home, take the walk. And expect one more thing — the question "what now?" arrives quickly. The answer is already in your hands: the sovereignty plan from Task 5.4 is your map for the years ahead. The rebuild ends. The building does not.',
    completionPrompt: {
      type: 'reflection',
      prompt: 'What are you giving back, to whom, and why does this matter to you? Describe the action you have already taken or will take this week.',
      minChars: 60,
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
