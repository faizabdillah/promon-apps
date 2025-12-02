



import { env } from '../env';

const protocol = env.SSL === 'true' ? 'https' : 'http';
export const API_URL = `${protocol}://${env.BACKEND_DOMAIN}`; // Console Backend URL

export async function login(username: string, password: string): Promise<{ token: string } | { error: string }> {
    try {
        const res = await fetch(`${API_URL}/instance/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('promon_token', data.token);
            return { token: data.token };
        } else {
            return { error: data.error || 'Login failed' };
        }
    } catch (e) {
        return { error: 'Network error' };
    }
}

export function logout() {
    localStorage.removeItem('promon_token');
    window.location.href = '/login';
}

export function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('promon_token');
    }
    return null;
}
