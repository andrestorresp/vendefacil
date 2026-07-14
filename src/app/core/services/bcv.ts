import { Injectable, signal, computed, inject } from '@angular/core';
import { TasaBcv } from '../models/tasa-bcv.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BcvService {
  private readonly STORAGE_KEY = 'bcv_historial';
  private http = inject(HttpClient);

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
  // metodo para pedir la tasa al backend
  async actualizarTasaDesdeAPI(): Promise<void> {
    try {
      // aqui adentro se llama al backend de python, hay que revisar el puerto
      const respuesta: any = await firstValueFrom(
        this.http.get('http://localhost:8000/api/bcv/tasa')
      );
      if (respuesta.exito && respuesta.tasa) {
        // guardo el metodo existente para guardar la tasa de forma local
        this.guardarTasa(respuesta.tasa);
      } else {
        console.error("error desde el backend", respuesta.error);
      }
    } catch (error) {
      console.error("error conectando con el backend", error);
    }
  }
}
