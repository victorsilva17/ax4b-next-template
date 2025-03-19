"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserHandler } from "@/core/handlers/users";
import {
  updateUserSchema,
  updateUserSchemaType,
} from "@/core/models/user/update";
import { UserRoleEnum } from "@/core/models/user/userRole.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";
import { actionToPerformAtom, selectedUserRowAtom } from "../atoms";

export function UpdatingUserForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useAtom(selectedUserRowAtom);
  const [actionToPerform] = useAtom(actionToPerformAtom);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<updateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      role: UserRoleEnum.admin,
      active: true,
    },
  });

  const handleFormOpen = () => setIsFormOpen(true);
  const handleFormClose = () => {
    form.reset();
    setSelectedRow(null);
    setIsFormOpen(false);
  };

  useEffect(() => {
    if (selectedRow && actionToPerform === "EDIT") {
      form.setValue("id", selectedRow.id);
      form.setValue("name", selectedRow.name);
      form.setValue("email", selectedRow.email);
      form.setValue("active", selectedRow.active);
      form.setValue("role", selectedRow.role as UserRoleEnum);

      handleFormOpen();
    }
  }, [form, actionToPerform, selectedRow]);

  const mutation = useMutation({
    mutationFn: updateUserHandler,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["users"] });
      toast({
        title: "Edição de um Usuário",
        description: "Usuário editado com sucesso!",
      });
      handleFormClose();
    },
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: `Erro ao editar um Usuário`,
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} modal={true}>
      <DialogContent
        className="w-full max-w-[500px]  max-h-[95dvh] overflow-y-auto shadow-xl backdrop-blur-3xl "
        onCloseAutoFocus={handleFormClose}
      >
        <DialogHeader className="flex flex-row  items-center justify-between gap-2">
          <DialogTitle>Formulário - Edição de Usuário</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="relative flex flex-col items-stretch justify-start gap-4"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o nome do usuário"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="contact_support"
                        placeholder="Insira o e-mail"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-start justify-start gap-2 mt-2">
                  <FormLabel>Disponível</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={UserRoleEnum[field.value]}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="p-2" value={UserRoleEnum.admin}>
                        Admnistrador
                      </SelectItem>
                      <SelectItem className="p-2" value={UserRoleEnum.viewer}>
                        Visualizador
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              Atualizar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
