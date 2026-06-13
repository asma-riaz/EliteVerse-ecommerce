<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db = getDB();

$category = $_GET['category'] ?? null;
$search   = $_GET['search']   ?? null;
$featured = $_GET['featured'] ?? null;
$sort     = $_GET['sort']     ?? 'newest';
$page     = max(1, intval($_GET['page'] ?? 1));
$limit    = intval($_GET['limit'] ?? 12);
$offset   = ($page - 1) * $limit;

$where  = ["p.status = 'active'"];
$params = [];

if ($category) { $where[] = "c.slug = ?"; $params[] = $category; }
if ($search)   { $where[] = "(p.name LIKE ? OR p.description LIKE ?)"; $params[] = "%$search%"; $params[] = "%$search%"; }
if ($featured) { $where[] = "p.featured = 1"; }

$whereSQL = $where ? "WHERE " . implode(" AND ", $where) : "";

$orderSQL = match($sort) {
    'price_asc'  => "ORDER BY COALESCE(p.sale_price, p.price) ASC",
    'price_desc' => "ORDER BY COALESCE(p.sale_price, p.price) DESC",
    'name'       => "ORDER BY p.name ASC",
    default      => "ORDER BY p.created_at DESC"
};

// Count
$countStmt = $db->prepare("SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id $whereSQL");
$countStmt->execute($params);
$total = $countStmt->fetchColumn();

// Products with avg rating
$stmt = $db->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
           COALESCE(AVG(r.rating), 0) AS avg_rating,
           COUNT(r.id) AS review_count
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id
    $whereSQL
    GROUP BY p.id
    $orderSQL
    LIMIT $limit OFFSET $offset
");
$stmt->execute($params);
$products = $stmt->fetchAll();

sendResponse([
    'products'     => $products,
    'total'        => intval($total),
    'page'         => $page,
    'total_pages'  => ceil($total / $limit)
]);
