import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/**
 * Redirige automáticamente a los paneles de administración si el usuario autenticado
 * intenta entrar al contexto de cliente (ruta raíz o secciones públicas protegidas).
 *
 * - admin-general/admin -> /admin-sistema
 * - admin-cine/admin_cine -> /admin-cine
 * - anunciante -> /anunciante
 * - cliente/visitante -> permite continuar
 */
export const roleRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    // No autenticado → permitir (otro guard decidirá si requiere login)
    return true;
  }

  let role = '' as string;
  try {
    const decoded: any = jwtDecode(token);
    role = decoded?.tipo || '';
  } catch (_) {
    // Token inválido → permitir y dejar que AuthGuard/Interceptores manejen
    return true;
  }

  switch (role) {
    case 'admin-general':
    case 'admin':
      return router.createUrlTree(['/admin-sistema']);
    case 'admin-cine':
    case 'admin_cine':
      return router.createUrlTree(['/admin-cine']);
    case 'anunciante':
      return router.createUrlTree(['/anunciante']);
    default:
      return true; // cliente → continúa a cliente
  }
};
