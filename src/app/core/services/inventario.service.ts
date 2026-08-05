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

  // Nuevo Subject para guardar las facturas/ingresos por separado para los reportes
  private facturasSubject = new BehaviorSubject<any[]>([]);
  public facturas$ = this.facturasSubject.asObservable();

  constructor() {
    // Si quisieramos guardar en localStorage para que no se borre al recargar:
    const dataGuardada = localStorage.getItem('inventario_vendefacil');
    if (dataGuardada) {
      this.inventarioSubject.next(JSON.parse(dataGuardada));
    }

    const facturasGuardadas = localStorage.getItem('facturas_compra_vendefacil');
    if (facturasGuardadas) {
      this.facturasSubject.next(JSON.parse(facturasGuardadas));
    }
  }

  registrarIngreso(proveedorData: any, productosData: any[]) {
    const inventarioActual = [...this.inventarioSubject.value];
    const facturasActuales = [...this.facturasSubject.value];

    // 1. Guardar la factura/ingreso completa de forma independiente para los reportes
    const nuevaFactura = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      proveedorData,
      productosData,
      fechaRegistro: new Date().toISOString()
    };
    facturasActuales.push(nuevaFactura);
    this.facturasSubject.next(facturasActuales);
    localStorage.setItem('facturas_compra_vendefacil', JSON.stringify(facturasActuales));

    // 2. Procesar los productos para agregarlos al inventario o sumar cantidades
    const nombreProveedor = proveedorData.compania ? proveedorData.compania : 'Sin Proveedor';

    productosData.forEach(prod => {
      // Buscar si ya existe un producto con el mismo nombre y proveedor
      const indexExistente = inventarioActual.findIndex(
        p => p.nombre.toLowerCase() === prod.nombre.toLowerCase() && 
             p.proveedor.toLowerCase() === nombreProveedor.toLowerCase()
      );

      if (indexExistente !== -1) {
        // Ya existe, sumamos la cantidad
        inventarioActual[indexExistente] = {
          ...inventarioActual[indexExistente],
          cantidad: inventarioActual[indexExistente].cantidad + prod.cantidad,
          // Opcionalmente se podrían actualizar costo y precio si variaron, 
          // pero por ahora priorizamos sumar la cantidad.
        };
      } else {
        // No existe, creamos el producto en el inventario
        const costo = prod.costoUsd || 0;
        const margen = prod.margenGanancia || 0;
        const precioVenta = costo + (costo * (margen / 100));

        inventarioActual.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
          nombre: prod.nombre,
          proveedor: nombreProveedor,
          fechaIngreso: proveedorData.fechaIngreso,
          cantidad: prod.cantidad,
          costoUsd: costo,
          margenGanancia: margen,
          precioVentaUsd: precioVenta
        });
      }
    });

    this.inventarioSubject.next(inventarioActual);
    localStorage.setItem('inventario_vendefacil', JSON.stringify(inventarioActual));
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
