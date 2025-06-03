import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { clinicsTable } from "./clinics";
import { doctorsTable } from "./doctors";
import { patientsTable } from "./patients";

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorsTable.id),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientsTable.id),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  appointmentPriceInCents: text("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const appointmentsRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
  }),
);
