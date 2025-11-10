# Script para comprimir el proyecto El CineHub
# Excluye carpetas innecesarias y genera un ZIP listo para entregar

Write-Host "=== COMPRIMIENDO PROYECTO EL CINEHUB ===" -ForegroundColor Cyan

$fecha = Get-Date -Format "yyyy-MM-dd"
$nombreZip = "el-cineHub-proyecto-$fecha.zip"
$rutaProyecto = "C:\Users\PC\el-cineHub-proyecto"

# Crear carpeta temporal para copiar archivos
$tempFolder = "$env:TEMP\el-cineHub-temp"
if (Test-Path $tempFolder) {
    Remove-Item $tempFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Copiando archivos al directorio temporal..." -ForegroundColor Yellow

# Copiar todo excepto lo que queremos excluir
$excludeFolders = @(
    "node_modules",
    ".angular",
    "dist",
    ".git",
    "db"
)

$excludeFiles = @(
    "*.zip",
    "test-*.js",
    "verificar-*.js",
    "fix-*.js"
)

# Copiar estructura principal
Get-ChildItem -Path $rutaProyecto -Exclude $excludeFolders | ForEach-Object {
    Copy-Item $_.FullName -Destination $tempFolder -Recurse -Force
}

# Eliminar carpetas excluidas del temporal
foreach ($folder in $excludeFolders) {
    $path = Join-Path $tempFolder $folder
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force
    }
    # También en backend
    $backendPath = Join-Path $tempFolder "backend\$folder"
    if (Test-Path $backendPath) {
        Remove-Item $backendPath -Recurse -Force
    }
}

# Eliminar archivos de prueba
Get-ChildItem -Path $tempFolder -Recurse -Include $excludeFiles | Remove-Item -Force

Write-Host "Creando archivo ZIP..." -ForegroundColor Yellow

# Comprimir
$zipPath = Join-Path $rutaProyecto $nombreZip
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Limpiar temporal
Remove-Item $tempFolder -Recurse -Force

Write-Host "`n=== COMPRESION COMPLETADA ===" -ForegroundColor Green
Write-Host "Archivo creado: $zipPath" -ForegroundColor Cyan
Write-Host "Tamaño: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "`nEl archivo está listo para enviar o subir a GitHub" -ForegroundColor Green
