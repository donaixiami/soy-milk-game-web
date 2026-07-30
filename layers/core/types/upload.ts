export interface UploadedAsset {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url?: string;
}

export type UploadState =
  | 'idle'
  | 'validating'
  | 'uploading'
  | 'success'
  | 'error'
  | 'cancelled';
