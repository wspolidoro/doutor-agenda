import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertPatientSchema } from "@/actions/upsert-patient/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { upsertPatient } from "@/actions/upsert-patient";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatternFormat } from "react-number-format";

type FormData = z.infer<typeof upsertPatientSchema>;

interface UpsertPatientFormProps {
  defaultValues?: Partial<FormData>;
  onSuccess?: () => void;
}

export function UpsertPatientForm({
  defaultValues,
  onSuccess,
}: UpsertPatientFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(upsertPatientSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phoneNumber: "",
      sex: undefined,
    },
  });

  const { execute, status } = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(
        defaultValues?.id
          ? "Paciente atualizado com sucesso!"
          : "Paciente cadastrado com sucesso!",
      );
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.serverError || "Erro ao salvar paciente");
    },
  });

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite o email do paciente"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <PatternFormat
                  format="(##) #####-####"
                  customInput={Input}
                  placeholder="Digite o telefone do paciente"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={status === "executing"}
        >
          {status === "executing"
            ? "Salvando..."
            : defaultValues?.id
              ? "Atualizar"
              : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}
