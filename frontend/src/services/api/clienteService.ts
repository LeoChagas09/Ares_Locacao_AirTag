// src/services/api/clienteService.ts
import { ICliente, IClienteData } from "@/types/Cliente";

const API_BASE_URL = 'http://localhost:3333'; // A URL do nosso backend

// Classe de Serviço para encapsular a lógica da API
class ClienteApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/clientes`;
  }

  // Método para buscar todos os clientes
  async getAll(): Promise<ICliente[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Falha ao buscar clientes.');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      // Em um app real, poderíamos ter um sistema de log mais robusto aqui
      throw error;
    }
  }

  async create(clienteData: IClienteData): Promise<ICliente> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteData),
    });
    if (!response.ok) throw new Error('Falha ao criar cliente.');
    return response.json();
  }

  async update(id_cliente: string, clienteData: IClienteData): Promise<ICliente> {
    const response = await fetch(`${this.baseUrl}/${id_cliente}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteData),
    });
    if (!response.ok) throw new Error('Falha ao atualizar cliente.');
    return response.json();
  }

  async delete(id_cliente: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id_cliente}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Falha ao deletar cliente.');
  }
}

// Exportamos uma instância única da classe (Padrão Singleton)
const clienteService = new ClienteApiService();
export default clienteService;