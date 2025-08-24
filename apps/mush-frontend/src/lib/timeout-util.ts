const taskWithTimeout = async <T>(
  task: Promise<T> | ((signal: AbortSignal) => Promise<T>), // abortable, or not.
  timeout: number,
  outerSignal?: AbortSignal,
): Promise<T> => {
  const controller = new AbortController();
  if (outerSignal) {
    if (outerSignal.aborted) controller.abort();
    else {
      outerSignal.addEventListener('abort', () => {
        controller.abort();
      });
    }
  }

  let timer: NodeJS.Timeout | null = null;

  const timerPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Timeout'));
    }, timeout);
  });

  try {
    const taskPromise =
      typeof task === 'function'
        ? (task as (signal: AbortSignal) => Promise<T>)(controller.signal)
        : task;

    return await Promise.race([taskPromise, timerPromise]);
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (timer) clearTimeout(timer);
  }
};

export { taskWithTimeout };
