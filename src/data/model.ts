// Operator OS — in-memory seed data layer.
// This is the single boundary a real backend (Appwrite + /api/v1) later replaces.
// Screens read from these typed collections; records are interlinked by id so the
// lead → company → opportunity → client → project → task lifecycle stays connected.

export type StatusColor = 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'teal' | 'gray' | 'indigo'
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent'

export interface Person {
  id: string
  name: string
  initials: string
  color: string // avatar bg
  role?: string
}

export interface Company {
  id: string
  name: string
  domain: string
  industry: string
  size: string
  location: string
  lifecycle: 'lead' | 'prospect' | 'active_client' | 'churned'
  owner: string // person id
  tags: string[]
  health?: StatusColor
}

export interface Contact {
  id: string
  name: string
  initials: string
  color: string
  title: string
  companyId: string
  email: string
  phone: string
  lastTouch: string
}

export interface Lead {
  id: string
  name: string
  company: string
  title: string
  source: string
  score: number
  stage: 'new' | 'researching' | 'contacted' | 'qualified' | 'disqualified'
  owner: string
  createdAt: string
  evidence?: string
}

export const STAGES = [
  { id: 'new', label: 'New Opportunity', color: 'gray' as StatusColor },
  { id: 'qualified', label: 'Qualified', color: 'blue' as StatusColor },
  { id: 'discovery', label: 'Discovery', color: 'indigo' as StatusColor },
  { id: 'solution', label: 'Solution Defined', color: 'teal' as StatusColor },
  { id: 'proposal', label: 'Proposal Sent', color: 'yellow' as StatusColor },
  { id: 'negotiation', label: 'Negotiation', color: 'orange' as StatusColor },
  { id: 'won', label: 'Won', color: 'green' as StatusColor },
  { id: 'lost', label: 'Lost', color: 'red' as StatusColor },
]
export type StageId = (typeof STAGES)[number]['id']

export interface Opportunity {
  id: string
  ref: string
  title: string
  companyId: string
  contactId: string
  stage: StageId
  value: number
  priority: Priority
  owner: string
  closeDate: string
  nextAction: string
  service: string
  labels: string[]
  atRisk?: boolean
}

export const PROJECT_STATES = [
  { id: 'planned', label: 'Planned', color: 'gray' as StatusColor },
  { id: 'active', label: 'Active', color: 'blue' as StatusColor },
  { id: 'waiting', label: 'Waiting on Client', color: 'yellow' as StatusColor },
  { id: 'blocked', label: 'Blocked', color: 'red' as StatusColor },
  { id: 'review', label: 'Quality Review', color: 'orange' as StatusColor },
  { id: 'completed', label: 'Completed', color: 'green' as StatusColor },
]
export type ProjectState = (typeof PROJECT_STATES)[number]['id']

export interface Project {
  id: string
  ref: string
  name: string
  clientId: string
  opportunityId?: string
  state: ProjectState
  health: StatusColor
  lead: string
  progress: number
  startDate: string
  targetDate: string
  phases: { name: string; start: number; end: number; done: boolean }[]
  scope: string
}

export const TASK_STATES = [
  { id: 'backlog', label: 'Backlog', color: 'gray' as StatusColor },
  { id: 'ready', label: 'Ready', color: 'gray' as StatusColor },
  { id: 'in_progress', label: 'In Progress', color: 'yellow' as StatusColor },
  { id: 'waiting', label: 'Waiting', color: 'orange' as StatusColor },
  { id: 'review', label: 'Review', color: 'blue' as StatusColor },
  { id: 'done', label: 'Done', color: 'green' as StatusColor },
]
export type TaskState = (typeof TASK_STATES)[number]['id']

export interface Task {
  id: string
  ref: string
  title: string
  state: TaskState
  priority: Priority
  assignee?: string
  projectId?: string
  companyId?: string
  due?: string
  labels: string[]
  agentAssigned?: boolean
}

export interface Meeting {
  id: string
  title: string
  type: 'Discovery' | 'Demo' | 'Follow-up' | 'Client'
  companyId: string
  when: string
  duration: string
  attendees: string[]
  hasBrief: boolean
  outcome?: string
}

export interface Proposal {
  id: string
  ref: string
  title: string
  companyId: string
  opportunityId: string
  value: number
  status: 'draft' | 'internal_review' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  updatedAt: string
}

export interface OutreachThread {
  id: string
  subject: string
  contactId: string
  companyId: string
  state: 'draft' | 'scheduled' | 'sent' | 'replied' | 'awaiting' | 'bounced'
  preview: string
  when: string
  sequence?: string
  agentDrafted?: boolean
}

export interface InboxItem {
  id: string
  ref: string
  title: string
  actor: string
  meta: string
  when: string
  unread: boolean
  priority: Priority
  state: TaskState
  project?: string
  labels: string[]
  body: string
  comments: { author: string; when: string; body: string; nested?: { author: string; when: string; body: string } }[]
  activity: { actor: string; text: string }[]
}

export type AutonomyLevel = 'observe' | 'suggest' | 'draft' | 'act' | 'operate'

