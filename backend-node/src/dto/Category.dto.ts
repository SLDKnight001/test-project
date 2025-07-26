export interface CreateCategoryDto {
    name: string;
    description?: string;
    image?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
    image?: string;
    status?: 'active' | 'inactive';
}