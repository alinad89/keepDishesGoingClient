import type { DishState } from "../types";

export function colorForState(state?: DishState): "success" | "warning" | "default" {
    switch (state) {
        case "PUBLISHED":
            return "success";
        case "OUT_OF_STOCK":
            return "warning";
        case "UNPUBLISHED":
        default:
            return "default";
    }
}
