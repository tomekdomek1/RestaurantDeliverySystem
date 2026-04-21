import useSWRMutation from "swr/mutation";
import type { CreateAddressDto, CreateAddressResponseDto } from "../types/addressDtos";
import { postMutation } from "../../../api/core";

export function useCreateAddress() {
    const { trigger, isMutating, error, data } = useSWRMutation<
        CreateAddressResponseDto,
        Error,
        string,
        CreateAddressDto
    >('/api/addresses', postMutation);

    return {
        createAddress: trigger,
        isCreating: isMutating,
        newAddress: data,
        error
    };
}
