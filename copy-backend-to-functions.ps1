# PowerShell script to copy backend files to Firebase Functions
Write-Host "Copying backend files to Firebase Functions..." -ForegroundColor Green

# Create directories if they don't exist
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "functions\src\routes" | Out-Null
New-Item -ItemType Directory -Force -Path "functions\src\middleware" | Out-Null
New-Item -ItemType Directory -Force -Path "functions\src\models" | Out-Null

# Copy routes
Write-Host "Copying routes..." -ForegroundColor Yellow
Copy-Item "backend\src\routes\*.ts" -Destination "functions\src\routes\" -Force

# Copy middleware
Write-Host "Copying middleware..." -ForegroundColor Yellow
Copy-Item "backend\src\middleware\*.ts" -Destination "functions\src\middleware\" -Force

# Copy models
Write-Host "Copying models..." -ForegroundColor Yellow
Copy-Item "backend\src\models\*.ts" -Destination "functions\src\models\" -Force

Write-Host "Done! Files copied successfully." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. cd functions" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npm run build" -ForegroundColor White
Write-Host "4. cd .." -ForegroundColor White
Write-Host "5. firebase deploy --only functions" -ForegroundColor White

