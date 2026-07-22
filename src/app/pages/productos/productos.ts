import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../core/services/inventario.service';
import { BcvService } from '../../core/services/bcv';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class ProductosComponent {
  private inventarioService = inject(InventarioService);
  public bcvService = inject(BcvService);
  
  // Observamos el inventario reactivamente
  inventario$ = this.inventarioService.inventario$;

  // Tasa actual para calcular los precios en bolívares
  tasaActual = this.bcvService.tasaActual;
}
