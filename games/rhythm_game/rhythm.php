<!-- rhythm.html -->
<!-- A rhythm game -->
<!-- Author: Chase Entwistle -->
<!-- Created: 10/26/2024 -->
<!-- Preconditions: Requires modern web browser with HTML5 support -->
<!-- Postconditions: Displays game interface -->
<!-- Error conditions: None -->
<!-- Side effects: None -->
<!-- Invariants: None -->
<!-- Known faults: None -->

<!DOCTYPE html>                                           <!-- Declares HTML5 document type -->
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
    <link rel="stylesheet" type="text/css" href="style.css"> 
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

    <div class="hero">
        <div id="game-container">                          <!-- Main container for game elements -->
            <div id="overlay">                             <!-- Overlay for game messages -->
                <div id="message">Press space to start</div>  <!-- Text display for game messages -->
            </div>                                         <!-- End of overlay div -->
            <canvas id="gameCanvas" width="500" height="600"></canvas>              <!-- Canvas element where game is drawn -->
        </div>                                            <!-- End of game container -->
    </div>
    <script src="rhythm.js"></script>                   <!-- Links to external JavaScript file -->

    <!-- Footer -->
    <div class="footer">
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </div>
</body>

</html>
