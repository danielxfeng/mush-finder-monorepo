/**
 * @File generate Json schema from zod.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as z from 'zod';
import { HashTaskSchema } from './src/schema';

const outDir = new URL('./models', import.meta.url).pathname;
fs.mkdirSync(outDir, { recursive: true });

const schemas = [{ name: 'HashTask', schema: HashTaskSchema }];

const generate = () => {
  schemas.forEach(({ name, schema }) => {
    const jsonSchema = z.toJSONSchema(schema);
    if (!jsonSchema || typeof jsonSchema !== 'object') {
      throw new Error(`Failed to convert Zod schema: ${name}`);
    }
    fs.writeFileSync(path.join(outDir, `${name}.schema.json`), JSON.stringify(jsonSchema, null, 2));
  });
};

generate();
