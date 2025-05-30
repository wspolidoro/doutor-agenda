import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/page-container";
import { AddPatientButton } from "./_components/add-patient-button";
import { PatientsList } from "./_components/patients-list";
import { DataTable } from "@/components/ui/data-table";
import { patientsTableColumns } from "./_components/table-columns";
import { getPatients } from "@/actions/get-patients";

export default async function PatientsPage() {
  const patients = await getPatients();
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        {/* <PatientsList /> */}
        <DataTable data={patients} columns={patientsTableColumns} />
      </PageContent>
    </PageContainer>
  );
}
