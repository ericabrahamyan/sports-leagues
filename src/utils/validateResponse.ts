import { z } from 'zod';

export function validateResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  errorContext: string
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(`${errorContext} validation failed:`, result.error.format());
    throw new Error(`Failed to validate ${errorContext}`);
  }

  return result.data;
}
