$inputPath = "e:\Elenty.app\scratch\eas_build.log"
$outputPath = "e:\Elenty.app\scratch\eas_build_text.log"

try {
    $inputFS = [System.IO.File]::OpenRead($inputPath)
    $outputFS = [System.IO.File]::Create($outputPath)
    $gzipStream = New-Object System.IO.Compression.GZipStream($inputFS, [System.IO.Compression.CompressionMode]::Decompress)

    $gzipStream.CopyTo($outputFS)

    $gzipStream.Close()
    $outputFS.Close()
    $inputFS.Close()
    Write-Host "Success: Decompressed log to $outputPath"
} catch {
    Write-Error "Error decompressing: $_"
}
