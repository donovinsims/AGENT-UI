import type { ReactNode } from 'react'
import { Today, MyWork, Notifications, Inbox } from './today'
import { SalesOverview, Leads, Companies, Contacts, Pipeline, Outreach, Meetings, Proposals, Services } from './sales'
import { Clients, Projects, Tasks, Calendar, Files, Knowledge } from './delivery'
import { IntelligenceCenter, Agents, Approvals, Automations, ModelRouting } from './intelligence'
import { ActivityFeed, Reports, Integrations, Developer, Settings } from './operations'

// route id → screen. Backend later swaps the data layer behind these.
export const SCREENS: Record<string, () => ReactNode> = {
  today: Today,
  'my-work': MyWork,
  inbox: Inbox,
  notifications: Notifications,

  'sales-overview': SalesOverview,
  leads: Leads,
  companies: Companies,
  contacts: Contacts,
  pipeline: Pipeline,
  outreach: Outreach,
  meetings: Meetings,
  proposals: Proposals,
  services: Services,

  clients: Clients,
  projects: Projects,
  tasks: Tasks,
  calendar: Calendar,
  files: Files,
  knowledge: Knowledge,

  intelligence: IntelligenceCenter,
  agents: Agents,
  approvals: Approvals,
  automations: Automations,
  'model-routing': ModelRouting,

  activity: ActivityFeed,
  reports: Reports,
  integrations: Integrations,
  developer: Developer,
  settings: Settings,
}
