<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET - no auth needed
if ($method === 'GET') {
    $db   = getDB();
    $stmt = $db->query("SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC");
    sendResponse($stmt->fetchAll());
}

requireRole('admin');
$db   = getDB();
$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $name       = trim($data['name'] ?? '');
    $cat_id     = $data['category_id'] ?? null;
    $desc       = trim($data['description'] ?? '');
    $price      = $data['price'] ?? 0;
    $sale_price = $data['sale_price'] ?: null;
    $stock      = $data['stock'] ?? 0;
    $image_url  = trim($data['image_url'] ?? '');
    $featured   = $data['featured'] ?? 0;
    $status     = $data['status'] ?? 'active';

    if (!$name || !$cat_id || !$price) sendError('Name, category and price required');

    $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name)) . '-' . time();

    $stmt = $db->prepare("INSERT INTO products (category_id, name, slug, description, price, sale_price, stock, image_url, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$cat_id, $name, $slug, $desc, $price, $sale_price, $stock, $image_url, $featured, $status]);
    sendResponse(['message' => 'Product added', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id         = $data['id'] ?? null;
    $name       = trim($data['name'] ?? '');
    $cat_id     = $data['category_id'] ?? null;
    $desc       = trim($data['description'] ?? '');
    $price      = $data['price'] ?? 0;
    $sale_price = $data['sale_price'] ?: null;
    $stock      = $data['stock'] ?? 0;
    $image_url  = trim($data['image_url'] ?? '');
    $featured   = $data['featured'] ?? 0;
    $status     = $data['status'] ?? 'active';

    if (!$id) sendError('Product ID required');

    $stmt = $db->prepare("UPDATE products SET category_id=?, name=?, description=?, price=?, sale_price=?, stock=?, image_url=?, featured=?, status=? WHERE id=?");
    $stmt->execute([$cat_id, $name, $desc, $price, $sale_price, $stock, $image_url, $featured, $status, $id]);
    sendResponse(['message' => 'Product updated']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendError('Product ID required');
    $db->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    sendResponse(['message' => 'Product deleted']);
}
