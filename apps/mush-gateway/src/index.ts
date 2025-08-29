import { HashTask, PHashSchema, TaskBodySchema, z } from '@repo/schemas';
import * as Sentry from '@sentry/cloudflare';
import { Context, Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { timeout } from 'hono/timeout';

import { getTask, idempotentAddTask, isProd, pingRedis, pingWorkers } from './service';

// env, since worker-configuration.d.ts does not work.
interface MyEnv {
  NODE_ENV: 'development' | 'production';
  TASKS_KEY: string;
  QUEUE_KEY: string;
  RESULT_TTL: number;
  CORS: string;
  API_KEY_FRONTEND: string;
  REDIS_URL: string;
  REDIS_TOKEN: string;
  SENTRY_DSN: string;
  WORKERS: string;
  IMG_URL_PREFIX: string;
}

type Ctx = Context<{ Bindings: MyEnv }>;

const app = new Hono<{ Bindings: MyEnv }>();

app.use(logger());

app.use('/api', timeout(5000)); // 5 second timeout

app.use(
  '/api/*',
  cors({
    origin: (origin, c: Ctx) => (isProd(c) ? c.env.CORS : '*'),
    allowHeaders: ['X-Api-Key'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Content-Type', 'X-Api-Key'],
    maxAge: 600,
    credentials: true,
  }),
);

app.get('/', async (c): Promise<Response> => {
  await pingRedis(c);
  const workersStatus = await pingWorkers(c);
  return c.json({
    server: 'ok',
    redis: 'ok',
    total_workers: workersStatus.total,
    alive_workers: workersStatus.alive,
  });
});

app.use(
  bodyLimit({
    maxSize: 10 * 1024, // 10kb
    onError: () => {
      throw new HTTPException(413, {
        message: 'Payload Too Large',
      });
    },
  }),
);

app.use('/api/*', async (c, next) => {
  if (!isProd(c)) return next();
  const apiKey = c.req.header('X-Api-Key');
  if (!apiKey || apiKey !== c.env.API_KEY_FRONTEND) {
    throw new HTTPException(401, {
      message: 'Unauthorized',
    });
  }
  return next();
});

app.get('/api/task/:p_hash', async (c): Promise<Response> => {
  const pHash = c.req.param('p_hash');
  const validated = PHashSchema.safeParse(pHash);
  if (!validated.success)
    throw new HTTPException(400, {
      message: `Invalid p_hash: ${z.prettifyError(validated.error)}`,
    });

  const task = await getTask(c, pHash);

  if (task) return c.json(task);

  const emptyTask: HashTask = {
    p_hash: pHash,
    img_url: 'https://not_found.com',
    status: 'not_found' as const,
    result: [],
    processed_at: 0,
    retry_count: 0,
  };

  // Asynchronously awake the workers
  pingWorkers(c).catch(() => {
    console.debug('Failed to get active workers');
  });

  return c.json(emptyTask);
});

app.post('/api/task', async (c): Promise<Response> => {
  const validated = TaskBodySchema.safeParse(await c.req.json());
  if (!validated.success)
    throw new HTTPException(400, {
      message: `Invalid task: ${z.prettifyError(validated.error)}`,
    });

  const task = validated.data;
  if (task.img_url && !task.img_url.startsWith(c.env.IMG_URL_PREFIX))
    throw new HTTPException(400, {
      message: `Invalid imgUrl: ${task.img_url}`,
    });

  const response = await idempotentAddTask(c, task);

  // Asynchronously awake the workers
  pingWorkers(c).catch(() => {
    console.debug('Failed to get active workers');
  });

  return c.json(response);
});

app.notFound((c) => {
  return c.json({ error: 'Not Found' }, { status: 404 });
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const status = err.status;
    if (status >= 500) Sentry.captureException(err);
    return c.json({ error: err.message }, status);
  }

  Sentry.captureException(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;

export type { Ctx, MyEnv };