export interface Agent {
  id: string
  name: string
  purpose: string
  autonomy: AutonomyLevel
  status: 'active' | 'paused' | 'draft'
  model: string
  fallback: string
  runsToday: number
  successRate: number
  scopes: string[]
  emoji: string
  lastRun: string
}

export interface AgentRun {
  id: string
  agentId: string
  initiator: string
  task: string
  status: 'running' | 'completed' | 'failed' | 'awaiting_approval'
  model: string
  fellBack: boolean
  duration: string
  when: string
  tokens: string
}

export interface Approval {
  id: string
  action: string
  agent: string
  detail: string
  risk: StatusColor
  requestedAt: string
  scope: string
}

export interface Automation {
  id: string
  name: string
  trigger: string
  action: string
  enabled: boolean
  runs: number
  lastRun: string
}

export interface Integration {
  name: string
  category: string
  status: 'connected' | 'offline' | 'unreachable' | 'available'
  detail: string
}

export interface Activity {
  actor: string
  text: string
  target: string
  when: string
  kind: 'sales' | 'delivery' | 'agent' | 'system'
}

export interface Notification {
  id: string
  title: string
  detail: string
  when: string
  unread: boolean
  kind: 'mention' | 'approval' | 'assigned' | 'reply' | 'system'
}

export interface FileRec {
  id: string
  name: string
  kind: string
  size: string
  linkedTo: string
  owner: string
  updatedAt: string
}

export interface KnowledgeDoc {
  id: string
  title: string
  category: 'SOP' | 'Playbook' | 'Template' | 'Offer' | 'Agent Instruction'
  updatedAt: string
  attachedAgents: number
}

export interface Service {
  id: string
  name: string
  price: string
  cadence: string
  desc: string
  active: boolean
}

// ------------------------------------------------------------------
// People
// ------------------------------------------------------------------
export const people: Person[] = [
  { id: 'u_owner', name: 'Marcus Vale', initials: 'MV', color: '#5e6ad2', role: 'Owner' },
  { id: 'u_karri', name: 'Karri Saarinen', initials: 'KS', color: '#27a644', role: 'Operator' },
  { id: 'u_andreas', name: 'Andreas Klein', initials: 'AK', color: '#fc7840', role: 'Delivery' },
  { id: 'u_jori', name: 'Jori Lallo', initials: 'JL', color: '#3caefe', role: 'Sales' },
  { id: 'u_zoe', name: 'Zoe Bauer', initials: 'ZB', color: '#eb5757', role: 'Sales' },
  { id: 'u_tom', name: 'Tom Moor', initials: 'TM', color: '#00b8cc', role: 'Delivery' },
]
export const owner = people[0]
export const personById = (id?: string) => people.find((p) => p.id === id)

// ------------------------------------------------------------------
// Companies / contacts / leads
// ------------------------------------------------------------------
export const companies: Company[] = [
  { id: 'c_northwind', name: 'Northwind HVAC', domain: 'northwindhvac.com', industry: 'Home Services', size: '25–50', location: 'Austin, TX', lifecycle: 'active_client', owner: 'u_jori', tags: ['field-service', 'priority'], health: 'green' },
  { id: 'c_brightsmile', name: 'BrightSmile Dental', domain: 'brightsmile.co', industry: 'Healthcare', size: '10–25', location: 'Denver, CO', lifecycle: 'active_client', owner: 'u_zoe', tags: ['multi-location'], health: 'yellow' },
  { id: 'c_summit', name: 'Summit Roofing', domain: 'summitroof.com', industry: 'Construction', size: '50–100', location: 'Phoenix, AZ', lifecycle: 'prospect', owner: 'u_jori', tags: ['inbound'] },
  { id: 'c_lumen', name: 'Lumen Electric', domain: 'lumenelectric.io', industry: 'Home Services', size: '10–25', location: 'Portland, OR', lifecycle: 'prospect', owner: 'u_zoe', tags: ['referral'] },
  { id: 'c_verde', name: 'Verde Landscaping', domain: 'verdescape.com', industry: 'Home Services', size: '25–50', location: 'San Diego, CA', lifecycle: 'active_client', owner: 'u_jori', tags: ['seasonal'], health: 'green' },
  { id: 'c_apex', name: 'Apex Plumbing', domain: 'apexplumb.com', industry: 'Home Services', size: '5–10', location: 'Dallas, TX', lifecycle: 'lead', owner: 'u_zoe', tags: [] },
  { id: 'c_harbor', name: 'Harbor Auto Group', domain: 'harborauto.com', industry: 'Automotive', size: '100+', location: 'Seattle, WA', lifecycle: 'prospect', owner: 'u_jori', tags: ['enterprise'] },
]
export const companyById = (id: string) => companies.find((c) => c.id === id)!

