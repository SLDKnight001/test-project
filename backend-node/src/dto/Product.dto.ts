export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    brand: string;
    stock: number;
    images: string[];
    specifications?: {
        processor?: string;
        ram?: string;
        storage?: string;
        graphics?: string;
        display?: string;
        [key: string]: any;
    };
    featured?: boolean;
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    discountPrice?: number;
    category?: string;
    brand?: string;
    stock?: number;
    images?: string[];
    specifications?: {
        processor?: string;
        ram?: string;
        storage?: string;
        graphics?: string;
        display?: string;
        [key: string]: any;
    };
    status?: 'active' | 'inactive';
    featured?: boolean;
}