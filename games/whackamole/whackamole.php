<!--
  Estimate Game
  HTML Page for the game
  Made by: Zonaid Prithu

  Created 11/4/2024
  Edited 11/10/2024:
      Added comments (Zonaid)
  Edited 11/24/2024:
      Added login-signin session and database functionality (Zonaid)
  Preconditions:
      Player must press the "Start Game" button in order to play the game
  Postconditions:
      The final score from the player's game is displayed.
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
    <link rel="stylesheet" type="text/css" href="style.css"> <!-- Link to external CSS file for styling -->
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
            <a href="leaderboard.html">Leaderboard</a>
            <a href="../../website/about/about.php">About</a>
            <!-- Show logout and profile buttons only if logged in -->
            <?php if ($isLoggedIn): ?>
                <a href="../../website/log-signup/handlers/logout.php" class="btn">Sign Out</a>
                <a href="profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a>
            <?php else: ?>
                <!-- Show Login and Sign Up buttons if not logged in -->
                <a href="../../website/log-signup/login.html" class="btn">Login</a>
                <a href="../../website/log-signup/signup.php" class="btn">Sign Up</a>
            <?php endif; ?>
        </div>
    </div>
    <!-- Whack-A-Mole Game -->
    <div class="game">
        <h1 class="score">SCORE: <span>00</span></h1>
        <div class="timer">TIME: <span>30</span>s</div>
        <button class="start-button">Start Game</button>
        
        <div class="board">
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
        </div>

        <div class="end-screen">
            <h2>Game Over!</h2>
            <p>Your Score: <span class="final-score">0</span></p>
            <button class="play-again-button">Play Again</button>
        </div>

        <!-- Sets Cursor to be a Hammer -->
        <div class="cursor"></div>

        <!-- Script to Run Game -->
        <script src="main.js"></script>
    </div>
</body>
</html>
