import { sql } from "drizzle-orm";

export async function up(db: any): Promise<void> {
  await db.execute(
    sql`
      ALTER TABLE "appointments"
      ADD COLUMN IF NOT EXISTS "time" text NOT NULL,
      ADD COLUMN IF NOT EXISTS "appointment_price_in_cents" text NOT NULL;
    `,
  );
}

export async function down(db: any): Promise<void> {
  await db.execute(
    sql`
      ALTER TABLE "appointments"
      DROP COLUMN IF EXISTS "time",
      DROP COLUMN IF EXISTS "appointment_price_in_cents";
    `,
  );
}
