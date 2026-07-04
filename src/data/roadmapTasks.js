// src/data/roadmapTasks.js
// Full task content for all 5 stages × 5 tasks = 25 tasks
// whatToDo can be an array (same for all tracks) or an object keyed by track ID (A-H)
// completionPrompt types: 'text_response' | 'field_entry' | 'checklist' | 'reflection' | 'upload_link'

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
    whyThisMatters: 'Financial instability is the number one reason immigrants cannot focus on rebuilding. Until you know exactly where the gap is, you cannot close it. This task forces clarity before action.',
    whatToDo: [
      'List all monthly income sources: employment, partner, benefits if eligible, savings.',
      'List all monthly essential expenses: rent, bills, food, transport, phone.',
      'Identify the single largest gap or the most precarious item.',
      'Name one specific action to address it this week — not a plan, one action.',
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
    whatToExpectToFeel: 'Seeing the numbers clearly can feel frightening. Most people avoid this task because the gap feels too large to face. Looking at it directly is the only way to make it smaller.',
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
    whyThisMatters: 'Without stable housing, nothing else is possible. The UK private rental market is harder to access as a new arrival than almost anywhere else in the world. You need to know your rights before you sign anything.',
    whatToDo: [
      'Clarify your current housing status: owned, rented (assured/periodic), temporary, or unstable.',
      'If renting: locate your tenancy agreement and note the start date, rent amount, and deposit amount.',
      'Check your deposit is protected in a government-approved scheme: DPS, MyDeposits, or TDS.',
      'Know your landlord\'s Right to Rent check obligations and your rights under the Equality Act if you face discrimination.',
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
    whatToExpectToFeel: 'Housing uncertainty is one of the most destabilising parts of arrival. If your situation is not yet stable, completing this task is more important — not less. It starts with knowing where you stand.',
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
    whyThisMatters: 'Chaos is the default state of arrival. A single daily habit — done at the same time, in the same way — creates a structure that holds everything else. It does not need to be impressive. It needs to be consistent.',
    whatToDo: [
      'Choose ONE habit: morning journal (5 min), 10-min walk, one task completed before 10am, one gratitude note, or weekly review. You can define your own.',
      'Attach it to something you already do — wake up, morning coffee, after brushing teeth.',
      'Set a daily reminder in the app at your chosen time.',
      'Commit to 7 consecutive days before evaluating.',
    ],
    resources: [
      { type: 'interactive', title: 'Habit selector — 8 pre-set options with custom input' },
      { type: 'tracker', title: 'In-app streak tracker — current streak, best streak, last logged date' },
    ],
    whatToExpectToFeel: 'The urge to pick something ambitious is strong. Resist it. The value of this task is not the habit you pick — it is the act of deciding and keeping a decision. That is the foundation everything else is built on.',
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
    whyThisMatters: 'Loneliness in the first weeks is near-universal among new arrivals — and it predicts worse mental health outcomes over the next two years. One connection that does not require you to explain yourself changes the trajectory. This is not a nice-to-have.',
    whatToDo: [
      'Identify whether this person exists in your life already — a friend, community member, or colleague.',
      'If not: open Rare Circle and introduce yourself in the Reset group.',
      'Send one message to one person this week — not a long explanation, just contact.',
      'Note who it is and what the connection is.',
    ],
    resources: [
      { type: 'circle_link', title: 'Rare Circle — Reset group (Stage 1 members)', group: 'Reset' },
      { type: 'guide', title: 'How to introduce yourself in Rare Circle without oversharing' },
      { type: 'guide', title: 'Finding diaspora communities near you in the UK' },
    ],
    whatToExpectToFeel: 'Reaching out can feel vulnerable, especially when you are not sure how to explain what you are going through. You do not have to explain everything. One honest sentence is enough.',
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
    whyThisMatters: 'When everything external has changed — country, job, status, community — your values are the only constant. Knowing what they are prevents you from rebuilding someone else\'s life in a new country.',
    whatToDo: [
      'Open the Values Exercise in the app.',
      'From a list of 50 values, select your top 10.',
      'From your top 10, identify your top 3.',
      'For each of your top 3: write one sentence on how this value showed up in your life before arrival, and one sentence on how you want it to show up now.',
    ],
    resources: [
      { type: 'interactive', title: 'Values card sort — 50 values, select and save to profile' },
      { type: 'template', title: 'Reflection template pre-filled with your top 3 values' },
      { type: 'product', title: '5R Rebuild Workbook (£22)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'This exercise feels simple until you get to the top 3. The difficulty of choosing is the point — it forces you to confront what actually matters, versus what you have been told should matter.',
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
    whyThisMatters: 'Your qualifications and experience are real — but the UK market does not automatically recognise them. Knowing exactly what you are working with and what translation is required is the difference between being stuck and moving forward.',
    whatToDo: [
      'List your top 3 professional skills and your highest qualification.',
      'Check whether your qualification needs a UK ENIC Statement of Comparability — required for most regulated professions and many employers.',
      'Identify whether your profession requires UK registration: medicine, law, teaching, engineering — each has a regulatory body.',
      'Build a one-paragraph UK professional summary in your own words.',
    ],
    resources: [
      { type: 'guide', title: 'Is my qualification recognised in the UK? The complete sector guide' },
      { type: 'external', title: 'UK ENIC Statement of Comparability application', url: 'https://www.enic.org.uk' },
      { type: 'interactive', title: 'UK professional summary builder' },
      { type: 'guide', title: 'UK CV conventions: what to include, exclude, and never say' },
      { type: 'product', title: 'Stage Worksheets Bundle (£25)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: 'Mapping your identity to a new system can feel reductive — as though your full professional self is being squeezed into boxes that were not made for you. That frustration is valid. This task is about strategy, not about who you are.',
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
    whyThisMatters: 'Integration does not require erasure. The research is clear: immigrants who maintain a meaningful connection to their heritage culture while building in a new country have better mental health outcomes. This task names that anchor deliberately — before it gets lost.',
    whatToDo: [
      'Reflect: what one practice, tradition, language, food, ritual, or community connection do you refuse to give up?',
      'Name it specifically.',
      'Decide how it will remain present in your life in the UK.',
      'Write it as a commitment statement.',
    ],
    resources: [],
    whatToExpectToFeel: 'This can bring up grief — for what you left behind, for what cannot travel with you, for who you were before. That grief is real. This task is not about pretending the loss is not there. It is about deciding what comes with you anyway.',
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
    whyThisMatters: 'Belonging does not happen passively. It requires a decision and an action. Working is the most reported route to belonging for new arrivals — but until work is established, community is the bridge.',
    whatToDo: [
      'Identify one community that is relevant to your life here: diaspora group, professional network, faith community, local group, or Rare Circle.',
      'Join or attend once this week.',
      'Introduce yourself to one person in that space.',
    ],
    resources: [
      { type: 'guide', title: 'Where to find your people in the UK: a directory by city and background' },
      { type: 'circle_link', title: 'Rare Circle — Rediscover group', group: 'Rediscover' },
    ],
    whatToExpectToFeel: 'The first time in a new space is almost always uncomfortable. The point is not to feel at home immediately — it is to show up. Belonging comes from repeated presence, not from a perfect first impression.',
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
    whyThisMatters: 'Sovereignty is the end destination of the entire 5R framework — but it means something different for every person. Defining it early gives every subsequent stage a direction. Without a destination, rebuilding has no shape.',
    whatToDo: [
      'Read the RareSena definition of sovereignty in the app.',
      'Write your own: what does a life that cannot be destabilised by a single letter look like for you specifically?',
      'Be concrete — name at least two tangible outcomes: financial, professional, residential, legal, or relational.',
    ],
    resources: [
      { type: 'guide', title: 'What sovereignty means: the RareSena framework' },
    ],
    whatToExpectToFeel: 'This question is bigger than it looks. Give yourself the time to sit with it. The most important word is "specifically" — vague sovereignty is not sovereignty, it is just hope.',
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
    whyThisMatters: null, // To be written by Sena
    whatToDo: null, // To be written by Sena
    resources: [
      { type: 'interactive', title: 'Morning routine builder — time slots, habit categories, custom items' },
      { type: 'product', title: 'Habit and Routine Planner (£12)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'interactive', title: 'Habit library — 30 pre-set habits by category with custom input' },
      { type: 'tracker', title: 'In-app streak tracker' },
      { type: 'product', title: 'Ultimate Planner (£19)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'template', title: 'Weekly Review template — embedded and fillable' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'tracker', title: 'In-app streak tracker with daily notification' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'template', title: 'Monthly income vs expenses tracker — pre-filled with UK categories' },
      { type: 'guide', title: 'Reading your UK credit report: Experian, Equifax, TransUnion' },
      { type: 'guide', title: 'How rent reporting tools build your credit score' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'template', title: '90-day direction framework — embedded worksheet' },
      { type: 'guide', title: 'Example direction statements by sector and visa track' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Income stream guide by visa track — what is permitted and what is not' },
      { type: 'circle_link', title: 'Rare Studio — creator pathway', group: 'Rise' },
      { type: 'guide', title: 'Employment pathway: Breaking Barriers, RefuAid, sector job boards' },
      { type: 'product', title: 'RareStack (£39/mo) — for business-builders', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Networking in the UK without pretending to be someone else' },
      { type: 'checklist', title: 'LinkedIn profile checklist' },
      { type: 'guide', title: 'Directory of UK professional communities by sector' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'product', title: 'Sovereignty Programme (£3,500) — assessment and overview', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'template', title: 'Project brief template' },
      { type: 'circle_link', title: 'Rare Circle — Rise group (accountability)', group: 'Rise' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'template', title: 'Journey documentation template — pulls in all completion prompt responses from Stages 1–5' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Digital product and passive income for immigrants: what is visa-compliant and how to build it' },
      { type: 'product', title: 'Rare Studio membership (from £19.99/mo)', url: 'https://raresena.com' },
      { type: 'product', title: 'Sovereignty Programme – Graduate (£3,000)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'circle_link', title: 'Rare Circle — Realize group', group: 'Realize' },
      { type: 'guide', title: 'Mentor introduction guide — how to support without overpromising' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'template', title: 'Sovereignty Plan framework — ILR timeline, financial targets, housing plan, legacy statement' },
      { type: 'product', title: 'Sovereignty Programme – Graduate (£3,000)', url: 'https://raresena.com' },
    ],
    whatToExpectToFeel: null,
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
    whyThisMatters: null,
    whatToDo: null,
    resources: [
      { type: 'guide', title: 'Contribution ideas library — by background, skill, and capacity' },
      { type: 'circle_link', title: 'Rare Circle — share your giving back publicly', group: 'Realize' },
    ],
    whatToExpectToFeel: null,
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
