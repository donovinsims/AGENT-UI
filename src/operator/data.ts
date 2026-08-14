// Operator OS — in-memory seed data for the interactive frontend direction.
// One source of truth per PRD: companies/contacts/opportunities/projects/agents
// are represented once and referenced by id elsewhere.

export type StatusColor =
  | 'blue'
  | 'green'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'brand'
  | 'muted'

export type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

export interface Person {
  id: string
  name: string
  initials: string
  color: string
}

export const people: Person[] = [
  { id: 'u_owner', name: 'You (Owner)', initials: 'YO', color: '#5e6ad2' },
  { id: 'u_raissa', name: 'Raissa Okoye', initials: 'RO', color: '#eb5757' },
  { id: 'u_tom', name: 'Tom Moor', initials: 'TM', color: '#27a644' },
  { id: 'u_zoe', name: 'Zoe Bauer', initials: 'ZB', color: '#f0bf00' },
  { id: 'u_nan', name: 'Nan Wei', initials: 'NW', color: '#00b8cc' },
  { id: 'u_karri', name: 'Karri Saarinen', initials: 'KS', color: '#7170ff' },
]

export const personById = (id: string) => people.find((p) => p.id === id)!

// ---------- Pipeline ----------
export interface Opportunity {
  id: string
  title: string
  company: string
  contact: string
  stage: string
  priority: Priority
  value: number
  closeDate: string
  ownerId: string
  nextAction: string
  labels: string[]
  service: string
}

export const pipelineStages = [
  'New Opportunity',
  'Qualified',
  'Discovery',
  'Solution Defined',
  'Proposal Sent',
  'Negotiation',
] as const

export const opportunities: Opportunity[] = [
  {
    id: 'OPP-2041',
    title: 'AI intake + booking assistant',
    company: 'Northgate HVAC',
    contact: 'Dana Whitfield',
    stage: 'New Opportunity',
    priority: 'high',
    value: 18000,
    closeDate: 'Sep 12',
    ownerId: 'u_owner',
    nextAction: 'Send research brief',
    labels: ['Inbound'],
    service: 'Voice Agent',
  },
  {
    id: 'OPP-2042',
    title: 'Lead-response automation',
    company: 'Cedar & Stone Landscaping',
    contact: 'Marcus Reyes',
    stage: 'New Opportunity',
    priority: 'medium',
    value: 9500,
    closeDate: 'Sep 20',
    ownerId: 'u_zoe',
    nextAction: 'Qualify budget',
    labels: ['Referral'],
    service: 'Automation',
  },
  {
    id: 'OPP-2044',
    title: 'Missed-call text-back system',
    company: 'BrightSmile Dental',
    contact: 'Priya Nair',
    stage: 'Qualified',
    priority: 'high',
    value: 12500,
    closeDate: 'Sep 8',
    ownerId: 'u_owner',
    nextAction: 'Book discovery call',
    labels: ['Inbound', 'Warm'],
    service: 'Voice Agent',
  },
  {
    id: 'OPP-2045',
    title: 'Review-generation workflow',
    company: 'Summit Roofing Co.',
    contact: 'Elena Duarte',
    stage: 'Qualified',
    priority: 'low',
    value: 6000,
    closeDate: 'Oct 1',
    ownerId: 'u_tom',
    nextAction: 'Confirm decision maker',
    labels: ['Referral'],
    service: 'Automation',
  },
  {
    id: 'OPP-2048',
    title: 'Full front-desk AI operator',
    company: 'Lakeside Veterinary',
    contact: 'Dr. Aiko Tanaka',
    stage: 'Discovery',
    priority: 'urgent',
    value: 32000,
    closeDate: 'Sep 5',
    ownerId: 'u_owner',
    nextAction: 'Map current call flow',
    labels: ['Inbound', 'Warm'],
    service: 'Voice + Automation',
  },
  {
    id: 'OPP-2049',
    title: 'Dispatch scheduling copilot',
    company: 'Metro Plumbing Group',
    contact: 'Sam Okafor',
    stage: 'Discovery',
    priority: 'medium',
    value: 21000,
    closeDate: 'Sep 18',
    ownerId: 'u_zoe',
    nextAction: 'Collect scheduling data',
    labels: ['Outbound'],
    service: 'Copilot',
  },
  {
    id: 'OPP-2051',
    title: 'Estimate follow-up sequences',
    company: 'Ironclad Fencing',
    contact: 'Reggie Boone',
    stage: 'Solution Defined',
    priority: 'high',
    value: 14000,
    closeDate: 'Sep 9',
    ownerId: 'u_owner',
    nextAction: 'Draft SOW',
    labels: ['Outbound'],
    service: 'Automation',
  },
  {
    id: 'OPP-2053',
    title: 'AI receptionist + CRM sync',
    company: 'Harbor Family Law',
    contact: 'Grace Lindqvist',
    stage: 'Proposal Sent',
    priority: 'high',
    value: 26500,
    closeDate: 'Aug 29',
    ownerId: 'u_owner',
    nextAction: 'Follow up on proposal',
    labels: ['Warm'],
    service: 'Voice Agent',
  },
  {
    id: 'OPP-2054',
    title: 'Quote-to-close automation',
    company: 'Peak Performance Auto',
    contact: 'Devon Marsh',
    stage: 'Proposal Sent',
    priority: 'medium',
    value: 11000,
    closeDate: 'Sep 2',
    ownerId: 'u_tom',
    nextAction: 'Awaiting signature',
    labels: ['Referral'],
    service: 'Automation',
  },
  {
    id: 'OPP-2056',
    title: 'Multi-location intake platform',
    company: 'ClearView Optometry',
    contact: 'Hana Brooks',
    stage: 'Negotiation',
    priority: 'urgent',
    value: 48000,
    closeDate: 'Aug 27',
    ownerId: 'u_owner',
    nextAction: 'Align on rollout terms',
    labels: ['Warm', 'Expansion'],
    service: 'Voice + Automation',
  },
]

