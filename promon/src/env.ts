import { z } from 'zod';

const envSchema = z.object({
    BACKEND_DOMAIN: z.string().min(1, "BACKEND_DOMAIN is required"),
    SSL: z.enum(['true', 'false']).default('true'),
    INTERNAL_BACKEND_URL: z.string().default("http://console_backend:8080"),
});

const processEnv = {
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
    SSL: process.env.SSL,
    INTERNAL_BACKEND_URL: process.env.INTERNAL_BACKEND_URL,
};

// Validate immediately
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}

export const env = parsed.data;
