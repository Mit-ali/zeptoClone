import { useQuery } from "@tanstack/react-query";
import { api } from "@/utility/api/call-api";
import { ENDPOINTS } from "@/utility/api/endpoints";

export interface ICart {
  id: number;
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
}

export const useGetCarts = () => {
  return useQuery({
    queryKey: ['carts'],
    queryFn: () => api.get<ICart[]>(ENDPOINTS.cart.getAll)
  });
};
