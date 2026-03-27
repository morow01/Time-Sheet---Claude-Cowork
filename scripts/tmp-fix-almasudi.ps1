$after='\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test Next 2 =-\After\Abú l-Hasan Alí ibn al-Husain al-Masúdí - Rýžoviště zlata a doly drahokamů'
$inner=Join-Path $after 'Al-Masudi-Ryzoviste_zlata_a_doly_drahokamu_VBR-HQ'
if(Test-Path -LiteralPath $inner){
  Get-ChildItem -LiteralPath $inner -File | ForEach-Object { Move-Item -LiteralPath $_.FullName -Destination $after -Force }
  Remove-Item -LiteralPath $inner -Recurse -Force
}
$map=@{
  'Al-Masudi-Ryzoviste_zlata01 20110509 + 2301_VBR-HQ.mp3'='Abú l-Hasan Alí ibn al-Husain al-Masúdí - Rýžoviště zlata a doly drahokamů 01.mp3'
  'Al-Masudi-Ryzoviste_zlata02 20110510 + 2301_VBR-HQ.mp3'='Abú l-Hasan Alí ibn al-Husain al-Masúdí - Rýžoviště zlata a doly drahokamů 02.mp3'
  'Al-Masudi-Ryzoviste_zlata03 20110511 + 2301_VBR-HQ.mp3'='Abú l-Hasan Alí ibn al-Husain al-Masúdí - Rýžoviště zlata a doly drahokamů 03.mp3'
  'Al-Masudi-Ryzoviste_zlata04 20110512 + 2304_VBR-HQ.mp3'='Abú l-Hasan Alí ibn al-Husain al-Masúdí - Rýžoviště zlata a doly drahokamů 04.mp3'
  'Al-Masudi-Ryzoviste_zlata05 20110513 + 2300_VBR-HQ.mp3'='Abú l-Hasan Alí ibn al-Husain al-Masúdí - Rýžoviště zlata a doly drahokamů 05.mp3'
  'Seznam_odkazu.txt'='Abú l-Hasan Alí ibn al-Husain al-Masúdí - Rýžoviště zlata a doly drahokamů.txt'
}
foreach($old in $map.Keys){
  $p=Join-Path $after $old
  if(Test-Path -LiteralPath $p){ Rename-Item -LiteralPath $p -NewName $map[$old] }
}
Get-ChildItem -LiteralPath $after -File | Select-Object -ExpandProperty Name
