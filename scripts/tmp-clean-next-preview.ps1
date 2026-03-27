$done='\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test Next =-'
if(Test-Path -LiteralPath $done){ Remove-Item -LiteralPath $done -Recurse -Force }
$current='\\Synology1621\Hovorene Slovo\-= Manual Check =-\-= Filename Rename Test Next 2 =-'
[pscustomobject]@{DoneExists=(Test-Path -LiteralPath $done); CurrentExists=(Test-Path -LiteralPath $current)} | Format-Table -AutoSize | Out-String -Width 200
