import { analyticsEnabled, siteConfig } from "@/config/site";
import { LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      intro={`This policy explains how ${siteConfig.legalName} ("we", "us") handles personal information when you visit this website, use the AI assistant or contact us.`}
      sections={[
        {
          heading: "Information we collect",
          body: [
            "Information you provide: when you submit the contact form we receive your name, business email, optional phone/WhatsApp number, company, the service and budget you select, and your project description.",
            "AI assistant: messages you send to the website assistant are processed to generate a reply. Do not share sensitive personal information in the chat.",
            "Technical data: our hosting provider may process standard request data such as IP address, browser type and pages visited for security and performance purposes.",
            ...(analyticsEnabled
              ? ["Analytics: we use Vercel Web Analytics, which records aggregated page views and referring websites without cookies and without identifying individual visitors."]
              : []),
          ],
        },
        {
          heading: "How we use information",
          body: [
            "To respond to your enquiry, prepare proposals and provide our services.",
            "To operate, secure and improve the website, including preventing spam and abuse.",
            "We do not sell personal information.",
          ],
        },
        {
          heading: "Service providers",
          body: [
            "We use trusted processors to run this website, for example hosting, email delivery and AI model providers. They process data on our behalf under appropriate agreements.",
          ],
        },
        {
          heading: "Retention",
          body: [
            "We keep enquiry data only as long as needed for the purposes above or as required by law.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            `Depending on your location you may have rights to access, correct, delete or restrict the use of your personal information. Contact us at ${siteConfig.contact.email} to exercise them.`,
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
