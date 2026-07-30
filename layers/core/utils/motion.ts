export function getAnimationDuration(duration: number, reducedMotion: boolean) {
  return reducedMotion ? 0 : duration;
}
