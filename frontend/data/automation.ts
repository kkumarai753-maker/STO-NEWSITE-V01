import {
  Bell,
  BrainCircuit,
  CircleCheck,
  Database,
  Inbox,
  ListTodo,
  Mail,
  ScanText,
  Search,
  Send,
  Split,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type AutomationStage = { id: string; label: string; icon: LucideIcon };

/** The journey every automation follows, in plain language. */
export const automationStages: AutomationStage[] = [
  { id: "request", label: "Customer asks", icon: Inbox },
  { id: "understanding", label: "AI understands", icon: BrainCircuit },
  { id: "decision", label: "AI decides", icon: Split },
  { id: "automation", label: "Work gets done", icon: Workflow },
  { id: "system", label: "Records updated", icon: Database },
  { id: "approval", label: "Team approves", icon: UserCheck },
  { id: "result", label: "Customer gets a reply", icon: CircleCheck },
];

export type AutomationStep = {
  id: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  /** Highest journey stage (index into automationStages) reached by this step. */
  stage: number;
};

/** Example: handling a customer email from start to finish (sample data). */
export const automationRun: { name: string; steps: AutomationStep[] } = {
  name: "Customer email assistant",
  steps: [
    {
      id: "email",
      title: "An email arrives",
      detail: "“My order #4821 arrived damaged, can I get a replacement?”",
      icon: Mail,
      stage: 0,
    },
    {
      id: "read",
      title: "AI reads the email",
      detail: "It understands the customer wants a replacement.",
      icon: ScanText,
      stage: 1,
    },
    {
      id: "extract",
      title: "AI finds the details",
      detail: "Customer name, order number and product.",
      icon: Search,
      stage: 2,
    },
    {
      id: "crm",
      title: "Customer record updated",
      detail: "The order history is updated automatically.",
      icon: Database,
      stage: 4,
    },
    {
      id: "task",
      title: "A task is created",
      detail: "“Send replacement” is added to the team’s to-do list.",
      icon: ListTodo,
      stage: 4,
    },
    {
      id: "notify",
      title: "The team is notified",
      detail: "A manager approves it with one click.",
      icon: Bell,
      stage: 5,
    },
    {
      id: "respond",
      title: "The customer gets a reply",
      detail: "A friendly reply with tracking details is sent.",
      icon: Send,
      stage: 6,
    },
  ],
};

/** What the AI picked out of the email, shown as simple facts. */
export const automationFindings: { label: string; value: string }[] = [
  { label: "Customer", value: "Jordan Lee" },
  { label: "Order", value: "#4821" },
  { label: "Product", value: "Desk Lamp Pro" },
  { label: "Problem", value: "Arrived damaged" },
  { label: "Wants", value: "A replacement" },
];
