import { getPatients } from "@/actions/get-patients";

import PatientCard from "./patient-card";

export async function PatientsList() {
  const patients = await getPatients();

  if (patients.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed">
        <h3 className="font-semibold">Nenhum paciente cadastrado</h3>
        <p className="text-muted-foreground text-sm">
          Clique no botão acima para cadastrar um paciente
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}
