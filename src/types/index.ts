// src/types/index.ts

/** Generic ids */
export type UUID = string;

/** Days of week (UI + scheduling) */
export const DAYS = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
] as const;
export type DayKey = typeof DAYS[number];

/** Dishes */
export const DISH_TYPES = ["STARTER", "MAIN", "DESSERT"] as const;
export type DishType = typeof DISH_TYPES[number];

export const DISH_STATES = ["PUBLISHED", "OUT_OF_STOCK", "UNPUBLISHED"] as const;
export type DishState = typeof DISH_STATES[number];

/** Tags (free-form, but keep a curated list for UI filters) */
export const FOOD_TAGS = ["VEGAN", "VEGETARIAN", "GLUTEN", "LACTOSE"] as const;
export type FoodTag = string;

/** Restaurant taxonomy */
export const CUISINES = [
    "ITALIAN", "FRENCH", "JAPANESE", "MEXICAN", "INDIAN", "AMERICAN",
] as const;
export type CuisineType = typeof CUISINES[number] | string;

export const PRICE_RANGES = ["LOW", "MEDIUM", "HIGH"] as const;
export type PriceRange = typeof PRICE_RANGES[number] | string;

/** Address */
export interface AddressDto {
    street: string;
    postalCode?: string;
    number: string;
    city: string;
    country: string;
}

/** Opening hours */
export interface OpeningHour { day: DayKey; open: string; close: string }
export type OpeningHours = OpeningHour[];

/** Draft for a dish (from backend) */
export interface DishDraft {
    name: string;
    description?: string | null;
    price: number;
    type: DishType;
    tags: string[];
    pictureUrl?: string | null;
}


// --- Customer-facing orders (for /api/orders/my and /api/orders/{id}) ---

export type CustomerOrderItemDto = {
    dishId: UUID;
    dishName: string;
    quantity: number;
    unitPrice: number; // we'll normalize BigDecimal -> number in the service
};

export type CustomerOrderDto = {
    orderId: UUID;
    restaurantId: UUID;
    status: OrderStatus;
    submittedAt: string;     // ISO string
    totalPrice: number;      // normalized
    items: CustomerOrderItemDto[];
    // include only if backend returns them; harmless if absent:
    pickupAddress?: {
        street: string;
        number: string;
        postalCode: string;
        city: string;
    } | null;
    dropoffAddress?: {
        street: string;
        number: string;
        postalCode: string;
        city: string;
    } | null;
    // Delivery driver location (updated in real-time during PICKED_UP status)
    lat?: number | null;
    lng?: number | null;
};


/** Dish domain */
export interface DishDto {
    id: UUID;
    name: string;
    description?: string;
    price: number;              // euros
    type: DishType;
    tags: string[];
    pictureUrl?: string;
    state?: DishState;
    restaurantId?: UUID;

    /** Present when there is a saved draft for this dish */
    draft?: DishDraft | null;
}

/** Owner requests */
export interface DishCreateRequest {
    restaurantId: UUID;
    name: string;
    description?: string;
    price: number;              // e.g. 12.5 means €12.50
    type: DishType;
    tags?: string[];
    pictureUrl?: string;
}

// Backend expects all fields (optional fields can be null/undefined)
export interface EditDishDraftRequest {
    name: string;
    description?: string | null;
    price: number;
    type: DishType;
    tags: string[];
    pictureUrl?: string | null;
}

export interface DishStatusChangeRequest {
    dishState: DishState;       // 'PUBLISHED' | 'OUT_OF_STOCK' | 'UNPUBLISHED'
}

export interface ScheduleDishRequest {
    publishAt: string | null;      // ISO-8601 format (Instant)
    unpublishAt: string | null;    // ISO-8601 format (Instant)
}

/** Restaurant domain */
export interface RestaurantDto {
    id?: UUID;
    restaurantId?: UUID;
    name: string;
    email: string;
    address: AddressDto;
    cuisineType: CuisineType;
    prepTime: number;           // minutes
    pictureURL?: string[];
    pictureUrls?: string[];
}

/** ————— Helpers ————— */
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

export function labelize(s: string | null | undefined): string {
    if (!s) return "";
    return s
        .toString()
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Order domain */
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


// Raw backend response (before normalization)
export type IncomingOrderLineRaw = {
    dishId: UUID | { id: UUID };  // Handle both flat UUID and nested structure
    quantity: number;
};

// Normalized order line (after processing)
export type IncomingOrderLine = {
    dishId: UUID;
    quantity: number;
};

export type IncomingOrderAddress = {
    street: string;
    number: string;
    postalCode: string;
    city: string;
};

export type IncomingOrderCoordinates = {
    latitude: number;
    longitude: number;
};

export type IncomingOrderResponse = {
    orderId: UUID;
    restaurantId: UUID;
    status: OrderStatus;
    orderItems: IncomingOrderLine[];  // Always normalized
    pickupAddress?: IncomingOrderAddress | null;
    pickupCoordinates?: IncomingOrderCoordinates | null;
    dropoffAddress?: IncomingOrderAddress | null;
    dropoffCoordinates?: IncomingOrderCoordinates | null;
    decisionDeadline?: string | null;  // ISO datetime string
};

// Helper to extract UUID from dishId (handles both formats)
export function extractDishId(dishId: UUID | { id: UUID }): UUID {
    if (typeof dishId === "string") return dishId;
    return dishId.id;
}

export interface CustomerInfoDto {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    number: string;
    postalCode?: string;
    city: string;
    country: string;
}

export type OrderAction = "ACCEPT" | "DECLINE" | "READY_FOR_PICKUP" | "PICKED_UP" | "DELIVERED";

export interface OrderStatusChangeRequest {
    action: OrderAction;
    explanation?: string;  // Optional explanation for decline
}
