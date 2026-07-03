import { Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

import { BcvService } from '../../core/services/bcv';
import { TasaBcv } from '../../core/models/tasa-bcv.model';

@Component({
  selector: 'app-tasa-bcv',
  standalone: true,
  imports: [FormsModule, MatGridListModule, MatIconModule, CommonModule],
  templateUrl: './tasa-bcv.html',
  styleUrl: './tasa-bcv.scss',
})
export class TasaBcvComponent implements OnInit {
  private bcvService = inject(BcvService);

  tasaInput = 0;
  historial: TasaBcv[] = [];

  // Almacenamos la referencia directa al Signal computado del servicio
  tasaActual = this.bcvService.tasaActual;

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  guardarTasa(): void {
    if (this.tasaInput <= 0) {
      return;
    }

    this.bcvService.guardarTasa(this.tasaInput);
    this.tasaInput = 0;
    this.cargarDatos();
  }

  private cargarDatos(): void {
    // La tasaActual se actualiza sola por el Signal, solo necesitamos actualizar el historial para la tabla/lista
    this.historial = this.bcvService.getHistorial();
  }
}
