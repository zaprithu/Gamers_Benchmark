<!--
  Baggle Game
  PHP Page for the game
  Made by: Christopher Gronewold

  Created 11/10/2024
  Edited 12/8/2024
      Added header and footer
      Converted to PHP file for session management
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

<!DOCTYPE html> <!-- Declares the document type -->
<html lang="en"> <!-- Opens the HTML document and sets the language to English -->
<head> <!-- Opens the head section of the HTML document -->
    <meta charset="UTF-8"> <!-- Sets the character encoding for the document -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Sets the viewport for responsive design -->
    <title>Gamers Benchmark</title> <!-- Sets the title of the webpage -->
    <link rel="stylesheet" type="text/css" href="../../index.css"> <!-- Links to the main CSS file -->
    <link rel="stylesheet" href="baggle.css"> <!-- Links to the game-specific CSS file -->
</head> <!-- Closes the head section -->

<body> <!-- Opens the body section of the HTML document -->
    <!-- Navigation Bar -->
    <div class="navbar"> <!-- Creates the navigation bar container -->
        <div class="logo"> <!-- Creates the logo container -->
            <h2>Gamers Benchmark</h2> <!-- Displays the website title -->
        </div> <!-- Closes the logo container -->
        
        <div class="nav-links"> <!-- Creates the navigation links container -->
            <a href="../../index.php">Home</a> <!-- Link to home page -->
            <a href="../../website/leaderboard/leaderboard.php">Leaderboard</a> <!-- Link to leaderboard page -->
            <a href="../../website/about/about.php">About</a> <!-- Link to about page -->
            <?php if ($isLoggedIn): ?> <!-- Checks if user is logged in -->
                <a href="../../website/log-signup/handlers/logout.php" class="btn">Sign Out</a> <!-- Sign out button for logged in users -->
                <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a> <!-- Profile button with username -->
            <?php else: ?> <!-- If user is not logged in -->
                <a href="../../website/log-signup/login.php" class="btn">Login</a> <!-- Login button -->
                <a href="../../website/log-signup/signup.php" class="btn">Sign Up</a> <!-- Sign up button -->
            <?php endif; ?> <!-- Ends the PHP if statement -->
        </div> <!-- Closes the navigation links container -->
    </div> <!-- Closes the navigation bar container -->

    <div class="container"> <!-- Creates a container div for the game content -->
        <h1>Baggle</h1> <!-- Displays the game title -->
        <div id="board"></div> <!-- Creates a div for the game board -->
        <input type="text" id="word-input" placeholder="Enter word"> <!-- Creates an input field for word entry -->
        <button id="submit-word">Submit Word</button> <!-- Creates a button to submit words -->
        <div id="score">Score: 0</div> <!-- Displays the current score -->
        <div id="timer">Time: 180</div> <!-- Displays the remaining time -->
        <div id="word-list"></div> <!-- Creates a div to display the list of found words -->
    </div> <!-- Closes the container div -->

    <!-- Footer -->
    <div class="footer"> <!-- Creates the footer container -->
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p> <!-- Displays footer content -->
    </div> <!-- Closes the footer container -->

    <script src="baggle.js"></script> <!-- Links to the external JavaScript file -->
</body> <!-- Closes the body section -->
</html> <!-- Closes the HTML document -->