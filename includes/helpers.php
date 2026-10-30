<?php
/**
 * Helper dasar MerchVerse.
 * Menghitung base URL proyek agar link dan asset tetap benar
 * baik saat dijalankan lewat XAMPP (htdocs/merchverse) maupun
 * PHP built-in server.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function base_url(string $path = ''): string
{
    static $base = null;

    if ($base === null) {
        $base = '/';
        $appRoot = realpath(dirname(__DIR__));
        $scriptFile = isset($_SERVER['SCRIPT_FILENAME']) ? realpath($_SERVER['SCRIPT_FILENAME']) : '';
        $scriptName = isset($_SERVER['SCRIPT_NAME']) ? str_replace('\\', '/', $_SERVER['SCRIPT_NAME']) : '';

        // Utamakan SCRIPT_NAME agar tetap benar saat aplikasi diakses lewat
        // sub-path (mis. /merchverse/) meskipun DOCUMENT_ROOT berbeda.
        if ($appRoot && $scriptFile && $scriptName !== '') {
            $appRoot = str_replace('\\', '/', $appRoot);
            $scriptFile = str_replace('\\', '/', $scriptFile);

            if (strpos($scriptFile, $appRoot) === 0) {
                $relScript = '/' . ltrim(substr($scriptFile, strlen($appRoot)), '/');
                $suffixLen = strlen($relScript);

                if ($suffixLen > 1 && substr($scriptName, -$suffixLen) === $relScript) {
                    $prefix = trim(substr($scriptName, 0, -$suffixLen), '/');
                    $base = $prefix === '' ? '/' : '/' . $prefix . '/';
                }
            }
        }

        $docRoot = isset($_SERVER['DOCUMENT_ROOT']) ? realpath($_SERVER['DOCUMENT_ROOT']) : '';

        if ($base === '/' && $appRoot && $docRoot) {
            $appRoot = str_replace('\\', '/', $appRoot);
            $docRoot = rtrim(str_replace('\\', '/', $docRoot), '/');

            if ($docRoot !== '' && strpos($appRoot, $docRoot) === 0) {
                $relative = trim(substr($appRoot, strlen($docRoot)), '/');
                $base = $relative === '' ? '/' : '/' . $relative . '/';
            }
        }
    }

    return $base . ltrim($path, '/');
}

function asset_url(string $path): string
{
    $rel = 'assets/' . ltrim($path, '/');
    $file = dirname(__DIR__) . '/' . $rel;
    // Cache-busting: tambah ?v=<waktu ubah file> agar browser tidak memakai CSS/JS lama
    $ver = is_file($file) ? filemtime($file) : time();
    return base_url($rel) . '?v=' . $ver;
}

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function rupiah($value): string
{
    return 'Rp ' . number_format((float) $value, 0, ',', '.');
}

/**
 * Ikon garis (inline SVG) agar antarmuka tidak memakai emoji.
 * Cerminan dari MV_ICONS pada assets/js/icons.js — jaga keduanya sinkron.
 */
function icon(string $name, string $className = 'icon'): string
{
    static $icons = [
        'apparel' => '<path d="M9 3 4.5 5.2A2 2 0 0 0 3.5 7v3l2 .6V21h13V10.6l2-.6V7a2 2 0 0 0-1-1.8L15 3a3 3 0 0 1-6 0Z"/>',
        'accessories' => '<path d="M12 3a4 4 0 0 1 4 4v1h1.5A1.5 1.5 0 0 1 19 9.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V9.5A1.5 1.5 0 0 1 6.5 8H8V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v1h4V7a2 2 0 0 0-2-2Z"/>',
        'collectibles' => '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
        'custom' => '<path d="M12 3a9 9 0 0 0 0 18 2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H18a3 3 0 0 0 3-3 9 9 0 0 0-9-8.6Z"/><circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="16.5" cy="10.5" r="1.2" fill="currentColor" stroke="none"/>',
        'search' => '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        'cart' => '<path d="M3 4h2l2.4 11.2A2 2 0 0 0 9.4 17h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>',
        'user' => '<circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/>',
        'bank' => '<path d="M3 9.5 12 4l9 5.5"/><path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9"/><path d="M3 20h18"/>',
        'truck' => '<path d="M3 6h10v9H3z"/><path d="M13 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
        'upload' => '<path d="M12 16V5"/><path d="m7.5 9.5 4.5-4.5 4.5 4.5"/><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',
        'image' => '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-5 3.5 3.5L16 12l4 4.5"/>',
        'check' => '<path d="m5 13 4 4 10-10"/>',
        'clock' => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        'tag' => '<path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8" cy="8" r="1.4"/>',
        'mail' => '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        'menu' => '<path d="M4 7h16M4 12h16M4 17h16"/>',
        'arrowRight' => '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
        'alert' => '<path d="M12 4 2.5 20h19z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>',
        'lock' => '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
        'box' => '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
        'palette' => '<path d="M12 3a9 9 0 0 0 0 18 2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H18a3 3 0 0 0 3-3 9 9 0 0 0-9-8.6Z"/>',
        'ruler' => '<rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
        'shirt' => '<path d="m9 3-5 2.4V10h2v11h12V10h2V5.4L15 3a3 3 0 0 1-6 0Z"/>',
    ];

    $body = $icons[$name] ?? $icons['box'];

    return '<svg class="' . e($className) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $body . '</svg>';
}
