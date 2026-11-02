/** Product mockup showcase tabs. Mockups live in components/products/mockups. */
export type ProductMockupId =
  | "ai-dashboard"
  | "workflow"
  | "crm"
  | "analytics"
  | "portal"
  | "mobile"
  | "admin";

export type ProductTab = {
  id: ProductMockupId;
  label: string;
  url: string;
  description: string;
};

export const productTabs: ProductTab[] = [
  {
    id: "ai-dashboard",
    label: "AI Assistant",
    url: "app.yourproduct.com/assistant",
    description: "See every customer conversation your AI assistant handles, in one place.",
  },
  {
    id: "workflow",
    label: "Automation",
    url: "app.yourproduct.com/automations/enquiries",
    description: "A simple visual map of the steps your business runs automatically.",
  },
  {
    id: "crm",
    label: "Sales (CRM)",
    url: "app.yourproduct.com/sales",
    description: "Track every deal and customer, with helpful next-step suggestions.",
  },
  {
    id: "analytics",
    label: "Reports",
    url: "app.yourproduct.com/reports",
    description: "Clear, live charts showing how your business is doing.",
  },
  {
    id: "portal",
    label: "Customer Portal",
    url: "portal.yourproduct.com",
    description: "A place where customers can check orders, invoices and get help.",
  },
  {
    id: "mobile",
    label: "Mobile App",
    url: "iOS · Android",
    description: "A phone app for your team that works even without internet.",
  },
  {
    id: "admin",
    label: "Admin Panel",
    url: "admin.yourproduct.com/team",
    description: "Manage your team, permissions and settings.",
  },
];
