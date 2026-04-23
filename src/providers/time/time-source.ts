export interface TimeSource {
  now(): Date;
}

export const systemTimeSource: TimeSource = {
  now() {
    return new Date();
  }
};

