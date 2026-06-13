<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query("SELECT c.*, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id AND p.status='active' GROUP BY c.id ORDER BY c.name");
    sendResponse($stmt->fetchAll());
}

// POST - admin only
require_once __DIR__ . '/../../config/jwt.php';
requireRole('admin');
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $name = trim($data['name'] ?? '');
    $desc = trim($data['description'] ?? '');
    $img  = trim($data['image_url'] ?? '');
    if (!$name) sendError('Category name required');
    $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
    $stmt = $db->prepare("INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $slug, $desc, $img]);
    sendResponse(['message' => 'Category added', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendError('Category ID required');
    $db->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    sendResponse(['message' => 'Category deleted']);
}
