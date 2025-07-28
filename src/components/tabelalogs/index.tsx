import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import useIntegrador from "@/hooks/use-integrador";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loading } from "../loading";

export const columns = [
  {
    accessorKey: "id_cliente",
    header: "Documento",
    cell: ({ row }: any) => (
      <div className="capitalize w-28">{row.getValue("id_cliente")}</div>
    ),
  },
  {
    accessorKey: "codeLog",
    header: ({ column }: any) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Cod
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: any) => (
      <div
        className={`${
          row.getValue("codeLog") === "error"
            ? "bg-red-700 text-white rounded text-center"
            : row.getValue("codeLog") === "success"
            ? "bg-green-600 text-white rounded text-center"
            : row.getValue("codeLog") === "warning"
            ? "bg-yellow-600 text-white rounded text-center"
            : row.getValue("codeLog") === "info"
            ? "bg-yellow-800 text-white rounded text-center"
            : ""
        } lowercase`}
      >
        {row.getValue("codeLog")}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left">Título</div>,
    cell: ({ row }: any) => (
      <div className="text-left font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "acao",
    header: () => <div className="max-w-[120px] text-left">Descrição</div>,
    cell: ({ row }: any) => (
      <div className="text-left font-medium">{row.getValue("acao")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }: any) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: any) => {
      const date: any = row.getValue("created_at");
      return (
        <div className="text-left font-medium">{date}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function TabelaLogs() {
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const savedSorting = localStorage.getItem("tableSorting");
    return savedSorting ? JSON.parse(savedSorting) : [];
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() => {
    const savedFilters = localStorage.getItem("tableFilters");
    return savedFilters ? JSON.parse(savedFilters) : [];
  });

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    return savedVisibility ? JSON.parse(savedVisibility) : {};
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const integra: any = useIntegrador();
  async function handleClientes() {

    setLoading(true)
    try {
      const result = await axios.get(
        "https://hub.sysprov.com.br/integraoletv/src/services/LogsDistintosClientes.php",
        { params: { idIntegra: integra() } }
      );
      setData(result.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    handleClientes();
  }, []);

  React.useEffect(() => {
    localStorage.setItem("tableSorting", JSON.stringify(sorting));
  }, [sorting]);

  React.useEffect(() => {
    localStorage.setItem("tableFilters", JSON.stringify(columnFilters));
  }, [columnFilters]);

  React.useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filtrar documento..."
            value={(table.getColumn("id_cliente")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id_cliente")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            onValueChange={(value) => {
              table.getColumn("codeLog")?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <RotateCw size={38} className="cursor-pointer border w-[70px] rounded" onClick={handleClientes} />
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Filtrar por CodLog" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4 ml-6">
          <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Página Anterior
          </Button>
          <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Próxima Página
          </Button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
