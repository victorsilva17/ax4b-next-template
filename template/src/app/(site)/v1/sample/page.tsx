"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { deleteSample, getAllSample } from "@/core/handlers/sample";
import { requestingSampleType } from "@/core/models/sample/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ZodError } from "zod";
import { selectedSampleRowAtom, actionToPerformAtom } from "./atoms";
import { getColumns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { LoaderCircle } from "lucide-react";

export default function Sample() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery<requestingSampleType[]>({
    queryKey: ["samples"],
    queryFn: getAllSample,
    enabled: false,
  });

  useEffect(() => {
    if (data) return;

    refetch();
  }, [data, refetch]);

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedRow, setSelectedRow] = useAtom(selectedSampleRowAtom);
  const [_, setActionToPerform] = useAtom(actionToPerformAtom);

  const deleteSampleMutation = useMutation({
    mutationFn: deleteSample,
    onSuccess: (id: string) => {
      if (id) {
        queryClient.setQueryData(
          ["samples"],
          (oldData: requestingSampleType[]) =>
            oldData.filter((data) => data.id !== id),
        );

        toast({
          title: "Exclusão de sample",
          description: "Sample deletado com sucesso!",
        });

        handleCloseConfirmDialog();
      }
    },
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: "Erro ao excluir um sample",
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });

      handleCloseConfirmDialog();
    },
  });

  const handleDeletion = async () => {
    if (selectedRow?.id) {
      deleteSampleMutation.mutate(selectedRow.id);
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmationDialogOpen(false);
    setSelectedRow(null);
    setActionToPerform(null);
  };

  const onEdit = (sample: requestingSampleType) => {
    setSelectedRow(sample);
    setActionToPerform("EDIT");
  };

  const onDelete = (sample: requestingSampleType) => {
    setSelectedRow(sample);
    setIsConfirmationDialogOpen(true);
    setActionToPerform("DELETE");
  };

  return (
    <div className="w-full h-full">
      {/* Data Table */}
      <DataTable
        isLoading={isLoading}
        columns={getColumns({
          onEdit,
          onDelete,
        })}
        data={data ?? []}
      />

      <Dialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deleção de registro.</DialogTitle>
            {deleteSampleMutation.isPending ? (
              <DialogDescription className="mt-6 flex flex-col items-center justify-center gap-4">
                <LoaderCircle size={36} className="animate-spin" />
                Registro {selectedRow?.product} está sendo deletado...
              </DialogDescription>
            ) : (
              <DialogDescription className="mt-6">
                Tem certeza que deseja deletar o registro de produto{" "}
                {selectedRow?.product}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="w-full flex items-center justify-end gap-4 mt-4">
            <Button
              onClick={handleCloseConfirmDialog}
              variant="outline"
              disabled={deleteSampleMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeletion}
              variant="destructive"
              className="text-white"
              disabled={deleteSampleMutation.isPending}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
