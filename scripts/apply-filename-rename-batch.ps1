$ErrorActionPreference = 'Stop'

$ops = @(
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Anatole France Baltazar'
        Files = @{
            'Anatole France-Baltazar mp3 256_2016_10_11-00_29_VBR-HQ.mp3' = 'Anatole France - Baltazar.mp3'
            'Anatole France-Straƒin zázrak mp3 256_2016_10_10-00_33_VBR-HQ.mp3' = 'Anatole France - Strašín zázrak.mp3'
        }
    }
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Bjorn Larsson'
        NewDir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Björn Larsson - O chemikovi, který předčil svého učitele'
        Files = @{
            'Björn Larsson-O chemikovi, kter∞ p²edƒil svého uƒitele mp3 256_2017_04_24-21_59_VBR-HQ.mp3' = 'Björn Larsson - O chemikovi, který předčil svého učitele.mp3'
        }
    }
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Dorthe Norsova'
        NewDir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Dorthe Norsová - Zimní zahrada a Velké rajče'
        Files = @{
            'Dorthe Norsová-Zimní zahrada a Velké rajƒe mp3 256_2017_02_13-22_00_VBR-HQ.mp3' = 'Dorthe Norsová - Zimní zahrada a Velké rajče.mp3'
        }
    }
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ivan Binar'
        NewDir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Ivan Binar - Jiné světy, jiné životy'
        Files = @{
            'Ivan Binar-Jiné sv╪ty, jiné ºivoty mp3 256_2017_06_24-11_33_VBR-HQ.mp3' = 'Ivan Binar - Jiné světy, jiné životy.mp3'
        }
    }
    @{
        Dir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jan Kamenik'
        NewDir = '\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Jan Kameník - Učitelka hudby'
        Files = @{
            'Jan Kameník-Uƒitelka hudby mp3 256_2017_02_06-22_03_VBR-HQ.mp3' = 'Jan Kameník - Učitelka hudby.mp3'
        }
    }
)

$out = @()
foreach ($op in $ops) {
    if (-not (Test-Path -LiteralPath $op.Dir)) {
        $out += [pscustomobject]@{ Dir = $op.Dir; Status = 'missing_source' }
        continue
    }

    foreach ($old in $op.Files.Keys) {
        $src = Join-Path $op.Dir $old
        if (Test-Path -LiteralPath $src) {
            Rename-Item -LiteralPath $src -NewName $op.Files[$old]
        }
    }

    if ($op.ContainsKey('NewDir')) {
        if (-not (Test-Path -LiteralPath $op.NewDir)) {
            Rename-Item -LiteralPath $op.Dir -NewName (Split-Path $op.NewDir -Leaf)
            $status = 'dir_renamed'
        }
        else {
            $status = 'target_exists'
        }
        $target = $op.NewDir
    }
    else {
        $status = 'files_only'
        $target = $op.Dir
    }

    $out += [pscustomobject]@{ Dir = $target; Status = $status }
}

$before = '\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-\Before'
if (Test-Path -LiteralPath $before) {
    Remove-Item -LiteralPath $before -Recurse -Force
    $out += [pscustomobject]@{ Dir = $before; Status = 'deleted' }
}

$out | ConvertTo-Json -Depth 4