export const contacts: Contact[] = [
  { id: 'p_dana', name: 'Dana Whitfield', initials: 'DW', color: '#5e6ad2', title: 'Owner / GM', companyId: 'c_northwind', email: 'dana@northwindhvac.com', phone: '+1 512-555-0148', lastTouch: '2d ago' },
  { id: 'p_raj', name: 'Raj Patel', initials: 'RP', color: '#27a644', title: 'Operations Lead', companyId: 'c_brightsmile', email: 'raj@brightsmile.co', phone: '+1 303-555-0192', lastTouch: '5h ago' },
  { id: 'p_elena', name: 'Elena Cruz', initials: 'EC', color: '#fc7840', title: 'VP Operations', companyId: 'c_summit', email: 'elena@summitroof.com', phone: '+1 602-555-0110', lastTouch: '1d ago' },
  { id: 'p_marc', name: 'Marc Delgado', initials: 'MD', color: '#3caefe', title: 'Founder', companyId: 'c_lumen', email: 'marc@lumenelectric.io', phone: '+1 503-555-0133', lastTouch: '3d ago' },
  { id: 'p_nina', name: 'Nina Osei', initials: 'NO', color: '#00b8cc', title: 'GM', companyId: 'c_verde', email: 'nina@verdescape.com', phone: '+1 619-555-0177', lastTouch: '6h ago' },
  { id: 'p_will', name: 'Will Tanaka', initials: 'WT', color: '#eb5757', title: 'Owner', companyId: 'c_apex', email: 'will@apexplumb.com', phone: '+1 214-555-0166', lastTouch: 'new' },
]
export const contactById = (id: string) => contacts.find((c) => c.id === id)!

export const leads: Lead[] = [
  { id: 'l_1', name: 'Will Tanaka', company: 'Apex Plumbing', title: 'Owner', source: 'Website form', score: 82, stage: 'qualified', owner: 'u_zoe', createdAt: '2h ago', evidence: '5 techs, no CRM, mentioned missed calls' },
  { id: 'l_2', name: 'Gary Voss', company: 'Voss Garage Doors', title: 'Owner', source: 'Cold list', score: 44, stage: 'researching', owner: 'u_jori', createdAt: '1d ago' },
  { id: 'l_3', name: 'Priya Anand', company: 'Anand Pest Control', title: 'GM', source: 'Referral', score: 71, stage: 'contacted', owner: 'u_zoe', createdAt: '2d ago', evidence: 'Referred by Verde; 3 locations' },
  { id: 'l_4', name: 'Deon Carter', company: 'Carter Electric', title: 'Owner', source: 'LinkedIn', score: 38, stage: 'new', owner: 'u_jori', createdAt: '3d ago' },
  { id: 'l_5', name: 'Mona Reyes', company: 'Reyes Cleaning Co', title: 'Founder', source: 'Webinar', score: 66, stage: 'contacted', owner: 'u_zoe', createdAt: '4d ago' },
  { id: 'l_6', name: 'Sam Okafor', company: 'Okafor HVAC', title: 'Owner', source: 'Website form', score: 29, stage: 'disqualified', owner: 'u_jori', createdAt: '5d ago' },
]

// ------------------------------------------------------------------
// Opportunities
// ------------------------------------------------------------------
export const opportunities: Opportunity[] = [
  { id: 'o_1', ref: 'OPP-142', title: 'AI receptionist + booking automation', companyId: 'c_apex', contactId: 'p_will', stage: 'new', value: 18000, priority: 'medium', owner: 'u_zoe', closeDate: 'Sep 12', nextAction: 'Book discovery call', service: 'AI Voice Agent', labels: ['voice', 'inbound'] },
  { id: 'o_2', ref: 'OPP-138', title: 'Lead-response automation rollout', companyId: 'c_summit', contactId: 'p_elena', stage: 'qualified', value: 32000, priority: 'high', owner: 'u_jori', closeDate: 'Sep 20', nextAction: 'Send discovery agenda', service: 'Workflow Automation', labels: ['automation'] },
  { id: 'o_3', ref: 'OPP-131', title: 'Multi-location review + reactivation', companyId: 'c_lumen', contactId: 'p_marc', stage: 'discovery', value: 24500, priority: 'medium', owner: 'u_zoe', closeDate: 'Sep 28', nextAction: 'Map current tools', service: 'Reputation AI', labels: ['reviews'] },
  { id: 'o_4', ref: 'OPP-126', title: 'Dispatch + scheduling copilot', companyId: 'c_harbor', contactId: 'p_elena', stage: 'solution', value: 68000, priority: 'urgent', owner: 'u_jori', closeDate: 'Oct 4', nextAction: 'Finalize scope doc', service: 'Custom Agent', labels: ['enterprise'], atRisk: true },
  { id: 'o_5', ref: 'OPP-120', title: 'Estimate follow-up sequences', companyId: 'c_summit', contactId: 'p_elena', stage: 'proposal', value: 21000, priority: 'high', owner: 'u_jori', closeDate: 'Sep 15', nextAction: 'Follow up on proposal', service: 'Outreach AI', labels: ['proposal'] },
  { id: 'o_6', ref: 'OPP-118', title: 'Membership renewal automation', companyId: 'c_brightsmile', contactId: 'p_raj', stage: 'negotiation', value: 29500, priority: 'high', owner: 'u_zoe', closeDate: 'Sep 10', nextAction: 'Send revised terms', service: 'Workflow Automation', labels: ['upsell'], atRisk: true },
  { id: 'o_7', ref: 'OPP-109', title: 'AI intake + qualification', companyId: 'c_northwind', contactId: 'p_dana', stage: 'won', value: 42000, priority: 'high', owner: 'u_jori', closeDate: 'Aug 1', nextAction: 'Kickoff project', service: 'Custom Agent', labels: ['won'] },
  { id: 'o_8', ref: 'OPP-101', title: 'Seasonal campaign automation', companyId: 'c_verde', contactId: 'p_nina', stage: 'won', value: 16500, priority: 'medium', owner: 'u_jori', closeDate: 'Jul 22', nextAction: 'Delivery in progress', service: 'Outreach AI', labels: ['won'] },
  { id: 'o_9', ref: 'OPP-095', title: 'Chatbot pilot', companyId: 'c_lumen', contactId: 'p_marc', stage: 'lost', value: 9000, priority: 'low', owner: 'u_zoe', closeDate: 'Jul 30', nextAction: 'Archived — budget', service: 'AI Voice Agent', labels: [] },
]

