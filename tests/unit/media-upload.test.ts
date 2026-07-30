import { describe, expect, it } from 'vitest';

import { resolveImageSource } from '../../layers/core/utils/image-source';
import { createUploader } from '../../layers/core/utils/uploader';

describe('图片来源解析', () => {
  it('Blob 与 Data URL 使用原生图片渲染', () => {
    expect(resolveImageSource('blob:https://site.test/1')).toMatchObject({ optimized: false });
    expect(resolveImageSource('data:image/png;base64,AA')).toMatchObject({ optimized: false });
  });

  it('私有资源只保留稳定资源 ID，不拼接访问令牌', () => {
    expect(resolveImageSource({ assetId: 'media_1', private: true })).toEqual({
      optimized: true,
      src: '/api/media/media_1',
    });
  });
});

describe('上传状态机', () => {
  it('拒绝超出限制的文件并进入 error 状态', async () => {
    const uploader = createUploader({ maxSize: 10, accept: ['image/png'] });
    const file = new File(['12345678901'], 'large.png', { type: 'image/png' });

    await expect(uploader.upload(file, async () => ({ id: '1', name: file.name, mimeType: file.type, size: file.size })))
      .rejects.toThrowError('文件大小超过限制');
    expect(uploader.state.value).toBe('error');
  });

  it('上传成功后返回统一 UploadedAsset', async () => {
    const uploader = createUploader({ maxSize: 100, accept: ['image/png'] });
    const file = new File(['123'], 'ok.png', { type: 'image/png' });
    const asset = await uploader.upload(file, async () => ({ id: '1', name: file.name, mimeType: file.type, size: file.size }));

    expect(uploader.state.value).toBe('success');
    expect(asset).toEqual({ id: '1', name: 'ok.png', mimeType: 'image/png', size: 3 });
  });
});
