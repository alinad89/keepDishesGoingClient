// src/types/index.ts

// ============================================================================
// PRIMITIVES & CONSTANTS
// ============================================================================

export type UUID = string;

/** Days of week */
export const DAYS = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
] as const;
export type DayKey = typeof DAYS[number];

/** Dish types */
export const DISH_TYPES = ["STARTER", "MAIN", "DESSERT"] as const;
export type DishType = typeof DISH_TYPES[number];

/** Dish states */
export const DISH_STATES = ["PUBLISHED", "OUT_OF_STOCK", "UNPUBLISHED"] as const;
export type DishState = typeof DISH_STATES[number];

/** Food tags */
export const FOOD_TAGS = ["VEGAN", "VEGETARIAN", "GLUTEN", "LACTOSE"] as const;
export type FoodTag = string;

/** Cuisine types */
export const CUISINES = [
    "ITALIAN", "FRENCH", "JAPANESE", "MEXICAN", "INDIAN", "AMERICAN",
] as const;
export type CuisineType = typeof CUISINES[number] | string;

/** Price ranges */
export const PRICE_RANGES = ["LOW", "MEDIUM", "HIGH"] as const;
export type PriceRange = typeof PRICE_RANGES[number] | string;

// ============================================================================
// SHARED/COMMON TYPES
// ============================================================================

/** Address */
export interface AddressDto {
    street: string;
    postalCode?: string;
    number: string;
    city: string;
    country: string;
}

/** Coordinates */
export interface Coordinates {
    lat: number;
    lng: number;
}

/** Opening hours */
export interface OpeningHour {
    day: DayKey;
    open: string;
    close: string;
}
export type OpeningHours = OpeningHour[];

// ============================================================================
// DISH DOMAIN
// ============================================================================

/** Main Dish DTO */
export interface DishDto {
    id: UUID;
    name: string;
    description?: string;
    price: number;
    type: DishType;
    tags: string[];
    pictureUrl?: string;
    state?: DishState;
    restaurantId?: UUID;
    draft?: DishDraft | null;
}

/** Draft for a dish - derived from DishDto (omitting id, state, restaurantId, draft) */
export type DishDraft = Omit<DishDto, 'id' | 'state' | 'restaurantId' | 'draft'>;

/** Edit dish draft request - same as DishDraft */
export type EditDishDraftRequest = DishDraft;

/** Create dish request - DishDto without id, state, draft, but restaurantId is required */
export type DishCreateRequest = Omit<DishDto, 'id' | 'state' | 'draft'> & {
    restaurantId: UUID; // Make required
};

/** Dish status change request */
export interface DishStatusChangeRequest {
    dishState: DishState;
}

/** Schedule dish request */
export interface ScheduleDishRequest {
    publishAt: string | null;
    unpublishAt: string | null;
}

// ============================================================================
// RESTAURANT DOMAIN
// ============================================================================

/** Restaurant DTO */
export interface RestaurantDto {
    id?: UUID;
    restaurantId?: UUID;
    name: string;
    email: string;
    address: AddressDto;
    cuisineType: CuisineType;
    prepTime: number;
    pictureURL?: string[];
    pictureUrls?: string[];
    coordinates?: Coordinates;
}

/** Restaurant with ETA */
export interface RestaurantWithEta {
    restaurant: RestaurantDto;
    etaMinutes: number;
}

// ============================================================================
// ORDER DOMAIN
// ============================================================================

/** Order statuses */
export const ORDER_STATUSES = [
    "SUBMITTED",
    "ACCEPTED",
    "DECLINED",
    "AUTO_DECLINED",
    "READY_FOR_PICKUP",
    "PICKED_UP",
    "DELIVERED"
] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

/** Order actions */
export type OrderAction = "ACCEPT" | "DECLINE" | "READY_FOR_PICKUP" | "PICKED_UP" | "DELIVERED";

/** Customer order item */
export type CustomerOrderItemDto = {
    dishId: UUID;
    dishName: string;
    quantity: number;
    unitPrice: number;
};

/** Customer order DTO - reusing AddressDto for addresses */
export type CustomerOrderDto = {
    orderId: UUID;
    restaurantId: UUID;
    status: OrderStatus;
    submittedAt: string;
    totalPrice: number;
    items: CustomerOrderItemDto[];
    pickupAddress?: Omit<AddressDto, 'country'> | null;  // Backend doesn't return country
    dropoffAddress?: Omit<AddressDto, 'country'> | null;
    lat?: number | null;
    lng?: number | null;
};

/** Customer info - combines person info with address */
export type CustomerInfoDto = {
    firstName: string;
    lastName: string;
    email: string;
} & AddressDto;

/** Incoming order line (raw from backend) */
export type IncomingOrderLineRaw = {
    dishId: UUID | { id: UUID };
    quantity: number;
};

/** Incoming order line (normalized) */
export type IncomingOrderLine = {
    dishId: UUID;
    quantity: number;
};

/** Incoming order address - reusing AddressDto without country */
export type IncomingOrderAddress = Omit<AddressDto, 'country'>;

/** Incoming order coordinates */
export type IncomingOrderCoordinates = {
    latitude: number;
    longitude: number;
};

/** Incoming order response */
export type IncomingOrderResponse = {
    orderId: UUID;
    restaurantId: UUID;
    status: OrderStatus;
    orderItems: IncomingOrderLine[];
    pickupAddress?: IncomingOrderAddress | null;
    pickupCoordinates?: IncomingOrderCoordinates | null;
    dropoffAddress?: IncomingOrderAddress | null;
    dropoffCoordinates?: IncomingOrderCoordinates | null;
    decisionDeadline?: string | null;
};

/** Order status change request */
export interface OrderStatusChangeRequest {
    action: OrderAction;
    explanation?: string;
}

// ============================================================================
// KDG DOMAIN (Admin/Price Management)
// ============================================================================

/** Price tiers */
export const PRICE_TIERS = ["CHEAP", "REGULAR", "EXPENSIVE", "PREMIUM"] as const;
export type PriceTier = typeof PRICE_TIERS[number];

/** Price bands configuration */
export interface PriceBands {
    cheapMax: number;
    regularMax: number;
    expensiveMax: number;
}

/** Restaurant price range */
export interface RestaurantPriceRange {
    tier: PriceTier;
    minPrice: number;
    maxPrice: number;
}

/** Price range snapshot */
export interface PriceRangeSnapshot {
    restaurantId: UUID;
    occurredAt: string;
    priceTier: PriceTier;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extracts restaurant ID from various response formats
 * Backend inconsistently returns `id` vs `restaurantId`
 */
export function restaurantId(r: unknown): UUID | null {
    if (!r) return null;
    if (typeof r === "string") return r;

    const obj = r as Record<string, unknown>;
    if (typeof obj.id === "string") return obj.id as UUID;
    if (typeof obj.restaurantId === "string") return obj.restaurantId as UUID;

    const nestedRid = (obj.restaurantId as any)?.restaurantId;
    if (typeof nestedRid === "string") return nestedRid as UUID;

    const nestedId = (obj.id as any)?.id;
    if (typeof nestedId === "string") return nestedId as UUID;

    return null;
}

/**
 * Converts snake_case or SCREAMING_CASE to Title Case
 * Example: "VEGAN" -> "Vegan", "GLUTEN_FREE" -> "Gluten Free"
 */
export function labelize(s: string | null | undefined): string {
    if (!s) return "";
    return s
        .toString()
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extracts UUID from dishId (handles both flat and nested formats)
 */
export function extractDishId(dishId: UUID | { id: UUID }): UUID {
    if (typeof dishId === "string") return dishId;
    return dishId.id;
}
