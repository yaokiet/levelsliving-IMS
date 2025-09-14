"use client";

import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "../sidebar";
import { ModeToggle } from "./toggle-theme";
import { AppBreadcrumb } from "./breadcrumb";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <AppBreadcrumb />
                <div className="ml-auto flex gap-3">
                    <Link href="/cart" passHref>
                        <Button variant="outline" size="icon" asChild>
                            <div>
                                <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
                                <span className="sr-only">Cart</span>
                            </div>
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}