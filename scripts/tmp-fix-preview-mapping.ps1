$base='\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test Next =-'
$targets=@(
  @{Before='Dominik Landsman, Zuzana Hubeňáková - Deníček moderního páru'; After='Dominik Landsman, Zuzana Hubeňáková - Deníček moderního páru'},
  @{Before='Stephen Clarke - 03 Celkem jde o Merde'; After='Stephen Clarke - Celkem jde o Merde'}
)
foreach($t in $targets){
  $before=Join-Path $base ('Before\' + $t.Before)
  $after=Join-Path $base ('After\' + $t.After)
  if(Test-Path -LiteralPath $after){ Remove-Item -LiteralPath $after -Recurse -Force }
  Copy-Item -LiteralPath $before -Destination $after -Recurse
}
foreach($t in $targets){
  Write-Host "### $($t.After)"
  $before=Get-ChildItem -LiteralPath (Join-Path $base ('Before\' + $t.Before)) -File -Filter *.mp3 | Sort-Object Name | Select-Object Name,@{n='Size';e={$_.Length}}
  $after=Get-ChildItem -LiteralPath (Join-Path $base ('After\' + $t.After)) -File -Filter *.mp3 | Sort-Object Name | Select-Object Name,@{n='Size';e={$_.Length}}
  $same=($before.Count -eq $after.Count)
  if($same){
    for($i=0;$i -lt $before.Count;$i++){
      if($before[$i].Name -ne $after[$i].Name -or $before[$i].Size -ne $after[$i].Size){ $same=$false; break }
    }
  }
  Write-Host "Matched: $same"
}
