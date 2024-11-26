<!--
- Name of code artifact: login.php
- Brief description of what the code does: This HTML file serves as a page for users to login to the "Gamers Benchmark" website so that their data is saved
between games and so that they are able to pparticipate in the leaderboards. They are also able to navigate to the sign up page if they do not already have an account
- Programmer’s name: Tommy Lam, Ethan Dirkes, Chase Entwistle, Christopher Gronewold, Zonaid Prithu
- Date the code was created: Oct 27, 2024.
- Dates the code was revised:
    • Brief description of each revision & author:
        • Zonaid Prithu - November 24, 2024: Removed Login Button
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
    <!-- Specifies the character encoding for proper text rendering -->
    <meta charset="UTF-8">
    <!-- Ensures the page is responsive on all devices -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Sets the page title that appears on the browser tab -->
    <title>Login - Gamers Benchmark</title>
    <!-- Links the external CSS file for consistent styling -->
    <link rel="stylesheet" href="../../index.css">
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

    <!-- Login container for user authentication form -->
    <div class="login-container">
        <!-- Title for the login form -->
        <h2>Login</h2>
        <!-- Form for user login with POST method for secure data submission -->
        <form action="handlers/login_handler.php" method="POST">
            <!-- Label and input field for the username -->
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>

            <!-- Label and input field for the password -->
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>

            <!-- Login button styled with the class "btn" -->
            <button type="submit" class="btn">Login</button>
            <!-- Link to the signup page for users without an account -->
            <p>Don't have an account? <a href="signup.php">Sign up</a></p>
        </form>
    </div>

    <!-- Footer section with copyright and privacy policy link -->
    <div class="footer">
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </div>
</body>
</html>