// ---------- Today ----------
export interface Approval {
  id: string
  title: string
  agent: string
  detail: string
  risk: StatusColor
  requested: string
  kind: string
}

export const approvals: Approval[] = [
  {
    id: 'APR-118',
    title: 'Send follow-up to Harbor Family Law',
    agent: 'Outreach Agent',
    detail: 'Draft personalized email nudging proposal OPP-2053. External send requires approval.',
    risk: 'yellow',
    requested: '8 min ago',
    kind: 'External send',
  },
  {
    id: 'APR-117',
    title: 'Move OPP-2056 to Won',
    agent: 'Sales Pipeline Agent',
    detail: 'ClearView Optometry countersigned. Commercial status change requires approval.',
    risk: 'orange',
    requested: '31 min ago',
    kind: 'Commercial status',
  },
  {
    id: 'APR-116',
    title: 'Enroll 42 leads in "Local Services Q3" sequence',
    agent: 'Outreach Agent',
    detail: 'Batch external sequence enrollment above the 25-recipient auto threshold.',
    risk: 'yellow',
    requested: '1h ago',
    kind: 'Bulk outreach',
  },
]

export interface FeedItem {
  id: string
  actorId: string
  verb: string
  target: string
  time: string
  agent?: boolean
}

export const activityFeed: FeedItem[] = [
  { id: 'a1', actorId: 'u_raissa', verb: 'created', target: 'OPP-2041 · Northgate HVAC', time: '12 min' },
  { id: 'a2', actorId: 'u_owner', verb: 'qualified', target: 'lead → BrightSmile Dental', time: '48 min', agent: true },
  { id: 'a3', actorId: 'u_zoe', verb: 'logged a call with', target: 'Metro Plumbing Group', time: '1h' },
  { id: 'a4', actorId: 'u_owner', verb: 'drafted outreach for', target: '6 contacts', time: '2h', agent: true },
  { id: 'a5', actorId: 'u_tom', verb: 'moved', target: 'PRJ-88 to Quality Review', time: '3h' },
  { id: 'a6', actorId: 'u_owner', verb: 'flagged risk on', target: 'PRJ-91 · Lakeside Veterinary', time: '4h', agent: true },
]

export interface TaskItem {
  id: string
  title: string
  meta: string
  priority: Priority
  status: 'todo' | 'progress' | 'done'
  due: string
  assigneeId: string
}

export const myTasks: TaskItem[] = [
  { id: 'OPS-311', title: 'Prep discovery call — Lakeside Veterinary', meta: 'OPP-2048', priority: 'urgent', status: 'todo', due: 'Today', assigneeId: 'u_owner' },
  { id: 'OPS-309', title: 'Review agent-drafted SOW for Ironclad Fencing', meta: 'OPP-2051', priority: 'high', status: 'progress', due: 'Today', assigneeId: 'u_owner' },
  { id: 'OPS-305', title: 'Approve outreach batch — Local Services Q3', meta: 'Outreach', priority: 'high', status: 'todo', due: 'Today', assigneeId: 'u_owner' },
  { id: 'OPS-298', title: 'Kickoff call notes → Peak Performance Auto', meta: 'PRJ-90', priority: 'medium', status: 'todo', due: 'Tomorrow', assigneeId: 'u_owner' },
  { id: 'OPS-291', title: 'Update ClearView rollout timeline', meta: 'OPP-2056', priority: 'medium', status: 'progress', due: 'Aug 15', assigneeId: 'u_owner' },
]

