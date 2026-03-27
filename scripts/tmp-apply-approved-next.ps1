$ErrorActionPreference='Stop'
$root='\\Synology1621\Hovorene Slovo\-= Audioknihy =-'

# single-file / simple folders from current Next batch
$ops=@(
 @{ Src='Tatjana Tolstaja'; Dst='Taťjana Tolstaja - Setkání s ptákem'; File='Taťjana Tolstaja - Setkání s ptákem.mp3' },
 @{ Src='Villiers de Isle Adam'; Dst="Auguste Villiers de l'Isle-Adam - Slečny de Bienfilatre"; File="Auguste Villiers de l'Isle-Adam - Slečny de Bienfilatre.mp3" },
 @{ Src='Zinaida Gippiusova'; Dst='Zinaida Gippiusová - Svatý hřích'; File='Zinaida Gippiusová - Svatý hřích.mp3' },
 @{ Src='Pianino na rance Lomito'; Dst='Rudolf Sloboda - Pianino a ranč Lomito'; File='Rudolf Sloboda - Pianino a ranč Lomito.mp3' },
 @{ Src='Robert Musil'; Dst='Robert Musil - Penzión Nenávratno'; File='Robert Musil - Penzión Nenávratno.mp3' },
 @{ Src='Seneca-Na kus řeči se Senekou etc mp3 256 2018 04 25-19 59 VBR-HQ'; Dst='Seneca - Na kus řeči se Senekou'; File='Seneca - Na kus řeči se Senekou.mp3' },
 @{ Src='Shakespeare-Zimní pohádka-1960 mp3 2016 12 25-09 58 VBR-HQ'; Dst='William Shakespeare - Zimní pohádka'; File='William Shakespeare - Zimní pohádka.mp3' },
 @{ Src='Sny-Karel IV 2016 05 14-23 58 04 VBR-HQ OK'; Dst='Karel IV. - Sny'; File='Karel IV. - Sny.mp3' },
 @{ Src='Bohumil Hrabal\Legenda o krasne Julince'; Dst='Bohumil Hrabal - Legenda o krásné Julince'; File='Bohumil Hrabal - Legenda o krásné Julince.mp3' },
 @{ Src='James Joyce\Mracek'; Dst='James Joyce - Mraček'; File='James Joyce - Mraček.mp3' },
 @{ Src='O Henry\Policajt a choral'; Dst='O. Henry - Policajt a chorál'; File='O. Henry - Policajt a chorál.mp3' },
 @{ Src='Dominik Landsman\Dominik Landsman, Zuzana Hubeňáková - Deníček moderního páru'; Dst='Dominik Landsman, Zuzana Hubeňáková - Deníček moderního páru'; Preserve=$true },
 @{ Src='Stephen Clarke - Merde!\Stephen Clarke - 03 Celkem jde o Merde'; Dst='Stephen Clarke - Celkem jde o Merde'; Preserve=$true }
)
foreach($op in $ops){
  $src=Join-Path $root $op.Src
  if(-not (Test-Path -LiteralPath $src)){ continue }
  $parent=Split-Path -Parent $src
  $target=Join-Path $parent $op.Dst
  if($op.ContainsKey('Preserve')){
    if((Split-Path -Leaf $src) -ne $op.Dst -and -not (Test-Path -LiteralPath $target)){
      Rename-Item -LiteralPath $src -NewName $op.Dst
    }
    continue
  }
  $f=Get-ChildItem -LiteralPath $src -File -Filter *.mp3 | Select-Object -First 1
  if($f){ Rename-Item -LiteralPath $f.FullName -NewName $op.File }
  if((Split-Path -Leaf $src) -ne $op.Dst -and -not (Test-Path -LiteralPath $target)){
    Rename-Item -LiteralPath $src -NewName $op.Dst
  }
}

# multi-file folders with normalized numbering
$multi=@(
 @{ Src='Betty MacDonaldova\Betty MacDonaldova - Vejce a ja CD 3'; Dst='Betty MacDonaldová - Vejce a já CD 3' },
 @{ Src='Betty MacDonaldova\Betty MacDonaldova - Vejce a ja CD 5'; Dst='Betty MacDonaldová - Vejce a já CD 5' },
 @{ Src='Jaroslav Hasek\Jaroslav Hašek - Osudy dobrého vojáka Švejka (2008)\CD 7'; Dst='Jaroslav Hašek - Osudy dobrého vojáka Švejka CD 7' },
 @{ Src='Jaroslav Hasek\Jaroslav Hašek - Osudy dobrého vojáka Švejka (2008)\CD 8'; Dst='Jaroslav Hašek - Osudy dobrého vojáka Švejka CD 8' },
 @{ Src='Machacek Karel-Utek do Anglie'; Dst='Karel Macháček - Útěk do Anglie' },
 @{ Src='Koskova Sarka-Porazeny Vitez-VBR-HQ'; Dst='Šárka Košková - Poražený vítěz' }
)
foreach($op in $multi){
  $src=Join-Path $root $op.Src
  if(-not (Test-Path -LiteralPath $src)){ continue }
  $mp3s=Get-ChildItem -LiteralPath $src -File -Filter *.mp3 | Sort-Object Name
  $i=1
  foreach($m in $mp3s){
    $new = ('{0} {1:00}.mp3' -f $op.Dst, $i)
    Rename-Item -LiteralPath $m.FullName -NewName $new
    $i++
  }
  $txts=Get-ChildItem -LiteralPath $src -File -Filter *.txt
  foreach($t in $txts){ Rename-Item -LiteralPath $t.FullName -NewName ($op.Dst + '.txt') }
  $parent=Split-Path -Parent $src
  $target=Join-Path $parent $op.Dst
  if((Split-Path -Leaf $src) -ne $op.Dst -and -not (Test-Path -LiteralPath $target)){
    Rename-Item -LiteralPath $src -NewName $op.Dst
  }
}
