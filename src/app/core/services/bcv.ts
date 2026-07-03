import { Injectable, signal, computed } from '@angular/core';
import { TasaBcv } from '../models/tasa-bcv.model';

@Injectable({
  providedIn: 'root',
})
export class BcvService {
  private readonly STORAGE_KEY = 'bcv_historial';

  // Signal reactivo para la tasa actual
  private tasaActualState = signal<TasaBcv | null>(null);
  
  // Computed property para que los componentes se suscriban a cambios automáticamente
  public readonly tasaActual = computed(() => this.tasaActualState());

  constructor() {
    this.cargarTasaInicial();
  }

  private cargarTasaInicial(): void {
    const historial = this.getHistorial();
    if (historial.length > 0) {
      this.tasaActualState.set(historial[0]);
    }
  }

  getHistorial(): TasaBcv[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  }

  guardarTasa(tasa: number): void {
    const historial = this.getHistorial();

    const nuevaTasa: TasaBcv = {
      id: Date.now(),
      fecha: new Date(),
      tasa,
    };

    // Añadimos al principio
    historial.unshift(nuevaTasa);

    // Limitamos a un máximo de 7 datos (historial de los últimos 7 cambios/días)
    const historialLimitado = historial.slice(0, 7);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historialLimitado));
    
    // Actualizamos el signal. Todo componente que use bcvService.tasaActual() se actualizará automáticamente
    this.tasaActualState.set(nuevaTasa);
  }
}
