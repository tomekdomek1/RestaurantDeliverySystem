import useSWR from "swr";
import type { GetAddressResponseDto } from "../types/addressDtos";

export function useGetAddresses() {
    const { data, error, isLoading, mutate } = useSWR<GetAddressResponseDto[]>('/api/addresses');

    return {
        addresses: data ?? [],
        isLoading,
        error,
        refreshAddresses: mutate
    };
}
