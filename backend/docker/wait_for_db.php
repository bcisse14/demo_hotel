<?php
// Robust DB readiness check using PDO with Neon endpoint handling
// Exits 0 if SELECT 1 succeeds, non-zero otherwise, printing the error

declare(strict_types=1);

$url = getenv('DATABASE_URL');
if (!$url) {
    fwrite(STDERR, "[wait_for_db] DATABASE_URL not set\n");
    exit(2);
}

// Parse DATABASE_URL (postgresql://user:pass@host:port/dbname?query)
$parts = parse_url($url);
if (!$parts || !isset($parts['host'])) {
    fwrite(STDERR, "[wait_for_db] Invalid DATABASE_URL\n");
    exit(3);
}

$host = $parts['host'];
$port = isset($parts['port']) ? (int)$parts['port'] : 5432;
$db   = isset($parts['path']) ? ltrim($parts['path'], '/') : '';
$user = $parts['user'] ?? '';
$pass = $parts['pass'] ?? '';

$query = [];
$queryStr = parse_url($url, PHP_URL_QUERY) ?: '';
parse_str($queryStr, $query);

// Map query args for DSN
$params = [
    "host=$host",
    "port=$port",
    "dbname=$db",
];

if (!empty($query['sslmode'])) {
    $params[] = 'sslmode='.$query['sslmode'];
}

if (!empty($query['channel_binding'])) {
    $params[] = 'channel_binding='.$query['channel_binding'];
}

// Neon SNI endpoint option if provided as URL-encoded options=endpoint%3D<id>
if (!empty($query['options'])) {
    // options can be like 'endpoint=<id>' already decoded by parse_str
    $options = $query['options'];
    // Ensure proper quoting for PDO pgsql DSN
    $params[] = "options='".$options."'";
}

$dsn = 'pgsql:'.implode(';', $params);

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5,
    ]);
    $pdo->query('SELECT 1');
    echo "[wait_for_db] DB ready (SELECT 1 ok)\n";
    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, "[wait_for_db] Connection failed: ".$e->getMessage()."\n");
    exit(1);
}
