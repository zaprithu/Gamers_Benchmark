<!--
- Name of code artifact: signup.php
- Brief description of what the code does: This HTML file lays out a page wherein users are able to sign up for an account on the Gamers Benchmark website,
allowing them to save their scores and participate in the leaderboards if they do not already have an account. In case they do have an account, this allows them
to navigate back to the login page.
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
    <!-- Signup container for the user registration form -->
    <div class="signup-container">
        <!-- Title for the signup form -->
        <h2>Create an Account</h2>
        <!-- Form for user registration, submitting data via POST for security -->
        <form action="handlers/signup_handler.php" method="POST">
            <!-- Label and input field for the username -->
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>

            <!-- Label and input field for the email address -->
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>

            <!-- Label and input field for the password -->
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>

            <!-- Label and input field to confirm the password -->
            <label for="confirm_password">Confirm Password</label>
            <input type="password" id="confirm_password" name="confirm_password" required>

            <!-- Sign up button styled with the "btn" class -->
            <button type="submit" class="btn">Sign Up</button>
            <!-- Link to login page for users who already have an account -->
            <p>Already have an account? <a href="login.php">Log in</a></p>
        </form>
    </div>

    <!-- Footer section with copyright and privacy policy link -->
    <div class="footer">
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </div>
</body>
</html>
