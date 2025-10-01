// src/services/api/locacaoService.ts
import { ILocacao } from "@/types/Locacao";

const API_BASE_URL = 'http://localhost:3333';

class LocacaoApiService {
  private baseUrl: string = `${API_BASE_URL}/locacoes`;

  async getAll(): Promise<ILocacao[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) throw new Error('Falha ao buscar locações.');
    return response.json();
  }

  async iniciar(data: { clienteId: string; dispositivoId: string }): Promise<ILocacao> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensagem || 'Falha ao iniciar locação.');
    }
    return response.json();
  }

  async finalizar(id_locacao: string): Promise<ILocacao> {
    const response = await fetch(`${this.baseUrl}/${id_locacao}/finalizar`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Falha ao finalizar locação.');
    return response.json();
  }
}

const locacaoService = new LocacaoApiService();
export default locacaoService;