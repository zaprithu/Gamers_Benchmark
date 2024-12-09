<!--
  Bullet Hell Game
  PHP Page for the game
  Made by: Christopher Gronewold

  Created 11/10/2024
  Edited 12/8/2024
      Converted to PHP file
  Preconditions:
      Player must press the "Start Game" button in order to play the game
  Postconditions:
      The final time from the player's game is displayed.
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

<!DOCTYPE html> <!-- Declare document type -->
<html lang="en"> <!-- HTML root element with language attribute -->
<head> <!-- Head section start -->
    <meta charset="UTF-8"> <!-- Specify character encoding -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsive viewport meta tag -->
    <title>Gamers Benchmark</title> <!-- Set page title -->
    <link rel="stylesheet" type="text/css" href="../../index.css"> <!-- Link to main CSS -->
    <link rel="stylesheet" href="bullet_hell.css"> <!-- Link to game CSS file -->
</head> <!-- Head section end -->
<body> <!-- Body section start -->
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
        <canvas id="gameCanvas"></canvas> <!-- Game canvas element -->
        <audio id="backgroundMusic" src="God Shave The Queen.mp3"></audio> <!-- Background music audio element -->
        <button id="startButton">Start Game</button> <!-- Start game button -->
    </div> <!-- End game container -->

    <!-- Footer -->
    <div class="footer"> <!-- Footer container -->
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p> <!-- Footer content -->
    </div> <!-- End footer -->

    <script src="bullet_hell.js"></script> <!-- Link to JavaScript file -->
</body> <!-- Body section end -->
</html> <!-- HTML root element end -->