import useSWR from "swr";
import type { Dish } from "../types/dish";

export function useGetDishes(restaurantId?: string) {
    const url = restaurantId ? `/api/dishes?restaurantId=${restaurantId}` : null;
    const { data, error, isLoading, mutate } = useSWR<Dish[]>(url);

    return {
        dishes: data ?? [],
        isLoading,
        error,
        refreshDishes: mutate
    };
}