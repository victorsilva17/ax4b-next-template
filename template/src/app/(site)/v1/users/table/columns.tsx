"use client";

import { requestingSampleType } from "@/core/models/sample/request";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableFilterRows } from "@/components/custom/DataTable/filterRows";
import {
  numberFilterFn,
  stringFilterFn,
} from "@/components/custom/DataTable/functions";
import { DataTableSortColumn } from "@/components/custom/DataTable/sortColumns";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { responseUserSchemaType } from "@/core/models/user/request";

interface GetColumnsProps {
  onEdit: (sample: responseUserSchemaType) => void;
  onDelete: (sample: responseUserSchemaType) => void;
}

const enumTranslation = {
  admin: "Admnistrador",
  viewer: "Visualizador",
};

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select tudo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="E-mail" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "E-mail",
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Nome" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Nome",
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Área" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      cell(props) {
        return (
          <Badge variant="outline">
            {enumTranslation[props.getValue() as keyof typeof enumTranslation]}
          </Badge>
        );
      },
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Área",
      },
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Ativo" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      cell(props) {
        return props.getValue() ? (
          <Badge
            variant="outline"
            className="bg-green-500 text-white border-green-700 "
          >
            Sim
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-red-500 text-white border-red-700 "
          >
            Não
          </Badge>
        );
      },
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Ativo",
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="w-full flex justify-start items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                  >
                    <FiEdit3 size={20} className="text-gray-800" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user)}
                  >
                    <MdDelete size={20} className="text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deletar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ] as ColumnDef<responseUserSchemaType>[];
};
