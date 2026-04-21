import type { UpdatePayload } from "../types/updatePayload";
import { API_BASE_URL } from "../config/api";

function getFullUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `${API_BASE_URL}${url}`;
}

async function parseResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const errorInfo = await res.json().catch(() => ({}));
        throw {
            status: res.status,
            message: res.statusText,
            ...errorInfo
        };
    }

    if (res.status === 204) {
        return null as unknown as T;
    }

    return res.json();
}

export async function fetcher<TResponse>(url: string): Promise<TResponse> {
    const fullUrl = getFullUrl(url);
    const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    return parseResponse<TResponse>(res);
}

export async function postMutation<TResponse, TArg>(
    url: string,
    { arg }: { arg: TArg }
): Promise<TResponse> {
    const fullUrl = getFullUrl(url);
    const res = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(arg),
    });

    return parseResponse<TResponse>(res);
}

function createUpdateMutator(method: 'PUT' | 'PATCH') {
    return async function <TResponse, TPayload>(
        url: string,
        { arg }: { arg: UpdatePayload<TPayload> } //  { id, data }
    ): Promise<TResponse> {

        const baseUrl = getFullUrl(url);
        const targetUrl = `${baseUrl}/${arg.id}`;

        const res = await fetch(targetUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(arg.data),
        });

        return parseResponse<TResponse>(res);
    };
}

export const putMutation = createUpdateMutator('PUT');
export const patchMutation = createUpdateMutator('PATCH');

export async function deleteMutation<TResponse, TArg extends string>(
    url: string,
    { arg }: { arg: TArg }
): Promise<TResponse> {
    const baseUrl = getFullUrl(url);
    const targetUrl = arg ? `${baseUrl}/${arg}` : baseUrl;

    const res = await fetch(targetUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    return parseResponse<TResponse>(res);
}