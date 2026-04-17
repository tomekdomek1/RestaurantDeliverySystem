import useSWR from "swr";
import type { Guid } from "../../types/guid";
import type { GetAddressResponseDto } from "../../types/addressDtos";

export function useGetAddress(id?: Guid | null) {
    const { data, error, isLoading, mutate } = useSWR<GetAddressResponseDto>(id ? `/api/addresses/${id}` : null);

    return {
        address: data,
        isLoading,
        error,
        refreshAddress: mutate
    };
}
