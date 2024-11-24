<!--
  Estimate Game
  HTML Page for the game
  Made by: Ethan Dirkes

  Created 10/26/2024
  Edited 10/27/2024 (Ethan):
      - Added comments 
  Edited 11/24/2024 (Zonaid):
      - Added login-signin session and database functionality
  Preconditions:
      Player must input a string as their guess for how many objects are present.
  Postconditions:
      Results from player guess are displayed.
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

  <div class="game-space">

    <!-- Header and description for game -->
    <h1>Estimate Number of Objects</h1>
    <p>
      A number of objects will be displayed in the game window.
      Objects are shown for 10 seconds, and then they are cleared
      from the window. Guess how many appeared!
    </p>
    
    <!-- Play button-->
    <button id="play_btn" class="btn" onclick="generateObjects()">Play</button>
    
    <!-- Display game -->
    <canvas id="canvas" class="game-window" width=400 height=400></canvas>
    
    <!-- Estimation submission text field and submit button -->
    <div>
      <input type="text" name="est_submission" id="est_submission" placeholder="Guess a number...">
      <button id="est_submit_btn" class="btn-d" onclick="answerSubmitted()">Submit</button>
    </div>

    <!-- Results of guess -->
    <p id="results">Results: </p>

    <!-- Compile functions for WebGL -->
    <script src="./webgl.js"></script>

    <!-- Script to run the game -->
    <script src="./estimate_game.js"></script>
  </div>

  <!-- div for spacing, probably better formatting available,
        this was just a quick solution i needed 
  -->
  <div style="height: 10vh"></div>

  <!-- Footer -->
  <div class="footer">
    <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
  </div>

</body>
</html>