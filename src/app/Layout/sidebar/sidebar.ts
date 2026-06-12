import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Productos', icon: 'inventory_2', route: '/productos' },
    { label: 'Proveedores', icon: 'local_shipping', route: '/proveedores' },
    { label: 'Ventas', icon: 'point_of_sale', route: '/ventas' },

    { label: 'Caja', icon: 'account_balance_wallet', route: '/caja' },
    { label: 'Tasa BCV', icon: 'currency_exchange', route: '/tasa-bcv' },
    { label: 'Reportes', icon: 'bar_chart', route: '/reportes' },
    { label: 'Compras', icon: 'shopping_cart', route: '/compras' },
  ];
}
