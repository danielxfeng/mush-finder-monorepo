import { describe, expect, it } from 'vitest';
import { HashTaskSchema, PHashSchema, TaskBodySchema, TaskResponseSchema } from '../src';

const validPHash = 'a'.repeat(64);

describe('Schemas', () => {
  it('PHashSchema should accept valid hash', () => {
    const result = PHashSchema.safeParse(validPHash);
    expect(result.success).toBe(true);
  });

  it('PHashSchema should reject invalid hash', () => {
    const result = PHashSchema.safeParse('not-a-valid-hash');
    expect(result.success).toBe(false);
  });

  it('TaskBodySchema should pass with valid data', () => {
    const result = TaskBodySchema.safeParse({
      pHash: validPHash,
      imgUrl: 'https://example.com/image.png',
    });
    expect(result.success).toBe(true);
  });

  it('TaskBodySchema should fail with missing pHash', () => {
    const result = TaskBodySchema.safeParse({
      imgUrl: 'https://example.com/image.png',
    });
    expect(result.success).toBe(false);
  });

  it('TaskBodySchema should fail with missing imgUrl', () => {
    const result = TaskBodySchema.safeParse({
      pHash: validPHash,
    });
    expect(result.success).toBe(false);
  });

  it('TaskBodySchema should fail with invalid URL', () => {
    const result = TaskBodySchema.safeParse({
      pHash: validPHash,
      imgUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('TaskResponseSchema should accept valid response', () => {
    const result = TaskResponseSchema.safeParse({
      status: 'done',
      result: [
        { category: 'mushroom', confidence: 0.95 },
        { category: 'toadstool', confidence: 0.75 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('TaskResponseSchema should reject invalid confidence', () => {
    const result = TaskResponseSchema.safeParse({
      status: 'done',
      result: [{ category: 'mushroom', confidence: 2 }],
    });
    expect(result.success).toBe(false);
  });

  it('TaskResponseSchema should reject invalid status', () => {
    const result = TaskResponseSchema.safeParse({
      status: 'invalid-status',
      result: [{ category: 'mushroom', confidence: 0.9 }],
    });
    expect(result.success).toBe(false);
  });

  it('TaskResponseSchema should reject missing result', () => {
    const result = TaskResponseSchema.safeParse({
      status: 'done',
    });
    expect(result.success).toBe(false);
  });

  it('TaskResponseSchema should reject missing status', () => {
    const result = TaskResponseSchema.safeParse({
      result: [{ category: 'mushroom', confidence: 0.9 }],
    });
    expect(result.success).toBe(false);
  });

  it('TaskResponseSchema should reject invalid status', () => {
    const result = TaskResponseSchema.safeParse({
      status: 'invalid-status',
      result: [{ category: 'mushroom', confidence: 0.9 }],
    });
    expect(result.success).toBe(false);
  });

  it('TaskResponseSchema should reject if result is not an array', () => {
    const result = TaskResponseSchema.safeParse({
      status: 'done',
      result: { category: 'mushroom', confidence: 0.9 },
    });
    expect(result.success).toBe(false);
  });

  it('HashTaskSchema should accept combined valid object', () => {
    const result = HashTaskSchema.safeParse({
      status: 'processing',
      result: [{ category: 'mushroom', confidence: 0.9 }],
      pHash: validPHash,
      imgUrl: 'https://example.com/m.png',
      processed_at: 0,
      retry_count: 0,
    });
    expect(result.success).toBe(true);
  });

  it('HashTaskSchema should reject if missing required fields', () => {
    const result = HashTaskSchema.safeParse({
      status: 'done',
      result: [],
      pHash: validPHash,
      processed_at: 0,
      retry_count: 1,
    });
    expect(result.success).toBe(false);
  });
});
