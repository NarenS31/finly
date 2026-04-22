import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const lesson = await getLesson(params.slug);
  if (!lesson) return {};
  return {
    title: lesson.data.title || params.slug,
    description: lesson.data.description || '',
  };
}

async function getLesson(slug: string) {
  const filePath = path.join(process.cwd(), 'content/epf-curriculum', `${slug}.md`);
  try {
    const source = fs.readFileSync(filePath, 'utf8');
    return matter(source);
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await getLesson(params.slug);
  if (!lesson) return notFound();
  return (
    <main className="prose mx-auto py-8">
      <h1>{lesson.data.title || params.slug}</h1>
      {lesson.data.description && <p className="text-lg text-gray-500 mb-4">{lesson.data.description}</p>}
      <MDXRemote source={lesson.content} />
    </main>
  );
}
