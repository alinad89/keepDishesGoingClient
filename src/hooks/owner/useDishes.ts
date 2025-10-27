// src/hooks/owner/useDishes.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    changeDishStatus,
    createDish,
    editDishAsDraft,
    scheduleDish,
} from "../../services/owner/dishService";
import type {
    DishCreateRequest,
    DishDto,
    EditDishDraftRequest,
    ScheduleDishRequest,
    UUID,
} from "../../types";

/** Create new dish */
export const useCreateDish = () => {
    const qc = useQueryClient();
    return useMutation<DishDto, unknown, DishCreateRequest>({
        mutationFn: createDish,
        onSuccess: (dish) => {
            qc.invalidateQueries({ queryKey: ["owner", "dishes"] });
            qc.setQueryData(["dish", dish.id], dish);
        },
    });
};

/** Edit dish draft */
export const useEditDishDraft = (dishId: UUID) =>
    useMutation<DishDto, unknown, EditDishDraftRequest>({
        mutationFn: (body: EditDishDraftRequest) =>
            editDishAsDraft(dishId, body),
    });

/** Schedule dish */
export const useScheduleDish = (dishId: UUID) =>
    useMutation<void, unknown, ScheduleDishRequest>({
        mutationFn: (body: ScheduleDishRequest) => scheduleDish(dishId, body),
    });

/** Change dish status (publish/unpublish/out-of-stock) */
export const useChangeDishStatus = () =>
    useMutation<DishDto, unknown, { dishId: UUID; dishState: string }>({
        mutationFn: ({ dishId, dishState }) =>
            changeDishStatus(dishId, { dishState } as any),
    });
