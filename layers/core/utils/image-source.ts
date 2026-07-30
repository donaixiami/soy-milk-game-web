type ImageSource = string | { assetId: string; private: true };

export function resolveImageSource(source: ImageSource) {
  if (typeof source === 'string') {
    return {
      optimized: !source.startsWith('blob:') && !source.startsWith('data:'),
      src: source,
    };
  }

  return {
    optimized: true,
    src: `/api/media/${encodeURIComponent(source.assetId)}`,
  };
}
