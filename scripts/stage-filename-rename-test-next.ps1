$ErrorActionPreference = 'Stop'
$testRoot = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before = Join-Path $testRoot 'Before'
$after = Join-Path $testRoot 'After'
if (Test-Path -LiteralPath $before) { Remove-Item -LiteralPath $before -Recurse -Force }
if (Test-Path -LiteralPath $after) { Remove-Item -LiteralPath $after -Recurse -Force }
New-Item -ItemType Directory -Path $before | Out-Null
New-Item -ItemType Directory -Path $after | Out-Null
$sets = @(
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Anatole France Baltazar'; Before='Anatole France Baltazar'; After='Anatole France - Strašín zázrak'; Old='Anatole France-Straƒin zázrak mp3 256_2016_10_10-00_33_VBR-HQ.mp3'; New='Anatole France - Strašín zázrak.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Bjorn Larsson'; Before='Bjorn Larsson'; After='Björn Larsson - O chemikovi, který předčil svého učitele'; Old='Björn Larsson-O chemikovi, kter∞ p²edƒil svého uƒitele mp3 256_2017_04_24-21_59_VBR-HQ.mp3'; New='Björn Larsson - O chemikovi, který předčil svého učitele.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Dorthe Norsova'; Before='Dorthe Norsova'; After='Dorthe Norsová - Zimní zahrada a Velké rajče'; Old='Dorthe Norsová-Zimní zahrada a Velké rajƒe mp3 256_2017_02_13-22_00_VBR-HQ.mp3'; New='Dorthe Norsová - Zimní zahrada a Velké rajče.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ivan Binar'; Before='Ivan Binar'; After='Ivan Binar - Jiné světy, jiné životy'; Old='Ivan Binar-Jiné sv╪ty, jiné ºivoty mp3 256_2017_06_24-11_33_VBR-HQ.mp3'; New='Ivan Binar - Jiné světy, jiné životy.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jan Kamenik'; Before='Jan Kamenik'; After='Jan Kameník - Učitelka hudby'; Old='Jan Kameník-Uƒitelka hudby mp3 256_2017_02_06-22_03_VBR-HQ.mp3'; New='Jan Kameník - Učitelka hudby.mp3' }
)
$out = @()
foreach ($s in $sets) {
    if (-not (Test-Path -LiteralPath $s.Source)) { continue }
    $b = Join-Path $before $s.Before
    $a = Join-Path $after $s.After
    Copy-Item -LiteralPath $s.Source -Destination $b -Recurse
    Copy-Item -LiteralPath $s.Source -Destination $a -Recurse
    $target = Join-Path $a $s.Old
    if (Test-Path -LiteralPath $target) { Rename-Item -LiteralPath $target -NewName $s.New }
    $out += [pscustomobject]@{ Before=$b; After=$a; NewFile=$s.New }
}
$out | ConvertTo-Json -Depth 4
