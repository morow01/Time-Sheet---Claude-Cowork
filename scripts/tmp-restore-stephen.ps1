$before='\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test Next =-\Before\Stephen Clarke - 03 Celkem jde o Merde'
$after='\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test Next =-\After\Stephen Clarke - Celkem jde o Merde'
if(-not (Test-Path -LiteralPath $after)){ New-Item -ItemType Directory -Path $after | Out-Null }
Get-ChildItem -LiteralPath $after -Force | Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath $before -Force | ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $after -Recurse -Force }
Get-ChildItem -LiteralPath $after -File | Select-Object Name,Length | Format-Table -AutoSize | Out-String -Width 400
