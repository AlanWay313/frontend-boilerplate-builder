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
import { 
  ArrowUpDown, 
  ChevronDown, 
  MoreHorizontal, 
  RotateCw, 
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  CheckCircle,
  X,
  CalendarDays,
  FileText,
  AlertCircle,
  SlidersHorizontal,
  RefreshCw
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

import { Loading } from "../loading";
import api from "@/services/api";
import useIntegrador from "@/hooks/use-integrador";

// Interface para o tipo de log
interface LogData {
  id_cliente: string;
  codeLog: string;
  title: string;
  acao: string;
  created_at: string;
  [key: string]: any;
}

// Interface para filtros de data
interface DateFilters {
  startDate: string;
  endDate: string;
  datePreset: string;
}

// Interface para estatísticas
interface LogStats {
  total: number;
  error: number;
  warning: number;
  success: number;
  info: number;
}

// Modal customizado usando React puro
const CustomModal = ({ 
  isOpen, 
  onClose, 
  children,
  title,
  description,
  maxWidth = "max-w-4xl"
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  maxWidth?: string;
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full max-h-[80vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-600 mt-2">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente Modal de Detalhes
const LogDetailsModal = ({ 
  isOpen, 
  onClose, 
  logData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  logData: LogData | null; 
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  if (!logData) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Log"
      description="Informações completas sobre o registro de log"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <StatusBadge status={logData.codeLog} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Documento</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg bg-gray-100 px-3 py-2 rounded">
                  {logData.id_cliente}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(logData.id_cliente)}
                  className="h-8 w-8 p-0"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Data/Hora</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-lg">{formatDateTime(logData.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Título</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-medium">{logData.title}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Descrição Completa
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(logData.acao)}
                className="h-8 w-8 p-0"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {logData.acao}
              </pre>
            </div>
          </CardContent>
        </Card>

        {Object.keys(logData).filter(key => 
          !['id_cliente', 'codeLog', 'title', 'acao', 'created_at'].includes(key)
        ).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Informações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(logData)
                  .filter(([key]) => !['id_cliente', 'codeLog', 'title', 'acao', 'created_at'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-gray-900 mt-1">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button 
          onClick={() => copyToClipboard(JSON.stringify(logData, null, 2))}
          className="gap-2"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copiar JSON Completo
        </Button>
      </div>
    </CustomModal>
  );
};

// Componente para badge de status melhorado
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'error':
        return { color: 'bg-red-500 hover:bg-red-600', text: 'Error', icon: '🚨' };
      case 'success':
        return { color: 'bg-green-500 hover:bg-green-600', text: 'Success', icon: '✅' };
      case 'warning':
        return { color: 'bg-yellow-500 hover:bg-yellow-600', text: 'Warning', icon: '⚠️' };
      case 'info':
        return { color: 'bg-blue-500 hover:bg-blue-600', text: 'Info', icon: 'ℹ️' };
      default:
        return { color: 'bg-gray-500 hover:bg-gray-600', text: status, icon: '📋' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge className={`${config.color} text-white transition-colors cursor-default`}>
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  );
};

// Componente de estatísticas
const LogStatsCards = ({ stats }: { stats: LogStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-blue-600">Total</p>
              <p className="text-lg font-bold text-blue-700">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-xs font-medium text-red-600">Erros</p>
              <p className="text-lg font-bold text-red-700">{stats.error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <div>
              <p className="text-xs font-medium text-yellow-600">Avisos</p>
              <p className="text-lg font-bold text-yellow-700">{stats.warning}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs font-medium text-green-600">Sucessos</p>
              <p className="text-lg font-bold text-green-700">{stats.success}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            <div>
              <p className="text-xs font-medium text-blue-600">Info</p>
              <p className="text-lg font-bold text-blue-700">{stats.info}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente de filtros avançados
const AdvancedFilters = ({ 
  dateFilters, 
  setDateFilters, 
  globalFilter, 
  setGlobalFilter,
  onClearFilters
}: {
  dateFilters: DateFilters;
  setDateFilters: (filters: DateFilters) => void;
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  onClearFilters: () => void;
}) => {


  const getDatePresets = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastThreeMonths = new Date(today);
    lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);

    // Garantir que estamos usando o timezone local correto
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      today: { start: formatDate(today), end: formatDate(today) },
      yesterday: { start: formatDate(yesterday), end: formatDate(yesterday) },
      lastWeek: { start: formatDate(lastWeek), end: formatDate(today) },
      lastMonth: { start: formatDate(lastMonth), end: formatDate(today) },
      lastThreeMonths: { start: formatDate(lastThreeMonths), end: formatDate(today) },
    };
  };

  const presets = getDatePresets();

  const handlePresetChange = (preset: string) => {
    if (preset === 'custom') {
      setDateFilters({ ...dateFilters, datePreset: preset });
      return;
    }

    if (preset === 'all') {
      setDateFilters({ startDate: '', endDate: '', datePreset: preset });
      return;
    }

    const presetData = presets[preset as keyof typeof presets];
    if (presetData) {
      setDateFilters({
        startDate: presetData.start,
        endDate: presetData.end,
        datePreset: preset
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros Avançados
          {(dateFilters.startDate || dateFilters.endDate || globalFilter) && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {[dateFilters.startDate, dateFilters.endDate, globalFilter].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros Avançados</h4>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Busca Global</Label>
              <Input
                placeholder="Buscar em todos os campos..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Período</Label>
              <Select value={dateFilters.datePreset} onValueChange={handlePresetChange}>
                <SelectTrigger className="mt-1">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="lastWeek">Última semana</SelectItem>
                  <SelectItem value="lastMonth">Último mês</SelectItem>
                  <SelectItem value="lastThreeMonths">Últimos 3 meses</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateFilters.datePreset === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">Data inicial</Label>
                  <Input
                    type="date"
                    value={dateFilters.startDate}
                    onChange={(e) => setDateFilters({ ...dateFilters, startDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Data final</Label>
                  <Input
                    type="date"
                    value={dateFilters.endDate}
                    onChange={(e) => setDateFilters({ ...dateFilters, endDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Componente de paginação personalizada
const TablePagination = ({ table }: { table: any }) => {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-t">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">Itens por página:</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-gray-700">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          de {table.getFilteredRowModel().rows.length} registros
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700">Página</span>
          <strong className="text-sm">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </strong>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export function TabelaLogs() {
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    try {
      const savedSorting = localStorage.getItem("tableSorting");
      return savedSorting ? JSON.parse(savedSorting) : [{ id: "created_at", desc: true }];
    } catch {
      return [{ id: "created_at", desc: true }];
    }
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() => {
    try {
      const savedFilters = localStorage.getItem("tableFilters");
      return savedFilters ? JSON.parse(savedFilters) : [];
    } catch {
      return [];
    }
  });

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    try {
      const savedVisibility = localStorage.getItem("columnVisibility");
      return savedVisibility ? JSON.parse(savedVisibility) : {};
    } catch {
      return {};
    }
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<LogData[]>([]);
  const [filteredData, setFilteredData] = React.useState<LogData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Estados para o modal
  const [selectedLog, setSelectedLog] = React.useState<LogData | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Estados para filtros avançados
  const [dateFilters, setDateFilters] = React.useState<DateFilters>({
    startDate: '',
    endDate: '',
    datePreset: ''
  });
  
  const [globalFilter, setGlobalFilter] = React.useState('');
  
  const integrador: any = useIntegrador();

  // Função para abrir o modal com os detalhes
  const openLogDetails = (logData: LogData) => {
    setSelectedLog(logData);
    setIsModalOpen(true);
  };

  const closeLogDetails = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Função para calcular estatísticas
  const calculateStats = (data: LogData[]): LogStats => {
    return {
      total: data.length,
      error: data.filter(item => item.codeLog.toLowerCase() === 'error').length,
      warning: data.filter(item => item.codeLog.toLowerCase() === 'warning').length,
      success: data.filter(item => item.codeLog.toLowerCase() === 'success').length,
      info: data.filter(item => item.codeLog.toLowerCase() === 'info').length,
    };
  };

  // Função para aplicar filtros
  const applyFilters = React.useCallback((data: LogData[]) => {
    let filtered = [...data];

    // Filtro por data
    if (dateFilters.startDate) {
      filtered = filtered.filter(item => {
        try {
          // Parse da data do item
          const itemDate = new Date(item.created_at);
          
          // Criar data de início forçando timezone local
          const [year, month, day] = dateFilters.startDate.split('-').map(Number);
          const startDate = new Date(year, month - 1, day); // month é 0-indexed
          
          // Verificar se as datas são válidas
          if (isNaN(itemDate.getTime()) || isNaN(startDate.getTime())) {
            return true;
          }
          
          // Comparar apenas ano, mês e dia
          const itemYear = itemDate.getFullYear();
          const itemMonth = itemDate.getMonth();
          const itemDay = itemDate.getDate();
          
          const startYear = startDate.getFullYear();
          const startMonth = startDate.getMonth();
          const startDay = startDate.getDate();
          
          // Criar datas normalizadas para comparação
          const itemDateNorm = new Date(itemYear, itemMonth, itemDay);
          const startDateNorm = new Date(startYear, startMonth, startDay);
          
          return itemDateNorm >= startDateNorm;
        } catch (error) {
          console.warn('Erro ao filtrar data de início:', error);
          return true;
        }
      });
    }

    if (dateFilters.endDate) {
      filtered = filtered.filter(item => {
        try {
          // Parse da data do item
          const itemDate = new Date(item.created_at);
          
          // Criar data de fim forçando timezone local
          const [year, month, day] = dateFilters.endDate.split('-').map(Number);
          const endDate = new Date(year, month - 1, day); // month é 0-indexed
          
          // Verificar se as datas são válidas
          if (isNaN(itemDate.getTime()) || isNaN(endDate.getTime())) {
            return true;
          }
          
          // Comparar apenas ano, mês e dia
          const itemYear = itemDate.getFullYear();
          const itemMonth = itemDate.getMonth();
          const itemDay = itemDate.getDate();
          
          const endYear = endDate.getFullYear();
          const endMonth = endDate.getMonth();
          const endDay = endDate.getDate();
          
          // Criar datas normalizadas para comparação
          const itemDateNorm = new Date(itemYear, itemMonth, itemDay);
          const endDateNorm = new Date(endYear, endMonth, endDay);
          
          return itemDateNorm <= endDateNorm;
        } catch (error) {
          console.warn('Erro ao filtrar data de fim:', error);
          return true;
        }
      });
    }

    // Filtro global
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    return filtered;
  }, [dateFilters, globalFilter]);

  // Aplicar filtros quando os dados ou filtros mudarem
  React.useEffect(() => {
    const filtered = applyFilters(data);
    setFilteredData(filtered);
    
    // Debug para entender o problema das datas
    if (dateFilters.startDate || dateFilters.endDate) {
 
      
      if (dateFilters.startDate) {
        const [year, month, day] = dateFilters.startDate.split('-').map(Number);
        new Date(year, month - 1, day);
       
      }
      
    
      
      if (data.length > 0) {
        const firstItem = data[0];
        new Date(firstItem.created_at);
    
      }
      

    }
  }, [data, applyFilters]);

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setDateFilters({ startDate: '', endDate: '', datePreset: '' });
    setGlobalFilter('');
    setColumnFilters([]);
  };

  // Definição das colunas
  const columns = React.useMemo(() => [
    {
      accessorKey: "id_cliente",
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Documento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded max-w-[120px] truncate">
          {row.getValue("id_cliente")}
        </div>
      ),
    },
    {
      accessorKey: "codeLog",
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => (
        <StatusBadge status={row.getValue("codeLog")} />
      ),
    },
    {
      accessorKey: "title",
      header: () => <div className="text-left font-medium">Título</div>,
      cell: ({ row }: any) => (
        <div className="text-left font-medium max-w-[200px] truncate" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "acao",
      header: () => <div className="text-left font-medium">Descrição</div>,
      cell: ({ row }: any) => (
        <div className="text-left max-w-[250px] truncate text-gray-600" title={row.getValue("acao")}>
          {row.getValue("acao")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => {
        const dateString = row.getValue("created_at");
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-3 w-3" />
            {formatDateTime(dateString)}
          </div>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        const logData = row.original as LogData;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div 
                className="flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer rounded-sm"
                onClick={() => openLogDetails(logData)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalhes
              </div>
              <div className="flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer rounded-sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  async function handleClientes() {
    setRefreshing(true);
    setLoading(true);
    try {
      const result = await api.get(
        "/src/services/LogsDistintosClientes.php",
        { params: { idIntegra: integrador } }
      );
      setData(result.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  React.useEffect(() => {
    handleClientes();
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("tableSorting", JSON.stringify(sorting));
    } catch (error) {
      console.error('Erro ao salvar sorting:', error);
    }
  }, [sorting]);

  React.useEffect(() => {
    try {
      localStorage.setItem("tableFilters", JSON.stringify(columnFilters));
    } catch (error) {
      console.error('Erro ao salvar filters:', error);
    }
  }, [columnFilters]);

  React.useEffect(() => {
    try {
      localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    } catch (error) {
      console.error('Erro ao salvar visibility:', error);
    }
  }, [columnVisibility]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const stats = calculateStats(filteredData);

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <div className="w-full space-y-4">
      {/* Header da página */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            Logs do Sistema
            <Badge variant="outline" className="ml-auto">
              {filteredData.length} registros
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <LogStatsCards stats={stats} />

      {/* Filtros e controles */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filtros principais */}
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Filtrar por documento..."
                  value={(table.getColumn("id_cliente")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("id_cliente")?.setFilterValue(event.target.value)
                  }
                  className="pl-9"
                />
              </div>

              <Select
                onValueChange={(value) => {
                  table.getColumn("codeLog")?.setFilterValue(value === "all" ? undefined : value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="error">🚨 Error</SelectItem>
                  <SelectItem value="warning">⚠️ Warning</SelectItem>
                  <SelectItem value="success">✅ Success</SelectItem>
                  <SelectItem value="info">ℹ️ Info</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Filtrar por título..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>

            {/* Controles da direita */}
            <div className="flex items-center gap-2">
              <AdvancedFilters
                dateFilters={dateFilters}
                setDateFilters={setDateFilters}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onClearFilters={clearAllFilters}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={handleClientes}
                disabled={refreshing}
                className="h-9"
              >
                <RotateCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Atualizando...' : 'Atualizar'}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Eye className="mr-2 h-4 w-4" />
                    Colunas
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Visibilidade das colunas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                        {column.id === "id_cliente" ? "Documento" :
                         column.id === "codeLog" ? "Status" :
                         column.id === "title" ? "Título" :
                         column.id === "acao" ? "Descrição" :
                         column.id === "created_at" ? "Data" : column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Indicadores de filtros ativos */}
          {(dateFilters.startDate || dateFilters.endDate || globalFilter || 
            columnFilters.some(filter => filter.value)) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              
              {dateFilters.startDate && (
                <Badge variant="secondary" className="gap-1">
                  Data início: {(() => {
                    const [year, month, day] = dateFilters.startDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('pt-BR');
                  })()}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setDateFilters({...dateFilters, startDate: ''})}
                  />
                </Badge>
              )}
              
              {dateFilters.endDate && (
                <Badge variant="secondary" className="gap-1">
                  Data fim: {(() => {
                    const [year, month, day] = dateFilters.endDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('pt-BR');
                  })()}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setDateFilters({...dateFilters, endDate: ''})}
                  />
                </Badge>
              )}
              
              {globalFilter && (
                <Badge variant="secondary" className="gap-1">
                  Busca: "{globalFilter}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setGlobalFilter('')}
                  />
                </Badge>
              )}

              {columnFilters.map((filter: any) => (
                <Badge key={filter.id} variant="secondary" className="gap-1">
                  {filter.id === "id_cliente" ? "Documento" :
                   filter.id === "codeLog" ? "Status" :
                   filter.id === "title" ? "Título" : filter.id}: "{filter.value}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => table.getColumn(filter.id)?.setFilterValue(undefined)}
                  />
                </Badge>
              ))}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-6 px-2 text-xs"
              >
                Limpar todos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <div className="rounded-lg border-0 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold text-gray-900">
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
                    className="hover:bg-gray-50 transition-colors"
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
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-gray-300" />
                      <span>Nenhum resultado encontrado</span>
                      {(dateFilters.startDate || dateFilters.endDate || globalFilter || 
                        columnFilters.some(filter => filter.value)) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearAllFilters}
                          className="mt-2"
                        >
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Paginação personalizada */}
          <TablePagination table={table} />
        </div>
      </Card>

      {/* Modal de Detalhes */}
      <LogDetailsModal
        isOpen={isModalOpen}
        onClose={closeLogDetails}
        logData={selectedLog}
      />
    </div>
  );
}