



import { loginAction } from '../app/actions';

export async function login(username: string, password: string): Promise<{ token: string } | { error: string }> {
    // We need to use FormData for the server action
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const result = await loginAction(formData);

    if (result.token) {
        localStorage.setItem('promon_token', result.token);
        return { token: result.token };
    } else {
        return { error: result.error || 'Login failed' };
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
