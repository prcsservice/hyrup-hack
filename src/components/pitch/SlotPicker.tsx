import { PitchSlot } from "@/hooks/usePitch";
import { Button } from "../ui/Button";
import { Clock, Calendar } from "lucide-react";

interface SlotPickerProps {
    slots: PitchSlot[];
    onBook: (slotId: string) => void;
    formatTime: (date: Date) => string;
    formatDate: (date: Date) => string;
}

export function SlotPicker({ slots, onBook, formatTime, formatDate }: SlotPickerProps) {
    // Group by date
    const groupedSlots = slots.reduce((acc, slot) => {
        const dateKey = formatDate(slot.startTime);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot);
        return acc;
    }, {} as Record<string, PitchSlot[]>);

    return (
        <div className="space-y-8">
            {Object.entries(groupedSlots).map(([date, daySlots]) => (
                <div key={date} className="animate-enter">
                    <h3 className="flex items-center gap-2 text-text-secondary font-mono text-sm uppercase mb-4">
                        <Calendar size={14} className="text-accent" />
                        {date}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {daySlots.map((slot) => {
                            const isBooked = slot.status === 'booked' || slot.teamId !== null;

                            return (
                                <button
                                    key={slot.id}
                                    onClick={() => !isBooked && onBook(slot.id)}
                                    disabled={isBooked}
                                    className={`
                                        relative group flex flex-col items-center justify-center p-4 rounded-sm border transition-all
                                        ${isBooked
                                            ? 'bg-bg-secondary/50 border-transparent opacity-50 cursor-not-allowed'
                                            : 'bg-bg-secondary border-stroke-primary hover:border-accent hover:bg-bg-tertiary cursor-pointer'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Clock size={12} className={isBooked ? "text-text-muted" : "text-accent"} />
                                        <span className={`text-sm font-bold ${isBooked ? "text-text-muted" : "text-white"}`}>
                                            {formatTime(slot.startTime)}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-text-secondary font-mono">
                                        {Math.round((slot.endTime.getTime() - slot.startTime.getTime()) / 60000)} MIN
                                    </div>

                                    {isBooked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/80 backdrop-blur-[1px] rounded-sm">
                                            <span className="text-[10px] font-mono uppercase text-text-muted transform -rotate-12 border border-text-muted px-1 rounded">Taken</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {slots.length === 0 && (
                <div className="text-center py-12 border border-dashed border-stroke-divider rounded-sm">
                    <p className="text-text-secondary">No slots available right now. checks back later!</p>
                </div>
            )}
        </div>
    );
}
