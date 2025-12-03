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

                    // We use the internal docker service name for server-side calls
                    const backendUrl = env.INTERNAL_BACKEND_URL;

                    const res = await fetch(`${backendUrl}/api/user`, {
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
