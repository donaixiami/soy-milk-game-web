import { buildAsyncDataKey } from '../../utils/async-data-key';

export function useApiData<T>(
  resource: string,
  url: string,
  query: Record<string, string | number | boolean | null | undefined> = {},
) {
  const { locale } = useI18n();
  const { $api } = useNuxtApp();
  const key = buildAsyncDataKey(resource, locale.value, query);

  // useAsyncData 的 payload 会在水合时复用，避免客户端重复请求 SSR 已获得的数据。
  return useAsyncData<T>(key, () => $api(url, { query }) as Promise<T>);
}
