# Build script for the Steam Desktop Guard app

Write-Host "Building Steam Desktop Guard..." -ForegroundColor Green

# Build the app
Write-Host "Building Tauri app..."
pnpm run tauri build

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "The installer can be found in src-tauri/target/release/bundle/" 