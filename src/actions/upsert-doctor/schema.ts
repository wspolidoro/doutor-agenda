import { z } from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatório",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório",
    }),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatório",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatório",
    }),
  })
  .refine(
    (data) => {
      if (data.availableFromTime < data.availableToTime) {
        return true;
      }
      return false;
    },
    {
      message: "O horário de início deve ser anterior ao horário de término",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
