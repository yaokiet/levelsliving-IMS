import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react";

interface ReusableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dialogTitle: string;
    dialogDescription?: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    // Allow handlers that return an HTTP-like response
    onConfirm?: () =>
        | void
        | boolean
        | { status: number }
        | Response
        | Promise<void | boolean | { status: number } | Response>;
    children?: React.ReactNode;
}
export function ReusableDialog({
    open,
    onOpenChange,
    dialogTitle,
    dialogDescription,
    cancelButtonText,
    confirmButtonText,
    onConfirm,
    children,
}: ReusableDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    /**
     * Returns true if the given response has a status code of 200, false otherwise.
     * @param res The response to check. Can be an object with a .status property,
     *            or a number (in which case it is compared directly to 200),
     *            or anything else (in which case the function returns false).
     * @returns true if the status code is 200, false otherwise.
     */
    const isSuccessStatus = (res: unknown): boolean => {
        if (!res || typeof res !== "object") return false;
        const status = (res as any).status;
        return typeof status === "number" && status >= 200 && status < 300;
    };

    const handleConfirm = async () => {
        if (!onConfirm) {
            // No confirm handler; do not auto-close
            return;
        }
        try {
            setSubmitting(true);
            const result = await onConfirm();

            if (isSuccessStatus(result)) {
                onOpenChange(false);
            }
            // If not successful, keep dialog open
        } catch {
            // Keep dialog open on error
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    {dialogDescription && (
                        <DialogDescription>{dialogDescription}</DialogDescription>
                    )}
                </DialogHeader>
                {children}
                <DialogFooter>
                    {cancelButtonText && (
                        <DialogClose asChild>
                            <Button variant="outline" disabled={submitting}>
                                {cancelButtonText}
                            </Button>
                        </DialogClose>
                    )}
                    {confirmButtonText && (
                        <Button type="button" onClick={handleConfirm} disabled={submitting}>
                            {submitting ? "Please wait..." : confirmButtonText}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}