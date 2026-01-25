import { Button } from "../ui/Button";
import { Database } from "lucide-react";
import { usePitch } from "@/hooks/usePitch";

export function SeedSlotsButton() {
    const { seedSlots } = usePitch();

    return (
        <div className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" onClick={seedSlots} className="text-xs font-mono h-8 border-dashed border-text-muted">
                <Database size={12} className="mr-2" />
                DEV: Seed Slots
            </Button>
        </div>
    );
}
