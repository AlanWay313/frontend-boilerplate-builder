// Configurações de Ambiente
// Crie um arquivo .env na raiz com essas variáveis

import { z } from 'zod';

const envSchema = z.object({
  // Banco de dados
  DATABASE_URL: z.string().url(),
  
  // Servidor
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // JWT para autenticação dos webhooks
  JWT_SECRET: z.string().min(32),
  
  // API Olé TV (padrões)
  OLE_API_BASE_URL: z.string().url().default('https://api.ofrfrbo.site/cliente'),
  OLE_API_TIMEOUT: z.string().default('30000'),
  
  // API Complementar (ERP - dados como data de nascimento)
  COMPLEMENTARY_API_URL: z.string().url().default('https://erp.internetway.com.br:45715'),
  COMPLEMENTARY_API_TOKEN: z.string().optional(),
  
  // Criptografia
  ENCRYPTION_KEY: z.string().min(32), // Para criptografar senhas da Olé
  
  // Redis (opcional, para filas)
  REDIS_URL: z.string().url().optional(),
});

// Validar variáveis de ambiente
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parseResult.error.format());
  process.exit(1);
}

export const env = parseResult.data;

// Exemplo de arquivo .env
export const envExample = `
# Banco de Dados PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/ole_integration?schema=public"

# Servidor
PORT=3000
NODE_ENV=development

# JWT Secret (mínimo 32 caracteres)
JWT_SECRET="sua-chave-secreta-muito-longa-aqui-32chars"

# API Olé TV
OLE_API_BASE_URL="https://api.ofrfrbo.site/cliente"
OLE_API_TIMEOUT=30000

# API Complementar (ERP - dados de nascimento, endereço)
COMPLEMENTARY_API_URL="https://erp.internetway.com.br:45715"
COMPLEMENTARY_API_TOKEN="seu-bearer-token-aqui"

# Chave de Criptografia (32 caracteres)
ENCRYPTION_KEY="chave-criptografia-32-caracteres"

# Redis (opcional)
REDIS_URL="redis://localhost:6379"
`;
