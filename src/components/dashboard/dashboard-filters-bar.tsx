import { Filter, X, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DashboardFilters } from "./dashboard-filters-context"

interface DashboardFiltersBarProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
}

const statusOptions = [
  { value: "todos", label: "Todos os Status" },
  { value: "ativos", label: "Ativos" },
  { value: "inativos", label: "Inativos" },
  { value: "cancelados", label: "Cancelados" },
]

const periodoOptions = [
  { value: "todos", label: "Todo o Período" },
  { value: "hoje", label: "Hoje" },
  { value: "7dias", label: "Últimos 7 dias" },
  { value: "30dias", label: "Últimos 30 dias" },
  { value: "90dias", label: "Últimos 90 dias" },
  { value: "ano", label: "Este ano" },
]

export function DashboardFiltersBar({ filters, onFiltersChange }: DashboardFiltersBarProps) {
  const activeFiltersCount = [
    filters.status !== "todos",
    filters.periodo !== "todos",
  ].filter(Boolean).length

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handlePeriodoChange = (value: string) => {
    onFiltersChange({ ...filters, periodo: value })
  }

  const handleClearFilters = () => {
    onFiltersChange({ status: "todos", periodo: "todos" })
  }

  const getStatusLabel = () => {
    return statusOptions.find(opt => opt.value === filters.status)?.label || "Status"
  }

  const getPeriodoLabel = () => {
    return periodoOptions.find(opt => opt.value === filters.periodo)?.label || "Período"
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.status !== "todos" ? "default" : "outline"} 
            size="sm" 
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            {getStatusLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 bg-popover border border-border">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Filtrar por Status
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`cursor-pointer ${filters.status === option.value ? 'bg-primary/10 text-primary' : ''}`}
            >
              {option.label}
              {filters.status === option.value && (
                <span className="ml-auto">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Periodo Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.periodo !== "todos" ? "default" : "outline"} 
            size="sm" 
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            {getPeriodoLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 bg-popover border border-border">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Filtrar por Período
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {periodoOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handlePeriodoChange(option.value)}
              className={`cursor-pointer ${filters.periodo === option.value ? 'bg-primary/10 text-primary' : ''}`}
            >
              {option.label}
              {filters.periodo === option.value && (
                <span className="ml-auto">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Badge */}
      {activeFiltersCount > 0 && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Filter className="h-3 w-3" />
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
