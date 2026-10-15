import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export function useSignUp() {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => authService.signUp(email, password)
    })
}

export function useSignIn() {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => authService.signIn(email, password)
    })
}

export function useSignOut() {
    return useMutation({
        mutationFn: () => authService.signOut(),

        onError: (error) => {
            toast.error(error.message)
        },

        onSuccess: () => {
            toast.success("Successfull signed out!")
        }
    })
}