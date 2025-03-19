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
import { format } from "date-fns";

interface GetColumnsProps {
  onEdit: (sample: requestingSampleType) => void;
  onDelete: (sample: requestingSampleType) => void;
}

const enumTranslation = {
  MALE: "Homem",
  FEMALE: "Mulher",
  OTHER: "Outro",
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
      accessorKey: "contact_support",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Contato de Suporte" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Contato de Suporte",
      },
    },
    {
      accessorKey: "secret_key",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Chave Secreta" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Chave Secreta",
      },
    },
    {
      accessorKey: "product",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Produto" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Produto",
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Quantidade" />
          <DataTableFilterRows column={column} dataType="number" />
        </div>
      ),
      filterFn: numberFilterFn,
      meta: {
        filter: "number",
        label: "Quantidade",
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Preço" />
          <DataTableFilterRows column={column} dataType="number" />
        </div>
      ),
      cell(props) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(((props.getValue() as number) ?? 0) / 100);
      },
      filterFn: numberFilterFn,
      meta: {
        filter: "number",
        label: "Preço",
      },
    },
    {
      accessorKey: "validDate",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Data Válida" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      cell(props) {
        return format(props.getValue() as Date, "dd/MM/yyyy");
      },
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Data Válida",
      },
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Gênero" />
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
        label: "Gênero",
      },
    },
    {
      accessorKey: "isAvailable",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Disponível" />
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
        label: "Disponível",
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const sample = row.original;

        return (
          <div className="w-full flex justify-start items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(sample)}
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
                    onClick={() => onDelete(sample)}
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
  ] as ColumnDef<requestingSampleType>[];
};
