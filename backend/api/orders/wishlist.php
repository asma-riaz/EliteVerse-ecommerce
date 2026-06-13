<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$user   = getAuthUser();
$uid    = $user['user_id'];
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->prepare("SELECT w.id, w.product_id, p.name, p.price, p.sale_price, p.image_url, p.slug FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?");
    $stmt->execute([$uid]);
    sendResponse($stmt->fetchAll());
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $pid  = $data['product_id'] ?? null;
    if (!$pid) sendError('Product ID required');
    $stmt = $db->prepare("INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)");
    $stmt->execute([$uid, $pid]);
    sendResponse(['message' => 'Added to wishlist']);
}

if ($method === 'DELETE') {
    $pid = $_GET['product_id'] ?? null;
    if (!$pid) sendError('Product ID required');
    $db->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?")->execute([$uid, $pid]);
    sendResponse(['message' => 'Removed from wishlist']);
}
