import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PLAYWRIGHT_BASE_URL: z.string().optional(),
})

export const env = schema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PLAYWRIGHT_BASE_URL: process.env.PLAYWRIGHT_BASE_URL,
})
