import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateMetadata(props: { params: { slug: string } | Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const lesson = await getLesson(params.slug);
  if (!lesson) return {};
  return {
    title: lesson.data.title || params.slug,
    description: lesson.data.description || '',
  };
}

async function getLesson(slug: string) {
  const filePath = path.join(process.cwd(), 'content/lessons', `${slug}.mdx`);
  try {
    const source = fs.readFileSync(filePath, 'utf8');
    return matter(source);
  } catch {
    return null;
  }
}

export default async function LessonPage(props: { params: { slug: string } } | { params: Promise<{ slug: string }> }) {
  const params = 'then' in props.params ? await props.params : props.params;
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
