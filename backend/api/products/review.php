<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $user   = getAuthUser();
    $data   = json_decode(file_get_contents('php://input'), true);
    $pid    = $data['product_id'] ?? null;
    $rating = intval($data['rating'] ?? 0);
    $comment= trim($data['comment'] ?? '');

    if (!$pid || $rating < 1 || $rating > 5) sendError('Product ID and rating (1-5) required');

    $stmt = $db->prepare("INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?, comment = ?");
    $stmt->execute([$pid, $user['user_id'], $rating, $comment, $rating, $comment]);
    sendResponse(['message' => 'Review submitted'], 201);
}
