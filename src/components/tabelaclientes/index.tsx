import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import axios from "axios"
import useIntegrador from "@/hooks/use-integrador"
import ResetSenha from "../resetsenha"
import EditarCliente from "../editarcliente"
import ReintegrarCliente from "../reintegrarcliente"
import { Loading } from "../loading"

export const columns = [
  {
    accessorKey: "nome",
    id: "nome", // Adicionando explicitamente o ID para garantir a identificação correta
    header: "Nome",
    cell: ({ row }: any) => (
      <div className="capitalize">{row.getValue("nome")}</div>
    ),
  },
  {
    accessorKey: "email",
    id: "email", // Adicionando explicitamente o ID para garantir a identificação correta
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: any) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "ole_contract_number",
    id: "ole_contract_number", // Adicionando explicitamente o ID
    header: () => <div className="text-right">Contratos</div>,
    cell: ({ row }: any) => {
      const contrato = row.getValue("ole_contract_number")
      return <div className="text-right font-medium">{contrato}</div>
    },
  },
  {
    accessorKey: "cpf_cnpj",
    id: "cpf_cnpj", // Adicionando explicitamente o ID
    header: () => <div className="text-right">Documento</div>,
    cell: ({ row }: any) => {
      const cpf_cnpj = row.getValue("cpf_cnpj")
      return <div className="text-right font-medium">{cpf_cnpj}</div>
    },
  },
  {
    accessorKey: "contato",
    id: "contato", // Adicionando explicitamente o ID
    header: () => <div className="text-right">Contato</div>,
    cell: ({ row }: any) => {
      const contato = row.getValue("contato")
      return <div className="text-right font-medium">{contato}</div>
    },
  },
  {
    accessorKey: "endereco_logradouro",
    id: "endereco_logradouro", // Adicionando explicitamente o ID
    header: () => <div className="text-left">Endereço</div>,
    cell: ({ row }: any) => {
      const endereco_logradouro = row.getValue("endereco_logradouro")
      return <div className="text-left font-medium">{endereco_logradouro}</div>
    },
  },
  {
    accessorKey: "endereco_cep",
    id: "endereco_cep", // Adicionando explicitamente o ID
    header: () => <div className="text-left">CEP</div>,
    cell: ({ row }: any) => {
      const endereco_cep = row.getValue("endereco_cep")
      return <div className="text-left font-medium">{endereco_cep}</div>
    },
  },
  {
    id: "actions", // ID explícito para as ações
    enableHiding: false,
    cell: ({ row }: any) => {
      const contrato = row.getValue("ole_contract_number");
      const email = row.getValue("email");
      const nome = row.getValue("nome");
      const rowData = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end"

          onFocus={(e) => e.stopPropagation()}
          onBlur={(e) => e.stopPropagation()}
          
          >
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ResetSenha contratoCliente={contrato} emailCliente={email} />
            <EditarCliente data={rowData}/>
            <ReintegrarCliente nome={nome}/>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TabelaDeClientes() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState<any>("");
  const [loading, setLoading] = React.useState(true); // Estado de carregamento

  const integra: any = useIntegrador()

  React.useEffect(() => {
    async function handleClientes() {
      try {
        const result = await axios.get(
          "https://hub.sysprov.com.br/integraoletv/src/clientes/listarclientes.php",
          { params: { idIntegra: integra() } }
        )
        setData(result.data.data)
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }
    handleClientes()
  }, [integra])

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
      globalFilter, // Adiciona o estado globalFilter aqui
    },
    globalFilterFn: (row: any, columnIds: any, filterValue: any) => {
      return (
        
        row.getValue("nome")?.toLowerCase(columnIds).includes(filterValue.toLowerCase()) ||
        row.getValue("email")?.toLowerCase(columnIds).includes(filterValue.toLowerCase()) ||
        row.getValue("cpf_cnpj")?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  });

  if(loading) {
    return <Loading />
  }

  return (
    <div className="w-full" >
      <div className="flex items-center py-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Pesquisar por nome, email ou cpf_cnpj..."
            value={globalFilter}
            className="w-[380px]"
            onChange={(e) => setGlobalFilter(e.target.value)} // Atualiza o filtro global
          />
        </div>

        <div className="flex items-center justify-end space-x-2 py-4 ml-6">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Página Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima Página
          </Button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
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
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
