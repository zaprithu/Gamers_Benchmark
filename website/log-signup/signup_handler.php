<?php
// Connect to the SQLite database
try {
    $db = new PDO('sqlite:highscores.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get POST data
$username = $_POST['username'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;
$confirm_password = $_POST['confirm_password'] ?? null;

// Simple validation
if (!$username || !$email || !$password || !$confirm_password) {
    die("All fields are required.");
}

if ($password !== $confirm_password) {
    die("Passwords do not match.");
}

// Check if username already exists
try {
    $stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $userExists = $stmt->fetchColumn();

    if ($userExists) {
        die("Username is already taken.");
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert the new user into the database
    $stmt = $db->prepare('INSERT INTO users (username, highscore, password_hash) VALUES (:username, 0, :password_hash)');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password_hash', $hashedPassword);
    $stmt->execute();

    echo "User registered successfully!";
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>
