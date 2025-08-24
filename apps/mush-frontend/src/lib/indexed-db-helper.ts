import { type HistoryDb, HistoryDbSchema, type ModelDb, ModelDbSchema, z } from '@repo/schemas';
// eslint-disable-next-line import/no-named-as-default
import Dexie, { type EntityTable } from 'dexie';

import { MAX_HISTORY_ITEMS } from '@/constants/constants';

const db = new Dexie('Db') as Dexie & {
  model: EntityTable<ModelDb, 'id'>;
  history: EntityTable<HistoryDb, 'p_hash'>;
};

// Schema declaration:
db.version(1).stores({
  model: 'id', // primary key "id" (for the runtime!)
  history: 'p_hash, createdAt', // primary key "p_hash" (for the runtime!)
});

const clearModelDb = async (): Promise<void> => {
  await db.model.clear();
};

const getModelDb = async (): Promise<Blob | null> => {
  try {
    const models = await db.model.toArray();

    if (models.length === 0) return null;
    if (models.length > 1)
      throw new Error(`Expected one model, but found ${models.length.toString()}`);

    const validated = ModelDbSchema.safeParse(models[0]);
    if (!validated.success) {
      throw new Error(`error on getModelDb: ${z.prettifyError(validated.error)}`);
    }

    return validated.data.model;
  } catch {
    // Sentry.captureException(error);
    await db.model.clear();
    return null;
  }
};

const hasModel = async (): Promise<boolean> => {
  const total = await db.model.count();
  return total > 0;
};

const putModelDb = async (data: ModelDb): Promise<void> => {
  const validatedDate = ModelDbSchema.safeParse(data);
  if (!validatedDate.success) {
    throw new Error(`error on addModelDb: ${z.prettifyError(validatedDate.error)}`);
  }

  await db.model.clear(); // only one model at a time
  await db.model.add(validatedDate.data);
};

const clearHistoryDb = async (): Promise<void> => {
  await db.history.clear();
};

const getHistoryDb = async (): Promise<HistoryDb[]> => {
  try {
    const histories = await db.history.orderBy('createdAt').reverse().toArray();

    const validated = HistoryDbSchema.array().safeParse(histories);
    if (!validated.success)
      throw new Error(`error on getHistoryDb: ${z.prettifyError(validated.error)}`);

    return validated.data;
  } catch {
    // Sentry.captureException(error);
    await db.history.clear();
    return [];
  }
};

const putAndGetHistoryDb = async (data: HistoryDb): Promise<HistoryDb[]> => {
  const validatedData = HistoryDbSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(`error on addHistoryDb: ${z.prettifyError(validatedData.error)}`);
  }

  try {
    await db.history.put(validatedData.data);

    // We keep only the latest MAX_HISTORY_ITEMS items
    const total = await db.history.count();
    if (total > MAX_HISTORY_ITEMS) {
      const oldestKeys = await db.history
        .orderBy('createdAt')
        .limit(total - MAX_HISTORY_ITEMS)
        .primaryKeys();
      await db.history.bulkDelete(oldestKeys);
    }
    return await getHistoryDb();
  } catch {
    // Sentry.captureException(error);
    await db.history.clear();
    return [];
  }
};

const deleteFromHistoryDb = async (p_hash: string): Promise<void> => {
  await db.history.delete(p_hash);
};

export {
  clearHistoryDb,
  clearModelDb,
  deleteFromHistoryDb,
  getHistoryDb,
  getModelDb,
  hasModel,
  putAndGetHistoryDb,
  putModelDb,
};
