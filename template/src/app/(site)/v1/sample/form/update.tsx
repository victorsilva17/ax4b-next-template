"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { updateSample } from "@/core/handlers/sample";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SampleGenderEnum } from "@/core/models/sample/create";
import {
  updatingSampleSchema,
  updatingSampleType,
} from "@/core/models/sample/update";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";
import { actionToPerformAtom, selectedSampleRowAtom } from "../atoms";
import { Checkbox } from "@/components/ui/checkbox";

export function UpdatingSampleForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useAtom(selectedSampleRowAtom);
  const [actionToPerform] = useAtom(actionToPerformAtom);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<updatingSampleType>({
    resolver: zodResolver(updatingSampleSchema),
    defaultValues: {
      id: "",
      product: "",
      contact_support: "",
      amount: 0,
      secret_key: "",
      gender: SampleGenderEnum.MALE,
      validDate: new Date(),
      isAvailable: true,
      price: "",
      preferences: ["cookies"],
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
      console.log(selectedRow.validDate);
      form.setValue("id", selectedRow.id);
      form.setValue("product", selectedRow.product);
      form.setValue("contact_support", selectedRow.contact_support);
      form.setValue("secret_key", selectedRow.secret_key);
      form.setValue("amount", selectedRow.amount);

      form.setValue("gender", selectedRow.gender as SampleGenderEnum);
      form.setValue("validDate", new Date(selectedRow.validDate));
      form.setValue(
        "price",
        Intl.NumberFormat("pt-BR", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(selectedRow.price.toString() ?? 0) / 100),
      );
      form.setValue("isAvailable", selectedRow.isAvailable);
      form.setValue("preferences", selectedRow.preferences);

      handleFormOpen();
    }
  }, [form, actionToPerform, selectedRow]);

  const mutation = useMutation({
    mutationFn: updateSample,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["samples"] });
      toast({
        title: "Edição de um Sample",
        description: "Sample editado com sucesso!",
      });
      handleFormClose();
    },
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: `Erro ao editar um Sample`,
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
          <DialogTitle>Formulário - Edição de Sample</DialogTitle>
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
              name="product"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o nome do produto"
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
              name="amount"
              render={({ field: { value, onChange }, ...field }) => {
                return (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Insira a quantidade"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
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
              name="contact_support"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="contact_support"
                        placeholder="Insira o contato de suporte"
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
              name="secret_key"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Chave Secreta</FormLabel>
                    <FormControl>
                      <Input
                        type="secret_key"
                        placeholder="Insira a chave"
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
              name="price"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          R$
                        </span>
                        <Input
                          type="text"
                          placeholder="Insira o valor"
                          {...field}
                          className="pl-10" // Adjust padding to make space for the prefix
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, "");
                            value = new Intl.NumberFormat("pt-BR", {
                              style: "decimal",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(parseFloat(value ?? 0) / 100);
                            field.onChange(value ?? 0);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="isAvailable"
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
              name="validDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de validade</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="p-2"
                          value={SampleGenderEnum.MALE}
                        >
                          Masculino
                        </SelectItem>
                        <SelectItem
                          className="p-2"
                          value={SampleGenderEnum.FEMALE}
                        >
                          Feminino
                        </SelectItem>
                        <SelectItem
                          className="p-2"
                          value={SampleGenderEnum.OTHER}
                        >
                          Outro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferências</FormLabel>
                  <div className="flex flex-col gap-2">
                    {["news", "cookies", "telemetring"].map((preference) => (
                      <div key={preference} className="flex items-center gap-2">
                        <Checkbox
                          value={preference}
                          checked={field.value.includes(preference)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...field.value, preference]
                              : field.value.filter(
                                  (item) => item !== preference,
                                );
                            field.onChange(newValue);
                          }}
                        />
                        <label>{preference}</label>
                      </div>
                    ))}
                  </div>
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
