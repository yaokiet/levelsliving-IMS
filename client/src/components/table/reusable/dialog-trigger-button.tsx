import { Button } from "@/components/ui/button";

interface DialogTriggerButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export function DialogTriggerButton({ onClick, children }: DialogTriggerButtonProps) {
    return (
        <Button className="self-start" variant="outline" onClick={onClick}>
            {children}
        </Button>
    );
}