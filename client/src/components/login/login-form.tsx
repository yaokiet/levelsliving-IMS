"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "@/app/_store/authSlice"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api/authApi";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [email, setEmail] = useState("admin@admin.com") // Default email for testing
  const [password, setPassword] = useState("password") // Default password for testing
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const user = await login(email, password);
      dispatch(setUser(user));
      router.replace("/");
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Login
        </Button>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </form>
  )
}
