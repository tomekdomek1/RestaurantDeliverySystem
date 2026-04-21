import useSWRMutation from "swr/mutation";
import type { EditAddressDto, EditAddressResponseDto } from "../types/addressDtos";
import type { UpdatePayload } from "../types/updatePayload";
import { patchMutation } from "../../../api/core";

export function useEditAddress() {
    const { trigger, isMutating, error, data } = useSWRMutation<
        EditAddressResponseDto,
        Error,
        string,
        UpdatePayload<EditAddressDto>
    >('/api/addresses', patchMutation);

    return {
        editAddress: trigger,
        isSaving: isMutating,
        updatedAddress: data,
        error
    };
}
