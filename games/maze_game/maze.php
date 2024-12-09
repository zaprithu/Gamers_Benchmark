<!-- maze.php -->
<!-- A maze game where player must reach treasure while avoiding minotaurs -->
<!-- Author: Christopher Gronewold -->
<!-- Created: 10/26/2024 -->
<!-- Edited: 12/8/2024 - Converted to PHP file for session management -->
<!-- Preconditions: Requires modern web browser with HTML5 support -->
<!-- Postconditions: Displays game interface -->
<!-- Error conditions: None -->
<!-- Side effects: None -->
<!-- Invariants: None -->
<!-- Known faults: None -->

<?php
session_start(); // Start the PHP session

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'];

// Access the username stored in the session, with a fallback
$username = $isLoggedIn ? $_SESSION['username'] : null;
?>

<!DOCTYPE html>                                           <!-- Declares HTML5 document type -->
<html>                                                   <!-- Root HTML element -->
<head>                                                   <!-- Document head section -->
    <title>Gamers Benchmark</title>                     <!-- Sets browser tab title -->
    <link rel="stylesheet" type="text/css" href="../../index.css"> <!-- Links to main CSS -->
    <link rel="stylesheet" href="style.css">            <!-- Links to game CSS file -->
</head>                                                 <!-- End of head section -->
<body>                                                  <!-- Document body section -->
    <!-- Navigation Bar -->
    <div class="navbar">                               <!-- Navigation bar container -->
        <div class="logo">                             <!-- Logo container -->
            <h2>Gamers Benchmark</h2>                  <!-- Website title -->
        </div>                                         <!-- End logo container -->
        
        <div class="nav-links">                        <!-- Navigation links container -->
            <a href="../../index.php">Home</a>         <!-- Home link -->
            <a href="../../website/leaderboard/leaderboard.php">Leaderboard</a> <!-- Leaderboard link -->
            <a href="../../website/about/about.php">About</a> <!-- About link -->
            <?php if ($isLoggedIn): ?>                 <!-- Check if user is logged in -->
                <a href="../../website/log-signup/handlers/logout.php" class="btn">Sign Out</a> <!-- Sign out button -->
                <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a> <!-- Profile button -->
            <?php else: ?>                             <!-- If user is not logged in -->
                <a href="../../website/log-signup/login.php" class="btn">Login</a> <!-- Login button -->
                <a href="../../website/log-signup/signup.php" class="btn">Sign Up</a> <!-- Sign up button -->
            <?php endif; ?>                            <!-- End PHP if statement -->
        </div>                                         <!-- End navigation links -->
    </div>                                            <!-- End navigation bar -->

    <div id="game-container">                          <!-- Main container for game elements -->
        <canvas id="gameCanvas"></canvas>              <!-- Canvas element where game is drawn -->
        <div id="overlay">                             <!-- Overlay for game messages -->
            <div id="message">Press any key to start</div>  <!-- Text display for game messages -->
        </div>                                         <!-- End of overlay div -->
    </div>                                            <!-- End of game container -->

    <!-- Footer -->
    <div class="footer">                              <!-- Footer container -->
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p> <!-- Footer content -->
    </div>                                            <!-- End footer -->

    <script src="maze.js"></script>                   <!-- Links to external JavaScript file -->
</body>                                               <!-- End of body section -->
</html>                                               <!-- End of HTML document -->