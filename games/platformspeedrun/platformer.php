<!--
  Platformer Game
  PHP Page for the game
  Made by: Christopher Gronewold

  Created 11/24/2024
  Edited 12/8/2024:
      - Converted to PHP file for session management
      - Added header and footer
  Preconditions:
      None
  Postconditions:
      Game canvas and scripts are loaded
  Errors/exceptions:
      None
  Side effects:
      None
  Invariants:
      None
  Known faults:
      None
-->

<?php
session_start(); // Start the PHP session

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'];

// Access the username stored in the session, with a fallback
$username = $isLoggedIn ? $_SESSION['username'] : null;
?>

<!DOCTYPE html> <!-- Declares that this is an HTML5 document -->
<html lang="en"> <!-- Opens the HTML tag and sets the language to English -->
<head> <!-- Opens the head section of the HTML document -->
    <meta charset="UTF-8"> <!-- Sets the character encoding for the document -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Sets the viewport for responsive design -->
    <title>Gamers Benchmark</title> <!-- Sets the title of the webpage -->
    <link rel="stylesheet" type="text/css" href="../../index.css"> <!-- Links to main CSS file -->
    <link rel="stylesheet" href="platformer.css"> <!-- Links to the game-specific CSS file -->
</head> <!-- Closes the head section -->

<body> <!-- Opens the body section of the HTML document -->
    <!-- Navigation Bar -->
    <div class="navbar"> <!-- Navigation bar container -->
        <div class="logo"> <!-- Logo container -->
            <h2>Gamers Benchmark</h2> <!-- Website title -->
        </div> <!-- End logo container -->
        
        <div class="nav-links"> <!-- Navigation links container -->
            <a href="../../index.php">Home</a> <!-- Home link -->
            <a href="../../website/leaderboard/leaderboard.php">Leaderboard</a> <!-- Leaderboard link -->
            <a href="../../website/about/about.php">About</a> <!-- About link -->
            <?php if ($isLoggedIn): ?> <!-- Check if user is logged in -->
                <a href="../../website/log-signup/handlers/logout.php" class="btn">Sign Out</a> <!-- Sign out button -->
                <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a> <!-- Profile button -->
            <?php else: ?> <!-- If user is not logged in -->
                <a href="../../website/log-signup/login.php" class="btn">Login</a> <!-- Login button -->
                <a href="../../website/log-signup/signup.php" class="btn">Sign Up</a> <!-- Sign up button -->
            <?php endif; ?> <!-- End PHP if statement -->
        </div> <!-- End navigation links -->
    </div> <!-- End navigation bar -->

    <div class="game-container"> <!-- Game container -->
        <canvas id="gameCanvas"></canvas> <!-- Creates a canvas element for the game -->
    </div> <!-- End game container -->

    <!-- Footer -->
    <div class="footer"> <!-- Footer container -->
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p> <!-- Footer content -->
    </div> <!-- End footer -->

    <script src="platformer.js"></script> <!-- Links to the external JavaScript file -->
</body> <!-- Closes the body section -->
</html> <!-- Closes the HTML tag -->