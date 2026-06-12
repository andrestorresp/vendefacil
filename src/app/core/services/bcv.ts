import { Injectable } from '@angular/core';
import { TasaBcv } from '../models/tasa-bcv.model';

@Injectable({
  providedIn: 'root',
})
export class BcvService {
  private readonly STORAGE_KEY = 'bcv_historial';

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

    historial.unshift(nuevaTasa);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historial));
  }

  getTasaActual(): TasaBcv | null {
    const historial = this.getHistorial();

    if (historial.length === 0) {
      return null;
    }

    return historial[0];
  }
}
