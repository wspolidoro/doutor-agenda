"use client";

import * as React from "react";

import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  availableFromTime?: string;
  availableToTime?: string;
}

const ALL_TIME_SLOTS = [
  { time: "05:00:00", label: "05:00", group: "Manhã" },
  { time: "05:30:00", label: "05:30", group: "Manhã" },
  { time: "06:00:00", label: "06:00", group: "Manhã" },
  { time: "06:30:00", label: "06:30", group: "Manhã" },
  { time: "07:00:00", label: "07:00", group: "Manhã" },
  { time: "07:30:00", label: "07:30", group: "Manhã" },
  { time: "08:00:00", label: "08:00", group: "Manhã" },
  { time: "08:30:00", label: "08:30", group: "Manhã" },
  { time: "09:00:00", label: "09:00", group: "Manhã" },
  { time: "09:30:00", label: "09:30", group: "Manhã" },
  { time: "10:00:00", label: "10:00", group: "Manhã" },
  { time: "10:30:00", label: "10:30", group: "Manhã" },
  { time: "11:00:00", label: "11:00", group: "Manhã" },
  { time: "11:30:00", label: "11:30", group: "Manhã" },
  { time: "12:00:00", label: "12:00", group: "Manhã" },
  { time: "12:30:00", label: "12:30", group: "Manhã" },
  { time: "13:00:00", label: "13:00", group: "Tarde" },
  { time: "13:30:00", label: "13:30", group: "Tarde" },
  { time: "14:00:00", label: "14:00", group: "Tarde" },
  { time: "14:30:00", label: "14:30", group: "Tarde" },
  { time: "15:00:00", label: "15:00", group: "Tarde" },
  { time: "15:30:00", label: "15:30", group: "Tarde" },
  { time: "16:00:00", label: "16:00", group: "Tarde" },
  { time: "16:30:00", label: "16:30", group: "Tarde" },
  { time: "17:00:00", label: "17:00", group: "Tarde" },
  { time: "17:30:00", label: "17:30", group: "Tarde" },
  { time: "18:00:00", label: "18:00", group: "Tarde" },
  { time: "18:30:00", label: "18:30", group: "Tarde" },
  { time: "19:00:00", label: "19:00", group: "Noite" },
  { time: "19:30:00", label: "19:30", group: "Noite" },
  { time: "20:00:00", label: "20:00", group: "Noite" },
  { time: "20:30:00", label: "20:30", group: "Noite" },
  { time: "21:00:00", label: "21:00", group: "Noite" },
  { time: "21:30:00", label: "21:30", group: "Noite" },
  { time: "22:00:00", label: "22:00", group: "Noite" },
  { time: "22:30:00", label: "22:30", group: "Noite" },
  { time: "23:00:00", label: "23:00", group: "Noite" },
  { time: "23:30:00", label: "23:30", group: "Noite" },
];

function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function TimePicker({
  onValueChange,
  defaultValue,
  disabled,
  availableFromTime,
  availableToTime,
}: TimePickerProps) {
  const availableTimeSlots = React.useMemo(() => {
    if (!availableFromTime || !availableToTime) return ALL_TIME_SLOTS;

    const fromMinutes = parseTime(availableFromTime);
    const toMinutes = parseTime(availableToTime);

    return ALL_TIME_SLOTS.filter((slot) => {
      const slotMinutes = parseTime(slot.time);
      return slotMinutes >= fromMinutes && slotMinutes <= toMinutes;
    });
  }, [availableFromTime, availableToTime]);

  const timeSlotsByGroup = React.useMemo(() => {
    return availableTimeSlots.reduce(
      (acc, slot) => {
        if (!acc[slot.group]) {
          acc[slot.group] = [];
        }
        acc[slot.group].push(slot);
        return acc;
      },
      {} as Record<string, typeof ALL_TIME_SLOTS>,
    );
  }, [availableTimeSlots]);

  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      disabled={disabled}
    >
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um horário" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {Object.entries(timeSlotsByGroup).map(([group, slots]) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {slots.map((slot) => (
              <SelectItem key={slot.time} value={slot.time}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
