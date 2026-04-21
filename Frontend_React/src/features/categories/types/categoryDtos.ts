import type { Guid } from "./guid";

export interface CreateCategoryDto {
    name: string,
    description: string
}

export interface CreateCategoryResponseDto {
    id: Guid,
    name: string,
    description: string
}

export type EditCategoryDto = Partial<CreateCategoryDto>;

export type EditCategoryResponseDto = CreateCategoryResponseDto;

export type GetCategoryResponseDto = CreateCategoryResponseDto;