// ------------------------------------------------------------------
// Clients / projects / tasks
// ------------------------------------------------------------------
export const projects: Project[] = [
  {
    id: 'pr_1', ref: 'PRJ-24', name: 'Northwind — AI Intake & Qualification', clientId: 'c_northwind', opportunityId: 'o_7',
    state: 'active', health: 'green', lead: 'u_andreas', progress: 66, startDate: 'Aug 5', targetDate: 'Sep 30', scope: 'Deploy AI intake agent across phone + web, integrate with ServiceTitan, qualify and route leads.',
    phases: [
      { name: 'Discovery & data', start: 0, end: 20, done: true },
      { name: 'Agent build', start: 20, end: 55, done: true },
      { name: 'Integration', start: 55, end: 80, done: false },
      { name: 'QA & launch', start: 80, end: 100, done: false },
    ],
  },
  {
    id: 'pr_2', ref: 'PRJ-22', name: 'Verde — Seasonal Campaign Automation', clientId: 'c_verde', opportunityId: 'o_8',
    state: 'review', health: 'yellow', lead: 'u_tom', progress: 88, startDate: 'Jul 25', targetDate: 'Sep 8', scope: 'Automated seasonal outreach + reactivation sequences tied to weather triggers.',
    phases: [
      { name: 'Setup', start: 0, end: 25, done: true },
      { name: 'Sequence build', start: 25, end: 65, done: true },
      { name: 'Testing', start: 65, end: 90, done: true },
      { name: 'Handoff', start: 90, end: 100, done: false },
    ],
  },
  {
    id: 'pr_3', ref: 'PRJ-19', name: 'BrightSmile — Membership Renewals', clientId: 'c_brightsmile', opportunityId: 'o_6',
    state: 'waiting', health: 'yellow', lead: 'u_andreas', progress: 40, startDate: 'Aug 12', targetDate: 'Oct 1', scope: 'Automate membership renewal reminders and payment recovery across 3 locations.',
    phases: [
      { name: 'Discovery', start: 0, end: 30, done: true },
      { name: 'Build', start: 30, end: 70, done: false },
      { name: 'Launch', start: 70, end: 100, done: false },
    ],
  },
]
export const clients = companies.filter((c) => c.lifecycle === 'active_client')
export const projectById = (id: string) => projects.find((p) => p.id === id)!

export const tasks: Task[] = [
  { id: 't_1', ref: 'PRJ-24-8', title: 'Map ServiceTitan lead fields', state: 'in_progress', priority: 'high', assignee: 'u_andreas', projectId: 'pr_1', due: 'Today', labels: ['integration'] },
  { id: 't_2', ref: 'PRJ-24-9', title: 'Configure call-intent classifier', state: 'in_progress', priority: 'high', assignee: 'u_tom', projectId: 'pr_1', due: 'Sep 4', labels: ['agent'] },
  { id: 't_3', ref: 'PRJ-24-11', title: 'QA voice latency under load', state: 'ready', priority: 'medium', projectId: 'pr_1', due: 'Sep 9', labels: ['qa'], agentAssigned: true },
  { id: 't_4', ref: 'OPS-51', title: 'Prepare discovery agenda — Summit', state: 'in_progress', priority: 'high', assignee: 'u_jori', companyId: 'c_summit', due: 'Today', labels: ['sales'] },
  { id: 't_5', ref: 'PRJ-22-14', title: 'Client walkthrough recording', state: 'review', priority: 'medium', assignee: 'u_tom', projectId: 'pr_2', due: 'Sep 6', labels: [] },
  { id: 't_6', ref: 'PRJ-19-4', title: 'Confirm payment gateway scope', state: 'waiting', priority: 'high', assignee: 'u_andreas', projectId: 'pr_3', due: 'Blocked', labels: ['blocked'] },
  { id: 't_7', ref: 'OPS-48', title: 'Review 4 outreach drafts from Outreach Agent', state: 'ready', priority: 'medium', assignee: 'u_owner', due: 'Today', labels: ['approval'], agentAssigned: true },
  { id: 't_8', ref: 'PRJ-24-12', title: 'Write launch runbook', state: 'backlog', priority: 'low', projectId: 'pr_1', labels: ['docs'] },
  { id: 't_9', ref: 'OPS-52', title: 'Follow up — BrightSmile revised terms', state: 'in_progress', priority: 'urgent', assignee: 'u_zoe', companyId: 'c_brightsmile', due: 'Today', labels: ['sales'] },
  { id: 't_10', ref: 'PRJ-22-15', title: 'Final QA sign-off', state: 'review', priority: 'high', assignee: 'u_tom', projectId: 'pr_2', due: 'Sep 7', labels: ['qa'] },
  { id: 't_11', ref: 'PRJ-24-7', title: 'Discovery interviews w/ dispatch team', state: 'done', priority: 'medium', assignee: 'u_andreas', projectId: 'pr_1', labels: [] },
  { id: 't_12', ref: 'PRJ-24-6', title: 'Data access + RLS review', state: 'done', priority: 'high', assignee: 'u_tom', projectId: 'pr_1', labels: ['security'] },
]

