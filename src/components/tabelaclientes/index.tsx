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
  ColumnDef,
  Row,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react"

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

import useIntegrador from "@/hooks/use-integrador"
import ResetSenha from "../resetsenha"
import EditarCliente from "../editarcliente"
import ReintegrarCliente from "../reintegrarcliente"
import { Loading } from "../loading"
import api from "@/services/api"

// Definindo tipos para melhor type safety
interface Cliente {
  nome: string
  email: string
  ole_contract_number: string
  cpf_cnpj: string
  contato: string
  endereco_logradouro: string
  endereco_cep: string
}

// Componente para célula de ações (memoizado para performance)
const ActionsCell = React.memo(
  ({ row, refetch }: { row: any; refetch: () => void }) => {
    const contrato: any = row.getValue("ole_contract_number")
    const email: any = row.getValue("email")
    const nome: any = row.getValue("nome")
    const rowData: any = row.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onFocus={(e) => e.stopPropagation()}
          onBlur={(e) => e.stopPropagation()}
        >
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ResetSenha contratoCliente={contrato} emailCliente={email} />
          <EditarCliente data={rowData} listarClientes={refetch} />
          <ReintegrarCliente nome={nome} />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ActionsCell.displayName = "ActionsCell"

// 🔁 Gera colunas com base no refetch
const getColumns = (refetch: () => void): ColumnDef<Cliente>[] => [
  {
    accessorKey: "nome",
    id: "nome",
    header: "Nome",
    cell: ({ row }) => (
      <div className="capitalize font-medium">{row.getValue("nome")}</div>
    ),
  },
  {
    accessorKey: "email",
    id: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase text-blue-600 hover:text-blue-800">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "ole_contract_number",
    id: "ole_contract_number",
    header: () => <div className="text-right font-semibold">Contratos</div>,
    cell: ({ row }: any) => {
      const contrato: any = row.getValue("ole_contract_number")
      return (
        <div className="text-right font-mono font-medium bg-gray-50 px-2 py-1 rounded">
          {contrato}
        </div>
      )
    },
  },
  {
    accessorKey: "cpf_cnpj",
    id: "cpf_cnpj",
    header: () => <div className="text-right font-semibold">Documento</div>,
    cell: ({ row }) => {
      const cpf_cnpj: any = row.getValue("cpf_cnpj")
      return <div className="text-right font-mono">{cpf_cnpj}</div>
    },
  },
  {
    accessorKey: "contato",
    id: "contato",
    header: () => <div className="text-right font-semibold">Contato</div>,
    cell: ({ row }) => {
      const contato: any = row.getValue("contato")
      return <div className="text-right">{contato}</div>
    },
  },
  {
    accessorKey: "endereco_logradouro",
    id: "endereco_logradouro",
    header: () => <div className="text-left font-semibold">Endereço</div>,
    cell: ({ row }) => {
      const endereco: any = row.getValue("endereco_logradouro")
      return (
        <div className="text-left max-w-[200px] truncate" title={endereco as any}>
          {endereco}
        </div>
      )
    },
  },
  {
    accessorKey: "endereco_cep",
    id: "endereco_cep",
    header: () => <div className="text-left font-semibold">CEP</div>,
    cell: ({ row }) => {
      const cep: any = row.getValue("endereco_cep")
      return <div className="text-left font-mono">{cep}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center font-semibold">Ações</div>,
    cell: ({ row }) => <ActionsCell row={row} refetch={refetch} />,
  },
]

// Hook customizado para buscar clientes
const useClientes = () => {
  const [data, setData] = React.useState<Cliente[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const integrador: any = useIntegrador()

  const fetchClientes = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await api.get(
        "/src/clientes/listarclientes.php",
        { 
          params: { idIntegra: integrador },
        }
      )

      setData(result.data.data || [])
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      setError("Erro ao carregar clientes. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }, [integrador])

  React.useEffect(() => {
    if (integrador) {
      fetchClientes()
    }
  }, [fetchClientes, integrador])

  return { data, loading, error, refetch: fetchClientes }
}

// Função de filtro global corrigida
const globalFilterFn = (row: Row<Cliente>, _columnId: string, filterValue: string): boolean => {
  if (!filterValue) return true
  
  const searchValue = filterValue.toLowerCase().trim()
  
  if (!searchValue) return true
  
  // Lista dos campos que queremos buscar
  const searchableFields = [
    row.getValue("nome"),
    row.getValue("email"),
    row.getValue("cpf_cnpj"),
    row.getValue("ole_contract_number"),
    row.getValue("contato"),
    row.getValue("endereco_logradouro"),
    row.getValue("endereco_cep")
  ]

  // Verifica se algum campo contém o valor de busca
  return searchableFields.some(field => {
    if (field == null) return false
    return String(field).toLowerCase().includes(searchValue)
  })
}

export function TabelaDeClientes() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const { data, loading, error, refetch } = useClientes()
  const columns = React.useMemo(() => getColumns(refetch), [refetch])

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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Reset da paginação quando o filtro global mudar
  React.useEffect(() => {
    if (table) {
      table.setPageIndex(0)
    }
  }, [globalFilter])

  // Estados derivados para melhor performance
  const pageInfo = React.useMemo(() => {
    const state = table.getState()
    const pageIndex = state.pagination.pageIndex
    const pageSize = state.pagination.pageSize
    const totalRows = table.getFilteredRowModel().rows.length
    const totalPages = totalRows > 0 ? Math.ceil(totalRows / pageSize) : 1
    
    return {
      currentPage: pageIndex + 1,
      totalPages,
      totalRows,
      pageSize,
      startIndex: totalRows > 0 ? pageIndex * pageSize + 1 : 0,
      endIndex: Math.min((pageIndex + 1) * pageSize, totalRows),
      canPreviousPage: pageIndex > 0,
      canNextPage: pageIndex < totalPages - 1,
    }
  }, [table.getState().pagination, table.getFilteredRowModel().rows.length])

  const visibleColumns = React.useMemo(() => 
    table.getAllColumns().filter((column) => column.getCanHide()),
    [table]
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-red-600 text-center">{error}</p>
        <Button onClick={refetch} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar por nome, email, documento ou contrato..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Colunas Visíveis</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {visibleColumns.map((column: any) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id === "ole_contract_number" ? "Contratos" :
                   column.id === "cpf_cnpj" ? "Documento" :
                   column.id === "endereco_logradouro" ? "Endereço" :
                   column.id === "endereco_cep" ? "CEP" :
                   column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <p>
                      {globalFilter 
                        ? `Nenhum cliente encontrado para "${globalFilter}"` 
                        : "Nenhum cliente encontrado"
                      }
                    </p>
                    {globalFilter && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setGlobalFilter("")}
                      >
                        Limpar filtro
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-sm text-gray-600">
          {pageInfo.totalRows > 0 ? (
            <span>
              Mostrando {pageInfo.startIndex} a {pageInfo.endIndex} de {pageInfo.totalRows} cliente(s)
              {globalFilter && ` (filtrado de ${data.length} total)`}
            </span>
          ) : (
            <span>Nenhum cliente encontrado</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!pageInfo.canPreviousPage}
          >
            Anterior
          </Button>
          
          <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
            {pageInfo.currentPage} de {pageInfo.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!pageInfo.canNextPage}>
              proxima
          </Button>
        </div>
      </div>
    </div>
  )
}