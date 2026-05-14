export type ExpoReminderSyncTask = (isLatest: () => boolean) => Promise<void>;

export function createExpoReminderSyncQueue() {
  let generation = 0;
  let queue = Promise.resolve();

  function run(task: ExpoReminderSyncTask) {
    const currentGeneration = ++generation;
    const isLatest = () => currentGeneration === generation;

    queue = queue.catch(() => undefined).then(() => task(isLatest));

    return queue;
  }

  return {
    run
  };
}
