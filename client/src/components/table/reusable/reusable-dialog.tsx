import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface DialogButtonProps {
    buttonText: string
    dialogTitle: string
    dialogDescription?: string
    cancelButtonText?: string
    confirmButtonText?: string
    onConfirm?: () => void
    children?: React.ReactNode
}

export function ReusableDialog({
    buttonText,
    dialogTitle,
    dialogDescription,
    cancelButtonText,
    confirmButtonText,
    onConfirm,
    children,
}: DialogButtonProps) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">{buttonText}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        {dialogDescription && (
                            <DialogDescription>
                                {dialogDescription}
                            </DialogDescription>
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
            </form>
        </Dialog>
    )
}