# Script para subir proyecto a GitHub
# Ejecutar desde la raíz del proyecto

Write-Host "=== SUBIENDO PROYECTO A GITHUB ===" -ForegroundColor Cyan

# Configurar usuario de Git (si no está configurado)
Write-Host "`nConfigurando usuario de Git..." -ForegroundColor Yellow
git config user.name "RichBoy-Y3RR1"
git config user.email "yerribamaca@gmail.com"

# Verificar estado actual
Write-Host "`nEstado actual del repositorio:" -ForegroundColor Yellow
git status

# Agregar todos los cambios
Write-Host "`nAgregando archivos..." -ForegroundColor Yellow
git add .

# Mostrar qué se va a subir
Write-Host "`nArchivos a subir:" -ForegroundColor Yellow
git status

# Confirmar
$continuar = Read-Host "`n¿Deseas continuar con el commit? (S/N)"
if ($continuar -ne "S" -and $continuar -ne "s") {
    Write-Host "Operación cancelada" -ForegroundColor Red
    exit
}

# Crear commit
$mensaje = Read-Host "`nIngresa el mensaje del commit (Enter para usar mensaje por defecto)"
if ([string]::IsNullOrWhiteSpace($mensaje)) {
    $mensaje = "Tercera iteración: Sistema completo con bloqueo gratuito de anuncios"
}

Write-Host "`nCreando commit..." -ForegroundColor Yellow
git commit -m "$mensaje"

# Push al repositorio
Write-Host "`nSubiendo cambios a GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n=== SUBIDA COMPLETADA ===" -ForegroundColor Green
Write-Host "Repositorio: https://github.com/RichBoy-Y3RR1/PROYECTO_FINAL_IPC2" -ForegroundColor Cyan
Write-Host "`nSi es la primera vez, puede que necesites autenticarte con GitHub." -ForegroundColor Yellow
