<script setup lang="ts">
import { Button, Upload } from 'ant-design-vue';

import type { UploadedAsset } from '../../../types/upload';
import { useUploader } from '../../composables/useUploader';

const props = defineProps<{
  accept: string[];
  maxSize: number;
  transport: (file: File, signal: AbortSignal) => Promise<UploadedAsset>;
}>();
const emit = defineEmits<{ success: [asset: UploadedAsset]; error: [error: unknown] }>();
const uploader = useUploader({ accept: props.accept, maxSize: props.maxSize });

async function beforeUpload(file: File) {
  try {
    emit('success', await uploader.upload(file, props.transport));
  } catch (error) {
    emit('error', error);
  }
  return false;
}
</script>

<template>
  <Upload :before-upload="beforeUpload" :show-upload-list="false">
    <Button :loading="uploader.state.value === 'uploading'">选择文件</Button>
  </Upload>
</template>
