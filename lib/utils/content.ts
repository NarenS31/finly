export interface HeadingItem {
  id: string;
  text: string;
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(markdown: string): HeadingItem[] {
  return Array.from(markdown.matchAll(/^##\s+(.+)$/gm)).map((match) => {
    const text = match[1].trim();
    return {
      text,
      id: slugifyHeading(text),
    };
  });
}
