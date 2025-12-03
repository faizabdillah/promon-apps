"use server"

import { headers } from "next/headers";
import { env } from "../env";

const BACKEND_URL = env.INTERNAL_BACKEND_URL;

export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const headersList = await headers();
    const domain = headersList.get('host') || '';

    try {
        const res = await fetch(`${BACKEND_URL}/instance/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, domain }),
        });

        const data = await res.json();
        if (res.ok) {
            return { token: data.token };
        } else {
            return { error: data.error || 'Login failed' };
        }
    } catch (e) {
        return { error: 'Network error' };
    }
}

export async function getDevicesAction(token: string) {
    if (!token) return { error: 'Unauthorized' };

    try {
        const res = await fetch(`${BACKEND_URL}/instance/device`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (res.ok) {
            return await res.json();
        } else if (res.status === 403 || res.status === 401) {
            return { error: 'Unauthorized' };
        } else {
            return { error: 'Failed to fetch devices' };
        }
    } catch (e) {
        return { error: 'Network error' };
    }
}

export async function deleteDeviceAction(id: string, token: string) {
    if (!token) return { error: 'Unauthorized' };

    try {
        const res = await fetch(`${BACKEND_URL}/instance/device/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            return { success: true };
        } else {
            return { error: 'Failed to delete device' };
        }
    } catch (e) {
        return { error: 'Network error' };
    }
}
