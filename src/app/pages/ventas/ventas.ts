import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { InventarioService, ProductoInventario } from '../../core/services/inventario.service';
import { VentasService } from '../../core/services/ventas.service';
import { BcvService } from '../../core/services/bcv';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss',
})
export class VentasComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  private ventasService = inject(VentasService);
  public bcvService = inject(BcvService);

  searchControl = new FormControl('');
  
  resultadosBusqueda$: Observable<ProductoInventario[]> | undefined;
  
  tasaActual = this.bcvService.tasaActual;

  // Objeto temporal para mantener el valor del contador (cantidad a vender) de cada producto
  cantidadesVenta: { [id: string]: number } = {};

  // Estado para las notificaciones tipo "toast"
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    if (tipo === 'exito') {
      this.mensajeExito = mensaje;
      setTimeout(() => this.mensajeExito = null, 3000);
    } else {
      this.mensajeError = mensaje;
      setTimeout(() => this.mensajeError = null, 3000);
    }
  }

  ngOnInit() {
    this.resultadosBusqueda$ = combineLatest([
      this.inventarioService.inventario$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(200) // Esperar 200ms para no saturar al escribir rápido
      )
    ]).pipe(
      map(([inventario, searchObj]) => {
        const searchTerm = (searchObj || '').toLowerCase().trim();
        
        // Si no hay texto de búsqueda, retornamos lista vacía
        if (!searchTerm) {
          return [];
        }

        // Buscar por coincidencias en el nombre
        const filtrados = inventario.filter(prod => 
          prod.nombre.toLowerCase().includes(searchTerm)
        );

        // Inicializar los contadores a 0 para los nuevos productos encontrados
        filtrados.forEach(prod => {
          if (this.cantidadesVenta[prod.id] === undefined) {
            this.cantidadesVenta[prod.id] = 0;
          }
        });

        return filtrados;
      })
    );
  }

  incrementar(id: string, max: number) {
    if (this.cantidadesVenta[id] < max) {
      this.cantidadesVenta[id]++;
    }
  }

  decrementar(id: string) {
    if (this.cantidadesVenta[id] > 0) {
      this.cantidadesVenta[id]--;
    }
  }

  realizarVenta(producto: ProductoInventario) {
    const cantidad = this.cantidadesVenta[producto.id];
    
    // Validación de seguridad
    if (cantidad >= 1 && cantidad <= producto.cantidad) {
      // 1. Registrar en el historial de ventas
      this.ventasService.registrarVenta(producto, cantidad, this.tasaActual()?.tasa || 1);
      
      // 2. Descontar del stock global
      this.inventarioService.descontarInventario(producto.id, cantidad);
      
      // 3. Resetear la búsqueda para la siguiente venta y dar feedback visual
      this.mostrarNotificacion('Producto agregado al historial');
      this.searchControl.setValue('');
    } else {
      this.mostrarNotificacion('Cantidad inválida (debe ser mayor a 0).', 'error');
    }
  }
}
