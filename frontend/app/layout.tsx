import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { analyticsEnabled, isIndexable, siteConfig } from "@/config/site";
import { DesignLabLoader } from "@/components/dev/design-lab-loader";
import { BackgroundFX } from "@/components/effects/background-fx";
import { PageEffects } from "@/components/effects/page-effects";
import { DEFAULTS, INIT_SCRIPT } from "@/lib/design-lab";
import { FloatingDock } from "@/components/floating-actions/floating-dock";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { InlineScript } from "@/components/providers/inline-script";
import { SiteChrome } from "@/components/providers/site-chrome";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

// Licensed fonts ship with the project: builds and first paint need no font CDN.
const brandFont = localFont({
  src: [
    { path: "../assets/fonts/Geist-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/Geist-Medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/Geist-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-brand",
  display: "swap",
});

const showDesignLab = false;

/**
 * Site-wide defaults. Each page adds its own title, description, canonical
 * and Open Graph tags through pageMetadata() (lib/seo.ts); there is
 * deliberately no default canonical, so a page without one never points at
 * the home page.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.metaDescription,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image" },
  // Preview and staging deployments are never indexed (see isIndexable).
  robots: isIndexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
      }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  // Matches the soft blue-white page background.
  themeColor: "#F5F8FD",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before first paint: opts into scroll-reveal styles only when JS is available. */
const JS_FLAG = "document.documentElement.classList.add('js')";

/**
 * Some browser extensions (form fillers, password managers) stamp `fdprocessedid`
 * on every button and input before React hydrates, which triggers a hydration
 * mismatch warning in development. Strip it as soon as it appears; the observer
 * callback runs as a microtask, so it wins the race against hydration.
 */
const STRIP_EXTENSION_ATTRS = `(function(){var a="fdprocessedid";function s(r){if(r.nodeType!==1)return;if(r.hasAttribute(a))r.removeAttribute(a);var l=r.querySelectorAll("["+a+"]");for(var i=0;i<l.length;i++)l[i].removeAttribute(a)}var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++){var x=m[i];if(x.type==="attributes")x.target.removeAttribute(a);else for(var j=0;j<x.addedNodes.length;j++)s(x.addedNodes[j])}});o.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:[a]});addEventListener("load",function(){setTimeout(function(){o.disconnect()},5000)})})()`;
const stripExtensionAttrs = process.env.NODE_ENV !== "production";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={brandFont.variable}
      data-palette="sunrise"
      data-font={DEFAULTS.font}
      data-bg={DEFAULTS.bg}
      data-logo={DEFAULTS.logo}
      suppressHydrationWarning
    >
      <head>
        {stripExtensionAttrs ? <InlineScript html={STRIP_EXTENSION_ATTRS} /> : null}
        <InlineScript html={JS_FLAG} />
        {showDesignLab ? <InlineScript html={INIT_SCRIPT} /> : null}
      </head>
      <body>
        <BackgroundFX />
        <JsonLd graph={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteChrome>
          <Navbar />
        </SiteChrome>
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteChrome>
          <Footer />
          <FloatingDock />
        </SiteChrome>
        <PageEffects />
        {analyticsEnabled ? <Analytics /> : null}
        {showDesignLab ? (
          <SiteChrome>
            <DesignLabLoader />
          </SiteChrome>
        ) : null}
      </body>
    </html>
  );
}
