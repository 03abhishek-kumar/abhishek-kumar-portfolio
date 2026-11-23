/**
 * Run non-urgent setup (e.g. below-the-fold ScrollTriggers) when the main
 * thread is idle, so it never lengthens the hydration task. Returns a cancel fn.
 */
export function onIdle(cb: () => void, timeout = 1500): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const t = window.setTimeout(cb, 1);
  return () => window.clearTimeout(t);
}
