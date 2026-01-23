// Serviço de API Complementar (ERP)
// Busca dados adicionais como data de nascimento para inserção na Olé TV

import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { logger } from '../lib/logger';

// ==========================================
// TIPOS
// ==========================================

interface EnderecoComplementar {
  streetType: string;
  street: string;
  number: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  codeCityId: number;
  addressReference: string;
  state: string;
  postalCode: string;
  longitude: string;
  latitude: string;
}

interface ClienteComplementarResponse {
  success: boolean;
  messages: string | null;
  response: {
    id: number;
    name: string;
    name2: string;
    txId: string;
    email: string;
    status: number;
    birthDate: string; // ISO format: "1998-06-19T00:00:00"
    phone: string;
    cellPhone: string;
    mainAddress: EnderecoComplementar;
    titles: any[];
  };
  dataResponseType: string;
  elapsedTime: string | null;
}

export interface DadosEnriquecidos {
  dataNascimento: string; // Formato: YYYY-MM-DD
  endereco: {
    tipoLogradouro: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    codigoCidade: number;
    referencia: string;
    uf: string;
    cep: string;
    longitude: string;
    latitude: string;
  };
  telefone: string;
  celular: string;
  email: string;
  nomeCompleto: string;
}

// ==========================================
// CLASSE DO SERVIÇO
// ==========================================

export class ComplementaryApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.COMPLEMENTARY_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Busca dados complementares do cliente por CPF/CNPJ
   * Endpoint: /external/integrations/thirdparty/people/txid/{documento}
   */
  async buscarDadosComplementares(documento: string): Promise<DadosEnriquecidos | null> {
    // Limpa o documento (remove pontos, traços, barras)
    const documentoLimpo = documento.replace(/[.\-\/]/g, '');

    if (!env.COMPLEMENTARY_API_TOKEN) {
      logger.warn('Token da API complementar não configurado');
      return null;
    }

    try {
      logger.info('Buscando dados complementares', { documento: documentoLimpo });

      const response = await this.client.get<ClienteComplementarResponse>(
        `/external/integrations/thirdparty/people/txid/${documentoLimpo}`,
        {
          headers: {
            Authorization: `Bearer ${env.COMPLEMENTARY_API_TOKEN}`,
          },
        }
      );

      if (!response.data.success || !response.data.response) {
        logger.info('Cliente não encontrado na API complementar', { documento: documentoLimpo });
        return null;
      }

      const { response: cliente } = response.data;

      // Extrai e formata data de nascimento (de ISO para YYYY-MM-DD)
      let dataNascimento = '';
      if (cliente.birthDate) {
        const birthDateParts = cliente.birthDate.split('T')[0];
        dataNascimento = birthDateParts; // Já está no formato YYYY-MM-DD
      }

      // Formata CEP (remove hífen se existir)
      const cepLimpo = cliente.mainAddress?.postalCode?.replace('-', '') || '';

      const dadosEnriquecidos: DadosEnriquecidos = {
        dataNascimento,
        endereco: {
          tipoLogradouro: cliente.mainAddress?.streetType || '',
          logradouro: cliente.mainAddress?.street || '',
          numero: cliente.mainAddress?.number || '',
          complemento: cliente.mainAddress?.addressComplement || '',
          bairro: cliente.mainAddress?.neighborhood || '',
          cidade: cliente.mainAddress?.city || '',
          codigoCidade: cliente.mainAddress?.codeCityId || 0,
          referencia: cliente.mainAddress?.addressReference || '',
          uf: cliente.mainAddress?.state || '',
          cep: cepLimpo,
          longitude: cliente.mainAddress?.longitude || '',
          latitude: cliente.mainAddress?.latitude || '',
        },
        telefone: cliente.phone || '',
        celular: cliente.cellPhone || '',
        email: cliente.email || '',
        nomeCompleto: cliente.name || '',
      };

      logger.info('Dados complementares obtidos com sucesso', { 
        documento: documentoLimpo,
        temDataNascimento: !!dataNascimento,
        temEndereco: !!cliente.mainAddress,
      });

      return dadosEnriquecidos;

    } catch (error: any) {
      if (error.response?.status === 404) {
        logger.info('Cliente não encontrado na API complementar', { documento: documentoLimpo });
        return null;
      }

      logger.error('Erro ao buscar dados complementares', {
        documento: documentoLimpo,
        status: error.response?.status,
        message: error.message,
      });
      
      return null; // Retorna null em vez de lançar erro para não bloquear o fluxo
    }
  }

  /**
   * Verifica se a API complementar está disponível
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Faz uma chamada simples para verificar conectividade
      await this.client.get('/health', {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${env.COMPLEMENTARY_API_TOKEN}`,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}

export default ComplementaryApiService;
