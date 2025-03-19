"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";

import { createUserHandler } from "@/core/handlers/users";
import {
  createUserSchema,
  createUserSchemaType,
} from "@/core/models/user/create";
import { UserRoleEnum } from "@/core/models/user/userRole.enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { ZodError } from "zod";

export function CreatingUserForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<createUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      active: true,
      role: UserRoleEnum.viewer,
    },
  });

  const handleFormClose = () => {
    form.reset();
    setIsFormOpen(false);
  };

  const mutation = useMutation({
    mutationFn: createUserHandler,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["users"] });
      toast({
        title: "Criação de um usuário",
        description: "Usuário criado com sucesso!",
      });
      handleFormClose();
    },
    onError(error) {
      let errorMessamount = error.message;
      if (error instanceof ZodError) errorMessamount = error.errors[0].message;

      toast({
        title: "Erro ao criar um Usuário",
        description: errorMessamount,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} modal={true}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-2 flex gap-2 items-center">
          <FiPlus size={20} />
          <span>Novo</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-[500px]  max-h-[95dvh] overflow-y-auto shadow-xl backdrop-blur-3xl "
        onCloseAutoFocus={handleFormClose}
      >
        <DialogHeader className="flex flex-row  items-center justify-between gap-2">
          <DialogTitle>Formulário - Criação de Usuário</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="relative flex flex-col items-stretch justify-start gap-4  "
          >
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
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
