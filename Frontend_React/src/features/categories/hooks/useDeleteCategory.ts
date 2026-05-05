import useSWRMutation from "swr/mutation";
import type { Guid } from "../../../api/types/guid";
import { deleteMutation } from "../../../api/core";

export function useDeleteCategory() {
    const { trigger, isMutating, error } = useSWRMutation<
        void,
        Error,
        string,
        Guid
    >('/api/categories', deleteMutation);

    return {
        deleteCategoy: trigger,
        isDeleting: isMutating,
        error
    };
}