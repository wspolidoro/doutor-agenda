"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getPatients() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.clinic?.id) {
    throw new Error("Unauthorized");
  }

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
    orderBy: (patients) => [patients.createdAt],
  });

  return patients;
}
