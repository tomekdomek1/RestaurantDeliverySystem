import useSWR from "swr";

export function useGetOrders() {
    const { data, error, isLoading, mutate } = useSWR<any[]>('/api/orders');

    return {
        orders: data ?? [],
        isLoading,
        error,
        refreshOrders: mutate
    };
}