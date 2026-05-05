import useSWRMutation from "swr/mutation";
import type { Guid } from "../../../api/types/guid";
import { deleteMutation } from "../../../api/core";

export function useDeleteAddress() {
    const { trigger, isMutating, error } = useSWRMutation<
        void,
        Error,
        string,
        Guid
    >('/api/addresses', deleteMutation);

    return {
        deleteAddress: trigger,
        isDeleting: isMutating,
        error
    };
}
