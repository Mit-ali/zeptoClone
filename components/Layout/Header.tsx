"use client"

import {
  ChevronDown,
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
export const Header = () => {
  const [mounted, setMounted] = useState(false)

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
      className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs"
    >
      <div className="relative z-10 flex flex-col justify-around gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-6">
          {/* Logo */}{" "}
          <div className="group relative">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-card">
              <Image
                src={
                  "https://cdn.zeptonow.com/web-static-assets-prod/artifacts/16.31.6/images/header/primary-logo.svg"
                }
                height={80}
                width={80}
                alt={"zeptoClone Logo"}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-bold text-foreground">
              Delivery in Minute *
            </span>{" "}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    icon={<HugeiconsIcon icon={ChevronDown} />}
                    variant="outline"
                  >
                    Select Location
                  </Button>
                }
              />
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Pune</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1">
            <Input
              placeholder="Search..."
              type="search"
              className="w-0 min-w-[700px] rounded-lg border-2 border-input bg-background px-4 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary sm:w-auto"
            />
          </div>
        </div>

        {/* Right Side Pill/Status */}
        <div className="flex items-end justify-end gap-4 sm:items-center">
          <span className="text-sm font-bold text-foreground">
            <HugeiconsIcon icon={UserCircleIcon} />
            <span className="">Login</span>
          </span>
          <span className="text-sm font-bold text-foreground">
            <HugeiconsIcon icon={ShoppingCart02Icon} />
            <span className="">Cart</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
