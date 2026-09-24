"use client"
import { ItemCard } from "@/components/ui/item-card"
import { Skeleton } from "@/components/ui/skeleton"
import { capitalizeFirstLetter } from "@/utility/helper"
import { useGetProducts } from "@/utility/tanstack/products/useGetProducts"
import { useCreateCart } from "@/utility/tanstack/cart/useCreateCart"
import { useUpdateCart } from "@/utility/tanstack/cart/useUpdateCart"
import { useGetCarts } from "@/utility/tanstack/cart/useGetCarts"
import { useState } from "react"

export default function CategoryProducts() {
  const { data: products, isLoading } = useGetProducts()
  const { data: carts } = useGetCarts()
  const { mutate: createCart } = useCreateCart()
  const { mutate: updateCart } = useUpdateCart()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const activeCart = carts?.[0]

  const handleAddToCart = (productId: number) => {
    if (activeCart) {
      const existingProduct = activeCart.products.find(p => p.productId === productId);
      const updatedProducts = [...activeCart.products];

      if (existingProduct) {
        const index = updatedProducts.findIndex(p => p.productId === productId);
        updatedProducts[index] = { ...existingProduct, quantity: existingProduct.quantity + 1 };
      } else {
        updatedProducts.push({ productId, quantity: 1 });
      }

      updateCart({
        id: activeCart.id,
        userId: activeCart.userId,
        products: updatedProducts
      });
    } else {
      createCart({
        userId: 1,
        products: [{ productId, quantity: 1 }]
      });
    }
  }
  const uniqueCategoryNames = Array.from(new Set(products?.map(p => p.category) || []))
  const categories = uniqueCategoryNames.map(name => ({
    name,
    image: products?.find(p => p.category === name)?.image,
    label: capitalizeFirstLetter(name)
  }))
  const filteredProducts = selectedCategory === "all"
    ? products
    : products?.filter(p => p.category === selectedCategory);


  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-8 py-6 px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!products) return null;



  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-white border-b border-slate-100 py-6 mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-[20px] font-bold text-slate-900 mb-6 tracking-tight">Shop by Categories</h2>
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2 snap-x">
            <ItemCard
              title="All Items"
              isActive={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              className="min-w-[140px] max-w-[140px] snap-start"
            />

            {categories.map(cat => (
              <ItemCard
                key={cat.name}
                title={cat.label}
                image={cat.image}
                isActive={selectedCategory === cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="min-w-[140px] max-w-[140px] snap-start"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 w-full pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">
            {selectedCategory === "all" ? "All Products" : categories.find(c => c.name === selectedCategory)?.label}
          </h2>
          <span className="text-sm font-medium text-slate-500">{filteredProducts?.length || 0} items</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts?.map(product => (
            <ItemCard
              key={product.id}
              title={product.title}
              image={product.image}
              price={product.price}
              onAdd={() => handleAddToCart(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


