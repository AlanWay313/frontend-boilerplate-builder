/**
 * Exporta dados para CSV
 */
export function exportToCSV(data: any[], filename: string, columns: { key: string; header: string }[]) {
  if (data.length === 0) {
    alert("Não há dados para exportar.")
    return
  }

  // Cabeçalhos
  const headers = columns.map(col => col.header).join(";")
  
  // Linhas de dados
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key] ?? ""
      // Escapa aspas duplas e envolve em aspas se contiver separador ou quebra de linha
      const stringValue = String(value).replace(/"/g, '""')
      if (stringValue.includes(";") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"${stringValue}"`
      }
      return stringValue
    }).join(";")
  })

  // Combina cabeçalhos e linhas
  const csvContent = [headers, ...rows].join("\n")
  
  // Adiciona BOM para UTF-8 (compatibilidade com Excel)
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
  
  // Cria link de download
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Colunas padrão para exportação de clientes
 */
export const clienteExportColumns = [
  { key: "nome", header: "Nome" },
  { key: "cpf_cnpj", header: "CPF/CNPJ" },
  { key: "email", header: "Email" },
  { key: "contato", header: "Contato" },
  { key: "endereco_logradouro", header: "Endereço" },
  { key: "endereco_cep", header: "CEP" },
  { key: "ole_contract_number", header: "Contrato Olé" },
  { key: "voalle_contract_status", header: "Status" },
]
