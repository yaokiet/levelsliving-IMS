"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Supplier } from "@/types/supplier";
import { DataTableSearch } from "@/components/table/reusable/data-table-search";

interface SupplierSelectCardProps {
    suppliers: Supplier[];
    selectedSupplierId?: string;
    onSelect?: (id: string) => void;
    poDisabled?: boolean;
    onPOCreate?: () => void;
}

export function SupplierSelectCard({
    suppliers,
    selectedSupplierId,
    onSelect,
    poDisabled = false,
    onPOCreate,
}: SupplierSelectCardProps) {
    const [selected, setSelected] = useState(selectedSupplierId ?? "");
    const [search, setSearch] = useState("");
    const router = useRouter();

    // Sync local state with prop
    useEffect(() => {
        setSelected(selectedSupplierId ?? "");
    }, [selectedSupplierId]);

    const filteredSuppliers = useMemo(() => {
        if (!search) return suppliers;
        return suppliers.filter(
            (s) =>
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
        );
    }, [suppliers, search]);

    const handleChange = (id: string) => {
        setSelected(id);
        onSelect?.(id);
    };

    const handlePOClick = () => {
        onPOCreate?.();
        router.push("/cart/checkout");
    };

    return (
        <Card className="flex flex-col p-6 w-full max-w-sm h-full max-h-[600px]">
            <div className="font-semibold text-lg mb-4">Select Supplier</div>
            <div className="mb-2">
                <DataTableSearch
                    value={search}
                    onSearch={setSearch}
                    placeholder="Search suppliers..."
                />
            </div>
            <ScrollArea className="flex-1 mb-4 pr-2">
                <RadioGroup
                    value={selected}
                    onValueChange={handleChange}
                    className="flex flex-col gap-2"
                >
                    {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((supplier) => (
                            <label
                                key={supplier.id}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted cursor-pointer"
                            >
                                <RadioGroupItem value={String(supplier.id)} />
                                <div>
                                    <div className="font-medium">{supplier.name}</div>
                                    {supplier.description && (
                                        <div className="text-xs text-muted-foreground">{supplier.description}</div>
                                    )}
                                </div>
                            </label>
                        ))
                    ) : (
                        <div className="text-muted-foreground px-3 py-2">No suppliers found.</div>
                    )}
                </RadioGroup>
            </ScrollArea>
            <Button
                className="mt-2 w-full"
                disabled={poDisabled}
                onClick={handlePOClick}
            >
                PO creation
            </Button>
        </Card>
    );
}