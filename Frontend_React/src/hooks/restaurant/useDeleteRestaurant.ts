import useSWRMutation from "swr/mutation";
import type { Guid } from "../../types/guid";
import { deleteMutation } from "../../api/core";

export function useDeleteRestaurant() {
    const { trigger, isMutating, error } = useSWRMutation<
        void,
        Error,
        string,
        Guid
    >('/api/restaurants', deleteMutation);

    return {
        deleteRestaurant: trigger,
        isDeleting: isMutating,
        error
    };
}
