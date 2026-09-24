"use client"

import {
  ChevronDown,
  FlashIcon,
  Search01Icon,
  ShoppingCart02Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import LoginDialog from "../ui/login-dialog"
import CartSheet from "./CartSheet"

export const Header = () => {
  const [mounted, setMounted] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative min-h-[100px] w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs" />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="mx-auto flex h-[80px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 md:gap-8">
        <div className="flex shrink-0 items-center gap-6 md:gap-8">
          <Image
            src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/16.31.6/images/header/primary-logo.svg"
            height={36}
            width={112}
            alt="Zepto"
            className="object-contain w-[90px] md:w-[112px]"
          />

          <div className="hidden flex-col gap-0.5 sm:flex">
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={FlashIcon} size={18} fill="#3B1C57" className="text-[#3B1C57]" />
              <span className="text-[15px] font-bold text-[#3B1C57]">
                Delivery in minutes*
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-gray-700 outline-none">
                Select Location
                <HugeiconsIcon icon={ChevronDown} size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Pune</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 max-w-[700px] w-full hidden md:block">
          <div className="relative flex items-center w-full">
            <HugeiconsIcon icon={Search01Icon} size={20} className="absolute left-4 text-gray-400" />
            <Input
              placeholder='Search for "kurkure"'
              type="search"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-[15px] font-medium text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-300"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <Button
            variant={"none"}
            onClick={() => setIsLoginOpen(true)}
            className="flex flex-col items-center gap-1 text-sm font-bold text-foreground hover:opacity-80 transition-opacity hover:text-foreground/80"
          >
            <HugeiconsIcon icon={UserCircleIcon} />
            <span>Login</span>
          </Button>

          <Button
            variant={"none"}
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 text-sm font-bold text-foreground hover:opacity-80 transition-opacity hover:text-foreground/80"
          >
            <HugeiconsIcon icon={ShoppingCart02Icon} />
            <span>Cart</span>
          </Button>

        </div>
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </motion.div>

  )
}
