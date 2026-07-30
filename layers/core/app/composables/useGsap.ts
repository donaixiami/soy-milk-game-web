import { getAnimationDuration } from '../../utils/motion';

export function useGsap(scope?: Ref<Element | null>) {
  const { $gsap } = useNuxtApp();
  const context = shallowRef<ReturnType<typeof $gsap.context>>();
  const reducedMotion = import.meta.client
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  onMounted(() => {
    context.value = $gsap.context(() => undefined, scope?.value ?? undefined);
  });
  onScopeDispose(() => context.value?.revert());

  return {
    gsap: $gsap,
    contextSafe: (callback: (...args: unknown[]) => void) => context.value?.contextSafe(callback),
    duration: (seconds: number) => getAnimationDuration(seconds, reducedMotion),
  };
}
