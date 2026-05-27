let clearSessionState: (() => void) | null = null;

export function registerClearSessionState(fn: (() => void) | null): void {
  clearSessionState = fn;
}

export function notifySessionCleared(): void {
  clearSessionState?.();
}
