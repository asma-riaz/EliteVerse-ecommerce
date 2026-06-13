<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$data     = json_decode(file_get_contents('php://input'), true);
$email    = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$email || !$password) sendError('Email and password required');

$db   = getDB();
$stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) sendError('Invalid credentials', 401);

$token = generateJWT(['user_id' => $user['id'], 'role' => $user['role'], 'name' => $user['name'], 'email' => $user['email']]);

sendResponse([
    'token' => $token,
    'user'  => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role'], 'phone' => $user['phone']]
]);
