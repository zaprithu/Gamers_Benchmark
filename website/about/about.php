<!--
- Name of code artifact: about.html
- Brief description of what the code does: This HTML file defines the purpose of the website  "Gamers Benchmark," where users
can also navigate between pages
- Programmer’s name: Tommy Lam, Ethan Dirkes, Chase Entwistle, Christopher Gronewold, Zonaid Prithu
- Date the code was created: Oct 27, 2024.
- Dates the code was revised:
    • Brief description of each revision & author:
        • Zonaid Prithu - November 24, 2024: Added login-signin session and database functionality
- Preconditions:
• Acceptable Input:
    • Users must access this page using a compatible web browser that supports HTML5, CSS, and JavaScript.
    • Links should work as long as the referenced HTML files and images are correctly located within the specified directories.
- Unacceptable Input:
    • Any access attempt through a browser that doesn’t support basic HTML5 features may lead to display issues.
    • Missing resources (CSS, images, or linked HTML pages) will result in broken links or absent styles and images.
- Postconditions:
• Return Values or Types:
    • The page renders with a navigation bar, hero section, game links, and footer in a visual layout.
    • Displays appropriate images, navigation links, and button states (enabled/disabled) for each game.
- Error and exception condition values or types that can occur, and their meanings:
• Missing or broken links: If the linked HTML files or images don’t exist in the specified location, users will see errors (e.g., "404 Not Found") or broken images.
• Styling errors: If index.css is missing or contains errors, the page layout may appear unstyled or improperly formatted.
• JavaScript errors: Although minimal JavaScript is used, browser incompatibilities might prevent onclick events from functioning as intended.
- Side effects: Navigating to other linked pages within the website, such as leaderboard.html or game pages like maze.html.
- Invariants:
• The navigation bar and footer should always display correctly, providing consistency in user experience across the site.
• Game buttons set to btn-d (disabled class) will remain non-clickable until their pages are implemented and classes are updated to btn.
- Any known faults:
• Currently, some game buttons are disabled (btn-d class) and are placeholders until their pages are created.
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
    <link rel="stylesheet" type="text/css" href="../../index.css"> <!-- Link to external CSS file for styling -->
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
            <a href="../leaderboard/leaderboard.php">Leaderboard</a>
            <a href="about.php">About</a>
            <!-- Show logout and profile buttons only if logged in -->
            <?php if ($isLoggedIn): ?>
                <a href="../log-signup/logout.php" class="btn">Sign Out</a>
                <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a>
            <?php else: ?>
                <!-- Show Login and Sign Up buttons if not logged in -->
                <a href="../log-signup/login.html" class="btn">Login</a>
                <a href="../log-signup/signup.php" class="btn">Sign Up</a>
            <?php endif; ?>
        </div>
    </div>

    <!-- Hero Section - Introduction to the About Page -->
    <div class="hero">
        <!-- Page title for the about section -->
        <h1>About</h1>
        <!-- Information about the Gamer’s Benchmark platform -->
        <p>Gamer’s Benchmark is a unique platform designed by a team consisting Tommy Lam, Christopher Gronewold, Ethan Dirkes, Chase Entwistle, and Zonaid Prithu from the University of Kansas—to help players assess and improve their gaming skills. Gamer’s Benchmark offers nine score-based mini-games designed to test reflexes, speed, strategy, and accuracy.</p>
        <p>Each mini-game presents a distinct challenge—from fast-paced rhythm tests to intense bullet-dodging or puzzle-solving. Players can create accounts, track their progress, and see how they stack up against others with game-specific leaderboards and percentile comparisons. Whether you're aiming for a high score or just testing your skills, Gamer’s Benchmark provides a fun, competitive environment for players of all levels to discover their strengths and areas for improvement. Join the Gamer’s Benchmark community today and put your skills to the test!</p>
        <!-- Horizontal rules to visually separate sections -->
        <hr>
        <hr>
    </div>

    <!-- Footer Section - Copyright information and additional links -->
    <div class="footer">
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </div>

</body>
</html>
