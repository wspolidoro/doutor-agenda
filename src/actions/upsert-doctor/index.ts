"use server";

import { upsertDoctorSchema } from "./schema";
import { doctorsTable } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/db";

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    await db
      .insert(doctorsTable)
      .values({
        id: parsedInput.id,
        clinicId: session?.user.clinic?.id,
        ...parsedInput,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
        },
      });
  });
