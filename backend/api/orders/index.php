<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$user   = getAuthUser();
$uid    = $user['user_id'];
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        // single order
        $stmt = $db->prepare("INSERT INTO orders (user_id, order_number, total_amount, shipping_fee, payment_method, shipping_address, notes, card_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$uid, $orderNum, $total, $shipping, $payment_method, $address, $notes, $card_details]);
        $order = $stmt->fetch();
        if (!$order) sendError('Order not found', 404);

        $iStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $iStmt->execute([$id]);
        $order['items'] = $iStmt->fetchAll();
        sendResponse($order);
    }

    // list orders
    if ($user['role'] === 'admin') {
        $stmt = $db->query("SELECT o.*, u.name AS customer_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC");
    } else {
        $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$uid]);
    }
    sendResponse($stmt->fetchAll());
}

if ($method === 'POST') {
    $data           = json_decode(file_get_contents('php://input'), true);
    $address        = $data['shipping_address'] ?? '';
    $payment_method = $data['payment_method']   ?? 'cod';
    $notes          = $data['notes']             ?? '';

    if (!$address) sendError('Shipping address required');

    // Get cart items
    $cStmt = $db->prepare("SELECT c.*, p.price, p.sale_price, p.name AS product_name, p.image_url, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
    $cStmt->execute([$uid]);
    $cartItems = $cStmt->fetchAll();
    if (!$cartItems) sendError('Cart is empty');

    $subtotal = array_sum(array_map(fn($i) => ($i['sale_price'] ?: $i['price']) * $i['quantity'], $cartItems));
    $shipping = 150;
    $total    = $subtotal + $shipping;
    $orderNum = 'ORD-' . strtoupper(uniqid());

    $db->beginTransaction();
    try {
        $stmt = $db->prepare("INSERT INTO orders (user_id, order_number, total_amount, shipping_fee, payment_method, shipping_address, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$uid, $orderNum, $total, $shipping, $payment_method, $address, $notes]);
        $orderId = $db->lastInsertId();

        foreach ($cartItems as $item) {
            $price = $item['sale_price'] ?: $item['price'];
            $iStmt = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price) VALUES (?, ?, ?, ?, ?, ?)");
            $iStmt->execute([$orderId, $item['product_id'], $item['product_name'], $item['image_url'], $item['quantity'], $price]);
            // Reduce stock
            $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?")->execute([$item['quantity'], $item['product_id']]);
        }

        // Clear cart
        $db->prepare("DELETE FROM cart WHERE user_id = ?")->execute([$uid]);

        $db->commit();
        sendResponse(['message' => 'Order placed successfully', 'order_number' => $orderNum, 'order_id' => $orderId], 201);
    } catch (Exception $e) {
        $db->rollBack();
        sendError('Order failed: ' . $e->getMessage(), 500);
    }
}

if ($method === 'PUT') {
    requireRole('admin');
    $data   = json_decode(file_get_contents('php://input'), true);
    $id     = $data['id'] ?? null;
    $status = $data['status'] ?? null;
    if (!$id || !$status) sendError('ID and status required');
    $db->prepare("UPDATE orders SET status = ? WHERE id = ?")->execute([$status, $id]);
    sendResponse(['message' => 'Order status updated']);
}

$payment_method = $data['payment_method'] ?? 'cod';
$card_details   = null;

if ($payment_method === 'card') {
    $card = $data['card_details'] ?? [];
    $card_details = json_encode([
        'card_name'   => $card['card_name']   ?? '',
        'card_number' => '****' . substr($card['card_number'] ?? '', -4), 
        'expiry'      => $card['expiry']       ?? '',
    ]);
}