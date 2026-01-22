import { TabelaLogs } from "@/components/tabelalogs";
import { FileText, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Logs() {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header com gradiente */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-border/50 p-6">
        {/* Background decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg shadow-primary/25">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-success rounded-lg shadow-lg">
                <Activity className="h-3 w-3 text-white" />
              </div>
            </motion.div>
            
            <div>
              <motion.h1 
                className="text-2xl font-bold text-foreground flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Logs do Sistema
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  <Zap className="h-3 w-3" />
                  Live
                </span>
              </motion.h1>
              <motion.p 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Acompanhe todas as ações e eventos do sistema em tempo real
              </motion.p>
            </div>
          </div>
          
          {/* Indicador de atividade */}
          <motion.div 
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
              </span>
              <span className="text-sm text-muted-foreground">Monitoramento ativo</span>
            </div>
          </motion.div>
        </div>
      </div>

      <TabelaLogs />
    </motion.div>
  );
}
