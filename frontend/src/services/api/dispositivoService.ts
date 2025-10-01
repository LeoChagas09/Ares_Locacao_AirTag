// src/services/api/dispositivoService.ts
import { IDispositivo, IDispositivoData } from "@/types/Dispositivo";

const API_BASE_URL = 'http://localhost:3333';

class DispositivoApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/dispositivos`;
  }

  async getAll(): Promise<IDispositivo[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) throw new Error('Falha ao buscar dispositivos.');
    return response.json();
  }

  async create(data: IDispositivoData): Promise<IDispositivo> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao criar dispositivo.');
    return response.json();
  }

  async update(id_dispositivo: string, data: IDispositivoData): Promise<IDispositivo> {
    const response = await fetch(`${this.baseUrl}/${id_dispositivo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao atualizar dispositivo.');
    return response.json();
  }

  async delete(id_dispositivo: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id_dispositivo}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Falha ao deletar dispositivo.');
  }
}

const dispositivoService = new DispositivoApiService();
export default dispositivoService;