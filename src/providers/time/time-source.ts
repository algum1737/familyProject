export interface TimeSource {
  now(): Date;
}

export const TEST_NOW_STORAGE_KEY = "today-did-you-finish:test-now";

export const systemTimeSource: TimeSource = {
  now() {
    if (typeof window !== "undefined") {
      const override = window.localStorage.getItem(TEST_NOW_STORAGE_KEY);

      if (override) {
        const parsed = new Date(override);

        if (!Number.isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }

    return new Date();
  }
};
