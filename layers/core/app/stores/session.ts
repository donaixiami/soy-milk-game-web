import { defineStore } from 'pinia';
import { ref } from 'vue';

export type PublicSession = Record<string, unknown>;

export const useSessionStore = defineStore('session', () => {
  const session = ref<PublicSession | null>(null);

  function setSession(value: PublicSession) {
    session.value = value;
  }

  function clearSession() {
    session.value = null;
  }

  return { clearSession, session, setSession };
});
