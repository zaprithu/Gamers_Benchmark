<!--
    Simon Says Game
    HTML file for simon says game page
    Made by: Ethan Dirkes

    Created 11/9/2024
    Edited 11/10/2024 (Ethan):
        - Added comments
    Edited 11/24/2024 (Zonaid):
        - Added login-signin session and database functionality
    Preconditions:
        Only inputs are mouse clicks on the color buttons
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
        <h1>Simon Says Sequence Game</h1>
        <p>
            As the buttons below flash, memorize the sequence and
            then repeat the pattern. After each round the length of the
            sequence will increase. See how far you can go!
        </p>

        <!-- Play button-->
        <button class="btn" id="start">Play</button>

        <!-- Game board -->
        <div id="gameboard">
            <!-- Color buttons for game -->
            <div class="color" id="blue"></div>
            <div class="color" id="red"></div>
            <div class="color" id="green"></div>
            <div class="color" id="yellow"></div>
        </div>

        <!-- Display results -->
        <p id="results"></p>

        <!-- JS file that runs game logic -->
        <script src="sequence.js"></script>

    </div>

    <!-- Footer -->
    <div class="footer">
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </div>
</body>

</html>