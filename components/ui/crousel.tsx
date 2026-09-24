"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useGetProducts } from "@/utility/tanstack/products/useGetProducts"
import { Skeleton } from "@/components/ui/skeleton"

interface ICrouselProps {
  title: string
}

const Crousel = ({ title }: ICrouselProps) => {
  const { data: products, isLoading, error } = useGetProducts()

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8 flex flex-col gap-4">
        <Skeleton className="h-6 w-48 rounded-md" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="min-w-[160px] h-[240px] rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !products) return null;

  return (
    <div className="w-full">
      <h2 className="text-[20px] font-bold text-slate-900 mb-4 px-4 tracking-tight">{title}</h2>
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[160px] max-w-[160px] flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm p-2 snap-start group transition-all duration-200 hover:shadow-md hover:border-gray-200 cursor-pointer"
          >
            <div className="relative w-full aspect-square bg-[#F4F6F9] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain mix-blend-multiply drop-shadow-sm p-3 transition-transform duration-300 group-hover:scale-110"
              />
              <Button
                size="icon"
                className="absolute bottom-1 right-1 h-8 w-8 rounded-[10px] bg-white shadow-sm border border-gray-100 text-brand-color hover:bg-brand-color hover:text-white transition-colors duration-200 z-10"
              >
                <span className="text-xl font-medium leading-none mb-0.5">+</span>
              </Button>
            </div>
            <div className="flex flex-col flex-1 px-1">
              <span className="text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug tracking-tight mb-1">
                {product.title}
              </span>
              <span className="text-xs text-slate-500 font-medium capitalize mt-auto">
                {product.category}
              </span>
              <div className="flex items-center gap-2 mt-2 pb-1">
                <span className="font-bold text-[15px] text-slate-900 tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Crousel
