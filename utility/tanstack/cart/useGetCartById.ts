import { useQuery } from "@tanstack/react-query";
import { api } from "@/utility/api/call-api";
import { ENDPOINTS } from "@/utility/api/endpoints";
import { ICartResponse } from "@/core/interfaces/Cart.interface";

export const useGetCartById = (cartId: string | number | undefined) => {
  return useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => {
      if (!cartId) throw new Error("Cart ID is required");
      return api.get<ICartResponse>(ENDPOINTS.cart.getById(cartId));
    },
    enabled: !!cartId,
  });
};
