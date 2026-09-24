import HomeLayout from "@/components/Layout/HomeLayout"
import "./globals.css"
import { ReactNode } from "react"
import { Fraunces, Nunito } from "next/font/google"
import StoreProvider from "@/utility/StoreProvider"
const zeptoNorms = Nunito({
  subsets: ["latin"],
  variable: "--zepto-font-family-name",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--fraunces-font-family-name",
  display: "swap",
})



export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${zeptoNorms.variable} ${fraunces.variable}`}>
      <body className="min-h-screen w-full">
        <StoreProvider>
          <HomeLayout>{children}</HomeLayout>
        </StoreProvider>
      </body>
    </html>
  )
}
