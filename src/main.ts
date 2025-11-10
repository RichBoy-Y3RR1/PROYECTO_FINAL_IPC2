import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withHashLocation } from '@angular/router';
// Usar la definición de rutas unificada que incluye /registro y /perfil
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './app/core/token.interceptor';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar locale español
registerLocaleData(localeEs, 'es');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    { provide: LOCALE_ID, useValue: 'es' }
  ]
}).catch(err => {
  console.error('Error al iniciar la aplicación:', err);
});
