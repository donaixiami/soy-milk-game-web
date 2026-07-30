import { createEventAuthBff } from '../../utils/auth-event';
import { assertTrustedOrigin } from '../../utils/csrf';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  assertTrustedOrigin(config.public.siteUrl as string, getHeader(event, 'origin'));
  const credentials = await readBody<Record<string, unknown>>(event);
  return createEventAuthBff<Record<string, unknown>, unknown>(event).register(credentials);
});
