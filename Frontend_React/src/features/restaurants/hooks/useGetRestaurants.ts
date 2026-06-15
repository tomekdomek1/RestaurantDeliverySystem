import useSWR from "swr";
import type { GetRestaurantResponseDto, RestaurantCategory } from "../types/restaurantDtos";

export function useGetRestaurants(category?: RestaurantCategory | '') {

    const queryUrl = category ? `/api/restaurants?category=${category}` : '/api/restaurants';
    
    const { data, error, isLoading, mutate } = useSWR<GetRestaurantResponseDto[]>(queryUrl);

    return {
        restaurants: data ?? [],
        isLoading,
        error,
        refreshRestaurants: mutate
    };
}