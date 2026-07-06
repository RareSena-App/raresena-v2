// src/utils/generateRebuildPDF.js
// Opens a print-ready window with all 25 task completions formatted as a Rebuild Record.
// User saves via browser "Print → Save as PDF".

import { ROADMAP_TASKS, STAGE_META } from '../data/roadmapTasks.js'

const STAGE_NAMES = { 1: 'Reset', 2: 'Rediscover', 3: 'Routine', 4: 'Rise', 5: 'Realize' }
const STAGE_COLORS = {
  1: '#6B9E78',
  2: '#7B9EC4',
  3: '#C9A84C',
  4: '#B07BC4',
  5: '#E8A87C',
}

function formatResponse(taskKey, rawResponse) {
  if (!rawResponse) return null
  const task = ROADMAP_TASKS[taskKey]
  if (!task) return null

  let parsed = rawResponse
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed) } catch { return `<p>${rawResponse}</p>` }
  }

  const type = task.completionPrompt.type

  if (type === 'auto') return '<p>30-day habit streak completed automatically.</p>'

  if (type === 'text_response' || type === 'reflection') {
    const text = parsed.text || ''
    return text ? `<p>${text.replace(/\n/g, '<br>')}</p>` : null
  }

  if (type === 'field_entry' || type === 'upload_link') {
    const fields = task.completionPrompt.fields || []
    const lines = fields.map(f => {
      const val = parsed[f.key]
      return val ? `<p><strong>${f.label}:</strong> ${val}</p>` : null
    }).filter(Boolean)
    return lines.length ? lines.join('') : null
  }

  if (type === 'checklist') {
    const items = task.completionPrompt.items || []
    const lines = items.map(item => {
      const val = parsed[item.key]
      if (!val) return null
      if (typeof val === 'boolean') return `<p>&#10003; ${item.label}</p>`
      return `<p><strong>${item.label}:</strong> ${val}</p>`
    }).filter(Boolean)
    return lines.length ? lines.join('') : null
  }

  return null
}

export function generateRebuildPDF(completions, userName) {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  let stageHTML = ''

  for (let stage = 1; stage <= 5; stage++) {
    const color = STAGE_COLORS[stage]
    const stageName = STAGE_NAMES[stage]
    const meta = STAGE_META[stage]
    let taskHTML = ''

    for (let task = 1; task <= 5; task++) {
      const key = `${stage}.${task}`
      const completion = completions[key]
      if (!completion?.isComplete) continue

      const taskData = ROADMAP_TASKS[key]
      if (!taskData) continue

      const responseHTML = formatResponse(key, completion.promptResponse)
      if (!responseHTML) continue

      taskHTML += `
        <div class="task">
          <div class="task-number" style="color:${color}">Task ${key}</div>
          <div class="task-title">${taskData.title}</div>
          <div class="task-response">${responseHTML}</div>
        </div>`
    }

    if (!taskHTML) continue

    stageHTML += `
      <div class="stage-section">
        <div class="stage-header" style="border-left-color:${color}">
          <div class="stage-label" style="color:${color}">Stage ${stage} — ${stageName}</div>
          <div class="stage-tagline">${meta.tagline}</div>
        </div>
        ${taskHTML}
      </div>`
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Rebuild Record — ${userName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      color: #1a1a1a;
      background: #fff;
      font-size: 13.5px;
      line-height: 1.75;
    }
    .cover {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px 72px;
      page-break-after: always;
    }
    .cover-brand {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #C9A84C;
      margin-bottom: 56px;
    }
    .cover-title {
      font-size: 52px;
      font-weight: 700;
      color: #111;
      line-height: 1.1;
      margin-bottom: 20px;
    }
    .cover-subtitle {
      font-size: 18px;
      color: #666;
      font-style: italic;
      margin-bottom: 64px;
    }
    .cover-rule { width: 48px; height: 2px; background: #C9A84C; margin-bottom: 32px; }
    .cover-meta {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      color: #888;
      line-height: 1.8;
    }
    .cover-meta strong { color: #333; }
    .content { padding: 56px 72px; max-width: 760px; }
    .stage-section { margin-bottom: 48px; }
    .stage-header {
      border-left: 3px solid #C9A84C;
      padding: 0 0 0 16px;
      margin-bottom: 28px;
    }
    .stage-label {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .stage-tagline {
      font-style: italic;
      color: #666;
      font-size: 13.5px;
    }
    .task {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #efefef;
    }
    .task:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .task-number {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .task-title {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #222;
      margin-bottom: 10px;
    }
    .task-response { color: #444; }
    .task-response p { margin-bottom: 6px; }
    .task-response p:last-child { margin-bottom: 0; }
    .footer {
      margin-top: 64px;
      padding-top: 24px;
      border-top: 1px solid #eee;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      color: #bbb;
      text-align: center;
      letter-spacing: 0.04em;
    }
    @media print {
      .cover { min-height: auto; padding: 60px 56px; }
      .content { padding: 40px 56px; }
      @page { margin: 0; size: A4 portrait; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-brand">RareSena · The 5R Rebuild Method</div>
    <div class="cover-title">Rebuild<br>Record</div>
    <div class="cover-subtitle">A complete account of the journey.</div>
    <div class="cover-rule"></div>
    <div class="cover-meta">
      <strong>${userName}</strong><br>
      Exported ${date}
    </div>
  </div>
  <div class="content">
    ${stageHTML || '<p style="color:#888;font-style:italic;">No completed tasks to display.</p>'}
    <div class="footer">RareSena &middot; raresena.com &middot; ${date}</div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print() }, 400) }</script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
