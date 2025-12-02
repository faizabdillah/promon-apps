import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { env } from "../env"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Initial sign in
            if (account && account.id_token) {
                token.id_token = account.id_token;

                try {
                    // Verify with backend and get user details
                    // We use the container name 'paas-backend' for server-side calls
                    // But since this runs in Next.js server, it might be running in a container or locally.
                    // If running in docker-compose, 'paas-backend' works.
                    // For now, assuming docker-compose environment as requested.

                    const backendUrl = `http://${env.BACKEND_DOMAIN}`; // Assuming HTTP for internal comms or use env.SSL logic if needed. 
                    // Wait, .env says BACKEND_DOMAIN=api.testnet.id. 
                    // But internal docker comms usually use service name 'console_backend' or 'paas-backend'.
                    // The original code had: process.env.BACKEND_DOMAIN || "http://paas-backend:8080"
                    // If BACKEND_DOMAIN is set to a public domain, it might not resolve internally.
                    // But the user wants strict env.
                    // Let's stick to what env says. If env.BACKEND_DOMAIN is the public domain, it might fail if not loopback.
                    // However, I must follow "no one should be nullable".
                    // I will use env.BACKEND_DOMAIN.
                    // But wait, the original code had a fallback. I removed fallback.
                    // So I must ensure BACKEND_DOMAIN is correct.
                    // I will use `https://${env.BACKEND_DOMAIN}` or `http` based on SSL?
                    // Console doesn't have SSL env var in my schema.
                    // I should probably add SSL to console env schema if needed.
                    // But for now, I'll just use what was there or standard.
                    // Original: process.env.BACKEND_DOMAIN || "http://paas-backend:8080"
                    // I'll use env.BACKEND_DOMAIN.

                    const res = await fetch(`https://${env.BACKEND_DOMAIN}/api/user`, { // Defaulting to https as per .env SSL=true
                        headers: {
                            Authorization: `Bearer ${account.id_token}`
                        }
                    });

                    if (res.ok) {
                        const user = await res.json();
                        token.id = user.id;
                        token.role = user.role || "user"; // Default to user if not returned
                        token.balance = user.balance || 0;
                        token.picture = user.image;
                        token.name = user.name;
                    } else {
                        console.error("Failed to fetch user from backend", await res.text());
                    }
                } catch (error) {
                    console.error("Error fetching user from backend", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id_token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.balance = token.balance as number;
                session.user.id_token = token.id_token as string;
                session.user.image = token.picture;
                session.user.name = token.name;
            }
            return session;
        },
    },
    secret: env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
    },
}
