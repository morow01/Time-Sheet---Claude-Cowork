$ErrorActionPreference = 'Stop'
$testRoot = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before = Join-Path $testRoot 'Before'
$after = Join-Path $testRoot 'After'
if (Test-Path -LiteralPath $before) { Remove-Item -LiteralPath $before -Recurse -Force }
if (Test-Path -LiteralPath $after) { Remove-Item -LiteralPath $after -Recurse -Force }
New-Item -ItemType Directory -Path $before | Out-Null
New-Item -ItemType Directory -Path $after | Out-Null
$sets = @(
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Herbert Eisenreich - Loučením k lásce'; Before='Herbert Eisenreich - Loučením k lásce'; After='Herbert Eisenreich - Loučením k lásce'; Old='Herbert Eisenreich-Louƒením k lásce mp3 256_2017_03_04-11_30_VBR-HQ.mp3'; New='Herbert Eisenreich - Loučením k lásce.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jaroslav Veis'; Before='Jaroslav Veis'; After='Jaroslav Veis - Historka z bezčasí'; Old='Jaroslav Veis-Historka z bezƒasí mp3 256_2017_01_07-11_30_VBR-HQ.mp3'; New='Jaroslav Veis - Historka z bezčasí.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Johannes Urzidil'; Before='Johannes Urzidil'; After='Johannes Urzidil - O mém pražském tatíčkovi'; Old='Johannes Urzidil-O mém praºském tatíƒkovi mp3 256_2017_05_27-11_31_VBR-HQ.mp3'; New='Johannes Urzidil - O mém pražském tatíčkovi.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Josef Knap'; Before='Josef Knap'; After='Josef Knap - Maškary na Popeleční středu'; Old='Josef Knap-Maτkary na Popeleƒní st²edu mp3 256_2017_03_11-11_29_VBR-HQ.mp3'; New='Josef Knap - Maškary na Popeleční středu.mp3' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ludwig Winder'; Before='Ludwig Winder'; After='Ludwig Winder - Legenda o ošklivém člověku'; Old='Ludwig Winder-Legenda o oτklivém ƒlov╪ku mp3 256_2017_02_04-11_30_VBR-HQ.mp3'; New='Ludwig Winder - Legenda o ošklivém člověku.mp3' }
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