// ------------------------------------------------------------------
// Meetings / proposals / outreach / services
// ------------------------------------------------------------------
export const meetings: Meeting[] = [
  { id: 'm_1', title: 'Summit Roofing — Discovery', type: 'Discovery', companyId: 'c_summit', when: 'Today · 2:00 PM', duration: '45m', attendees: ['u_jori', 'p_elena'], hasBrief: true },
  { id: 'm_2', title: 'Harbor Auto — Solution review', type: 'Demo', companyId: 'c_harbor', when: 'Today · 4:30 PM', duration: '60m', attendees: ['u_jori', 'u_owner'], hasBrief: true },
  { id: 'm_3', title: 'Northwind — Weekly delivery sync', type: 'Client', companyId: 'c_northwind', when: 'Tomorrow · 10:00 AM', duration: '30m', attendees: ['u_andreas', 'p_dana'], hasBrief: false },
  { id: 'm_4', title: 'BrightSmile — Renewal negotiation', type: 'Follow-up', companyId: 'c_brightsmile', when: 'Sep 6 · 1:00 PM', duration: '30m', attendees: ['u_zoe', 'p_raj'], hasBrief: true },
]

export const proposals: Proposal[] = [
  { id: 'pp_1', ref: 'PROP-58', title: 'Summit — Estimate follow-up sequences', companyId: 'c_summit', opportunityId: 'o_5', value: 21000, status: 'sent', updatedAt: '2d ago' },
  { id: 'pp_2', ref: 'PROP-57', title: 'BrightSmile — Membership renewals', companyId: 'c_brightsmile', opportunityId: 'o_6', value: 29500, status: 'viewed', updatedAt: '5h ago' },
  { id: 'pp_3', ref: 'PROP-59', title: 'Harbor — Dispatch copilot', companyId: 'c_harbor', opportunityId: 'o_4', value: 68000, status: 'internal_review', updatedAt: '1d ago' },
  { id: 'pp_4', ref: 'PROP-54', title: 'Northwind — AI intake', companyId: 'c_northwind', opportunityId: 'o_7', value: 42000, status: 'accepted', updatedAt: '3w ago' },
  { id: 'pp_5', ref: 'PROP-60', title: 'Apex — AI receptionist', companyId: 'c_apex', opportunityId: 'o_1', value: 18000, status: 'draft', updatedAt: '4h ago' },
]

export const outreach: OutreachThread[] = [
  { id: 'ot_1', subject: 'Cutting missed calls at Apex', contactId: 'p_will', companyId: 'c_apex', state: 'draft', preview: 'Hi Will — noticed Apex handles emergency plumbing…', when: 'now', agentDrafted: true },
  { id: 'ot_2', subject: 'Discovery follow-up', contactId: 'p_elena', companyId: 'c_summit', state: 'awaiting', preview: 'Great talking today — attached the agenda for…', when: '3h ago' },
  { id: 'ot_3', subject: 'Re: Membership renewals', contactId: 'p_raj', companyId: 'c_brightsmile', state: 'replied', preview: 'Can we push the numbers a bit? Board wants…', when: '5h ago' },
  { id: 'ot_4', subject: 'Referral intro — Anand Pest', contactId: 'p_marc', companyId: 'c_lumen', state: 'scheduled', preview: 'Thanks for the intro to Priya — reaching out…', when: 'Tomorrow 9am', sequence: 'Referral warm-up' },
  { id: 'ot_5', subject: 'Reactivation — dormant estimates', contactId: 'p_nina', companyId: 'c_verde', state: 'sent', preview: 'We pulled 40 estimates with no follow-up…', when: '1d ago', sequence: 'Reactivation' },
]

export const services: Service[] = [
  { id: 's_1', name: 'AI Voice Agent', price: '$2,500', cadence: '/mo + setup', desc: 'Answers calls, books jobs, routes emergencies 24/7.', active: true },
  { id: 's_2', name: 'Workflow Automation', price: '$8,000', cadence: 'one-time', desc: 'Lead-response, dispatch and follow-up automations.', active: true },
  { id: 's_3', name: 'Custom Agent Build', price: '$18,000+', cadence: 'project', desc: 'Bespoke multi-step agent tailored to operations.', active: true },
  { id: 's_4', name: 'Reputation AI', price: '$1,200', cadence: '/mo', desc: 'Review requests, monitoring and AI responses.', active: true },
  { id: 's_5', name: 'Outreach AI', price: '$1,800', cadence: '/mo', desc: 'Reactivation and estimate follow-up sequences.', active: false },
]

