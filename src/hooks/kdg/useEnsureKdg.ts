// src/hooks/kdg/useEnsureKdg.ts
import { useMutation } from "@tanstack/react-query";
import { ensureKdg } from "../../services/kdg/kdgService";

export function useEnsureKdg() {
    const { mutate: ensureKdgAccount, isPending, isError, error } = useMutation({
        mutationKey: ["ensureKdg"],
        mutationFn: () => ensureKdg(),
    });
    return { ensureKdgAccount, isPending, isError, error };
}
