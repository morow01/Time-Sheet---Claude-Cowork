$ErrorActionPreference = 'Stop'
$testRoot = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before = Join-Path $testRoot 'Before'
$after = Join-Path $testRoot 'After'
if (Test-Path -LiteralPath $before) { Remove-Item -LiteralPath $before -Recurse -Force }
if (Test-Path -LiteralPath $after) { Remove-Item -LiteralPath $after -Recurse -Force }
New-Item -ItemType Directory -Path $before | Out-Null
New-Item -ItemType Directory -Path $after | Out-Null

$sets = @(
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Drozda_Zdenek-Kosi_hnizdo_128kbps'; Before='Drozda_Zdenek-Kosi_hnizdo_128kbps'; After='Zdeněk Drozda - Kosí hnízdo'; Prefix='Zdeněk Drozda - Kosí hnízdo ' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Durych_Jaroslav-Bozi_duha_128kbps'; Before='Durych_Jaroslav-Bozi_duha_128kbps'; After='Jaroslav Durych - Boží duha'; Prefix='Jaroslav Durych - Boží duha ' },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Fjodor Michajlovic Dostojevskij'; Before='Fjodor Michajlovic Dostojevskij'; After='Fjodor Michajlovič Dostojevskij - Román v devíti dopisech'; Single=@{'Fjodor Michajloviƒ Dostojevskij-Román v devíti dopisech mp3 256_2016_10_09-02_30_VBR-HQ.mp3'='Fjodor Michajlovič Dostojevskij - Román v devíti dopisech.mp3'} },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Francis Scott Fitzgerald\Brousena Misa'; Before='Brousena Misa'; After='Francis Scott Fitzgerald - Broušená mísa'; Single=@{'Francis Scott Fitzgerald-Brouτená mísa mp3 256_2017_03_13-21_59_VBR-HQ.mp3'='Francis Scott Fitzgerald - Broušená mísa.mp3'} },
    @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Frantisek Kubka'; Before='Frantisek Kubka'; After='František Kubka - Skytský jezdec'; Single=@{'Frantiτek Kubka-Skytsk∞ jezdec mp3 256_2016_10_16-02_29_VBR-HQ.mp3'='František Kubka - Skytský jezdec.mp3'} }
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
            if ($_.Name -match '(\d{2}) \(([^)]+)\)\.mp3$') {
                $new = '{0}{1} ({2}).mp3' -f $set.Prefix, $matches[1], $matches[2]
                Rename-Item -LiteralPath $_.FullName -NewName $new
            }
        }
    }
}

Get-ChildItem -LiteralPath $after -Recurse -File -Filter *.mp3 | Measure-Object | Select-Object Count | ConvertTo-Json -Depth 3
