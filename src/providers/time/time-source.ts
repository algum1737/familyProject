export interface TimeSource {
  now(): Date;
}

export const TEST_NOW_STORAGE_KEY = "today-did-you-finish:test-now";

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

export const systemTimeSource: TimeSource = {
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
  }
};
