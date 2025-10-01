// src/types/Locacao.ts
import { ICliente } from "./Cliente";
import { IDispositivo } from "./Dispositivo";

export interface ILocacao {
  id_locacao: string;
  dataInicio: string; // Datas virão como string no JSON
  dataFim: string | null;
  custoTotal: number | null;
  clienteId: string;
  dispositivoId: string;
  // Dados incluídos que virão da API
  cliente: ICliente;
  dispositivo: IDispositivo;
}