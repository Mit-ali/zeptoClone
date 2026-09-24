"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetProducts } from "@/utility/tanstack/products/useGetProducts"

export default function CategoryTabs() {
  const { data: products, isLoading } = useGetProducts()
  if (isLoading) {
    return <div className="h-[52px] w-full border-b border-slate-200 bg-white" />
  }
  if (!products) return null;
  const uniqueCategoryNames = ["all", ...Array.from(new Set(products.map(p => p.category)))]
  const tabs = uniqueCategoryNames.map(cat => ({
    value: cat,
    label: cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1),
  }))

  return (
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue={tabs[0]?.value}>
          <TabsList className="bg-transparent h-auto p-0 flex items-center justify-start gap-8 overflow-x-auto no-scrollbar w-full snap-x">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative rounded-none bg-transparent px-1 pb-3 pt-4 font-semibold text-[17px] text-slate-500 hover:text-slate-800 transition-colors !border-0 !border-b-[3px] !border-b-transparent data-[active]:!border-b-brand-color data-active:!border-b-brand-color data-[active]:text-brand-color data-active:text-brand-color shadow-none after:hidden whitespace-nowrap snap-start flex items-center"
              >
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
