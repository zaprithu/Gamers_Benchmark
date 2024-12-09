<!-- rhythm.php -->
<!-- A rhythm game -->
<!-- Author: Chase Entwistle -->
<!-- Created: 10/26/2024 -->
<!-- Preconditions: Requires modern web browser with HTML5 support -->
<!-- Postconditions: Displays game interface -->
<!-- Error conditions: None -->
<!-- Side effects: None -->
<!-- Invariants: None -->
<!-- Known faults: None -->

<!DOCTYPE html> <!-- Declares document type -->
<?php // Start PHP code block
session_start(); // Initialize PHP session

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in']; // Set login status

// Access the username stored in the session, with a fallback
$username = $isLoggedIn ? $_SESSION['username'] : null; // Get username if logged in
?>

<!DOCTYPE html> <!-- Declares document type -->
<html lang="en"> <!-- Sets document language to English -->
<head> <!-- Start of head section -->
    <meta charset="UTF-8"> <!-- Sets character encoding -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Sets viewport properties -->
    <title>Gamers Benchmark</title> <!-- Sets page title -->
    <link rel="stylesheet" type="text/css" href="../../index.css"> <!-- Links main stylesheet -->
    <link rel="stylesheet" type="text/css" href="style.css"> <!-- Links game-specific stylesheet -->
</head> <!-- End of head section -->
<body> <!-- Start of body section -->
    <div class="page-container"> <!-- Main page container -->
        <!-- Navigation Bar -->
        <div class="navbar"> <!-- Navigation bar container -->
            <div class="logo"> <!-- Logo container -->
                <h2>Gamers Benchmark</h2> <!-- Site title -->
            </div> <!-- End logo container -->
            <div class="nav-links"> <!-- Navigation links container -->
                <a href="../../index.php">Home</a> <!-- Home link -->
                <a href="../../website/leaderboard/leaderboard.php">Leaderboard</a> <!-- Leaderboard link -->
                <a href="../../website/about/about.php">About</a> <!-- About link -->
                <?php if ($isLoggedIn): ?> <!-- Check if user is logged in -->
                    <a href="../../website/log-signup/handlers/logout.php" class="btn">Sign Out</a> <!-- Logout button -->
                    <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a> <!-- Profile link -->
                <?php else: ?> <!-- If user is not logged in -->
                    <a href="../../website/log-signup/login.php" class="btn">Login</a> <!-- Login button -->
                    <a href="../../website/log-signup/signup.php" class="btn">Sign Up</a> <!-- Sign up button -->
                <?php endif; ?> <!-- End PHP if statement -->
            </div> <!-- End navigation links -->
        </div> <!-- End navigation bar -->

        <!-- Game Container -->
        <div class="content-wrapper"> <!-- Content wrapper -->
            <div id="game-container"> <!-- Game container -->
                <div id="overlay"> <!-- Overlay container -->
                    <div id="message">Press space to start</div> <!-- Start message -->
                </div> <!-- End overlay -->
                <canvas id="gameCanvas" width="500" height="600"></canvas> <!-- Game canvas -->
            </div> <!-- End game container -->
        </div> <!-- End content wrapper -->

        <!-- Footer -->
        <div class="footer"> <!-- Footer container -->
            <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p> <!-- Footer content -->
        </div> <!-- End footer -->
    </div> <!-- End page container -->

    <script src="rhythm.js"></script> <!-- Links to game script -->
</body> <!-- End body section -->
</html> <!-- End HTML document -->