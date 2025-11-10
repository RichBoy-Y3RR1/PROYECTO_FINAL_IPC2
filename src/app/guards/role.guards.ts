import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const anuncianteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);

    // Verificar si el usuario es anunciante
    if (decoded.tipo === 'anunciante') {
      return true;
    } else {
      // Si no es anunciante, redirigir según su rol
      if (decoded.tipo === 'admin-general' || decoded.tipo === 'admin') {
        router.navigate(['/admin-sistema']);
      } else if (decoded.tipo === 'admin-cine' || decoded.tipo === 'admin_cine') {
        router.navigate(['/admin-cine']);
      } else {
        router.navigate(['/']);
      }
      return false;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    router.navigate(['/login']);
    return false;
  }
};

export const adminCineGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);

    if (decoded.tipo === 'admin-cine' || decoded.tipo === 'admin_cine') {
      return true;
    } else if (decoded.tipo === 'admin-general' || decoded.tipo === 'admin') {
      router.navigate(['/admin-sistema']);
      return false;
    } else if (decoded.tipo === 'anunciante') {
      router.navigate(['/anunciante']);
      return false;
    } else {
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    router.navigate(['/login']);
    return false;
  }
};

export const adminSistemaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);

    if (decoded.tipo === 'admin-general' || decoded.tipo === 'admin') {
      return true;
    } else if (decoded.tipo === 'admin-cine' || decoded.tipo === 'admin_cine') {
      router.navigate(['/admin-cine']);
      return false;
    } else if (decoded.tipo === 'anunciante') {
      router.navigate(['/anunciante']);
      return false;
    } else {
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    router.navigate(['/login']);
    return false;
  }
};
