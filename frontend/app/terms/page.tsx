import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      intro={`These terms govern your use of this website operated by ${siteConfig.legalName}. By using the website you agree to them.`}
      sections={[
        {
          heading: "Use of the website",
          body: [
            "You may use this website for lawful purposes only. You must not attempt to disrupt, overload or gain unauthorised access to the website or its systems, including the AI assistant and contact form.",
          ],
        },
        {
          heading: "Content",
          body: [
            "Website content, including illustrative product interfaces and sample projects, is provided for general information. Sample projects are examples of systems we build and do not describe specific client engagements unless stated.",
          ],
        },
        {
          heading: "AI assistant",
          body: [
            "The website assistant provides automated, general information and may make mistakes. Nothing it says forms an offer, quotation or contractual commitment.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "The website design, text and graphics are owned by or licensed to us. Third-party names and logos are trademarks of their respective owners and are used for identification only; no partnership or endorsement is implied.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "The website is provided “as is”. To the extent permitted by law, we are not liable for losses arising from its use.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms: ${siteConfig.contact.email}.`],
        },
      ]}
    />
  );
}
