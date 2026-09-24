import Image from "next/image"
import CategoryProducts from "@/components/Layout/CategoryProducts"
import CategoryTabs from "@/components/Layout/CategoryTabs"

export default function Page() {
  return (
    <div className="pt-0">
      <CategoryTabs />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pt-6">
        <div className="mx-auto flex w-full justify-center gap-6 px-4">
          <div className="relative aspect-[2344/1192] w-full overflow-hidden rounded-2xl border border-border/60 bg-card">
            <Image
              src={
                "https://cdn.zeptonow.com/production/tr:w-1280,ar-2344-1192,pr-true,f-auto,q-40/inventory/banner/601180a6-b82f-499b-a24f-c079904e9f53.png"
              }
              alt="home page banner"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[2352/1192] w-full overflow-hidden rounded-2xl border border-border/60 bg-card hidden md:block">
            <Image
              src={
                "https://cdn.zeptonow.com/production/tr:w-1280,ar-2352-1192,pr-true,f-auto,q-40/inventory/banner/85b9411e-fa0e-427f-96ec-97fd4d13aaed.png"
              }
              alt="Placeholder"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <CategoryProducts />
    </div>
  )
}
