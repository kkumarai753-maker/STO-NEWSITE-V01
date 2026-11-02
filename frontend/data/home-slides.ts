/**
 * Home page service slider (components/slider). Artwork lives in
 * public/sliders: desktop files are 1920 × 807, mobile files 1080 × 1350
 * (recomposed, not cropped). The headline, copy and buttons are part of the
 * artwork, so `alt` repeats the slide's text and every visible button gets a
 * real link laid over it.
 *
 * Button rectangles are [left, top, width, height] in percent of the image,
 * converted from the designer's pixel positions (layout-and-buttons.json in
 * the slider handover).
 */
export type SlideRect = readonly [left: number, top: number, width: number, height: number];

export type SlideLink = {
  label: string;
  href: string;
  desktop: SlideRect;
  mobile: SlideRect;
};

export type HomeSlide = {
  id: string;
  /** Short name for the slide picker. */
  label: string;
  title: string;
  alt: string;
  desktop: string;
  mobile: string;
  links: SlideLink[];
};

const DESKTOP_TOP = 79.678;
const DESKTOP_HEIGHT = 8.922;
const MOBILE_TOP = 43.926;
const MOBILE_HEIGHT = 5.333;

/** The common single-button placement: bottom-left on desktop, under the copy on mobile. */
function cta(label: string, href: string, desktopWidth: number, mobileWidth: number): SlideLink {
  return {
    label,
    href,
    desktop: [5.417, DESKTOP_TOP, desktopWidth, DESKTOP_HEIGHT],
    mobile: [6.481, MOBILE_TOP, mobileWidth, MOBILE_HEIGHT],
  };
}

function art(id: string) {
  return {
    desktop: `/sliders/desktop/sunrise-${id}.webp`,
    mobile: `/sliders/mobile/sunrise-${id}-mobile.webp`,
  };
}

export const homeSlides: HomeSlide[] = [
  {
    id: "smarter-future",
    label: "Overview",
    title: "Innovative Tech for a Smarter Future",
    alt: "Innovative Tech for a Smarter Future. Websites, software and automation built to move your business forward. Websites, Software, Automation, Digital Marketing.",
    ...art("10-smarter-future"),
    links: [
      cta("Explore Services", "/services", 16.667, 32.593),
      {
        label: "Let’s Talk",
        href: "/contact",
        desktop: [23.229, DESKTOP_TOP, 9.531, DESKTOP_HEIGHT],
        mobile: [41.111, MOBILE_TOP, 18.611, MOBILE_HEIGHT],
      },
    ],
  },
  {
    id: "website-development",
    label: "Websites",
    title: "Website Development",
    alt: "Website Development. Responsive websites, online stores and landing pages built for your business: business and e-commerce websites, landing pages, domain and hosting support.",
    ...art("01-website-development"),
    links: [cta("Plan your website", "/services/website-development", 17.292, 33.889)],
  },
  {
    id: "apps-custom-software",
    label: "Apps & Software",
    title: "Apps & Custom Software",
    alt: "Apps and Custom Software. Build apps and software around how your customers and your team work: mobile and web applications, custom software and SaaS platforms, API integrations.",
    ...art("02-apps-custom-software"),
    links: [cta("Discuss your app", "/services/custom-software-development", 16.979, 33.241)],
  },
  {
    id: "whatsapp-email-automation",
    label: "Automation",
    title: "WhatsApp & Email Automation",
    alt: "WhatsApp and Email Automation. Reduce repetitive tasks and organise your customer communication: enquiry responses and follow-ups, WhatsApp and email workflows, AI agents and business automation.",
    ...art("03-whatsapp-email-automation"),
    links: [cta("Explore automation", "/services/whatsapp-automation", 18.385, 36.111)],
  },
  {
    id: "digital-marketing",
    label: "Marketing",
    title: "Digital Marketing",
    alt: "Digital Marketing. Help the right customers find, understand and connect with your business: social media content, local SEO, paid campaigns.",
    ...art("04-digital-marketing-social"),
    links: [cta("Grow your presence", "/digital-growth", 18.958, 37.315)],
  },
  {
    id: "crm-integrations",
    label: "CRM",
    title: "CRM & Business Integrations",
    alt: "CRM and Business Integrations. Organise leads, customers and follow-ups, and connect the tools your team uses: lead and customer management, sales follow-up workflows, business tool integrations.",
    ...art("06-crm-workflows"),
    links: [cta("Connect your tools", "/services/erp-crm-hrms", 18.125, 35.556)],
  },
  {
    id: "brand-identity",
    label: "Branding",
    title: "Logo & Brand Identity",
    alt: "Logo and Brand Identity. Give your business a clear, consistent look across every customer touchpoint: logo design, brand guidelines, business and social media creatives.",
    ...art("07-logo-brand-identity"),
    links: [cta("Build your brand", "/digital-growth", 16.406, 32.037)],
  },
  {
    id: "it-software-solutions",
    label: "IT Solutions",
    title: "Software built for the way you work",
    alt: "IT and Software Solutions. Software built for the way you work: ERP, CRM, HRMS, websites, apps and AI automation.",
    ...art("09-it-software-solutions"),
    links: [],
  },
];
