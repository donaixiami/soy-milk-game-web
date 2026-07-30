import { shallowRef } from 'vue';

import type { UploadedAsset, UploadState } from '../types/upload';

interface UploaderOptions {
  maxSize: number;
  accept: string[];
}

export function createUploader(options: UploaderOptions) {
  const state = shallowRef<UploadState>('idle');
  const controller = shallowRef<AbortController>();

  async function upload(
    file: File,
    transport: (file: File, signal: AbortSignal) => Promise<UploadedAsset>,
  ) {
    state.value = 'validating';
    if (!options.accept.includes(file.type)) {
      state.value = 'error';
      throw new Error('不支持的文件类型');
    }
    if (file.size > options.maxSize) {
      state.value = 'error';
      throw new Error('文件大小超过限制');
    }

    controller.value = new AbortController();
    state.value = 'uploading';
    try {
      const asset = await transport(file, controller.value.signal);
      state.value = 'success';
      return asset;
    } catch (error) {
      state.value = controller.value.signal.aborted ? 'cancelled' : 'error';
      throw error;
    }
  }

  function cancel() {
    controller.value?.abort();
  }

  return { state, upload, cancel };
}
