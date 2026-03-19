$ErrorActionPreference = 'Stop'

# Anatole France: keep folder, clean both file names
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Anatole France Baltazar'
if (Test-Path -LiteralPath $dir) {
    $f = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -like 'Anatole France-Baltazar*' } | Select-Object -First 1
    if ($f) { Rename-Item -LiteralPath $f.FullName -NewName 'Anatole France - Baltazar.mp3' }
    $f = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -like 'Anatole France-Stra*' } | Select-Object -First 1
    if ($f) { Rename-Item -LiteralPath $f.FullName -NewName 'Anatole France - Strašín zázrak.mp3' }
}

# Bjorn Larsson
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Bjorn Larsson'
if (Test-Path -LiteralPath $dir) {
    $f = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -like 'Bj*Larsson*' } | Select-Object -First 1
    if ($f) { Rename-Item -LiteralPath $f.FullName -NewName 'Björn Larsson - O chemikovi, který předčil svého učitele.mp3' }
    if (-not (Test-Path -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Björn Larsson - O chemikovi, který předčil svého učitele')) {
        Rename-Item -LiteralPath $dir -NewName 'Björn Larsson - O chemikovi, který předčil svého učitele'
    }
}

# Dorthe Norsova
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Dorthe Norsova'
if (Test-Path -LiteralPath $dir) {
    $f = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -like 'Dorthe*Nors*' } | Select-Object -First 1
    if ($f) { Rename-Item -LiteralPath $f.FullName -NewName 'Dorthe Norsová - Zimní zahrada a Velké rajče.mp3' }
    if (-not (Test-Path -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Dorthe Norsová - Zimní zahrada a Velké rajče')) {
        Rename-Item -LiteralPath $dir -NewName 'Dorthe Norsová - Zimní zahrada a Velké rajče'
    }
}

# Ivan Binar
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ivan Binar'
if (Test-Path -LiteralPath $dir) {
    $f = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -like 'Ivan Binar*' } | Select-Object -First 1
    if ($f) { Rename-Item -LiteralPath $f.FullName -NewName 'Ivan Binar - Jiné světy, jiné životy.mp3' }
    if (-not (Test-Path -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ivan Binar - Jiné světy, jiné životy')) {
        Rename-Item -LiteralPath $dir -NewName 'Ivan Binar - Jiné světy, jiné životy'
    }
}

# Jan Kamenik
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jan Kamenik'
if (Test-Path -LiteralPath $dir) {
    $f = Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Name -like 'Jan Kamen*' } | Select-Object -First 1
    if ($f) { Rename-Item -LiteralPath $f.FullName -NewName 'Jan Kameník - Učitelka hudby.mp3' }
    if (-not (Test-Path -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jan Kameník - Učitelka hudby')) {
        Rename-Item -LiteralPath $dir -NewName 'Jan Kameník - Učitelka hudby'
    }
}

$before = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-\Before'
if (Test-Path -LiteralPath $before) {
    Remove-Item -LiteralPath $before -Recurse -Force
}

'apply-complete'
