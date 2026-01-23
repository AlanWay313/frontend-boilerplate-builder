import * as React from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Activity,
  Clock,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";

interface LogData {
  id_cliente: string;
  codeLog: string;
  title: string;
  acao: string;
  created_at: string;
}

interface ClienteAtividadeRecenteProps {
  cpfCnpj: string;
  integrador: string | number;
}

// Configuração de status
const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'error':
      return { 
        icon: AlertCircle, 
        color: 'text-destructive', 
        bg: 'bg-destructive/10',
        border: 'border-destructive/20',
        label: 'Erro' 
      };
    case 'success':
      return { 
        icon: CheckCircle, 
        color: 'text-success', 
        bg: 'bg-success/10',
        border: 'border-success/20',
        label: 'Sucesso' 
      };
    case 'warning':
      return { 
        icon: AlertTriangle, 
        color: 'text-warning', 
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        label: 'Aviso' 
      };
    case 'info':
      return { 
        icon: Info, 
        color: 'text-primary', 
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        label: 'Info' 
      };
    default:
      return { 
        icon: Activity, 
        color: 'text-muted-foreground', 
        bg: 'bg-secondary',
        border: 'border-border',
        label: status 
      };
  }
};

// Formatar tempo relativo
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });
};

// Formatar data/hora completa
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Skeleton de loading
function AtividadeSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Item da timeline
const TimelineItem = React.memo(({ log }: { log: LogData }) => {
  const config = getStatusConfig(log.codeLog);
  const Icon = config.icon;

  return (
    <div className="group flex gap-4 py-3 px-3 -mx-3 rounded-xl hover:bg-muted/30 transition-colors">
      {/* Ícone */}
      <div className={`shrink-0 p-2.5 rounded-full ${config.bg} ${config.border} border`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate">
              {log.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {log.acao}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <Badge variant="outline" className={`${config.bg} ${config.color} ${config.border} text-xs`}>
              {config.label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-end">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(log.created_at)}
            </p>
          </div>
        </div>
        
        {/* Tooltip com data/hora completa */}
        <p className="text-xs text-muted-foreground/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {formatDateTime(log.created_at)}
        </p>
      </div>
    </div>
  );
});

TimelineItem.displayName = 'TimelineItem';

export function ClienteAtividadeRecente({ cpfCnpj, integrador }: ClienteAtividadeRecenteProps) {
  const navigate = useNavigate();
  const [logs, setLogs] = React.useState<LogData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      if (!integrador || !cpfCnpj) return;
      
      setIsLoading(true);
      try {
        const result = await api.get("/src/services/LogsDistintosClientes.php", {
          params: { idIntegra: integrador }
        });
        
        const allLogs: LogData[] = result.data.data || [];
        
        // Filtrar logs do cliente (por CPF/CNPJ)
        const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');
        const clienteLogs = allLogs
          .filter((log) => {
            const logDoc = log.id_cliente?.replace(/\D/g, '') || '';
            return logDoc === cleanCpfCnpj;
          })
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10); // Últimos 10 logs
        
        setLogs(clienteLogs);
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [integrador, cpfCnpj]);

  const handleVerTodos = () => {
    navigate(`/logs?search=${cpfCnpj}`);
  };

  // Contadores de status
  const statusCounts = React.useMemo(() => {
    return logs.reduce((acc, log) => {
      const status = log.codeLog?.toLowerCase() || 'info';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [logs]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            Atividade Recente
          </CardTitle>
          
          {!isLoading && logs.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-xs"
              onClick={handleVerTodos}
            >
              Ver todos
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        {/* Resumo de status */}
        {!isLoading && logs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = getStatusConfig(status);
              return (
                <Badge 
                  key={status} 
                  variant="outline" 
                  className={`${config.bg} ${config.color} ${config.border} gap-1`}
                >
                  {count} {config.label.toLowerCase()}
                </Badge>
              );
            })}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <AtividadeSkeleton />
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-muted/30 rounded-full mb-3">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma atividade registrada
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Os eventos do cliente aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="space-y-1 divide-y divide-border/50">
            {logs.map((log, index) => (
              <TimelineItem key={`${log.id_cliente}-${log.created_at}-${index}`} log={log} />
            ))}
          </div>
        )}
        
        {/* Footer com link */}
        {!isLoading && logs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleVerTodos}
            >
              <ExternalLink className="h-4 w-4" />
              Ver histórico completo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
