export interface ICollection {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    imagePath: string | null;
    isActive: boolean;
}

export interface IProduct {
    productId: string;              // Product ID (Parent)
    variantId: string;       // Variant ID (Unique for this item)
    productTitle: string;           // Parent Title (e.g. "iPhone 15")
    variantTitle: string | null; // Variant Title (e.g. "Black")
    fullTitle: string;       // Combined Title (e.g. "iPhone 15 - Black")
    slug: string;
    categoryName: string;
    categorySlug: string;
    createdAt: string;

    // --- Pricing & Discounts ---
    price: number;           // Base price (Decimal converted to number)
    salePrice: number;       // Final price after discount (defaults to price)
    discountStatus: boolean; // Manual toggle for the discount
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;   // The raw value (e.g., 10 for 10% or 500 for 500 Tk. )

    stock: number;
    thumbnail: string;
    options: Record<string, string>[];
    isFeatured: boolean;
    isPublished: boolean;
}

export interface SerializedOption {
    val: string;
    serial: number;
}

export interface IProductVariant {
    id: string;
    productId: string;
    title: string;
    sku: string | null;
    barcode: string | null;
    price: string;          // Comes as "1220.00"
    stock: number;
    images: string[];
    video: string | null;
    isFeatured: boolean;
    isPublished: boolean;
    options?: Record<string, SerializedOption>;

    // --- New Discount Fields ---
    discountStatus: boolean;
    discountType: "FIXED" | "PERCENTAGE";
    discountValue: string;  // Comes as "110.00" or "50.00"
}

export interface IProductDetail {
    success: boolean;
    data: {
        id: string;
        title: string;
        description: string;
        slug: string;
        categoryId: string;
        categoryName: string;
        categorySlug: string;
        variants: IProductVariant[];
    };
}

export interface FacetOption {
    label: string;
    value: string;
    count: number;
}

export interface Facet {
    id: string;    // e.g., "Special Features"
    title: string; // e.g., "Special Features"
    options: FacetOption[];
}

export interface Pagination {
    total: number;
    totalPages: number;
    page: number;  // Optional
    limit: number; // Optional
}


export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];          // The array of items
    pagination: Pagination;
    facets: Facet[];

}

// The API response adds these two arrays to the main category object
export interface CollectionData extends ICollection {
    ancestors: ICollection[];
    children: ICollection[];
    minPrice: number | string;
    maxPrice: number | string;
}

export interface CollectionResponse {
    success: boolean;
    data: CollectionData;
}

export interface ICollectionListResponse {
    success: boolean;
    data: ICollection[];
}

export interface IAddress {
    id: string;
    customerId: string;
    label: string;
    street: string;
    city: string;
    area: string;
    isDefault: boolean;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    isBanned: boolean;
    createdAt: string;
    addresses: IAddress[];
}

export interface IAuthResponse {
    success: boolean;
    user: IUser;
}