import { siteConfig } from "@/config/site";

/** JSON-LD structured data for rich search results. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    inLanguage: "en-GB",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    featureList: [
      "150 Life in the UK practice questions with explanations",
      "Timed mock tests in the official format (24 questions, 45 minutes)",
      "Practice by handbook chapter with instant feedback",
      "Automatic mistakes list and progress tracking",
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
