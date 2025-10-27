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
    const { data } = await axiosClient.patch<DishDto>(
        `/dishes/${dishId}`,
        body
    );
    return data;
}

export async function applyAllDishDrafts() {
    const { data } = await axiosClient.patch(`/menus/dishes/drafts`);
    return data;
}


export async function fetchOwnerDishes(): Promise<DishDto[]> {
    const { data } = await axiosClient.get(`/dishes`);
    return data; // includes all 3 states
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
