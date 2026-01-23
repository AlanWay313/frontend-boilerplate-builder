import { useState, useEffect, useCallback } from 'react'
import { 
  ScrollText, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  Info,
  Loader2,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { adminApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface SystemLog {
  id: string
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  source: string
  message: string
  details?: Record<string, any>
  createdAt: string
}

interface LogStats {
  byLevel: { level: string; count: number }[]
  bySource: { source: string; count: number }[]
  total: number
}

export function Logs() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [stats, setStats] = useState<LogStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string | null>(null)
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    try {
      const params: Record<string, string> = { limit: '100' }
      if (search) params.search = search
      if (levelFilter) params.level = levelFilter
      if (sourceFilter) params.source = sourceFilter

      const [logsRes, statsRes] = await Promise.all([
        adminApi.get('/logs', { params }),
        adminApi.get('/logs/stats'),
      ])

      if (logsRes.data.success) {
        setLogs(logsRes.data.data.logs)
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data)
      }
    } catch (error: any) {
      console.error('Erro ao buscar logs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [search, levelFilter, sourceFilter])

  useEffect(() => {
    fetchLogs()
    // Auto-refresh a cada 30s
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [fetchLogs])

  const handleCleanup = async () => {
    try {
      const response = await adminApi.delete('/logs/cleanup')
      if (response.data.success) {
        toast({
          title: 'Sucesso',
          description: response.data.message,
        })
        fetchLogs()
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao limpar logs',
        variant: 'destructive',
      })
    }
  }

  const getLevelConfig = (level: string) => {
    const config: Record<string, { icon: typeof AlertCircle; color: string; bg: string }> = {
      ERROR: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-500/10 border-red-500/20' },
      WARN: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-500/10 border-amber-500/20' },
      INFO: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-500/10 border-blue-500/20' },
      DEBUG: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-500/10 border-gray-500/20' },
    }
    return config[level] || config.INFO
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  const sources = stats?.bySource.map(s => s.source) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs do Sistema</h1>
          <p className="text-muted-foreground">
            Acompanhe eventos em tempo real
            {stats && ` • ${stats.total} logs no total`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCleanup} size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar antigos
          </Button>
          <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          {['ERROR', 'WARN', 'INFO', 'DEBUG'].map(level => {
            const count = stats.byLevel.find(l => l.level === level)?.count || 0
            const config = getLevelConfig(level)
            const Icon = config.icon
            return (
              <Card key={level} className={cn("cursor-pointer transition-all hover:scale-105", levelFilter === level && "ring-2 ring-primary")} onClick={() => setLevelFilter(levelFilter === level ? null : level)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", config.bg)}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">{level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nos logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {sources.slice(0, 5).map((source) => (
                <Button
                  key={source}
                  variant={sourceFilter === source ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSourceFilter(sourceFilter === source ? null : source)}
                >
                  {source}
                </Button>
              ))}
              {(levelFilter || sourceFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setLevelFilter(null); setSourceFilter(null) }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Eventos Recentes
          </CardTitle>
          <CardDescription>
            {logs.length} eventos 
            {levelFilter && ` (nível: ${levelFilter})`}
            {sourceFilter && ` (fonte: ${sourceFilter})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {logs.map((log) => {
                const config = getLevelConfig(log.level)
                const Icon = config.icon
                return (
                  <div
                    key={log.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      config.bg
                    )}
                  >
                    <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{log.message}</p>
                      {log.details && (
                        <pre className="mt-2 text-xs bg-black/5 dark:bg-white/5 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {log.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {logs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Nenhum log encontrado</p>
                  <p className="text-sm mt-1">Os logs serão exibidos aqui conforme o sistema opera</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
