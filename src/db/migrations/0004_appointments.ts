import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull(),
  doctorId: uuid("doctor_id").notNull(),
  patientId: uuid("patient_id").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  appointmentPriceInCents: text("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export async function up(db: any): Promise<void> {
  await db.schema.createTable(appointments).execute();

  await db.execute(
    sql`
      ALTER TABLE "appointments"
      ADD CONSTRAINT "appointments_clinic_id_clinics_id_fk"
      FOREIGN KEY ("clinic_id")
      REFERENCES "clinics"("id")
      ON DELETE CASCADE;

      ALTER TABLE "appointments"
      ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk"
      FOREIGN KEY ("doctor_id")
      REFERENCES "doctors"("id")
      ON DELETE CASCADE;

      ALTER TABLE "appointments"
      ADD CONSTRAINT "appointments_patient_id_patients_id_fk"
      FOREIGN KEY ("patient_id")
      REFERENCES "patients"("id")
      ON DELETE CASCADE;
    `,
  );
}

export async function down(db: any): Promise<void> {
  await db.schema.dropTable(appointments).execute();
}
