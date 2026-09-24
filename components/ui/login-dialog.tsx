"use client"

import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./dialog"
import { Input } from "./input"
import { FieldGroup } from "./field"
import { useState } from "react"
import { useLogin } from "@/utility/tanstack/auth/useLogin"
import { useForm } from "react-hook-form"
import { errorTypes } from "@/utility/Validations"
import { ILoginFormData } from "@/core/interfaces/Login.interface"

interface ILoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const LoginDialog = ({ open, onOpenChange }: ILoginDialogProps) => {
  const [globalError, setGlobalError] = useState("")
  const { mutateAsync: login, isPending } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ILoginFormData>()

  const onSubmit = async (data: ILoginFormData) => {
    setGlobalError("")
    try {
      const response = await login(data)
      console.log(response)
      reset()
      onOpenChange(false)
    } catch (err: any) {
      console.error("Login failed:", err)
      setGlobalError(err.data?.message || err.message || "Failed to login")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            {globalError && <div className="text-sm font-medium text-destructive">{globalError}</div>}
            <Input
              label="Username"
              id="username-login"
              placeholder="Enter your username"
              error={errors.username?.message}
              {...register("username", { ...errorTypes.required("username") })}
            />
            <Input
              label="Password"
              id="password-login"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password", { ...errorTypes.required("password"), ...errorTypes.password })}
            />

          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="destructive">Cancel</Button>} />
            <Button type="submit" disabled={isPending} className="bg-brand-color hover:bg-brand-color/80">
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
export default LoginDialog
