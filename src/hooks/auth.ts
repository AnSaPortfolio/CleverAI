import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";


export function useSignUp() {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => authService.signUp(email, password)
    })
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => authService.signIn(email, password),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["session"],
      });

      toast.success("Successfully logged in!");
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),

    onSuccess: async () => {
      queryClient.setQueryData(["session"], null);

      await queryClient.invalidateQueries({
        queryKey: ["session"],
      });

      toast.success("Successfully signed out!");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => authService.getSession(),
    staleTime: 60_000 * 5,
  });
}