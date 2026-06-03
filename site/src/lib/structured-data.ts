import { SITE_URL, REPO_URL, HARNESS_VERSION, SITE_DESCRIPTION } from "@/lib/site";

const DESCRIPTION = SITE_DESCRIPTION;

/** Site-wide: the website itself. */
export const WEBSITE_JSONLD: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "harness-mini",
  url: SITE_URL,
  description: DESCRIPTION,
};

/** Site-wide: the project/author behind it. */
export const ORGANIZATION_JSONLD: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "harness-mini",
  url: SITE_URL,
  sameAs: [REPO_URL],
};

/** Homepage: harness-mini as an open-source developer tool. */
export const SOFTWARE_JSONLD: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "harness-mini",
  description: DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux",
  softwareVersion: HARNESS_VERSION,
  codeRepository: REPO_URL,
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "harness-mini", url: REPO_URL },
};
