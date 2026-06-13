<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

requireRole('admin');
$db = getDB();

// Totals
$stats = [];
foreach ([
    'total_revenue'  => "SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE status != 'cancelled'",
    'total_orders'   => "SELECT COUNT(*) FROM orders",
    'total_customers'=> "SELECT COUNT(*) FROM users WHERE role = 'customer'",
    'total_products' => "SELECT COUNT(*) FROM products WHERE status = 'active'",
    'pending_orders' => "SELECT COUNT(*) FROM orders WHERE status = 'pending'",
    'low_stock'      => "SELECT COUNT(*) FROM products WHERE stock <= 5 AND status = 'active'",
] as $key => $sql) {
    $stats[$key] = $db->query($sql)->fetchColumn();
}

// Monthly revenue (last 6 months)
$monthly = $db->query("
    SELECT DATE_FORMAT(created_at,'%b') AS month, SUM(total_amount) AS revenue, COUNT(*) AS orders
    FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) AND status != 'cancelled'
    GROUP BY DATE_FORMAT(created_at,'%Y-%m') ORDER BY created_at
")->fetchAll();

// Orders by status
$byStatus = $db->query("SELECT status, COUNT(*) AS count FROM orders GROUP BY status")->fetchAll();

// Recent orders
$recent = $db->query("
    SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at, u.name AS customer_name
    FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10
")->fetchAll();

// Top products
$topProducts = $db->query("
    SELECT p.name, p.image_url, SUM(oi.quantity) AS sold, SUM(oi.quantity * oi.price) AS revenue
    FROM order_items oi JOIN products p ON oi.product_id = p.id
    GROUP BY oi.product_id ORDER BY sold DESC LIMIT 5
")->fetchAll();

sendResponse(compact('stats', 'monthly', 'byStatus', 'recent', 'topProducts'));
