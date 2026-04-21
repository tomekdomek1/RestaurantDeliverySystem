import useSWRMutation from "swr/mutation";
import type { EditCategoryDto, EditCategoryResponseDto } from "../types/categoryDtos";
import type { UpdatePayload } from "../types/updatePayload";
import { patchMutation } from "../../../api/core";

export function useEditCategory() {
    const { trigger, isMutating, error, data } = useSWRMutation<
        EditCategoryResponseDto,
        Error,
        string,
        UpdatePayload<EditCategoryDto>
    >('/api/categories', patchMutation);

    return {
        editCategory: trigger,
        isSaving: isMutating,
        updatedCategory: data,
        error
    };
}