// ------------------------------------------------------------------
// Inbox (3-pane record detail)
// ------------------------------------------------------------------
export const inbox: InboxItem[] = [
  {
    id: 'in_1', ref: 'OPP-118', title: 'BrightSmile pushing back on renewal terms', actor: 'zoe', meta: 'zoe mentioned you', when: '12min', unread: true, priority: 'urgent', state: 'in_progress', project: 'Membership renewals', labels: ['upsell', 'at-risk'],
    body: 'Raj says the board wants to see the numbers before committing. They’re asking for a 10% reduction or a phased rollout. Deal is at risk — we should decide on a counter today.\n\nOptions: hold at $29.5k with a success milestone, or phase to $22k now + $10k on results.',
    comments: [
      { author: 'u_zoe', when: '3 days ago', body: 'Marcus, how far can we flex on this one?' },
      { author: 'u_owner', when: '3 days ago', body: 'Phase it. $22k now, $10k tied to renewal lift at 60 days.', nested: { author: 'u_zoe', when: '2 days ago', body: 'On it — drafting revised terms.' } },
    ],
    activity: [
      { actor: 'u_zoe', text: 'created the follow-up' },
      { actor: 'u_owner', text: 'set priority to Urgent' },
      { actor: 'u_zoe', text: 'linked OPP-118' },
    ],
  },
  {
    id: 'in_2', ref: 'AGT-run', title: 'Outreach Agent drafted 4 messages for review', actor: 'agent', meta: 'Outreach Agent · needs approval', when: '1h', unread: true, priority: 'high', state: 'ready', labels: ['approval', 'agent'],
    body: 'The Outreach Agent prepared 4 personalized first-touch emails for qualified leads. Sending external messages requires your approval per policy.',
    comments: [],
    activity: [
      { actor: 'agent', text: 'drafted 4 messages' },
      { actor: 'agent', text: 'requested send approval' },
    ],
  },
  {
    id: 'in_3', ref: 'PRJ-24-8', title: 'ServiceTitan field mapping needs a decision', actor: 'andreas', meta: 'andreas mentioned you', when: '1d', unread: false, priority: 'high', state: 'in_progress', project: 'Northwind intake', labels: ['integration'],
    body: 'Their custom fields don’t line up with our lead schema. Do we normalize on our side or request they add two fields? Prefer normalizing to keep the client light.',
    comments: [{ author: 'u_andreas', when: '1 day ago', body: 'Leaning normalize — thoughts @marcus?' }],
    activity: [{ actor: 'u_andreas', text: 'created the issue' }],
  },
  {
    id: 'in_4', ref: 'PRJ-22-14', title: 'Verde QA sign-off ready', actor: 'tom', meta: 'tom moved to Review', when: '1d', unread: false, priority: 'medium', state: 'review', project: 'Verde campaign', labels: [],
    body: 'All sequences tested against the weather-trigger matrix. Ready for final sign-off before client handoff.',
    comments: [],
    activity: [{ actor: 'u_tom', text: 'moved to Review' }],
  },
  {
    id: 'in_5', ref: 'INT-gmail', title: 'Gmail integration reconnected', actor: 'system', meta: 'system', when: '2d', unread: false, priority: 'low', state: 'done', labels: ['integration'],
    body: 'The Gmail connector token was refreshed successfully. Outreach sending is available again.',
    comments: [],
    activity: [{ actor: 'system', text: 'refreshed credentials' }],
  },
]

