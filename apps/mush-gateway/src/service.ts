import { Redis } from '@upstash/redis/cloudflare';
import { HTTPException } from 'hono/http-exception';

import { HashTask, HashTaskSchema, TaskBody, z } from '@repo/schemas';
import { Ctx } from '.';

let redis: Redis | null = null;

const getRedis = (c: Ctx): Redis => {
  redis ??= new Redis({ url: c.env.REDIS_URL, token: c.env.REDIS_TOKEN });
  return redis;
};

const pingRedis = async (c: Ctx): Promise<string> => {
  const r = getRedis(c);
  try {
    return await r.ping();
  } catch (error: unknown) {
    throw new HTTPException(503, {
      message: `Failed to ping Redis: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const getTaskKey = (c: Ctx, p_hash: string): string => {
  return `${c.env.TASKS_KEY}:${p_hash}`;
};

const getTask = async (c: Ctx, p_hash: string): Promise<HashTask | null> => {
  const r = getRedis(c);
  const taskKey = getTaskKey(c, p_hash);

  let existingTask: HashTask | null = null;
  try {
    existingTask = await r.get<HashTask>(taskKey);
  } catch (error: unknown) {
    throw new HTTPException(503, {
      message: `Failed to get task from Redis: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
  if (!existingTask) return null;

  const validated = HashTaskSchema.safeParse(existingTask);
  if (!validated.success)
    throw new HTTPException(500, {
      message: `Existing task data is invalid: ${z.prettifyError(validated.error)}`,
    });
  return validated.data;
};

const idempotentAddTask = async (c: Ctx, taskBody: TaskBody): Promise<HashTask> => {
  const r = getRedis(c);
  const taskKey = getTaskKey(c, taskBody.p_hash);

  const newTask: HashTask = {
    ...taskBody,
    status: 'queued' as const,
    processed_at: 0,
    retry_count: 0,
    result: [],
  };
  const validated = HashTaskSchema.safeParse(newTask);
  if (!validated.success)
    throw new HTTPException(500, {
      message: `New task data is invalid: ${z.prettifyError(validated.error)}`,
    });

  try {
    const ok = await r.set<HashTask>(taskKey, validated.data, { nx: true, ex: c.env.RESULT_TTL });

    // idempotent
    if (!ok) {
      const existingTask = await getTask(c, taskBody.p_hash);
      if (existingTask) return existingTask;
      throw new Error('Idempotent check failed, but existing task was not found');
    }

    await r.rpush(c.env.QUEUE_KEY, taskBody.p_hash);
    return validated.data;
  } catch (error: unknown) {
    throw new HTTPException(503, {
      message: `Failed to add new task: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const pingWorkers = async (c: Ctx): Promise<{ total: number; alive: number }> => {
  const workers = c.env.WORKERS.split(',');
  const total = workers.length;

  const results = await Promise.all(
    workers.map(async (worker) => {
      try {
        const response = await fetch(worker, { method: 'GET' });
        return response.ok;
      } catch {
        return false;
      }
    }),
  );

  const alive = results.filter(Boolean).length;
  return { total, alive };
};

const isProd = (c: Ctx): boolean => c.env.NODE_ENV === 'production';

export { getTask, idempotentAddTask, isProd, pingRedis, pingWorkers };
