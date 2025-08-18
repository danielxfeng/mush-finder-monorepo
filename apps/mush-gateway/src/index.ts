import { Context, Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { timeout } from 'hono/timeout';

import { HashTask, PHashSchema, TaskBodySchema, z } from '@repo/schemas';
import { getTask, idempotentAddTask, pingRedis, pingWorkers } from './service';

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
app.use(compress());
app.use('/api', timeout(5000)); // 5 second timeout

app.use(
  '/api/*',
  cors({
    origin: (origin, c) => (c.env.NODE_ENV === ('production' as const) ? c.env.CORS : '*'),
    allowHeaders: ['X-Api-Key'],
    allowMethods: ['POST', 'GET'],
    exposeHeaders: ['Content-Length'],
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
  const apiKey = c.req.header('X-Api-Key');
  if (!apiKey || apiKey !== c.env.API_KEY_FRONTEND) {
    throw new HTTPException(401, {
      message: 'Unauthorized',
    });
  }
  await next();
});

app.get('/api/task/:p_hash', async (c): Promise<Response> => {
  const p_hash = c.req.param('p_hash');
  const validated = PHashSchema.safeParse(p_hash);
  if (!validated.success)
    throw new HTTPException(400, {
      message: `Invalid p_hash: ${z.prettifyError(validated.error)}`,
    });

  const task = await getTask(c, p_hash);

  if (task) return c.json(task);

  const emptyTask: HashTask = {
    pHash: p_hash,
    imgUrl: 'https://not_found.com',
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
  if (task.imgUrl && !task.imgUrl.startsWith(c.env.IMG_URL_PREFIX))
    throw new HTTPException(400, {
      message: `Invalid imgUrl: ${task.imgUrl}`,
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

export default app;

export type { Ctx };
