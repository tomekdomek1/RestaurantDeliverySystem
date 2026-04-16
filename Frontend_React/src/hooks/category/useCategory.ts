import useSWR from "swr";
import type { Guid } from "../../types/guid";
import type { GetCategoryResponseDto } from "../../types/categoryDtos";

export function useCategory(id?: Guid | null) {
    const { data, error, isLoading, mutate } = useSWR<GetCategoryResponseDto>(id ? `/api/categories/${id}` : null);

    return {
        category: data,
        isLoading,
        error,
        refreshCategory: mutate
    };
}