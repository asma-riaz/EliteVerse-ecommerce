<?php
// backend/config/jwt.php
require_once __DIR__ . '/database.php';

function base64url_encode($d) { return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); }
function base64url_decode($d) { return base64_decode(strtr($d, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($d)) % 4)); }

function generateJWT($payload) {
    $h = base64url_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + 86400 * 7; // 7 days
    $p = base64url_encode(json_encode($payload));
    $s = base64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    return "$h.$p.$s";
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    [$h, $p, $s] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $s)) return false;
    $data = json_decode(base64url_decode($p), true);
    if ($data['exp'] < time()) return false;
    return $data;
}

function getAuthUser() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!$auth || !str_starts_with($auth, 'Bearer ')) sendError('Unauthorized', 401);
    $user = verifyJWT(substr($auth, 7));
    if (!$user) sendError('Invalid or expired token', 401);
    return $user;
}

function requireRole($role) {
    $user = getAuthUser();
    if ($user['role'] !== $role) sendError('Forbidden', 403);
    return $user;
}

function optionalAuth() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!$auth || !str_starts_with($auth, 'Bearer ')) return null;
    return verifyJWT(substr($auth, 7));
}
