$ErrorActionPreference = 'Stop'

# Apply approved batch to real AB library
# 1. Zdenek Drozda series
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Drozda_Zdenek-Kosi_hnizdo_128kbps'
if (Test-Path -LiteralPath $dir) {
    Get-ChildItem -LiteralPath $dir -File -Filter *.mp3 | Sort-Object Name | ForEach-Object {
        if ($_.Name -match '(\d{2}) \([^)]+\)\.mp3$') {
            $new = 'Zdeněk Drozda - Kosí hnízdo {0}.mp3' -f $matches[1]
            if ($_.Name -ne $new) { Rename-Item -LiteralPath $_.FullName -NewName $new }
        }
    }
    if (-not (Test-Path -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Zdeněk Drozda - Kosí hnízdo')) {
        Rename-Item -LiteralPath $dir -NewName 'Zdeněk Drozda - Kosí hnízdo'
    }
}

# 2. Jaroslav Durych series
$dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Durych_Jaroslav-Bozi_duha_128kbps'
if (Test-Path -LiteralPath $dir) {
    Get-ChildItem -LiteralPath $dir -File -Filter *.mp3 | Sort-Object Name | ForEach-Object {
        if ($_.Name -match '(\d{2}) \([^)]+\)\.mp3$') {
            $new = 'Jaroslav Durych - Boží duha {0}.mp3' -f $matches[1]
            if ($_.Name -ne $new) { Rename-Item -LiteralPath $_.FullName -NewName $new }
        }
    }
    if (-not (Test-Path -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jaroslav Durych - Boží duha')) {
        Rename-Item -LiteralPath $dir -NewName 'Jaroslav Durych - Boží duha'
    }
}

# 3. Single-file folders
$single = @(
    @{Dir='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Fjodor Michajlovic Dostojevskij'; NewDir='Fjodor Michajlovič Dostojevskij - Román v devíti dopisech'; Pattern='Fjodor*'; NewFile='Fjodor Michajlovič Dostojevskij - Román v devíti dopisech.mp3'},
    @{Dir='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Francis Scott Fitzgerald\Brousena Misa'; NewDir='Francis Scott Fitzgerald - Broušená mísa'; Pattern='Francis Scott Fitzgerald*'; NewFile='Francis Scott Fitzgerald - Broušená mísa.mp3'},
    @{Dir='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Frantisek Kubka'; NewDir='František Kubka - Skytský jezdec'; Pattern='Franti*Kubka*'; NewFile='František Kubka - Skytský jezdec.mp3'}
)
foreach ($op in $single) {
    if (-not (Test-Path -LiteralPath $op.Dir)) { continue }
    $f = Get-ChildItem -LiteralPath $op.Dir -File | Where-Object { $_.Name -like $op.Pattern } | Select-Object -First 1
    if ($f) { Rename-Item -LiteralPath $f.FullName -NewName $op.NewFile }
    $parent = Split-Path -Parent $op.Dir
    $target = Join-Path $parent $op.NewDir
    if (-not (Test-Path -LiteralPath $target)) { Rename-Item -LiteralPath $op.Dir -NewName $op.NewDir }
}

# Refresh test folder with next 20 scrambled audiobook examples
$testRoot = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before = Join-Path $testRoot 'Before'
$after = Join-Path $testRoot 'After'
if (Test-Path -LiteralPath $before) { Remove-Item -LiteralPath $before -Recurse -Force }
if (Test-Path -LiteralPath $after) { Remove-Item -LiteralPath $after -Recurse -Force }
New-Item -ItemType Directory -Path $before | Out-Null
New-Item -ItemType Directory -Path $after | Out-Null

$sets = @(
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Golombek_Bedrich-Vysazena_okna_128kbps'; Before='Golombek_Bedrich-Vysazena_okna_128kbps'; After='Bedřich Golombek - Vysazená okna'; Prefix='Bedřich Golombek - Vysazená okna ' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Härtling_Peter-Ucit_se_zit_128kbps'; Before='Härtling_Peter-Ucit_se_zit_128kbps'; After='Peter Härtling - Učit se žít'; Prefix='Peter Härtling - Učit se žít ' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jaroslav Veis'; Before='Jaroslav Veis'; After='Jaroslav Veis - Historka z bezčasí'; Single=@{'Jaroslav Veis-Historka z bezƒasí mp3 256_2017_01_07-11_30_VBR-HQ.mp3'='Jaroslav Veis - Historka z bezčasí.mp3'} },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Johannes Urzidil'; Before='Johannes Urzidil'; After='Johannes Urzidil - O mém pražském tatíčkovi'; Single=@{'Johannes Urzidil-O mém praºském tatíƒkovi mp3 256_2017_05_27-11_31_VBR-HQ.mp3'='Johannes Urzidil - O mém pražském tatíčkovi.mp3'} },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Josef Knap'; Before='Josef Knap'; After='Josef Knap - Maškary na Popeleční středu'; Single=@{'Josef Knap-Maτkary na Popeleƒní st²edu mp3 256_2017_03_11-11_29_VBR-HQ.mp3'='Josef Knap - Maškary na Popeleční středu.mp3'} }
)
foreach ($set in $sets) {
    if (-not (Test-Path -LiteralPath $set.Source)) { continue }
    $beforeDest = Join-Path $before $set.Before
    $afterDest = Join-Path $after $set.After
    Copy-Item -LiteralPath $set.Source -Destination $beforeDest -Recurse
    Copy-Item -LiteralPath $set.Source -Destination $afterDest -Recurse
    if ($set.ContainsKey('Single')) {
        foreach ($old in $set.Single.Keys) {
            $target = Join-Path $afterDest $old
            if (Test-Path -LiteralPath $target) { Rename-Item -LiteralPath $target -NewName $set.Single[$old] }
        }
    }
    if ($set.ContainsKey('Prefix')) {
        Get-ChildItem -LiteralPath $afterDest -File -Filter *.mp3 | Sort-Object Name | ForEach-Object {
            if ($_.Name -match '(\d{2}) \([^)]+\)\.mp3$') {
                $new = '{0}{1}.mp3' -f $set.Prefix, $matches[1]
                Rename-Item -LiteralPath $_.FullName -NewName $new
            }
        }
    }
}
Get-ChildItem -LiteralPath $after -Directory | Select-Object -ExpandProperty Name | ConvertTo-Json -Depth 3
