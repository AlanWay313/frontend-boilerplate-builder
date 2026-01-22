import { createContext, useContext, ReactNode } from "react"

export interface DashboardFilters {
  status: string
  periodo: string
}

interface DashboardFiltersContextType {
  filters: DashboardFilters
  setFilters: (filters: DashboardFilters) => void
  resetFilters: () => void
}

const defaultFilters: DashboardFilters = {
  status: "todos",
  periodo: "todos",
}

const DashboardFiltersContext = createContext<DashboardFiltersContextType | undefined>(undefined)

export function useDashboardFilters() {
  const context = useContext(DashboardFiltersContext)
  if (!context) {
    throw new Error("useDashboardFilters must be used within a DashboardFiltersProvider")
  }
  return context
}

interface DashboardFiltersProviderProps {
  children: ReactNode
  filters: DashboardFilters
  setFilters: (filters: DashboardFilters) => void
}

export function DashboardFiltersProvider({ 
  children, 
  filters, 
  setFilters 
}: DashboardFiltersProviderProps) {
  const resetFilters = () => setFilters(defaultFilters)

  return (
    <DashboardFiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </DashboardFiltersContext.Provider>
  )
}

export { defaultFilters }
