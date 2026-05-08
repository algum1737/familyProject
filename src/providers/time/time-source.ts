export interface TimeSource {
  now(): Date;
  subscribe?(listener: () => void): () => void;
}

export interface MutableTimeSource extends TimeSource {
  clearOverride(): void;
  getOverride(): string | null;
  setOverride(next: Date | string): void;
}

export const TEST_NOW_STORAGE_KEY = "today-did-you-finish:test-now";
export const TEST_NOW_CHANGED_EVENT = "today-did-you-finish:test-now-changed";

function parseLocalDateTime(override: string) {
  const match = override.match(
    /^local:(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hours, minutes, seconds] = match;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds ?? "0"),
    0
  );
}

function formatLocalDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `local:${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function notifyTimeOverrideChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(TEST_NOW_CHANGED_EVENT));
}

export function isMutableTimeSource(timeSource: TimeSource): timeSource is MutableTimeSource {
  return (
    "getOverride" in timeSource &&
    typeof timeSource.getOverride === "function" &&
    "setOverride" in timeSource &&
    typeof timeSource.setOverride === "function" &&
    "clearOverride" in timeSource &&
    typeof timeSource.clearOverride === "function"
  );
}

export const systemTimeSource: MutableTimeSource = {
  now() {
    if (typeof window !== "undefined") {
      const override = window.localStorage.getItem(TEST_NOW_STORAGE_KEY);

      if (override) {
        const localParsed = parseLocalDateTime(override);

        if (localParsed && !Number.isNaN(localParsed.getTime())) {
          return localParsed;
        }

        const parsed = new Date(override);

        if (!Number.isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }

    return new Date();
  },
  subscribe(listener) {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handleChange = () => {
      listener();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === TEST_NOW_STORAGE_KEY) {
        listener();
      }
    };

    window.addEventListener(TEST_NOW_CHANGED_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(TEST_NOW_CHANGED_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  },
  getOverride() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(TEST_NOW_STORAGE_KEY);
  },
  setOverride(next) {
    if (typeof window === "undefined") {
      return;
    }

    const value =
      next instanceof Date ? formatLocalDateTime(next) : next;

    window.localStorage.setItem(TEST_NOW_STORAGE_KEY, value);
    notifyTimeOverrideChanged();
  },
  clearOverride() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(TEST_NOW_STORAGE_KEY);
    notifyTimeOverrideChanged();
  }
};
