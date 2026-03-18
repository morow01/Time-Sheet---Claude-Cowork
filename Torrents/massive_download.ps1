$cookies = "_ga=GA1.1.589896920.1773779823; stitialcookie=1; uid=911255; pass=42bd11fe0deecff9b9d2567e37885633; _ga_GQP9ZGYTXS=GS2.1.s1773784286$o2$g1$t1773788505$j34$l0$h0"
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
$batch_file = "Torrents/batch_12_216.jsonl"
$output_dir = "Torrents/"

if (!(Test-Path $output_dir)) { New-Item -ItemType Directory -Path $output_dir }

$items = Get-Content -Path $batch_file
$total = $items.Count
$count = 0

Write-Host "Starting massive download of $total torrents..."

foreach ($line in $items) {
    $count++
    if ($line -match '\{"id":\s*"(?<id>[^"]+)",\s*"title":\s*"(?<title>[^"]+)"\}') {
        $id = $matches['id']
        $title = $matches['title']
        
        # Clean title for filename
        $safe_title = $title -replace '[\/\\:\*\?"<>\|]', '_'
        $filename = "$($safe_title).torrent"
        $file_path = Join-Path $output_dir $filename
        
        if (Test-Path $file_path) {
            Write-Host "[$count/$total] Skipping (already exists): $filename"
            continue
        }
        
        Write-Host "[$count/$total] Downloading: $filename"
        $download_url = "https://sktorrent.eu/torrent/download.php?id=$id"
        
        & curl.exe -s -L -H "Cookie: $cookies" -H "User-Agent: $ua" -o $file_path $download_url
        
        # Check if file is valid torrent (at least some size)
        if ((Get-Item $file_path).Length -lt 500) {
            Write-Host "Warning: Downloaded file for '$title' seems too small. Check session."
        }
        
        # Random delay between 100ms and 300ms
        Start-Sleep -Milliseconds (Get-Random -Minimum 100 -Maximum 300)
    }
}

Write-Host "Massive mission complete!"
