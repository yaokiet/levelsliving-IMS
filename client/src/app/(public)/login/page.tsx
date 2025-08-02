"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/_store/redux-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login/login-form"
import { ModeToggle } from "@/components/ui/topbar/toggle-theme"

export default function LoginPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/"); // or your default protected page
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Levels Living</span>
              <span className="">IMS</span>
            </div>
          </a>
          <div className="ml-auto">
              <ModeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login-img.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
        />
      </div>
    </div>
  )
}
