<!--
    Spot the Object
    HTML file for spot the object game page
    Made by: Tommy Lam

    Created 11/9/2024
    Edited 11/10/2024 (Tommy):
        - Added comments
    Edited 11/24/2024 (Zonaid):
        - Added login-signin session and database functionality
    Preconditions:
        Only inputs are mouse clicks on game objects
    Postconditions:
        Final score of the game
    Errors:
        None
    Side effects:
        None
    Invariants:
        None
    Known faults:
        None
-->
<?php
session_start();

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'];

// Access the username stored in the session, with a fallback
$username = $isLoggedIn ? $_SESSION['username'] : null;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Basic HTML metadata for page setup -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamers Benchmark</title>
    <link rel="stylesheet" type="text/css" href="../../index.css"> 
    <link rel="stylesheet" type="text/css" href="../game.css"> <!-- Link to external CSS file for styling -->
</head>
<body>

    <!-- Navigation Bar -->
    <div class="navbar">
        <!-- Site logo/title -->
        <div class="logo">
            <h2>Gamers Benchmark</h2>
        </div>
        <!-- Navigation links to various sections/pages -->
        <div class="nav-links">
            <a href="../../index.php">Home</a>
            <a href="../../website/leaderboard/leaderboard.php">Leaderboard</a>
            <a href="../../website/about/about.php">About</a>
            <!-- Show logout and profile buttons only if logged in -->
            <?php if ($isLoggedIn): ?>
                <a href="../../website/log-signup/handlers/logout.php" class="btn">Sign Out</a>
                <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a>
            <?php else: ?>
                <!-- Show Login and Sign Up buttons if not logged in -->
                <a href="../../website/log-signup/login.php" class="btn">Login</a>
                <a href="../../website/log-signup/signup.php" class="btn">Sign Up</a>
            <?php endif; ?>
        </div>
    </div>

    <div class="game-space">
        <!-- Header and description for game -->
        <h1>Spot the Object Game</h1>
        <p>
            Welcome to Spot the Object! Test your visual perception and speed.
            When you click 'Play', you'll be shown an object to find among similar distractors.
            Click on the matching object as quickly as you can - your time will be recorded!
            Try to beat your best time with each attempt.
        </p>

        <!-- JS file that runs game logic -->
        <script src="./spot.js"></script>
        <div class="controls">
            <!-- Play button-->
            <button class="btn" id="start">Play</button>
        </div>

        <div class="hint-container" id="hint-container"></div>
        <div class="game-canvas" id="game-canvas"></div>

    </div>

    <!-- Footer -->
    <div class="footer">
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </div>
</body>

</html>