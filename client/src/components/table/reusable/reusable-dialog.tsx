import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ReusableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dialogTitle: string;
    dialogDescription?: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    onConfirm?: () => void;
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
                            <Button variant="outline">{cancelButtonText}</Button>
                        </DialogClose>
                    )}
                    {confirmButtonText && (
                        <DialogClose asChild>
                            <Button type="button" onClick={onConfirm}>
                                {confirmButtonText}
                            </Button>
                        </DialogClose>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}