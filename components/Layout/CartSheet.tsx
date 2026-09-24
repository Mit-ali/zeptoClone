"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet"
import { useDeleteCart } from "@/utility/tanstack/cart/useDeleteCart"
import { useGetCartById } from "@/utility/tanstack/cart/useGetCartById"
import { useUpdateCart } from "@/utility/tanstack/cart/useUpdateCart"
import { ArrowLeft01Icon, ShoppingBag02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react";
interface ICartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}



const CartSheet = ({ open, onOpenChange }: ICartSheetProps) => {
  const { data: cart, isLoading, error } = useGetCartById(1);
  const { mutate: updateCart } = useUpdateCart();
  const { mutate: deleteCart } = useDeleteCart();
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);

  const products = cart?.products || [];

  const handleRemoveProduct = (productId: number) => {
    if (!cart) return;
    setUpdatingProductId(productId);

    const updatedProducts = products.filter(p => p.productId !== productId);

    if (updatedProducts.length === 0) {
      deleteCart(cart.id, {
        onSettled: () => setUpdatingProductId(null)
      });
    } else {
      updateCart({
        id: cart.id,
        userId: cart.userId,
        products: updatedProducts
      }, {
        onSettled: () => setUpdatingProductId(null)
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent showCloseButton={false} side="right" className="sm:max-w-md w-full flex flex-col h-full p-0 bg-[#F4F6F9] gap-0">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-gray-200 shrink-0 text-slate-600"
            onClick={() => onOpenChange(false)}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2.5} />
          </Button>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Cart</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Loading cart...
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-destructive">
              Failed to load cart.
            </div>
          ) : products.length === 0 ? (
            <div className="flex-1 flex flex-col">
              <div className="w-full bg-white rounded-[24px] shadow-sm p-8 flex flex-col items-center justify-center mt-2">
                <div className="w-[100px] h-[100px] bg-[#F0F4F8] rounded-[32px] flex items-center justify-center mb-6">
                  <HugeiconsIcon icon={ShoppingBag02Icon} size={54} className="text-[#A0ABC0]" />
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-6 tracking-tight">Your cart is empty</h3>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full bg-[#1C212D] hover:bg-[#1C212D]/90 text-white rounded-xl h-14 text-[15px] font-semibold"
                >
                  Browse Products
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {products.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex justify-between items-center p-4 bg-white shadow-sm border border-slate-100 rounded-2xl">
                  <div>
                    <div className="font-bold text-[15px] text-slate-900">Product #{item.productId}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Qty: {item.quantity}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-9 font-semibold text-slate-600"
                    onClick={() => handleRemoveProduct(item.productId)}
                    disabled={updatingProductId === item.productId}
                  >
                    {updatingProductId === item.productId ? "Removing..." : "Remove"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        {products.length > 0 && (
          <div className="bg-white p-4 border-t border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between font-bold text-slate-900 px-1">
              <span>Total Items</span>
              <span>{products.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
            </div>
            <Button className="w-full bg-brand-color hover:bg-brand-color/90 text-white rounded-xl h-14 text-base font-semibold shadow-md">
              Checkout
            </Button>
          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
