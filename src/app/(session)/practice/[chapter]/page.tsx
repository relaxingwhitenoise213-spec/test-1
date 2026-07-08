import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeScreen } from "@/components/quiz/practice-screen";
import { CHAPTER_IDS, chapterTitle, isChapterId } from "@/lib/questions";

export const dynamicParams = false;

export function generateStaticParams() {
  return CHAPTER_IDS.map((chapter) => ({ chapter }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter } = await params;
  if (!isChapterId(chapter)) return { title: "Practice" };
  return {
    title: `Practice — ${chapterTitle(chapter)}`,
    description: `Practise Life in the UK Test questions from the chapter '${chapterTitle(chapter)}' with instant answers and explanations.`,
    alternates: { canonical: `/practice/${chapter}` },
  };
}

export default async function PracticeChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  if (!isChapterId(chapter)) notFound();
  return <PracticeScreen chapter={chapter} />;
}
