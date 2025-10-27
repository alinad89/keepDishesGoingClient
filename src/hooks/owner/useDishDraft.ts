// src/hooks/owner/useDishDraft.ts
import { useMutation } from "@tanstack/react-query";
import { editDishAsDraft, applyAllDishDrafts } from "../../services/owner/dishService.ts";
import type { UUID, EditDishDraftRequest } from "../../types";

export function useDishDraft() {
    const updateDishDraft = useMutation({
        mutationKey: ["edit-dish-draft"],
        mutationFn: ({ dishId, body }: { dishId: UUID; body: EditDishDraftRequest }) =>
            editDishAsDraft(dishId, body),
    });

    const applyDrafts = useMutation({
        mutationKey: ["apply-dish-drafts"],
        mutationFn: applyAllDishDrafts,
    });

    return { updateDishDraft, applyDrafts };
}
