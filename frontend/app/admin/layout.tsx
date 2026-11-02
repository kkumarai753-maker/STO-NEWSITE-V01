import type { Metadata } from "next";

/** Every admin page and action calls the backend, which may need time to wake from sleep. */
export const maxDuration = 60;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

/** Admin area. The site navbar/footer are hidden here (components/providers/site-chrome). */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
