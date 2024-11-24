<!--
- Name of code artifact: signup_handler.php
- Brief description of what the code does: This php file handles the entered signup information from an use and handles any errors that may show up and inputs users into the database
- Programmer’s name: Chase Entwistle
- Date the code was created: Oct 27, 2024.
- Dates the code was revised:
    • Brief description of each revision & author:
        • Zonaid Prithu - November 24, 2024: Added login-signin session and database functionality
- Preconditions:
• Acceptable Input:
    • Users must access this page using a compatible web browser that supports PHP
- Unacceptable Input:
    • Invalid email formats and empty fields
- Postconditions:
• Return Values or Types:
    • The functionality signs up players, inputs them into the database, and redirects to the login page so that the players may login
-->
<?php
// Connect to the SQLite database
try {
    $db = new PDO('sqlite:../highscores.db');
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
    echo "<script>alert('All fields are required.'); window.location.href='../signup.php';</script>";
    exit;
}

if ($password !== $confirm_password) {
    echo "<script>alert('Passwords do not match.'); window.location.href='../signup.php';</script>";
    exit;
}

// Check if username already exists
try {
    $stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $userExists = $stmt->fetchColumn();

    if ($userExists) {
        echo "<script>alert('Username is already taken.'); window.location.href='../signup.php';</script>";
        exit;
    }

    // Check if email already exists
    $stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE email = :email');
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $emailExists = $stmt->fetchColumn();

    if ($emailExists) {
        echo "<script>alert('Email is already registered.'); window.location.href='../signup.php';</script>";
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert the new user into the database
    $stmt = $db->prepare('INSERT INTO users (username, email, highscore, password_hash) VALUES (:username, :email, 0, :password_hash)');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password_hash', $hashedPassword);
    $stmt->execute();

    echo "<script>alert('User registered successfully!'); window.location.href='../login.html';</script>";
} catch (PDOException $e) {
    echo "<script>alert('Error: " . $e->getMessage() . "'); window.location.href='../signup.php';</script>";
    exit;
}
?>
