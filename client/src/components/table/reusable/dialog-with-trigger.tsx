import { useState } from "react";
import { DialogTriggerButton } from "./dialog-trigger-button";
import { ReusableDialog } from "./reusable-dialog";

interface DialogWithTriggerProps {
    buttonText: string;
    dialogTitle: string;
    dialogDescription?: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    onConfirm?: () => void;
    children?: React.ReactNode;
}

export function DialogWithTrigger({
    buttonText,
    dialogTitle,
    dialogDescription,
    cancelButtonText,
    confirmButtonText,
    onConfirm,
    children,
}: DialogWithTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DialogTriggerButton onClick={() => setOpen(true)}>
                {buttonText}
            </DialogTriggerButton>
            <ReusableDialog
                open={open}
                onOpenChange={setOpen}
                dialogTitle={dialogTitle}
                dialogDescription={dialogDescription}
                cancelButtonText={cancelButtonText}
                confirmButtonText={confirmButtonText}
                onConfirm={onConfirm}
            >
                {children}
            </ReusableDialog>
        </>
    );
}