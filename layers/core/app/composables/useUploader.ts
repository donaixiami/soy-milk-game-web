import { createUploader } from '../../utils/uploader';

export function useUploader(options: { maxSize: number; accept: string[] }) {
  return createUploader(options);
}
