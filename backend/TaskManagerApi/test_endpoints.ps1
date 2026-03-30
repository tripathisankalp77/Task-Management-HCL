$ErrorActionPreference="Stop"
try {
  $res = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body (Get-Content payload_login.json -Raw)
  $token = $res.token
  Write-Host "Token received"

  # Create a task
  $taskJson = '{"title":"My Test Task","description":"Task description","status":"Pending"}'
  $taskRes = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token"} -Body $taskJson
  Write-Host "Created task: $($taskRes.id) | $($taskRes.title)"

  # Get tasks
  $tasksGet = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method GET -Headers @{"Authorization"="Bearer $token"}
  Write-Host "Tasks count: $($tasksGet.Count)"
} catch {
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  Write-Host "ERROR: $($reader.ReadToEnd())"
}
