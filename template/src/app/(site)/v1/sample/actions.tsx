"use client";

import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import { RxReload } from "react-icons/rx";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import { filterOptions } from "@/components/custom/DataTable/filterRows";
import { DataTableViewColumn } from "@/components/custom/DataTable/viewColumns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { deleteAllSample } from "@/core/handlers/sample";
import { requestingSampleType } from "@/core/models/sample/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { RiSearch2Line } from "react-icons/ri";
import { ZodError } from "zod";
import { CreatingSampleForm } from "./form/create";
import { UpdatingSampleForm } from "./form/update";

interface HeaderActionsProps<TData> {
  table: Table<TData>;
}

export function HeaderActions<TData>({ table }: HeaderActionsProps<TData>) {
  const queryClient = useQueryClient();
  const [isReloading, setIsReloading] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  const selectedRows = table.getSelectedRowModel().rows;

  const mutation = useMutation({
    mutationFn: deleteAllSample,
    onSuccess: (ids) => {
      if (ids?.length) {
        queryClient.setQueryData(
          ["samples"],
          (oldData: requestingSampleType[]) =>
            oldData.filter((data) => !ids?.includes(data.id)),
        );
        table.resetRowSelection();
        toast({
          title: "Exclusão de Samples",
          description: "Samples deletados com sucesso!",
        });
      }
    },
    onMutate: () => handleCloseConfirmDialog(),
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: "Erro ao deletar vários samples",
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  const handleOpenConfirmDialog = () => {
    setIsConfirmationDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleDeletion = () => {
    const ids = selectedRows.map(
      ({ original }) => (original as requestingSampleType).id,
    );

    mutation.mutate(ids);
  };

  return (
    <header className="w-full bg-white sticky top-0 left-0 right-0 z-10 border-b-2 flex flex-row gap-4 items-center justify-start p-2">
      {/* Creation Form */}
      <CreatingSampleForm />

      {/* Edition Form */}
      <UpdatingSampleForm />

      {/* Deletion Confirm Dialog  */}
      <Dialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="px-2 flex gap-2 items-center"
            onClick={handleOpenConfirmDialog}
            disabled={selectedRows?.length == 0}
          >
            <MdDelete size={20} />
            <span>Deletar</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Deleção de {selectedRows?.length ?? 0} registros.
            </DialogTitle>
            <DialogDescription className="mt-6">
              <span>
                {selectedRows?.length ?? 0} registros foram selecionadas! Tem
                certeza que deseja deletar os registros selecionados?
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex items-center justify-end gap-4 mt-4">
            <Button onClick={handleCloseConfirmDialog} variant="outline">
              Cancelar
            </Button>
            <Button
              onClick={handleDeletion}
              variant="destructive"
              className="text-white"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refetch Button */}
      <Separator orientation="vertical" className="h-6" />
      <Button
        disabled={isReloading}
        onClick={async () => {
          setIsReloading(true);
          await queryClient.resetQueries({ queryKey: ["samples"] });
          setIsReloading(false);
        }}
        variant="ghost"
        className="px-2 flex gap-2 items-center"
      >
        <RxReload size={20} className={isReloading ? "animate-spin" : ""} />
        <span>Recarregar</span>
      </Button>
      <DataTableViewColumn table={table} />
      <div className="flex flex-row items-center justify-center relative gap-4 max-w-[400px] w-full min-w-[300px]">
        <div className="p-2 absolute top-[50%] left-1 rounded-none translate-y-[-50%]">
          <RiSearch2Line size={20} className="text-gray-900" />
        </div>
        <Input
          value={
            ((table.getColumn("product")?.getFilterValue() as any)
              ?.value as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("product")?.setFilterValue({
              filterType: filterOptions.equal,
              value: event.target.value,
            })
          }
          className="w-full border-0 border-b-[1px] focus-visible:ring-0 ring-0 rounded-none text-gray-800 pl-12"
          type="text"
          name="sample-search-filter"
          id="sample-search-filter"
          placeholder="Filtrar"
        />
      </div>
    </header>
  );
}
