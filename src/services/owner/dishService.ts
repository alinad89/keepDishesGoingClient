import axiosClient from "../../lib/axiosClient";
import type {
    DishDto,
    DishCreateRequest,
    EditDishDraftRequest,
    ScheduleDishRequest,
    DishStatusChangeRequest,
    UUID,
} from "../../types";

// OWNER endpoints
export async function createDish(body: DishCreateRequest) {
    const { data } = await axiosClient.post<DishDto>("/dishes", body);
    return data;
}

export async function editDishAsDraft(dishId: UUID, body: EditDishDraftRequest) {
    try {
        console.log(`[dishService] Saving draft for dish ${dishId}:`, body);
        const { data } = await axiosClient.patch<DishDto>(
            `/dishes/${dishId}`,
            body
        );
        console.log(`[dishService] Draft saved successfully:`, data);
        return data;
    } catch (error: any) {
        console.error(`[dishService] Failed to save draft:`, error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

export async function applyAllDishDrafts(): Promise<DishDto[]> {
    try {
        console.log("[dishService] Applying all drafts");
        const { data } = await axiosClient.patch<DishDto[]>("/menus/dishes/drafts", {});
        console.log("[dishService] All drafts applied successfully:", data);
        return data;
    } catch (error: any) {
        console.error("[dishService] Failed to apply all drafts:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

export async function applyDishDraft(dishId: UUID): Promise<DishDto> {
    try {
        console.log(`[dishService] Applying draft for dish ${dishId}`);
        const { data } = await axiosClient.patch<DishDto>(`/menus/dishes/${dishId}/draft`, {});
        console.log(`[dishService] Draft applied successfully:`, data);
        return data;
    } catch (error: any) {
        console.error(`[dishService] Failed to apply draft:`, error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}


export async function fetchOwnerDishes(): Promise<DishDto[]> {
    const { data } = await axiosClient.get(`/dishes`);
    return data;
}

export async function scheduleDish(dishId: UUID, body: ScheduleDishRequest) {
    await axiosClient.post(`/dishes/${dishId}`, body);
}

export async function changeDishStatus(
    dishId: UUID,
    body: DishStatusChangeRequest
) {
    const { data } = await axiosClient.patch<DishDto>(
        `/dishes/${dishId}/status`,
        body
    );
    return data;
}
