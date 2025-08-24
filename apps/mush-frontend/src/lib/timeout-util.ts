const taskWithTimeout = async <T>(task: Promise<T>, timeout: number): Promise<T> => {
  let timer: NodeJS.Timeout | null = null;

  const timerPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('Timeout'));
    }, timeout);
  });

  try {
    return await Promise.race([task, timerPromise]);
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (timer) clearTimeout(timer);
  }
};

export { taskWithTimeout };
