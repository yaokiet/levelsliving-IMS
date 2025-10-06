import { useState } from "react";
import { DialogTriggerButton } from "./dialog-trigger-button";
import { ReusableDialog } from "./reusable-dialog";

interface DialogWithTriggerProps {
    buttonText: string;
    dialogTitle: string;
    dialogDescription?: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    onConfirm?: () => Promise<boolean> | boolean;
    children?: React.ReactNode;
    confirmButtonDisabled?: boolean;
}

export function DialogWithTrigger({
    buttonText,
    dialogTitle,
    dialogDescription,
    cancelButtonText,
    confirmButtonText,
    onConfirm,
    children,
    confirmButtonDisabled = false,
}: DialogWithTriggerProps) {
    const [open, setOpen] = useState(false);

    const handleConfirm = async () => {
        if (!onConfirm) {
            setOpen(false);
            return;
        }
        try {
            const result = await onConfirm();
            // close only if callback indicates success (truthy)
            if (result) setOpen(false);
        } catch {
            // don't close on thrown error
        }
    };
    
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
                onConfirm={handleConfirm}
                confirmButtonDisabled={confirmButtonDisabled}
            >
                {children}
            </ReusableDialog>
        </>
    );
}