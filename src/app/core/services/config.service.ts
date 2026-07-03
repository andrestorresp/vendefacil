import { Injectable, signal, computed } from '@angular/core';
import { AppConfig } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Configuración por defecto extraída de la lógica de tu Excel
  private readonly DEFAULT_CONFIG: AppConfig = {
    iva: 0.16,               // 16% de IVA
    multiplicadorGanancia: 2 // Precio = CostoBs * Multiplicador
  };

  // Signal principal que almacena el estado reactivo
  private configState = signal<AppConfig>(this.DEFAULT_CONFIG);

  // Computados reactivos de solo lectura para ser consumidos en componentes
  public readonly iva = computed(() => this.configState().iva);
  public readonly multiplicadorGanancia = computed(() => this.configState().multiplicadorGanancia);
  public readonly currentConfig = computed(() => this.configState());

  constructor() {
    this.loadConfig();
  }

  // Cargar desde localStorage si existe
  private loadConfig(): void {
    const saved = localStorage.getItem('vendefacil_config');
    if (saved) {
      this.configState.set(JSON.parse(saved));
    }
  }

  // Actualizar configuración
  public updateConfig(newValues: Partial<AppConfig>): void {
    this.configState.update(current => {
      const updated = { ...current, ...newValues };
      localStorage.setItem('vendefacil_config', JSON.stringify(updated));
      return updated;
    });
  }
}
