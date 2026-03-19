$ErrorActionPreference = 'Stop'

$testRoot = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before = Join-Path $testRoot 'Before'
$after = Join-Path $testRoot 'After'

foreach ($p in @($testRoot, $before, $after)) {
    if (-not (Test-Path -LiteralPath $p)) {
        New-Item -ItemType Directory -Path $p | Out-Null
    }
}

$bollSource = Get-ChildItem -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-' -Recurse -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like '*Chleb_mladych_let_128kbps' } |
    Select-Object -First 1 -ExpandProperty FullName

$sets = @(
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Bohumil Hrabal\Prokopnuty buben'
        BeforeName = 'Bohumil Hrabal - Prokopnuty buben'
        AfterName = 'Bohumil Hrabal - Prokopnutý buben'
        Renames = @{
            'Bohumil Hrabal-Prokopnut∞ buben mp3 256_2016_10_17-00_29_VBR-HQ.mp3' = 'Bohumil Hrabal - Prokopnutý buben.mp3'
        }
    }
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Broch_Hermann-Ocarovani_128kbps'
        BeforeName = 'Broch_Hermann-Ocarovani_128kbps'
        AfterName = 'Hermann Broch - Očarování'
        Renames = @{}
    }
    @{
        Source = $bollSource
        BeforeName = 'Böll_Heinrich-Chleb_mladych_let_128kbps'
        AfterName = 'Heinrich Böll - Chléb mladých let'
        Renames = @{}
    }
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Christoph Janacs'
        BeforeName = 'Christoph Janacs'
        AfterName = 'Christoph Janacs - Pták ve žlabu'
        Renames = @{
            'Christoph Janacs-Pták ve ºlabu mp3 256_2017_03_20-22_08_VBR-HQ.mp3' = 'Christoph Janacs - Pták ve žlabu.mp3'
        }
    }
    @{
        Source = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ciler Ilhanova'
        BeforeName = 'Ciler Ilhanova'
        AfterName = 'Ciler Ilhanová - Upřímnost'
        Renames = @{
            'Ciler Ilhanová-Up²ímnost mp3 256_2017_04_10-21_59_VBR-HQ.mp3' = 'Ciler Ilhanová - Upřímnost.mp3'
        }
    }
)

function Repair-Name {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    $fixed = $Name
    $fixed = $fixed.Replace([string][char]0x0192, 'č')
    $fixed = $fixed.Replace([string][char]0x221E, 'ý')
    $fixed = $fixed.Replace([string][char]0x00B2, 'ř')
    $fixed = $fixed.Replace([string][char]0x00BA, 'ž')
    $fixed = $fixed.Replace([string][char]0x03C4, 'š')
    $fixed = $fixed.Replace([string][char]0x256A, 'ě')
    $fixed = $fixed.Replace([string][char]0x2565, 'Ď')
    $fixed = $fixed.Replace('mp3 256_', '')
    $fixed = $fixed.Replace('_VBR-HQ', '')
    $fixed = $fixed.Replace('  ', ' ')
    return $fixed
}

$brochMap = @{}
Get-ChildItem -LiteralPath '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Broch_Hermann-Ocarovani_128kbps' -File -Filter *.mp3 |
    Sort-Object Name |
    ForEach-Object {
        $new = Repair-Name $_.Name
        $new = $new.Replace('Hermann Broch-', 'Hermann Broch - ')
        $brochMap[$_.Name] = $new
    }
$sets[1].Renames = $brochMap

$bollMap = @{}
Get-ChildItem -LiteralPath $bollSource -File -Filter *.mp3 |
    Sort-Object Name |
    ForEach-Object {
        $new = Repair-Name $_.Name
        $new = $new.Replace('Heinrich Böll-', 'Heinrich Böll - ')
        $new = $new.Replace('mladých let', 'mladých let ')
        $new = $new.Replace('  ', ' ')
        $bollMap[$_.Name] = $new
    }
$sets[2].Renames = $bollMap

$out = @()
foreach ($set in $sets) {
    if (-not (Test-Path -LiteralPath $set.Source)) {
        continue
    }

    $beforeDest = Join-Path $before $set.BeforeName
    $afterDest = Join-Path $after $set.AfterName

    if (Test-Path -LiteralPath $beforeDest) {
        Remove-Item -LiteralPath $beforeDest -Recurse -Force
    }
    if (Test-Path -LiteralPath $afterDest) {
        Remove-Item -LiteralPath $afterDest -Recurse -Force
    }

    Copy-Item -LiteralPath $set.Source -Destination $beforeDest -Recurse
    Copy-Item -LiteralPath $set.Source -Destination $afterDest -Recurse

    foreach ($old in $set.Renames.Keys) {
        $target = Join-Path $afterDest $old
        if (Test-Path -LiteralPath $target) {
            Rename-Item -LiteralPath $target -NewName $set.Renames[$old]
        }
    }

    $out += [pscustomobject]@{
        Source = $set.Source
        Before = $beforeDest
        After = $afterDest
        RenamedFiles = @($set.Renames.Values)
    }
}

$out | ConvertTo-Json -Depth 6
