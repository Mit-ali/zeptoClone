import { useMutation } from "@tanstack/react-query";
import { api } from "@/utility/api/call-api";
import { ENDPOINTS } from "@/utility/api/endpoints";
import { ILoginFormData } from "@/core/interfaces/Login.interface";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: ILoginFormData) => {
      return api.post(ENDPOINTS.auth.login, credentials);
    }
  });
};
