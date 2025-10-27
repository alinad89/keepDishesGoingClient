// src/types/index.ts

/** Generic ids */
export type UUID = string;

/** Days of week (UI + scheduling) */
export const DAYS = [
    'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY',
] as const;
export type DayKey = typeof DAYS[number];

/** Dishes */
export const DISH_TYPES = ['STARTER','MAIN','DESSERT'] as const;
export type DishType = typeof DISH_TYPES[number];

export const DISH_STATES = ['PUBLISHED','OUT_OF_STOCK','UNPUBLISHED'] as const;
export type DishState = typeof DISH_STATES[number];

/** Tags (free-form, but keep a curated list for UI filters) */
export const FOOD_TAGS = ['VEGAN','VEGETARIAN','GLUTEN','LACTOSE'] as const;
export type FoodTag = string;

/** Restaurant taxonomy */
export const CUISINES = ['ITALIAN','FRENCH','JAPANESE','MEXICAN','INDIAN','AMERICAN'] as const;
export type CuisineType = typeof CUISINES[number] | string;

export const PRICE_RANGES = ['LOW','MEDIUM','HIGH'] as const;
export type PriceRange = typeof PRICE_RANGES[number] | string;

/** Address */
export interface AddressDto {
    street: string;
    postalCode?: string;
    city: string;
    country: string;
}

/** Opening hours */
export interface OpeningHour { day: DayKey; open: string; close: string }
export type OpeningHours = OpeningHour[];

/** Dish domain */
export interface DishDto {
    id: UUID;
    name: string;
    description?: string;
    price: number;              // assume euros; keep consistent across app
    type: DishType;
    tags: string[];
    pictureUrl?: string;
    state?: DishState;
    restaurantId?: UUID;
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

export type EditDishDraftRequest = Partial<Omit<DishCreateRequest, 'restaurantId'>>;


export interface DishStatusChangeRequest {
    dishState: DishState;          // 'PUBLISHED' | 'OUT_OF_STOCK' | 'DRAFT'
}

export interface ScheduleDishRequest {
    scheduledTime: string;
}


/** Restaurant domain */
export interface RestaurantDto {
    // Some payloads use `id`, some use `restaurantId`; keep both optional.
    id?: UUID;
    restaurantId?: UUID;

    name: string;
    email: string;
    address: AddressDto;
    cuisineType: CuisineType;
    prepTime: number;           // minutes

    // Backends vary: keep legacy + new fields
    pictureURL?: string[];
    pictureUrls?: string[];
}

/** ————— Helpers ————— */

/** Try to read a restaurant id from various shapes you receive. */
export function restaurantId(r: unknown): UUID | null {
    if (!r) return null;
    if (typeof r === 'string') return r;

    // index signatures to safely probe
    const obj = r as Record<string, unknown>;

    if (typeof obj.id === 'string') return obj.id as UUID;
    if (typeof obj.restaurantId === 'string') return obj.restaurantId as UUID;

    // nested id objects
    const nestedRid = (obj.restaurantId as any)?.restaurantId;
    if (typeof nestedRid === 'string') return nestedRid as UUID;

    const nestedId = (obj.id as any)?.id;
    if (typeof nestedId === 'string') return nestedId as UUID;

    return null;
}



export function labelize(s: string | null | undefined): string {
    if (!s) return '';
    return s
        .toString()
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
