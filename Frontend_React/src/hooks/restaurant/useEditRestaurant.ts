import useSWRMutation from "swr/mutation";
import type { EditRestaurantDto, EditRestaurantResponseDto } from "../../types/restaurantDtos";
import type { UpdatePayload } from "../../types/updatePayload";
import { patchMutation } from "../../api/core";

export function useEditRestaurant() {
    const { trigger, isMutating, error, data } = useSWRMutation<
        EditRestaurantResponseDto,
        Error,
        string,
        UpdatePayload<EditRestaurantDto>
    >('/api/restaurants', patchMutation);

    return {
        editRestaurant: trigger,
        isSaving: isMutating,
        updatedRestaurant: data,
        error
    };
}
