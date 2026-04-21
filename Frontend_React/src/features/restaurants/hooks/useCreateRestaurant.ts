import useSWRMutation from "swr/mutation";
import type { CreateRestaurantDto, CreateRestaurantResponseDto } from "../types/restaurantDtos";
import { postMutation } from "../../../api/core";

export function useCreateRestaurant() {
    const { trigger, isMutating, error, data } = useSWRMutation<
        CreateRestaurantResponseDto,
        Error,
        string,
        CreateRestaurantDto
    >('/api/restaurants', postMutation);

    return {
        createRestaurant: trigger,
        isCreating: isMutating,
        newRestaurant: data,
        error
    };
}
