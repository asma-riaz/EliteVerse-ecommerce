<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$user   = getAuthUser();
$uid    = $user['user_id'];
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->prepare("
        SELECT c.id, c.quantity, c.product_id,
               p.name, p.price, p.sale_price, p.image_url, p.stock, p.status
        FROM cart c JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? ORDER BY c.created_at DESC
    ");
    $stmt->execute([$uid]);
    $items = $stmt->fetchAll();

    $subtotal = array_sum(array_map(fn($i) => ($i['sale_price'] ?: $i['price']) * $i['quantity'], $items));
    sendResponse(['items' => $items, 'subtotal' => $subtotal, 'count' => count($items)]);
}

$data = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $pid = $data['product_id'] ?? null;
    $qty = max(1, intval($data['quantity'] ?? 1));
    if (!$pid) sendError('Product ID required');

    // check stock
    $pStmt = $db->prepare("SELECT stock FROM products WHERE id = ? AND status = 'active'");
    $pStmt->execute([$pid]);
    $product = $pStmt->fetch();
    if (!$product) sendError('Product not found', 404);

    $stmt = $db->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)");
    $stmt->execute([$uid, $pid, $qty]);
    sendResponse(['message' => 'Added to cart'], 201);
}

if ($method === 'PUT') {
    $cart_id = $data['cart_id'] ?? null;
    $qty     = max(1, intval($data['quantity'] ?? 1));
    if (!$cart_id) sendError('Cart ID required');
    $db->prepare("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?")->execute([$qty, $cart_id, $uid]);
    sendResponse(['message' => 'Cart updated']);
}

if ($method === 'DELETE') {
    $cart_id = $_GET['id'] ?? null;
    if ($cart_id === 'all') {
        $db->prepare("DELETE FROM cart WHERE user_id = ?")->execute([$uid]);
    } else {
        $db->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?")->execute([$cart_id, $uid]);
    }
    sendResponse(['message' => 'Removed from cart']);
}
