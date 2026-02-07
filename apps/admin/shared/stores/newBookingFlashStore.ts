/**
 * Global store for new booking flash IDs.
 * Persists across page navigation (module-level singleton).
 * Bookings realtime adds IDs here; BookingsTable reads & dismisses them.
 */

type Listener = () => void;

const flashIds = new Set<string>();
const listeners = new Set<Listener>();
let snapshot = new Set<string>();

function notify() {
  snapshot = new Set(flashIds);
  listeners.forEach((fn) => fn());
}

export const newBookingFlashStore = {
  add(id: string) {
    if (!flashIds.has(id)) {
      flashIds.add(id);
      notify();
    }
  },
  dismiss(id: string) {
    if (flashIds.has(id)) {
      flashIds.delete(id);
      notify();
    }
  },
  has(id: string) {
    return flashIds.has(id);
  },
  getSnapshot(): Set<string> {
    return snapshot;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
