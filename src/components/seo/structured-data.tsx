import { siteConfig } from "@/config/site";

/** JSON-LD structured data for rich search results. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Text to speech",
      "Multiple voices and languages",
      "Adjustable rate, pitch and volume",
      "Downloadable audio (with API providers)",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, generated data — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
