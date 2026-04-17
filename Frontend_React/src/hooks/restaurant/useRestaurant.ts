import useSWR from "swr";
import type { Guid } from "../../types/guid";
import type { GetRestaurantResponseDto } from "../../types/restaurantDtos";

export function useRestaurant(id?: Guid | null) {
    const { data, error, isLoading, mutate } = useSWR<GetRestaurantResponseDto>(id ? `/api/restaurants/${id}` : null);

    return {
        restaurant: data,
        isLoading,
        error,
        refreshRestaurant: mutate
    };
}
