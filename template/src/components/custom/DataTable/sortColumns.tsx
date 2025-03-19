import { LuArrowDownWideNarrow } from "react-icons/lu";
import { LuArrowUpWideNarrow } from "react-icons/lu";
import { RxCaretSort } from "react-icons/rx";
import { FaEyeSlash } from "react-icons/fa";

import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineDisabledByDefault } from "react-icons/md";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableSortColumn<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <LuArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <LuArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <RxCaretSort className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <MdOutlineDisabledByDefault className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Padrão
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <LuArrowUpWideNarrow className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Crescente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <LuArrowDownWideNarrow className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Decrescente
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <FaEyeSlash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Escoder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