// ------------------------------------------------------------------
// Agents / runs / approvals / automations
// ------------------------------------------------------------------
export const agents: Agent[] = [
  { id: 'a_exec', name: 'Executive Operations', purpose: 'Daily briefs, priorities, exception summaries.', autonomy: 'operate', status: 'active', model: 'Codex (local)', fallback: 'business-backup', runsToday: 3, successRate: 99, scopes: ['activities:read', 'tasks:create'], emoji: '🧭', lastRun: '2h ago' },
  { id: 'a_research', name: 'Lead Research & Qualification', purpose: 'Researches & qualifies leads with evidence.', autonomy: 'act', status: 'active', model: 'Codex (local)', fallback: 'business-backup', runsToday: 14, successRate: 96, scopes: ['leads:read', 'leads:write', 'companies:read'], emoji: '🔍', lastRun: '18m ago' },
  { id: 'a_outreach', name: 'Outreach Agent', purpose: 'Drafts outreach, classifies replies, suggests next actions.', autonomy: 'draft', status: 'active', model: 'business-backup', fallback: 'coding-backup', runsToday: 9, successRate: 94, scopes: ['outreach:draft', 'outreach:send:approval-required'], emoji: '✉️', lastRun: '1h ago' },
  { id: 'a_pipeline', name: 'Sales Pipeline Agent', purpose: 'Detects stale/risky deals, recommends actions.', autonomy: 'suggest', status: 'active', model: 'Codex (local)', fallback: 'business-backup', runsToday: 2, successRate: 98, scopes: ['opportunities:read'], emoji: '📈', lastRun: '4h ago' },
  { id: 'a_meeting', name: 'Meeting Agent', purpose: 'Builds briefs, agendas, notes, follow-ups.', autonomy: 'draft', status: 'active', model: 'Codex (local)', fallback: 'business-backup', runsToday: 4, successRate: 97, scopes: ['meetings:read', 'tasks:create'], emoji: '📅', lastRun: '30m ago' },
  { id: 'a_project', name: 'Implementation Project', purpose: 'Plans, monitors delivery risk, prepares updates.', autonomy: 'act', status: 'active', model: 'Codex (local)', fallback: 'coding-backup', runsToday: 5, successRate: 95, scopes: ['projects:update', 'tasks:update'], emoji: '🛠️', lastRun: '1h ago' },
  { id: 'a_success', name: 'Client Success', purpose: 'Monitors relationship & delivery health.', autonomy: 'suggest', status: 'paused', model: 'business-backup', fallback: 'coding-backup', runsToday: 0, successRate: 92, scopes: ['clients:read', 'activities:read'], emoji: '🤝', lastRun: '1d ago' },
  { id: 'a_data', name: 'Data & Automation', purpose: 'Finds duplicates, gaps, workflow failures.', autonomy: 'act', status: 'active', model: 'coding-backup', fallback: 'business-backup', runsToday: 6, successRate: 99, scopes: ['records:read', 'automations:run'], emoji: '🧹', lastRun: '3h ago' },
]
export const agentById = (id: string) => agents.find((a) => a.id === id)!

export const agentRuns: AgentRun[] = [
  { id: 'r_1', agentId: 'a_research', initiator: 'schedule', task: 'Qualify 6 inbound leads', status: 'completed', model: 'Codex (local)', fellBack: false, duration: '42s', when: '18m ago', tokens: '~18k' },
  { id: 'r_2', agentId: 'a_outreach', initiator: 'Marcus Vale', task: 'Draft first-touch for Apex', status: 'awaiting_approval', model: 'business-backup', fellBack: true, duration: '11s', when: '1h ago', tokens: '~6k' },
  { id: 'r_3', agentId: 'a_exec', initiator: 'schedule', task: 'Morning executive brief', status: 'completed', model: 'Codex (local)', fellBack: false, duration: '1m 04s', when: '2h ago', tokens: '~22k' },
  { id: 'r_4', agentId: 'a_project', initiator: 'automation', task: 'Northwind delivery-risk scan', status: 'completed', model: 'Codex (local)', fellBack: false, duration: '38s', when: '1h ago', tokens: '~14k' },
  { id: 'r_5', agentId: 'a_data', initiator: 'schedule', task: 'Duplicate detection sweep', status: 'running', model: 'coding-backup', fellBack: false, duration: '—', when: 'now', tokens: '~3k' },
  { id: 'r_6', agentId: 'a_pipeline', initiator: 'schedule', task: 'Stale-deal detection', status: 'failed', model: 'Codex (local)', fellBack: false, duration: '8s', when: '4h ago', tokens: '~2k' },
]

export const approvals: Approval[] = [
  { id: 'ap_1', action: 'Send 4 outreach emails', agent: 'Outreach Agent', detail: 'First-touch to qualified leads incl. Apex Plumbing', risk: 'yellow', requestedAt: '1h ago', scope: 'outreach:send' },
  { id: 'ap_2', action: 'Update opportunity stage', agent: 'Sales Pipeline Agent', detail: 'Move OPP-138 to Discovery based on reply intent', risk: 'green', requestedAt: '2h ago', scope: 'opportunities:move_stage' },
  { id: 'ap_3', action: 'Send revised proposal', agent: 'Outreach Agent', detail: 'BrightSmile membership renewals — phased terms', risk: 'orange', requestedAt: '30m ago', scope: 'proposals:send' },
]

export const automations: Automation[] = [
  { id: 'au_1', name: 'New lead → research + score', trigger: 'Lead created', action: 'Run Lead Research Agent', enabled: true, runs: 214, lastRun: '18m ago' },
  { id: 'au_2', name: 'Won deal → create project', trigger: 'Opportunity → Won', action: 'Create project from template', enabled: true, runs: 12, lastRun: '2w ago' },
  { id: 'au_3', name: 'Stale deal alert', trigger: 'No activity 7d', action: 'Notify owner + suggest next action', enabled: true, runs: 46, lastRun: '4h ago' },
  { id: 'au_4', name: 'Reply received → classify', trigger: 'Outreach reply', action: 'Classify + draft response', enabled: true, runs: 88, lastRun: '5h ago' },
  { id: 'au_5', name: 'Project at risk → escalate', trigger: 'Health = red', action: 'Notify owner, add to Today', enabled: false, runs: 3, lastRun: '1w ago' },
]

