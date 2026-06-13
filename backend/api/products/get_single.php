<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db   = getDB();
$slug = $_GET['slug'] ?? null;
$id   = $_GET['id']   ?? null;

if (!$slug && !$id) sendError('Product slug or id required');

if ($slug) {
    $stmt = $db->prepare("SELECT p.*, c.name AS category_name, c.slug AS category_slug,
        COALESCE(AVG(r.rating),0) AS avg_rating, COUNT(r.id) AS review_count
        FROM products p JOIN categories c ON p.category_id = c.id
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.slug = ? GROUP BY p.id");
    $stmt->execute([$slug]);
} else {
    $stmt = $db->prepare("SELECT p.*, c.name AS category_name, c.slug AS category_slug,
        COALESCE(AVG(r.rating),0) AS avg_rating, COUNT(r.id) AS review_count
        FROM products p JOIN categories c ON p.category_id = c.id
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.id = ? GROUP BY p.id");
    $stmt->execute([$id]);
}

$product = $stmt->fetch();
if (!$product) sendError('Product not found', 404);

// Reviews
$rStmt = $db->prepare("SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC");
$rStmt->execute([$product['id']]);
$product['reviews'] = $rStmt->fetchAll();

// Related products
$relStmt = $db->prepare("SELECT id, name, slug, price, sale_price, image_url FROM products WHERE category_id = ? AND id != ? AND status = 'active' LIMIT 4");
$relStmt->execute([$product['category_id'], $product['id']]);
$product['related'] = $relStmt->fetchAll();

sendResponse($product);
