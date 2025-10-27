import {useMutation} from "@tanstack/react-query";
import {createAnonymousCustomer} from "../../services/customer/anonymousCustomerService.ts";


export function useAnonymCustomer() {
    const {mutate: createAnonCustomer, isPending, isError,error} = useMutation({
        mutationKey: ["anonymousCustomer"],
        mutationFn: () => createAnonymousCustomer(),
    });
    return {createAnonCustomer, isPending, isError,error}
}