import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utility/api/call-api";
import { ENDPOINTS } from "@/utility/api/endpoints";
import { showToastNotification } from "@/utility/helper";

export const useDeleteCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string | number) => {
      return api.delete(ENDPOINTS.cart.delete(cartId));
    },
    onSuccess: (response, cartId) => {

      queryClient.setQueryData(["carts"], (old: any) => {
        if (!old) return old;
        return old.filter((c: any) => String(c.id) !== String(cartId));
      });
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      showToastNotification("success", "Cart deleted");
    },
    onError: (error: any) => {
      showToastNotification("danger", error?.message || "Failed to delete cart");
    }
  });
};
