export const siteConfig = {
  name: "Life in the UK Test",
  shortName: "UK Test",
  description:
    "Free practice for the Life in the UK Test. 150 study questions across all five official handbook chapters, timed mock tests in the real exam format (24 questions, 45 minutes, 75% to pass), instant explanations and progress tracking.",
  tagline: "Practise. Pass. Become a citizen.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  locale: "en_GB",
  keywords: [
    "Life in the UK test",
    "British citizenship test",
    "UK settlement test",
    "indefinite leave to remain",
    "Life in the UK practice questions",
    "Life in the UK mock test",
    "UK citizenship exam 2026",
  ],
  links: {
    github: "https://github.com",
  },
  nav: [
    { title: "Home", href: "/" },
    { title: "Practice", href: "/practice" },
    { title: "Mock test", href: "/mock-test" },
    { title: "Mistakes", href: "/mistakes" },
    { title: "Progress", href: "/progress" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
