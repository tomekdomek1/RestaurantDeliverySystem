import useSWRMutation from "swr/mutation";
import type { CreateCategoryDto, CreateCategoryResponseDto } from "../types/categoryDtos";
import { postMutation } from "../../../api/core";

export function useCreateCategory() {
    const { trigger, isMutating, error, data } = useSWRMutation<
        CreateCategoryResponseDto,
        Error,
        string,
        CreateCategoryDto
    >('/api/categories', postMutation);

    return {
        createCategory: trigger,
        isCreating: isMutating,
        newCategory: data,
        error
    };
}