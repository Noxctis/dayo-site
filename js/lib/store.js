/** Minimal observable store: one source of truth for state shared across features. */
export function createStore(initial) {
  let state = { ...initial };
  const subscribers = new Set();

  return {
    get: () => state,
    set(patch) {
      const changed = Object.keys(patch).some((key) => !Object.is(state[key], patch[key]));
      if (!changed) return;
      state = { ...state, ...patch };
      subscribers.forEach((fn) => fn(state));
    },
    /** Calls `fn` immediately with the current state, then on every change. */
    subscribe(fn) {
      subscribers.add(fn);
      fn(state);
      return () => subscribers.delete(fn);
    },
  };
}
