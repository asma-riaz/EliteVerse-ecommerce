<?php
// backend/config/database.php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'eliteverse_db');
define('JWT_SECRET', '$2y$10$vnFXhPyniOcuzAd6hIDOdeGoBlECQ5QMQRIK9m1jsiIxLsFaG5Kgu');

function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
            DB_USER, DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB connection failed']);
        exit;
    }
}

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function sendError($msg, $status = 400) {
    http_response_code($status);
    echo json_encode(['error' => $msg]);
    exit;
}
