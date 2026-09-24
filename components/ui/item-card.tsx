import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

export interface ItemCardProps {
  title: string
  image?: string
  price?: number
  isActive?: boolean
  onClick?: () => void
  onAdd?: () => void
  className?: string
}

export function ItemCard({
  title,
  image,
  price,
  isActive,
  onClick,
  onAdd,
  className,
}: ItemCardProps) {
  const isCategory = price === undefined;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "flex flex-col group cursor-pointer w-full relative border-none shadow-none bg-transparent",
        className
      )}
    >
      <CardContent className="p-0">
        <div
          className={cn(
            "relative w-full aspect-square rounded-2xl border bg-white flex items-center justify-center p-4 mb-3 transition-colors duration-200",
            isActive
              ? "border-brand-color bg-brand-color/5"
              : "border-gray-200 group-hover:border-brand-color/40"
          )}
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain mix-blend-multiply p-3 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <span className="font-bold text-slate-400 text-2xl">All</span>
          )}


          {!isCategory && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onAdd?.()
              }}
              className="absolute -bottom-3 -right-1 h-8 rounded-lg border-[1.5px] border-brand-color bg-white text-brand-color hover:bg-brand-color hover:text-white transition-colors font-extrabold text-[14px] uppercase px-4 z-10 shadow-sm"
            >
              ADD
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className={cn("p-0 flex flex-col w-full", isCategory ? "items-center" : "items-start")}>
        {!isCategory && (
          <div className="flex items-end gap-1.5 mb-1.5 px-0.5">

            <div className="bg-[#228035] text-white px-1.5 py-0.5 rounded-[6px] shadow-[0_3px_0_0_#145620] font-extrabold text-[14px] leading-tight flex items-center tracking-tight">
              ${price?.toFixed(2)}
            </div>

            <span className="text-slate-500 line-through text-[13px] font-medium mb-[1px]">
              ${(price! * 1.4).toFixed(2)}
            </span>
          </div>
        )}

        <span
          className={cn(
            "font-semibold text-slate-800 leading-snug tracking-tight px-0.5",
            isCategory
              ? cn("text-[14px] text-center", isActive ? "text-brand-color" : "")
              : "text-[14px] line-clamp-2 text-left"
          )}
        >
          {title}
        </span>
      </CardFooter>
    </Card>
  )
}
