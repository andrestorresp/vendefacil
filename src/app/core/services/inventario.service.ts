import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoInventario {
  id: string;
  nombre: string;
  proveedor: string;
  fechaIngreso: string;
  cantidad: number;
  costoUsd: number;
  margenGanancia: number;
  precioVentaUsd: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  // Simularemos la persistencia en memoria por ahora
  private inventarioSubject = new BehaviorSubject<ProductoInventario[]>([]);
  public inventario$ = this.inventarioSubject.asObservable();

  constructor() {
    // Si quisieramos guardar en localStorage para que no se borre al recargar:
    const dataGuardada = localStorage.getItem('inventario_vendefacil');
    if (dataGuardada) {
      this.inventarioSubject.next(JSON.parse(dataGuardada));
    }
  }

  registrarIngreso(proveedorData: any, productosData: any[]) {
    const inventarioActual = this.inventarioSubject.value;
    
    // Transformar los productos agregando la info del proveedor y cálculos
    const nuevosProductos: ProductoInventario[] = productosData.map(prod => {
      const costo = prod.costoUsd || 0;
      const margen = prod.margenGanancia || 0;
      const precioVenta = costo + (costo * (margen / 100));

      // Si es al contado (repuestos mc), podríamos mostrar eso o "Compra directa"
      // Según la lógica anterior, el form se llena con "repuestos mc"
      const nombreProveedor = proveedorData.compania ? proveedorData.compania : 'Sin Proveedor';

      return {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        nombre: prod.nombre,
        proveedor: nombreProveedor,
        fechaIngreso: proveedorData.fechaIngreso,
        cantidad: prod.cantidad,
        costoUsd: costo,
        margenGanancia: margen,
        precioVentaUsd: precioVenta
      };
    });

    const nuevoInventario = [...inventarioActual, ...nuevosProductos];
    this.inventarioSubject.next(nuevoInventario);
    
    // Opcional: Guardar en localStorage para pruebas sin backend
    localStorage.setItem('inventario_vendefacil', JSON.stringify(nuevoInventario));
  }

  eliminarProducto(id: string) {
    const inventarioActual = this.inventarioSubject.value;
    const nuevoInventario = inventarioActual.filter(p => p.id !== id);
    this.inventarioSubject.next(nuevoInventario);
    localStorage.setItem('inventario_vendefacil', JSON.stringify(nuevoInventario));
  }

  descontarInventario(id: string, cantidadVenta: number) {
    const inventarioActual = this.inventarioSubject.value;
    const nuevoInventario = inventarioActual.map(prod => {
      if (prod.id === id) {
        const nuevaCantidad = Math.max(0, prod.cantidad - cantidadVenta);
        return { ...prod, cantidad: nuevaCantidad };
      }
      return prod;
    });
    
    this.inventarioSubject.next(nuevoInventario);
    localStorage.setItem('inventario_vendefacil', JSON.stringify(nuevoInventario));
  }
}
