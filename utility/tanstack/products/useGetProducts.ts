import { useQuery } from "@tanstack/react-query";
import { api } from "@/utility/api/call-api";
import { ENDPOINTS } from "@/utility/api/endpoints";
export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => api.get<IProduct[]>(ENDPOINTS.products.getAll)
  });
};
