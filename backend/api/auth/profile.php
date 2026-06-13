<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$user = getAuthUser();
$db   = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare("SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?");
    $stmt->execute([$user['user_id']]);
    sendResponse($stmt->fetch());
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data  = json_decode(file_get_contents('php://input'), true);
    $name  = trim($data['name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $stmt  = $db->prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?");
    $stmt->execute([$name, $phone, $user['user_id']]);
    sendResponse(['message' => 'Profile updated']);
}
