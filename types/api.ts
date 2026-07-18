
export interface IProductOption {
    label: string;
    val: string;
    serial: number;
}

export interface IProduct {
    id: string;
    slug?: string;
    name?: string;
    title?: string;
    productTitle?: string;
    variantTitle?: string | null;
    fullTitle?: string;
    description?: string;
    price?: number | string;
    category?: string;
    categoryName?: string;
    categorySlug?: string;
    brand?: string;
    image?: string;
    thumbnail?: string;
    stock?: number;
    inStock?: boolean;
    variantId?: string;
    productId?: string;
    createdAt?: string;
    minPrice?: string;
    maxPrice?: string;
    salePrice?: number;
    discountStatus?: boolean;
    discountType?: "PERCENTAGE" | "FIXED";
    discountValue?: string | number;
    options?: IProductOption[];
    isFeatured?: boolean;
    isPublished?: boolean;
    requiresImei?: boolean;
    warranty?: string;
    [key: string]: unknown;
}


export interface PaginatedResponse<T> {
    data: T[];
    total?: number;
    page?: number;
    limit?: number;
}

export interface IProductDetail extends IProduct {
    specs?: Record<string, string>;
}

export interface CollectionResponse {
    data?: unknown;
    [key: string]: unknown;
}

export interface ICollectionListResponse {
    data?: unknown[];
    [key: string]: unknown;
}

export interface IAuthResponse {
    success?: boolean;
    user?: unknown;
    [key: string]: unknown;
}

export interface ICartStockInfo {
    inStock?: boolean;
    enoughStock?: boolean;
    availableQuantity?: number;
    stock?: number;
    stockStatus?: "in_stock" | "out_of_stock" | "limited" | string;
}

export interface ICartItem extends ICartStockInfo {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    variantName?: string;
    image?: string[] | null;
    price?: string | number;
    quantity?: number;
    slug?: string;
    [key: string]: unknown;
}
