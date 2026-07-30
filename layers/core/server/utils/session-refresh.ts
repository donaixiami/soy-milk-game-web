export function createSessionRefreshCoordinator() {
  const inFlight = new Map<string, Promise<unknown>>();

  return {
    run<T>(sessionKey: string, refresh: () => Promise<T>): Promise<T> {
      const existing = inFlight.get(sessionKey) as Promise<T> | undefined;
      if (existing) return existing;

      const pending = refresh().finally(() => {
        if (inFlight.get(sessionKey) === pending) inFlight.delete(sessionKey);
      });

      inFlight.set(sessionKey, pending);
      return pending;
    },
  };
}
