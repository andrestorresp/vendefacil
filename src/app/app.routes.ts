import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./Layout/admin-layout/layout').then((m) => m.LayoutComponent),

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
      },

      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/productos/productos').then((m) => m.ProductosComponent),
      },

      {
        path: 'proveedores',
        loadComponent: () =>
          import('./pages/proveedores/proveedores').then((m) => m.ProveedoresComponent),
      },

      {
        path: 'ventas',
        loadComponent: () => import('./pages/ventas/ventas').then((m) => m.VentasComponent),
      },

      {
        path: 'caja',
        loadComponent: () => import('./pages/caja/caja').then((m) => m.CajaComponent),
      },

      {
        path: 'tasa-bcv',
        loadComponent: () => import('./pages/tasa-bcv/tasa-bcv').then((m) => m.TasaBcvComponent),
      },

      {
        path: 'reportes',
        loadComponent: () => import('./pages/reportes/reportes').then((m) => m.ReportesComponent),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
