import type { UpdatePayload } from "../types/updatePayload";

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
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // In future: SWRConfig can inject 'Authorization': `Bearer ${token}`
        },
    });

    return parseResponse<TResponse>(res);
}

export async function postMutation<TResponse, TArg>(
    url: string,
    { arg }: { arg: TArg }
): Promise<TResponse> {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });

    return parseResponse<TResponse>(res);
}

function createUpdateMutator(method: 'PUT' | 'PATCH') {
    return async function <TResponse, TPayload>(
        url: string,
        { arg }: { arg: UpdatePayload<TPayload> } //  { id, data }
    ): Promise<TResponse> {

        const targetUrl = `${url}/${arg.id}`;

        const res = await fetch(targetUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
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
    const targetUrl = arg ? `${url}/${arg}` : url;

    const res = await fetch(targetUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    return parseResponse<TResponse>(res);
}