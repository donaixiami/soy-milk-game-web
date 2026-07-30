interface SeoInput {
  siteUrl: string;
  title: string;
  description: string;
  path: string;
  image?: string;
  private?: boolean;
}

export function createSeoDefinition(input: SeoInput) {
  const siteUrl = input.siteUrl.replace(/\/$/, '');
  const path = input.path.split('?')[0] || '/';

  return {
    title: input.title,
    description: input.description,
    canonical: `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`,
    image: input.image,
    robots: input.private ? 'noindex,nofollow' : 'index,follow',
  };
}
