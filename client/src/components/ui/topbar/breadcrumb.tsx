"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function AppBreadcrumb() {
    const pathname = usePathname();

    // Generate breadcrumb items based on the current route
    const breadcrumbItems = pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, arr) => ({
            name: segment.charAt(0).toUpperCase() + segment.slice(1),
            href: `/${arr.slice(0, index + 1).join("/")}`,
        }));
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Home Link */}
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" >
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
                {/* Dynamic Breadcrumb Links */}
                {breadcrumbItems.map((item, index) => (
                    <BreadcrumbItem key={item.href}>
                        {index === breadcrumbItems.length - 1 ? (
                            <BreadcrumbPage>{item.name}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink
                                href={item.href}
                            >
                                {item.name}
                            </BreadcrumbLink>
                        )}
                        {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}