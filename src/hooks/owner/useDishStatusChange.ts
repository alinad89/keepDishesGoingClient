import { useQueryClient } from "@tanstack/react-query";
import { changeDishStatus } from "../../services/owner/dishService.ts";
import type { DishDto, DishState } from "../../types";

export function useDishStatusChange() {
    const qc = useQueryClient();

    const handleChange = async (dishId: string, newState: DishState) => {
        try {
            // Optimistic cache update
            qc.setQueryData<DishDto[]>(["owner", "dishes"], (old) =>
                old?.map((d) =>
                    d.id === dishId ? { ...d, state: newState } : d
                ) ?? []
            );

            await changeDishStatus(dishId, { dishState: newState });
            qc.invalidateQueries({ queryKey: ["owner", "dishes"] });
        } catch (err) {
            console.error("Failed to update dish status", err);
        }
    };

    return { handleChange };
}
