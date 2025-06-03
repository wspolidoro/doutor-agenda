"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { getAvailableTimes } from "@/actions/get-available-times";
import { upsertAppointment } from "@/actions/upsert-appointment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable, patientsTable } from "@/db/schema";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  patientId: z.string().uuid({
    message: "Selecione um paciente",
  }),
  doctorId: z.string().uuid({
    message: "Selecione um médico",
  }),
  appointmentPriceInCents: z.number().min(1, {
    message: "Valor da consulta é obrigatório",
  }),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string().min(1, {
    message: "Selecione um horário",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface CreateAppointmentFormProps {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
  onSuccess?: () => void;
}

export function CreateAppointmentForm({
  doctors,
  patients,
  onSuccess,
}: CreateAppointmentFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === form.watch("doctorId"),
  );

  const selectedDate = form.watch("date");

  const { execute: executeGetAvailableTimes, data: availableTimes } =
    useAction(getAvailableTimes);

  useEffect(() => {
    if (selectedDoctor) {
      form.setValue(
        "appointmentPriceInCents",
        selectedDoctor.appointmentPriceInCents / 100,
      );
    }
  }, [selectedDoctor, form]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      executeGetAvailableTimes({
        doctorId: selectedDoctor.id,
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
      });
    }
  }, [selectedDoctor, selectedDate, executeGetAvailableTimes]);

  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success("Agendamento realizado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao realizar agendamento");
    },
  });

  const onSubmit = (data: FormData) => {
    upsertAppointmentAction.execute({
      ...data,
      appointmentPriceInCents: data.appointmentPriceInCents * 100,
    });
  };

  const isDateTimeEnabled = !!selectedDoctor;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>Crie um novo agendamento</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPriceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => field.onChange(value.floatValue)}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$"
                    className="w-full"
                    disabled={!selectedDoctor}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={!isDateTimeEnabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={ptBR}
                      fromDate={new Date()}
                      formatters={{
                        formatCaption: (date) => {
                          return format(date, "MMMM 'de' yyyy", {
                            locale: ptBR,
                          });
                        },
                        formatWeekdayName: (date) => {
                          return format(date, "EEEEEE", {
                            locale: ptBR,
                          }).toUpperCase();
                        },
                      }}
                      ISOWeek
                      disabled={(date) => {
                        // Desabilita finais de semana
                        return date.getDay() === 0 || date.getDay() === 6;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isDateTimeEnabled || !selectedDate}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimes?.data?.map((time) => (
                      <SelectItem
                        key={time.value}
                        value={time.value}
                        disabled={!time.available}
                      >
                        {time.label} {!time.available && "(Indisponível)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={upsertAppointmentAction.isPending}
          >
            {upsertAppointmentAction.isPending ? "Agendando..." : "Agendar"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
