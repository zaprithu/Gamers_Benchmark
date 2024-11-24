<!--
- Name of code artifact: login_handler.php
- Brief description of what the code does: This php file controls the functionality wherein users are able to log in to an account on the Gamers Benchmark website, and recieve an appropriate response depending on the validity of the fields they fill out
- Programmer’s name: Zonaid Prithu
- Date the code was created: Nov 23, 2024.
- Dates the code was revised:
    • Brief description of each revision & author:
        • Zonaid Prithu - November 24, 2024: Added login-signin session and database functionality
- Preconditions:
• Acceptable Input:
    • Users must access this page using a compatible web browser that supports php
    • Users must use valid input
- Unacceptable Input:
    • Invalid Credentials
- Postconditions:
• Return Values or Types:
    • The function either logs one in or handles any applicable error
-->
<?php
session_start(); // Start the session

// Connect to the SQLite database
try {
    $db = new PDO('sqlite:../highscores.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get POST data
$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

// Simple validation
if (!$username || !$password) {
    echo "<script>alert('Both fields are required.'); window.location.href='login.html';</script>";
    exit;
}

// Check if the user exists and validate password
try {
    $stmt = $db->prepare('SELECT password_hash FROM users WHERE username = :username');
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $hashedPassword = $stmt->fetchColumn();

    if ($hashedPassword && password_verify($password, $hashedPassword)) {
        // Set session variables to maintain login state
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $username;

        // Redirect to the homepage
        header('Location: ../../../index.php');
        exit;
    } else {
        // Invalid credentials
        echo "<script>alert('Invalid username or password.'); window.location.href='../login.php';</script>";
        exit;
    }
} catch (PDOException $e) {
    echo "<script>alert('Error: " . $e->getMessage() . "'); window.location.href='../login.html';</script>";
    exit;
}
?>
