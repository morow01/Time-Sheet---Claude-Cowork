$ErrorActionPreference='Stop'
function U([string]$s){ [uri]::UnescapeDataString($s) }

$root='\\Synology1621\Hovorene Slovo\-= Audioknihy =-'

# repair/apply approved batch
$target=U('Bed%C5%99ich%20Golombek%20-%20Vysazen%C3%A1%20okna')
$src=Join-Path $root 'Golombek_Bedrich-Vysazena_okna_128kbps'
$bad=Get-ChildItem -LiteralPath $root -Directory | Where-Object { $_.Name -like 'Bed*Golombek*Vysazen*okna' -and $_.Name -ne $target } | Select-Object -First 1
if($bad){ $src=$bad.FullName }
if(Test-Path -LiteralPath $src){
  Get-ChildItem -LiteralPath $src -File -Filter *.mp3 | Sort-Object Name | ForEach-Object {
    if($_.Name -match '(\d{2})'){
      Rename-Item -LiteralPath $_.FullName -NewName ($target + ' ' + $matches[1] + '.mp3')
    }
  }
  if((Split-Path -Leaf $src) -ne $target){ Rename-Item -LiteralPath $src -NewName $target }
}

$target=U('Peter%20H%C3%A4rtling%20-%20U%C4%8Dit%20se%20%C5%BE%C3%ADt')
$src=Join-Path $root 'Härtling_Peter-Ucit_se_zit_128kbps'
if(Test-Path -LiteralPath $src){
  Get-ChildItem -LiteralPath $src -File -Filter *.mp3 | Sort-Object Name | ForEach-Object {
    if($_.Name -match '(\d{2})'){
      Rename-Item -LiteralPath $_.FullName -NewName ($target + ' ' + $matches[1] + '.mp3')
    }
  }
  Rename-Item -LiteralPath $src -NewName $target
}

$single=@(
  @{ Prefix='Jaroslav Veis'; New=U('Jaroslav%20Veis%20-%20Historka%20z%20bez%C4%8Das%C3%AD') },
  @{ Prefix='Johannes Urzidil'; New=U('Johannes%20Urzidil%20-%20O%20m%C3%A9m%20pra%C5%BEsk%C3%A9m%20tat%C3%AD%C4%8Dkovi') },
  @{ Prefix='Josef Knap'; New=U('Josef%20Knap%20-%20Ma%C5%A1kary%20na%20Popele%C4%8Dn%C3%AD%20st%C5%99edu') }
)
foreach($s in $single){
  $src=Join-Path $root $s.Prefix
  $bad=Get-ChildItem -LiteralPath $root -Directory | Where-Object { $_.Name -like ($s.Prefix + ' - *') -and $_.Name -ne $s.New } | Select-Object -First 1
  if($bad){ $src=$bad.FullName }
  if(Test-Path -LiteralPath $src){
    $f=Get-ChildItem -LiteralPath $src -File -Filter *.mp3 | Select-Object -First 1
    if($f){ Rename-Item -LiteralPath $f.FullName -NewName ($s.New + '.mp3') }
    if((Split-Path -Leaf $src) -ne $s.New){ Rename-Item -LiteralPath $src -NewName $s.New }
  }
}

# restage next 20 files
$testRoot='\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test =-'
$before=Join-Path $testRoot 'Before'
$after=Join-Path $testRoot 'After'
if(Test-Path -LiteralPath $before){ Remove-Item -LiteralPath $before -Recurse -Force }
if(Test-Path -LiteralPath $after){ Remove-Item -LiteralPath $after -Recurse -Force }
New-Item -ItemType Directory -Path $before | Out-Null
New-Item -ItemType Directory -Path $after | Out-Null

$sets=@(
  @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Böll Heinrich-Chleb mladych let 128kbps\Heinrich Böll - Chléb mladých let'; Before=U('Heinrich%20B%C3%B6ll%20-%20Chl%C3%A9b%20mlad%C3%BDch%20let'); After=U('Heinrich%20B%C3%B6ll%20-%20Chl%C3%A9b%20mlad%C3%BDch%20let'); Prefix=U('Heinrich%20B%C3%B6ll%20-%20Chl%C3%A9b%20mlad%C3%BDch%20let%20') },
  @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Coudenhove-Calergi_Micu-Pameti_hrabenky_VBR-HQ'; Before='Coudenhove-Calergi_Micu-Pameti_hrabenky_VBR-HQ'; After=U('Micu%20Coudenhove-Calergi%20-%20Pam%C4%9Bti%20hrab%C4%9Bnky'); Prefix=U('Micu%20Coudenhove-Calergi%20-%20Pam%C4%9Bti%20hrab%C4%9Bnky%20') },
  @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\Dauthendey_Max-Lingam_VBR-HQ'; Before='Dauthendey_Max-Lingam_VBR-HQ'; After='Max Dauthendey - Lingam'; Prefix='Max Dauthendey - Lingam ' },
  @{ Source='\\Synology1621\Hovorene Slovo\-= Audioknihy =-\James Henry-Mala cesta po Francii'; Before='James Henry-Mala cesta po Francii'; After=U('Henry%20James%20-%20Mal%C3%A1%20cesta%20po%20Francii'); Prefix=U('Henry%20James%20-%20Mal%C3%A1%20cesta%20po%20Francii%20') }
)
foreach($set in $sets){
  if(Test-Path -LiteralPath $set.Source){
    $bd=Join-Path $before $set.Before
    $ad=Join-Path $after $set.After
    New-Item -ItemType Directory -Path $bd | Out-Null
    New-Item -ItemType Directory -Path $ad | Out-Null
    Get-ChildItem -LiteralPath $set.Source -File -Filter *.mp3 | Sort-Object Name | Select-Object -First 5 | ForEach-Object {
      Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $bd $_.Name)
      $new=$_.Name
      if($_.Name -match '(\d{2})') { $new = $set.Prefix + $matches[1] + '.mp3' }
      Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $ad $new)
    }
  }
}

Get-ChildItem -LiteralPath $after -Directory | ForEach-Object { [pscustomobject]@{Name=$_.Name; Count=(Get-ChildItem -LiteralPath $_.FullName -File -Filter *.mp3 | Measure-Object).Count} } | Format-Table -AutoSize | Out-String -Width 300
