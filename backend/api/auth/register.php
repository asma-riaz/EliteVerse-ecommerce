<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$data     = json_decode(file_get_contents('php://input'), true);
$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$phone    = trim($data['phone'] ?? '');

if (!$name || !$email || !$password) sendError('Name, email and password required');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) sendError('Invalid email');
if (strlen($password) < 6) sendError('Password min 6 characters');

$db   = getDB();
$stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) sendError('Email already registered');

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $db->prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, 'customer', ?)");
$stmt->execute([$name, $email, $hash, $phone]);
$userId = $db->lastInsertId();

$token = generateJWT(['user_id' => $userId, 'role' => 'customer', 'name' => $name, 'email' => $email]);
sendResponse(['token' => $token, 'user' => ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => 'customer', 'phone' => $phone]], 201);
