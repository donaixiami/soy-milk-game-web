import { assertProductionRuntimeConfig } from '../utils/security';

export default defineNitroPlugin(() => {
  if (import.meta.dev) return;
  const config = useRuntimeConfig();
  assertProductionRuntimeConfig({
    backendBaseUrl: config.backendBaseUrl as string,
    cookieSecret: config.cookieSecret as string,
    siteUrl: config.public.siteUrl as string,
  });
});
