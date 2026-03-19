$ErrorActionPreference = 'Stop'

# Repair mojibake folder names from the failed inline pass
$repairs = @(
    @{
        Old = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\BedÃ…â„¢ich Golombek - VysazenÃƒÂ¡ okna'
        New = 'BedÅ™ich Golombek - VysazenÃ¡ okna'
    },
    @{
        Old = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jaroslav Veis - Historka z bezÃ„ÂasÃƒÂ­'
        New = 'Jaroslav Veis - Historka z bezÄasÃ­'
    },
    @{
        Old = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Johannes Urzidil - O mÃƒÂ©m praÃ…Â¾skÃƒÂ©m tatÃƒÂ­Ã„Âkovi'
        New = 'Johannes Urzidil - O mÃ©m praÅ¾skÃ©m tatÃ­Äkovi'
    },
    @{
        Old = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Josef Knap - MaÃ…Â¡kary na PopeleÃ„ÂnÃƒÂ­ stÃ…â„¢edu'
        New = 'Josef Knap - MaÅ¡kary na PopeleÄnÃ­ stÅ™edu'
    }
)
foreach ($repair in $repairs) {
    if (Test-Path -LiteralPath $repair.Old) {
        $target = Join-Path (Split-Path -Parent $repair.Old) $repair.New
        if (-not (Test-Path -LiteralPath $target)) {
            Rename-Item -LiteralPath $repair.Old -NewName $repair.New
        }
    }
}

# Apply approved batch to real AB library

# 1. Bedrich Golombek series
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Golombek_Bedrich-Vysazena_okna_128kbps'
if (Test-Path -LiteralPath $dir) {
    Get-ChildItem -LiteralPath $dir -File -Filter *.mp3 | Sort-Object Name | ForEach-Object {
        if ($_.Name -match '(\d{2})') {
            $new = 'BedÅ™ich Golombek - VysazenÃ¡ okna {0}.mp3' -f $matches[1]
            if ($_.Name -ne $new) {
                Rename-Item -LiteralPath $_.FullName -NewName $new
            }
        }
    }
    $target = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\BedÅ™ich Golombek - VysazenÃ¡ okna'
    if (-not (Test-Path -LiteralPath $target)) {
        Rename-Item -LiteralPath $dir -NewName 'BedÅ™ich Golombek - VysazenÃ¡ okna'
    }
}

# 2. Peter Hartling series
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\HÃ¤rtling_Peter-Ucit_se_zit_128kbps'
if (Test-Path -LiteralPath $dir) {
    Get-ChildItem -LiteralPath $dir -File -Filter *.mp3 | Sort-Object Name | ForEach-Object {
        if ($_.Name -match '(\d{2})') {
            $new = 'Peter HÃ¤rtling - UÄit se Å¾Ã­t {0}.mp3' -f $matches[1]
            if ($_.Name -ne $new) {
                Rename-Item -LiteralPath $_.FullName -NewName $new
            }
        }
    }
    $target = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Peter HÃ¤rtling - UÄit se Å¾Ã­t'
    if (-not (Test-Path -LiteralPath $target)) {
        Rename-Item -LiteralPath $dir -NewName 'Peter HÃ¤rtling - UÄit se Å¾Ã­t'
    }
}

# 3. Single-file folders
$single = @(
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jaroslav Veis'
        NewDir = 'Jaroslav Veis - Historka z bezÄasÃ­'
        NewFile = 'Jaroslav Veis - Historka z bezÄasÃ­.mp3'
    },
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Johannes Urzidil'
        NewDir = 'Johannes Urzidil - O mÃ©m praÅ¾skÃ©m tatÃ­Äkovi'
        NewFile = 'Johannes Urzidil - O mÃ©m praÅ¾skÃ©m tatÃ­Äkovi.mp3'
    },
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Josef Knap'
        NewDir = 'Josef Knap - MaÅ¡kary na PopeleÄnÃ­ stÅ™edu'
        NewFile = 'Josef Knap - MaÅ¡kary na PopeleÄnÃ­ stÅ™edu.mp3'
    }
)

foreach ($op in $single) {
    if (-not (Test-Path -LiteralPath $op.Dir)) {
        continue
    }
    $file = Get-ChildItem -LiteralPath $op.Dir -File -Filter *.mp3 | Select-Object -First 1
    if ($file) {
        Rename-Item -LiteralPath $file.FullName -NewName $op.NewFile
    }
    $target = Join-Path (Split-Path -Parent $op.Dir) $op.NewDir
    if (-not (Test-Path -LiteralPath $target)) {
        Rename-Item -LiteralPath $op.Dir -NewName $op.NewDir
    }
}

# Refresh test folder with exactly 20 new files
$testRoot = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before = Join-Path $testRoot 'Before'
$after = Join-Path $testRoot 'After'
if (Test-Path -LiteralPath $before) {
    Remove-Item -LiteralPath $before -Recurse -Force
}
if (Test-Path -LiteralPath $after) {
    Remove-Item -LiteralPath $after -Recurse -Force
}
New-Item -ItemType Directory -Path $before | Out-Null
New-Item -ItemType Directory -Path $after | Out-Null

$sets = @(
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\BÃ¶ll Heinrich-Chleb mladych let 128kbps\Heinrich BÃ¶ll - ChlÃ©b mladÃ½ch let'
        Before = 'Heinrich BÃ¶ll - ChlÃ©b mladÃ½ch let'
        After = 'Heinrich BÃ¶ll - ChlÃ©b mladÃ½ch let'
        Prefix = 'Heinrich BÃ¶ll - ChlÃ©b mladÃ½ch let '
        Count = 5
    },
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Coudenhove-Calergi_Micu-Pameti_hrabenky_VBR-HQ'
        Before = 'Coudenhove-Calergi_Micu-Pameti_hrabenky_VBR-HQ'
        After = 'Micu Coudenhove-Calergi - PamÄ›ti hrabÄ›nky'
        Prefix = 'Micu Coudenhove-Calergi - PamÄ›ti hrabÄ›nky '
        Count = 5
    },
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Dauthendey_Max-Lingam_VBR-HQ'
        Before = 'Dauthendey_Max-Lingam_VBR-HQ'
        After = 'Max Dauthendey - Lingam'
        Prefix = 'Max Dauthendey - Lingam '
        Count = 5
    },
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\James Henry-Mala cesta po Francii'
        Before = 'James Henry-Mala cesta po Francii'
        After = 'Henry James - MalÃ¡ cesta po Francii'
        Prefix = 'Henry James - MalÃ¡ cesta po Francii '
        Count = 5
    }
)

foreach ($set in $sets) {
    if (-not (Test-Path -LiteralPath $set.Source)) {
        continue
    }
    $beforeDest = Join-Path $before $set.Before
    $afterDest = Join-Path $after $set.After
    New-Item -ItemType Directory -Path $beforeDest | Out-Null
    New-Item -ItemType Directory -Path $afterDest | Out-Null
    Get-ChildItem -LiteralPath $set.Source -File -Filter *.mp3 | Sort-Object Name | Select-Object -First $set.Count | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $beforeDest $_.Name)
        $newName = $_.Name
        if ($_.Name -match '(\d{2})') {
            $newName = '{0}{1}.mp3' -f $set.Prefix, $matches[1]
        }
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $afterDest $newName)
    }
}

Get-ChildItem -LiteralPath $after -Directory | ForEach-Object {
    [pscustomobject]@{
        Name = $_.Name
        Count = (Get-ChildItem -LiteralPath $_.FullName -File -Filter *.mp3 | Measure-Object).Count
    }
} | ConvertTo-Json -Depth 3