export interface Meeting {
  id: string
  title: string
  time: string
  company: string
  kind: string
}

export const meetings: Meeting[] = [
  { id: 'm1', title: 'Discovery — Lakeside Veterinary', time: '10:30', company: 'Lakeside Veterinary', kind: 'Discovery' },
  { id: 'm2', title: 'Proposal walkthrough — Harbor Family Law', time: '13:00', company: 'Harbor Family Law', kind: 'Demo' },
  { id: 'm3', title: 'Weekly delivery sync', time: '16:00', company: 'Internal', kind: 'Internal' },
]

// ---------- Agents ----------
export interface Agent {
  id: string
  name: string
  purpose: string
  autonomy: 'Observe' | 'Suggest' | 'Draft' | 'Act within policy' | 'Operate workflow'
  status: 'active' | 'idle' | 'paused'
  model: string
  fallback: string
  runsToday: number
  successRate: number
  budgetUsed: number
  lastRun: string
}

export const agents: Agent[] = [
  { id: 'AGT-01', name: 'Executive Operations Agent', purpose: 'Daily briefs, priorities, exception summaries.', autonomy: 'Operate workflow', status: 'active', model: 'Codex CLI', fallback: 'business-backup', runsToday: 4, successRate: 100, budgetUsed: 22, lastRun: '6 min ago' },
  { id: 'AGT-02', name: 'Lead Research & Qualification', purpose: 'Researches and qualifies leads with verifiable evidence.', autonomy: 'Act within policy', status: 'active', model: 'Codex CLI', fallback: 'business-backup', runsToday: 31, successRate: 94, budgetUsed: 61, lastRun: '2 min ago' },
  { id: 'AGT-03', name: 'Outreach Agent', purpose: 'Drafts outreach, classifies replies, suggests next actions.', autonomy: 'Draft', status: 'active', model: 'Codex CLI', fallback: 'business-backup', runsToday: 18, successRate: 97, budgetUsed: 44, lastRun: '8 min ago' },
  { id: 'AGT-04', name: 'Sales Pipeline Agent', purpose: 'Detects stale/risky deals; recommends actions & forecasts.', autonomy: 'Suggest', status: 'active', model: 'Codex CLI', fallback: 'business-backup', runsToday: 7, successRate: 100, budgetUsed: 15, lastRun: '31 min ago' },
  { id: 'AGT-05', name: 'Implementation Project Agent', purpose: 'Builds plans, monitors delivery risk, prepares updates.', autonomy: 'Draft', status: 'idle', model: 'Codex CLI', fallback: 'coding-backup', runsToday: 3, successRate: 100, budgetUsed: 9, lastRun: '2h ago' },
  { id: 'AGT-06', name: 'Client Success Agent', purpose: 'Monitors relationship & delivery health, expansion signals.', autonomy: 'Suggest', status: 'idle', model: 'Codex CLI', fallback: 'business-backup', runsToday: 2, successRate: 100, budgetUsed: 6, lastRun: '5h ago' },
  { id: 'AGT-07', name: 'Data & Automation Agent', purpose: 'Finds duplicates, gaps, and workflow failures.', autonomy: 'Act within policy', status: 'paused', model: 'FCM · coding-backup', fallback: '—', runsToday: 0, successRate: 98, budgetUsed: 0, lastRun: '1d ago' },
]

// ---------- Runner / integration health ----------
export interface HealthItem {
  name: string
  status: 'connected' | 'available' | 'offline' | 'unreachable'
}

export const systemHealth: HealthItem[] = [
  { name: 'Codex Cloud', status: 'available' },
  { name: 'Mac Runner', status: 'offline' },
  { name: 'FCM Router', status: 'unreachable' },
  { name: 'Hermes', status: 'connected' },
  { name: 'GitHub', status: 'connected' },
  { name: 'Gmail', status: 'connected' },
]

// ---------- Inbox / record detail ----------
export interface InboxRow {
  id: string
  title: string
  preview: string
  actorId: string
  time: string
  unread: boolean
}

