export const siteConfig = {
  name: "Vocalis",
  shortName: "Vocalis",
  description:
    "Vocalis is a modern text-to-speech studio. Turn text into natural, lifelike speech with multiple voices, languages, and providers — right in your browser.",
  tagline: "Turn text into lifelike speech",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  locale: "en_US",
  keywords: [
    "text to speech",
    "TTS",
    "AI voice generator",
    "speech synthesis",
    "voice over",
    "narration",
    "OpenAI TTS",
    "ElevenLabs",
  ],
  links: {
    github: "https://github.com",
  },
  nav: [
    { title: "Studio", href: "/" },
    { title: "Dashboard", href: "/dashboard" },
    { title: "History", href: "/history" },
    { title: "Settings", href: "/settings" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
