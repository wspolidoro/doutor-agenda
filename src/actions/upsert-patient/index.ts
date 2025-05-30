"use server";

import { actionClient } from "@/lib/next-safe-action";
import { upsertPatientSchema } from "./schema";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.clinic?.id) {
      throw new Error("Unauthorized");
    }

    const { id, ...rest } = parsedInput;

    if (id) {
      await db
        .update(patientsTable)
        .set({
          ...rest,
          updatedAt: new Date(),
        })
        .where(eq(patientsTable.id, id));
    } else {
      await db.insert(patientsTable).values({
        ...rest,
        clinicId: session.user.clinic.id,
      });
    }

    revalidatePath("/patients");

    return { success: true };
  });
