import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utility/api/call-api";
import { ENDPOINTS } from "@/utility/api/endpoints";
import { showToastNotification } from "@/utility/helper";
import { ICartResponse } from "@/core/interfaces/Cart.interface";

interface IUpdateCartPayload {
  id: string | number;
  userId: number;
  products: { productId: number; quantity?: number }[];
  date?: string;
}

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateCartPayload) => {
      const { id, ...data } = payload;
      const requestData = {
        date: new Date().toISOString().split('T')[0],
        ...data
      };
      return api.put<ICartResponse>(ENDPOINTS.cart.update(id), requestData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["cart", response.id] });
      showToastNotification("success", "Cart updated successfully");


    },
    onError: (error: any) => {
      showToastNotification("danger", error?.message || "Failed to update cart");
    }
  });
};