export const integrations: Integration[] = [
  { name: 'Codex Cloud', category: 'Model lane', status: 'available', detail: 'Primary lane · owner login' },
  { name: 'Mac Runner', category: 'Runner', status: 'offline', detail: 'Local-only ops unavailable' },
  { name: 'FCM Router', category: 'Model lane', status: 'unreachable', detail: 'localhost:… not responding' },
  { name: 'Hermes', category: 'Agent bus', status: 'connected', detail: 'Connected · 3 tools' },
  { name: 'GitHub', category: 'Dev', status: 'connected', detail: 'operator-os · main' },
  { name: 'Gmail', category: 'Comms', status: 'connected', detail: 'marcus@ · sending enabled' },
  { name: 'Google Calendar', category: 'Comms', status: 'connected', detail: '2 calendars synced' },
  { name: 'Slack', category: 'Comms', status: 'available', detail: 'Not connected' },
]

export const activities: Activity[] = [
  { actor: 'u_jori', text: 'moved', target: 'OPP-138 to Qualified', when: '12m ago', kind: 'sales' },
  { actor: 'agent', text: 'qualified 6 leads via', target: 'Lead Research Agent', when: '18m ago', kind: 'agent' },
  { actor: 'u_andreas', text: 'completed', target: 'Data access + RLS review', when: '1h ago', kind: 'delivery' },
  { actor: 'u_zoe', text: 'requested approval to', target: 'send revised proposal', when: '30m ago', kind: 'agent' },
  { actor: 'system', text: 'refreshed', target: 'Gmail credentials', when: '2h ago', kind: 'system' },
  { actor: 'u_owner', text: 'won', target: 'OPP-109 — Northwind ($42k)', when: '1d ago', kind: 'sales' },
  { actor: 'u_tom', text: 'moved', target: 'PRJ-22 to Quality Review', when: '1d ago', kind: 'delivery' },
]

export const notifications: Notification[] = [
  { id: 'n_1', title: 'zoe mentioned you', detail: 'BrightSmile pushing back on renewal terms', when: '12m', unread: true, kind: 'mention' },
  { id: 'n_2', title: 'Outreach Agent needs approval', detail: 'Send 4 outreach emails', when: '1h', unread: true, kind: 'approval' },
  { id: 'n_3', title: 'andreas mentioned you', detail: 'ServiceTitan field mapping decision', when: '1d', unread: true, kind: 'mention' },
  { id: 'n_4', title: 'Task assigned by Executive Agent', detail: 'Review 4 outreach drafts', when: '2h', unread: false, kind: 'assigned' },
  { id: 'n_5', title: 'Raj replied', detail: 'Re: Membership renewals', when: '5h', unread: false, kind: 'reply' },
]

export const files: FileRec[] = [
  { id: 'f_1', name: 'Northwind_Scope_v3.pdf', kind: 'PDF', size: '2.4 MB', linkedTo: 'PRJ-24', owner: 'u_andreas', updatedAt: '2d ago' },
  { id: 'f_2', name: 'Harbor_Dispatch_Proposal.pdf', kind: 'PDF', size: '1.1 MB', linkedTo: 'OPP-126', owner: 'u_jori', updatedAt: '1d ago' },
  { id: 'f_3', name: 'BrightSmile_Terms_revised.docx', kind: 'DOCX', size: '88 KB', linkedTo: 'OPP-118', owner: 'u_zoe', updatedAt: '30m ago' },
  { id: 'f_4', name: 'Verde_Walkthrough.mp4', kind: 'Video', size: '146 MB', linkedTo: 'PRJ-22', owner: 'u_tom', updatedAt: '1d ago' },
  { id: 'f_5', name: 'Discovery_Notes_Summit.md', kind: 'Doc', size: '12 KB', linkedTo: 'c_summit', owner: 'u_jori', updatedAt: '3h ago' },
]

export const knowledge: KnowledgeDoc[] = [
  { id: 'k_1', title: 'Discovery Call Playbook', category: 'Playbook', updatedAt: '1w ago', attachedAgents: 2 },
  { id: 'k_2', title: 'AI Intake Implementation SOP', category: 'SOP', updatedAt: '3d ago', attachedAgents: 1 },
  { id: 'k_3', title: 'Proposal Template — Custom Agent', category: 'Template', updatedAt: '2w ago', attachedAgents: 0 },
  { id: 'k_4', title: 'Service Offers & Pricing', category: 'Offer', updatedAt: '5d ago', attachedAgents: 3 },
  { id: 'k_5', title: 'Outreach Agent — tone & guardrails', category: 'Agent Instruction', updatedAt: '4d ago', attachedAgents: 1 },
]

export const runnerStatus = [
  { name: 'Codex Cloud', status: 'Available', color: 'green' as StatusColor },
  { name: 'Mac Runner', status: 'Offline', color: 'red' as StatusColor },
  { name: 'FCM Router', status: 'Unreachable', color: 'red' as StatusColor },
  { name: 'Hermes', status: 'Connected', color: 'green' as StatusColor },
  { name: 'GitHub', status: 'Connected', color: 'green' as StatusColor },
  { name: 'Gmail', status: 'Connected', color: 'green' as StatusColor },
]

export const fmtMoney = (n: number) => '$' + (n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'k' : String(n))
