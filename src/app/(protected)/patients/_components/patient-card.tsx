"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { patientsTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Mail, Phone, User2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { UpsertPatientForm } from "./upsert-patient-form";

type Patient = InferSelectModel<typeof patientsTable>;

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="bg-primary/10 h-12 w-12 rounded-full p-2">
            <User2 className="text-primary h-full w-full" />
          </div>
          <div className="flex flex-1 flex-col">
            <h3 className="font-semibold">{patient.name}</h3>
            <p className="text-muted-foreground text-sm">
              {patient.sex === "male" ? "Masculino" : "Feminino"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="text-muted-foreground h-4 w-4" />
            <span>{patient.phoneNumber}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar paciente</DialogTitle>
          </DialogHeader>
          <UpsertPatientForm
            defaultValues={patient}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
