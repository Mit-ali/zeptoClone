import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utility/api/call-api";
import { ENDPOINTS } from "@/utility/api/endpoints";
import { showToastNotification } from "@/utility/helper";

import { ICartResponse } from "@/core/interfaces/Cart.interface";

interface ICreateCartPayload {
  userId: number;
  products: { productId: number; quantity?: number }[];
  date?: string;
}

export const useCreateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateCartPayload) => {
      const data = {
        date: new Date().toISOString().split('T')[0],
        ...payload
      };
      return api.post<ICartResponse>(ENDPOINTS.cart.create, data);
    },
    onSuccess: (response: ICartResponse) => {
      queryClient.setQueryData(["carts"], (old: ICartResponse[] | undefined) => {
        return old ? [response, ...old] : [response];
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showToastNotification("success", "Item added to cart");
    },
    onError: (error: any) => {
      showToastNotification("danger", error?.message || "Failed to add item to cart");
    }
  });
};
