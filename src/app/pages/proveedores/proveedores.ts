import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BcvService } from '../../core/services/bcv';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.scss',
})
export class ProveedoresComponent implements OnInit {
  private fb = inject(FormBuilder);
  public bcvService = inject(BcvService);
  
  // Obtenemos la tasa actual reactivamente desde el servicio
  tasaActual = this.bcvService.tasaActual;

  proveedorForm: FormGroup;

  constructor() {
    this.proveedorForm = this.fb.group({
      compania: ['', Validators.required],
      vendedor: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaCredito: [''],
      fechaVencimiento: [''],
      productos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Inicializar con al menos una fila en blanco
    this.agregarProducto();
  }

  // Getter para facilitar el acceso al FormArray
  get productos(): FormArray {
    return this.proveedorForm.get('productos') as FormArray;
  }

  // Agregar un nuevo producto al formulario
  agregarProducto() {
    const productoForm = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      costoUsd: [0, [Validators.required, Validators.min(0)]],
      // Se añade nuevamente el margen de ganancia a petición del usuario
      margenGanancia: [30, [Validators.required, Validators.min(0)]]
    });
    this.productos.push(productoForm);
  }

  // Eliminar un producto
  eliminarProducto(index: number) {
    if (this.productos.length > 1) {
      this.productos.removeAt(index);
    }
  }

  // --- CÁLCULOS REACTIVOS ---

  // Costo Unitario en USD
  calcularCostoUsdUnidad(index: number): number {
    const control = this.productos.at(index);
    return control.value.costoUsd || 0;
  }

  // Acción de guardar el formulario
  guardarIngreso() {
    if (this.proveedorForm.valid) {
      console.log('Datos a guardar:', this.proveedorForm.value);
      alert('Ingreso validado correctamente. (Próximamente se enviará al Backend Python)');
      
      // Reiniciar formulario para una nueva entrada
      this.proveedorForm.reset();
      this.productos.clear();
      this.agregarProducto();
    } else {
      alert('Por favor, completa todos los campos requeridos (marcados en rojo si faltan).');
      this.proveedorForm.markAllAsTouched();
    }
  }
}
