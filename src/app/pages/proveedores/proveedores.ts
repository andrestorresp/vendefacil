import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BcvService } from '../../core/services/bcv';
import { InventarioService } from '../../core/services/inventario.service';

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
  public inventarioService = inject(InventarioService);
  
  // Obtenemos la tasa actual reactivamente desde el servicio
  tasaActual = this.bcvService.tasaActual;

  proveedorForm: FormGroup;

  constructor() {
    this.proveedorForm = this.fb.group({
      compania: ['', Validators.required],
      vendedor: ['', Validators.required],
      compraAlContado: ['no'],
      fechaIngreso: [new Date().toISOString().split('T')[0], Validators.required],
      fechaCredito: [''],
      fechaVencimiento: [''],
      productos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Inicializar con al menos una fila en blanco
    this.agregarProducto();

    // Escuchar cambios en el selector
    this.proveedorForm.get('compraAlContado')?.valueChanges.subscribe(val => {
      this.actualizarDatosProveedor(val);
    });

    // Inicializar el estado de los datos del proveedor
    this.actualizarDatosProveedor(this.proveedorForm.get('compraAlContado')?.value);
  }

  private actualizarDatosProveedor(val: string) {
    if (val === 'no') {
      // Al contado
      this.proveedorForm.patchValue({
        compania: 'repuestos mc',
        vendedor: 'Sin vendedor',
        fechaCredito: '',
        fechaVencimiento: ''
      });
    } else {
      // A crédito: reiniciar para obligar al usuario a llenarlos
      this.proveedorForm.patchValue({
        compania: '',
        vendedor: '',
        fechaCredito: '',
        fechaVencimiento: ''
      });
    }
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
      
      // Enviar datos al servicio de inventario
      this.inventarioService.registrarIngreso(
        this.proveedorForm.value, 
        this.productos.value
      );

      alert('Ingreso registrado con éxito y añadido al inventario. (Próximamente Backend Python)');
      
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
