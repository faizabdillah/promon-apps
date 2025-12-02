import { z } from 'zod';

const envSchema = z.object({
    BACKEND_DOMAIN: z.string().min(1, "BACKEND_DOMAIN is required"),
    SSL: z.enum(['true', 'false']).default('true'),
});

const processEnv = {
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
    SSL: process.env.SSL,
};

// Validate immediately
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}

export const env = parsed.data;
