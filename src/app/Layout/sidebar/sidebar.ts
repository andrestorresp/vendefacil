import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, NgFor],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Productos', icon: 'inventory_2', route: '/productos' },
    { label: 'Proveedores', icon: 'local_shipping', route: '/proveedores' },
    { label: 'Ventas', icon: 'point_of_sale', route: '/ventas' },
    { label: 'Calculadora', icon: 'calculate', route: '/calculadora' },
    { label: 'Caja', icon: 'account_balance_wallet', route: '/caja' },
    { label: 'Tasa BCV', icon: 'currency_exchange', route: '/tasa-bcv' },
    { label: 'Reportes', icon: 'bar_chart', route: '/reportes' },
  ];
}
