import Image from "next/image"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="relative h-[200px] w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
        <Image
          src={
            "https://cdn.zeptonow.com/production/tr:w-1438,ar-1438-274,pr-true,f-auto,q-40,dpr-2/images/paan-corner/zepto-paan-desktop.webp"
          }
          alt="Placeholder"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}
