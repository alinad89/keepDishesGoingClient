import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addItemToBasket} from "../../services/customer/basketService.ts";
import type {AddItemToBasket} from "../../types/basket.ts";


export function useAddItemToBasket() {
    const queryClient = useQueryClient();
    const {mutate:addItem, isPending, isError, error} = useMutation({
        mutationKey: ["add-item-to-basket"],
        mutationFn: (item: AddItemToBasket) => addItemToBasket(item.dishId, item),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["basket"]})
        }
    })
    return {addItem, isPending, isError, error}
}