export const inboxRows: InboxRow[] = [
  { id: 'OPP-2048', title: 'Lakeside Veterinary — discovery requested', preview: 'Raissa mentioned you · agent flagged as urgent', actorId: 'u_raissa', time: '12min', unread: true },
  { id: 'APR-118', title: 'Approval: send follow-up to Harbor Family Law', preview: 'Outreach Agent prepared a draft · needs your review', actorId: 'u_owner', time: '18min', unread: true },
  { id: 'OPP-2056', title: 'ClearView countersigned rollout terms', preview: 'Zoe moved to Negotiation · 5h', actorId: 'u_zoe', time: '5h', unread: false },
  { id: 'PRJ-91', title: 'Delivery risk on Lakeside implementation', preview: 'Nan mentioned you: what do you think about this?', actorId: 'u_nan', time: '1d', unread: false },
  { id: 'OPP-2054', title: 'Peak Performance Auto — proposal viewed 3×', preview: 'Pipeline Agent: strong buying signal, no reply yet', actorId: 'u_owner', time: '1d', unread: false },
]

export interface Comment {
  id: string
  authorId: string
  time: string
  body: string
}

export const detailRecord = {
  id: 'OPP-2048',
  title: 'Full front-desk AI operator — Lakeside Veterinary',
  status: 'Discovery',
  priority: 'urgent' as Priority,
  assignee: 'u_owner',
  project: 'AI Front Desk',
  labels: ['Voice Agent', 'Automation'],
  value: 32000,
  body: [
    'Lakeside runs a 3-vet practice fielding ~180 inbound calls/day with two front-desk staff. They lose an estimated 22% of after-hours booking requests to voicemail.',
    'Scope under discussion: an AI front-desk operator that answers, books into their PMS, handles prescription refills triage, and hands off to staff on clinical questions — with a missed-call text-back fallback.',
    'Next action: map the current call flow on the discovery call and confirm PMS integration surface before we scope the SOW.',
  ],
  comments: [
    { id: 'c1', authorId: 'u_zoe', time: '3 days ago', body: 'Owner is motivated — losing bookings after hours is the pain. What integration lift do we expect for their PMS?' },
    { id: 'c2', authorId: 'u_owner', time: '3 days ago', body: "We've designed the intake actions to stay reversible. Let me confirm the PMS webhook surface before we commit a timeline." },
  ] as Comment[],
}

// ---------- Sidebar nav model ----------
export interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number
}
export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    id: 'today',
    label: 'Today',
    items: [
      { id: 'today', label: 'Today', icon: 'Sparkles' },
      { id: 'my-work', label: 'My Work', icon: 'CircleUser' },
      { id: 'notifications', label: 'Notifications', icon: 'Bell', badge: 3 },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    items: [
      { id: 'sales-overview', label: 'Sales Overview', icon: 'TrendingUp' },
      { id: 'leads', label: 'Leads', icon: 'UserPlus' },
      { id: 'companies', label: 'Companies', icon: 'Building2' },
      { id: 'contacts', label: 'Contacts', icon: 'Users' },
      { id: 'pipeline', label: 'Pipeline', icon: 'KanbanSquare' },
      { id: 'outreach', label: 'Outreach', icon: 'Send' },
      { id: 'inbox', label: 'Inbox', icon: 'Inbox', badge: 2 },
      { id: 'meetings', label: 'Meetings', icon: 'CalendarClock' },
      { id: 'proposals', label: 'Proposals', icon: 'FileText' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    items: [
      { id: 'clients', label: 'Clients', icon: 'Handshake' },
      { id: 'projects', label: 'Projects', icon: 'FolderKanban' },
      { id: 'tasks', label: 'Tasks', icon: 'ListChecks' },
      { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
      { id: 'files', label: 'Files', icon: 'Paperclip' },
      { id: 'knowledge', label: 'Knowledge', icon: 'BookOpen' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      { id: 'intelligence', label: 'Intelligence Center', icon: 'BrainCircuit' },
      { id: 'agents', label: 'Agents', icon: 'Bot' },
      { id: 'approvals', label: 'Approvals', icon: 'ShieldCheck', badge: 3 },
      { id: 'automations', label: 'Automations', icon: 'Workflow' },
      { id: 'model-routing', label: 'Model Routing', icon: 'Route' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { id: 'activity', label: 'Activity', icon: 'Activity' },
      { id: 'reports', label: 'Reports', icon: 'BarChart3' },
      { id: 'integrations', label: 'Integrations', icon: 'Plug' },
      { id: 'developer', label: 'Developer', icon: 'Terminal' },
      { id: 'settings', label: 'Settings', icon: 'Settings' },
    ],
  },
]

export const statusHex: Record<StatusColor, string> = {
  blue: 'var(--color-status-blue)',
  green: 'var(--color-status-green)',
  red: 'var(--color-status-red)',
  orange: 'var(--color-status-orange)',
  yellow: 'var(--color-status-yellow)',
  teal: 'var(--color-status-teal)',
  brand: 'var(--color-brand)',
  muted: 'var(--color-text-muted)',
}

export const fmtMoney = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`
