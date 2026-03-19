$ErrorActionPreference = 'Stop'
$testRoot = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before = Join-Path $testRoot 'Before'
$after = Join-Path $testRoot 'After'
foreach ($p in @($testRoot, $before, $after)) { if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Path $p | Out-Null } }
if (Test-Path -LiteralPath $after) { Remove-Item -LiteralPath $after -Recurse -Force }
New-Item -ItemType Directory -Path $after | Out-Null
$sets = @(
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Bohumil Hrabal\Prokopnuty buben'; BeforeName='Bohumil Hrabal - Prokopnuty buben'; AfterName='Bohumil Hrabal - Prokopnutý buben'; Single=@{'Bohumil Hrabal-Prokopnut∞ buben mp3 256_2016_10_17-00_29_VBR-HQ.mp3'='Bohumil Hrabal - Prokopnutý buben.mp3'} },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Broch_Hermann-Ocarovani_128kbps'; BeforeName='Broch_Hermann-Ocarovani_128kbps'; AfterName='Hermann Broch - Očarování'; Prefix='Hermann Broch - Očarování ' },
    @{ Source=(Get-ChildItem -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-' -Recurse -Directory | Where-Object { $_.Name -like '*Chleb_mladych_let_128kbps' } | Select-Object -First 1 -ExpandProperty FullName); BeforeName='Böll_Heinrich-Chleb_mladych_let_128kbps'; AfterName='Heinrich Böll - Chléb mladých let'; Prefix='Heinrich Böll - Chléb mladých let ' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Christoph Janacs'; BeforeName='Christoph Janacs'; AfterName='Christoph Janacs - Pták ve žlabu'; Single=@{'Christoph Janacs-Pták ve ºlabu mp3 256_2017_03_20-22_08_VBR-HQ.mp3'='Christoph Janacs - Pták ve žlabu.mp3'} },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ciler Ilhanova'; BeforeName='Ciler Ilhanova'; AfterName='Ciler Ilhanová - Upřímnost'; Single=@{'Ciler Ilhanová-Up²ímnost mp3 256_2017_04_10-21_59_VBR-HQ.mp3'='Ciler Ilhanová - Upřímnost.mp3'} }
)
foreach ($set in $sets) {
    if (-not $set.Source -or -not (Test-Path -LiteralPath $set.Source)) { continue }
    $beforeDest = Join-Path $before $set.BeforeName
    $afterDest = Join-Path $after $set.AfterName
    if (Test-Path -LiteralPath $beforeDest) { Remove-Item -LiteralPath $beforeDest -Recurse -Force }
    if (Test-Path -LiteralPath $afterDest) { Remove-Item -LiteralPath $afterDest -Recurse -Force }
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
            if ($_.Name -match '(\d{2}) \(([^)]+)\)\.mp3$') {
                $new = '{0}{1} ({2}).mp3' -f $set.Prefix, $matches[1], $matches[2]
                Rename-Item -LiteralPath $_.FullName -NewName $new
            }
        }
    }
}
Get-ChildItem -LiteralPath $after -Directory | Select-Object -ExpandProperty Name | ConvertTo-Json -Depth 3
