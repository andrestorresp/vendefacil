import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface VentaHistorial {
  id: string;
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUsdTotal: number;
  precioBsTotal: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private historialSubject = new BehaviorSubject<VentaHistorial[]>([]);
  public historial$ = this.historialSubject.asObservable();

  constructor() {
    const dataGuardada = localStorage.getItem('historial_ventas_vendefacil');
    if (dataGuardada) {
      this.historialSubject.next(JSON.parse(dataGuardada));
    }
  }

  registrarVenta(producto: any, cantidad: number, tasaActual: number) {
    const historialActual = this.historialSubject.value;
    
    const precioTotalUsd = producto.precioVentaUsd * cantidad;
    const precioTotalBs = precioTotalUsd * tasaActual;
    const fechaActual = new Date().toISOString();

    const nuevaVenta: VentaHistorial = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      productoId: producto.id,
      nombreProducto: producto.nombre,
      cantidad: cantidad,
      precioUsdTotal: precioTotalUsd,
      precioBsTotal: precioTotalBs,
      fecha: fechaActual
    };

    const nuevoHistorial = [...historialActual, nuevaVenta];
    this.historialSubject.next(nuevoHistorial);
    
    localStorage.setItem('historial_ventas_vendefacil', JSON.stringify(nuevoHistorial));
  }
}
