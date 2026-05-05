import useSWR from "swr";
import type { GetCategoryResponseDto } from "../types/categoryDtos";

export function useGetCategories() {
    const { data, error, isLoading, mutate } = useSWR<GetCategoryResponseDto[]>('/api/categories');

    return {
        categories: data ?? [],
        isLoading,
        error,
        refreshCategories: mutate
    };
}