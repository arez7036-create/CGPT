try {
    $headers = @{'Content-Type'='application/json'}
    $body = '{"provider":"ollama","model":"llama3.2","messages":[{"role":"user","content":"hello"}],"stream":false}'
    $resp = Invoke-WebRequest -Uri 'http://64.176.75.208:4174/api/chat/completions' -Method Post -Headers $headers -Body $body -TimeoutSec 30
    Write-Host "Status: $($resp.StatusCode)"
    Write-Host "Body: $($resp.Content)"
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    $r = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Error Body: $($r.ReadToEnd())"
}