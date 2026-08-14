import type { LucideIcon } from 'lucide-react'
import {
  Sun, Inbox, Bell, LayoutGrid, Users, Building2, Contact, GitBranch, Send, Mail,
  Calendar, FileText, Package, Briefcase, FolderKanban, CheckSquare, CalendarDays,
  Files, BookOpen, Sparkles, Bot, ShieldCheck, Workflow, Router, Activity, BarChart3,
  Plug, Terminal, Settings,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  badge?: number
}
export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export const NAV: NavSection[] = [
  {
    id: 'today',
    label: 'Today',
    items: [
      { id: 'today', label: 'Today', icon: Sun },
      { id: 'my-work', label: 'My Work', icon: LayoutGrid },
      { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 3 },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    items: [
      { id: 'sales-overview', label: 'Sales Overview', icon: BarChart3 },
      { id: 'leads', label: 'Leads', icon: Users },
      { id: 'companies', label: 'Companies', icon: Building2 },
      { id: 'contacts', label: 'Contacts', icon: Contact },
      { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
      { id: 'outreach', label: 'Outreach', icon: Send },
      { id: 'meetings', label: 'Meetings', icon: Calendar },
      { id: 'proposals', label: 'Proposals', icon: FileText },
      { id: 'services', label: 'Services', icon: Package },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    items: [
      { id: 'clients', label: 'Clients', icon: Briefcase },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
      { id: 'calendar', label: 'Calendar', icon: CalendarDays },
      { id: 'files', label: 'Files', icon: Files },
      { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      { id: 'intelligence', label: 'Intelligence Center', icon: Sparkles },
      { id: 'agents', label: 'Agents', icon: Bot },
      { id: 'approvals', label: 'Approvals', icon: ShieldCheck, badge: 3 },
      { id: 'automations', label: 'Automations', icon: Workflow },
      { id: 'model-routing', label: 'Model Routing', icon: Router },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { id: 'activity', label: 'Activity', icon: Activity },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'integrations', label: 'Integrations', icon: Plug },
      { id: 'developer', label: 'Developer', icon: Terminal },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

export const ALL_ITEMS = NAV.flatMap((s) => s.items)
export const itemById = (id: string) => ALL_ITEMS.find((i) => i.id === id)

// Mobile bottom nav
export const MOBILE_NAV: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'today', label: 'Today', icon: Sun },
  { id: 'pipeline', label: 'Sales', icon: GitBranch },
  { id: 'my-work', label: 'Work', icon: CheckSquare },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'more', label: 'More', icon: LayoutGrid },
]
