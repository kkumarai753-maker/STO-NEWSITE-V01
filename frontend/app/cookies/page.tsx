import { analyticsEnabled, siteConfig } from "@/config/site";
import { LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/cookies");

export default function CookiesPage() {
  return (
    <LegalPage
      path="/cookies"
      intro="This page explains how this website uses cookies and similar browser storage."
      sections={[
        {
          heading: "What we use",
          body: [
            "This website does not set advertising or third-party tracking cookies by default.",
            "Callback prompt: session storage remembers whether the automatic callback prompt has been shown in this browser tab, so it does not repeatedly interrupt your visit. This flag does not contain the details entered in the form.",
            "Session storage: the AI assistant keeps your current conversation in your browser's session storage so it survives page reloads. It is cleared when you close the tab or press “Clear conversation”.",
          ],
        },
        {
          heading: "Analytics",
          body: analyticsEnabled
            ? [
                "This website uses Vercel Web Analytics to count page views and see which websites send visitors here. It does not use cookies and does not identify individual visitors; the data is aggregated.",
              ]
            : [
                "This website does not currently use analytics. If analytics are added, this policy will be updated and, where required, your consent will be requested before any non-essential cookies are set.",
              ],
        },
        {
          heading: "Managing storage",
          body: [
            "You can clear cookies and site data at any time through your browser settings.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about this policy: ${siteConfig.contact.email}.`],
        },
      ]}
    />
  );
}
