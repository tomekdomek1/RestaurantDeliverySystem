import useSWR from "swr";
import type { GetRestaurantResponseDto } from "../types/restaurantDtos";

export function useGetRestaurants() {
    const { data, error, isLoading, mutate } = useSWR<GetRestaurantResponseDto[]>('/api/restaurants');

    return {
        restaurants: data ?? [],
        isLoading,
        error,
        refreshRestaurants: mutate
    };
}
