//
// Items
//

import * as z from 'zod';

const PHashSchema = z
  .string()
  .length(64)
  .regex(/^[A-Fa-f0-9]{64}$/, { message: 'PHash must be a valid hex string' })
  .describe('Perceptual hash (64-hex) of the image');

const imgUrlSchema = z.url().describe('URL of the image');

const TaskStatusSchema = z.enum(['queued', 'processing', 'done', 'error', 'not_found']);

//
// Objects
//

const PHashObjSchema = z.object({
  pHash: PHashSchema,
});

const TaskBodySchema = z.object({
  pHash: PHashSchema,
  imgUrl: imgUrlSchema,
});

const TaskResultSchema = z.object({
  category: z.string().describe('The category of the task'),
  confidence: z.number().min(0).max(1).describe('Confidence level of the task result'),
});

const TaskResponseSchema = z.object({
  status: TaskStatusSchema,
  result: z.array(TaskResultSchema),
});

const HashTaskSchema = z.intersection(
  z.union([TaskResponseSchema, TaskBodySchema]),
  z.object({
    processed_at: z.number().int().nonnegative().describe('Timestamp when the task was processed'),
    retry_count: z.number().min(0).describe('Number of times the task has been retried'),
  }),
);
export {
  HashTaskSchema,
  PHashObjSchema,
  PHashSchema,
  TaskBodySchema,
  TaskResponseSchema,
  TaskResultSchema,
};

//
// Inferred Types
//

type HashTask = z.infer<typeof HashTaskSchema>;
type PHashObj = z.infer<typeof PHashObjSchema>;
type TaskBody = z.infer<typeof TaskBodySchema>;
type TaskResponse = z.infer<typeof TaskResponseSchema>;
type TaskResult = z.infer<typeof TaskResultSchema>;

export type { HashTask, PHashObj, TaskBody, TaskResponse, TaskResult };
