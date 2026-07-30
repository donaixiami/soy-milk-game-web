import { createSeoDefinition } from '../../utils/seo';

interface SeoPageInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  private?: boolean;
  structuredData?: Record<string, unknown>;
}

export function useSeoPage(input: SeoPageInput) {
  const config = useRuntimeConfig();
  const seo = createSeoDefinition({
    ...input,
    siteUrl: config.public.siteUrl as string,
  });

  useSeoMeta({
    title: seo.title,
    description: seo.description,
    robots: seo.robots,
    ogTitle: seo.title,
    ogDescription: seo.description,
    ogImage: seo.image,
  });
  useHead({
    link: [{ rel: 'canonical', href: seo.canonical }],
    script: input.structuredData
      ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(input.structuredData) }]
      : [],
  });

  return seo;
}
