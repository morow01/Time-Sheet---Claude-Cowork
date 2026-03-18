$cookies = "_ga=GA1.1.589896920.1773779823; stitialcookie=1; uid=911255; pass=42bd11fe0deecff9b9d2567e37885633; _ga_GQP9ZGYTXS=GS2.1.s1773784286$o2$g1$t1773788505$j34$l0$h0"
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
$out_file = "Torrents/all_ids_51_216.json-snippet.txt"

$results = New-Object System.Collections.Generic.List[string]

for ($p = 50; $p -le 215; $p++) {
    Write-Host "Processing page $($p + 1)..."
    $url = "https://sktorrent.eu/torrent/torrents.php?active=1&category=24&order=data&by=DESC&zaner=&jazyk=&page=$p"
    $html_file = "Torrents/temp_page.html"
    
    & curl.exe -s -L -H "Cookie: $cookies" -H "User-Agent: $ua" -o $html_file $url
    
    if (!(Test-Path $html_file) -or (Get-Item $html_file).Length -lt 1000) {
        Write-Host "Failed to download page $($p + 1). stopping."
        break
    }
    
    $content = Get-Content -Raw $html_file
    
    $matches = [regex]::Matches($content, 'href=details\.php\?id=([a-f0-9]{40}).*?>(.*?)</a>', ([System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline))
    
    foreach ($m in $matches) {
        $id = $m.Groups[1].Value
        $title = $m.Groups[2].Value -replace '<[^>]+>', '' # Remove inner tags
        $title = $title.Trim()
        
        if ($id -and $title) {
            $json = '{"id":"' + $id + '","title":"' + ($title -replace '"', '\"') + '"}'
            $results.Add($json)
        }
    }
    
    # Safety delay
    Start-Sleep -Milliseconds 200
}

$results | Set-Content -Path $out_file
Write-Host "Finished extraction. Total items: $($results.Count)"
