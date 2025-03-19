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
import { deleteUserHandler, getAllUsersHandler } from "@/core/handlers/users";
import { responseUserSchemaType } from "@/core/models/user/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ZodError } from "zod";
import { actionToPerformAtom, selectedUserRowAtom } from "./atoms";
import { getColumns } from "./table/columns";
import { DataTable } from "./table/data-table";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery<responseUserSchemaType[]>({
    queryKey: ["users"],
    queryFn: getAllUsersHandler,
    enabled: false,
  });

  useEffect(() => {
    if (data) return;

    refetch();
  }, [data, refetch]);

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedRow, setSelectedRow] = useAtom(selectedUserRowAtom);
  const [_, setActionToPerform] = useAtom(actionToPerformAtom);

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserHandler,
    onSuccess: (id: string) => {
      if (id) {
        queryClient.setQueryData(
          ["users"],
          (oldData: responseUserSchemaType[]) =>
            oldData.filter((data) => data.id !== id),
        );

        toast({
          title: "Exclusão de usuário",
          description: "Usuário deletado com sucesso!",
        });

        handleCloseConfirmDialog();
      }
    },
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: "Erro ao excluir um usuário",
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });

      handleCloseConfirmDialog();
    },
  });

  const handleDeletion = async () => {
    if (selectedRow?.id) {
      deleteUserMutation.mutate(selectedRow);
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmationDialogOpen(false);
    setSelectedRow(null);
    setActionToPerform(null);
  };

  const onEdit = (user: responseUserSchemaType) => {
    setSelectedRow(user);
    setActionToPerform("EDIT");
  };

  const onDelete = (user: responseUserSchemaType) => {
    setSelectedRow(user);
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
            {deleteUserMutation.isPending ? (
              <DialogDescription className="mt-6 flex flex-col items-center justify-center gap-4">
                <LoaderCircle size={36} className="animate-spin" />
                Usuário de e-mail {selectedRow?.email} está sendo deletado...
              </DialogDescription>
            ) : (
              <DialogDescription className="mt-6">
                Tem certeza que deseja deletar o usuário de e-mail{" "}
                {selectedRow?.email}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="w-full flex items-center justify-end gap-4 mt-4">
            <Button
              onClick={handleCloseConfirmDialog}
              variant="outline"
              disabled={deleteUserMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeletion}
              variant="destructive"
              className="text-white"
              disabled={deleteUserMutation.isPending}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
