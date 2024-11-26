<!--
- Name of code artifact: index.html
- Brief description of what the code does: This HTML file defines the layout and content for the home page of a website called "Gamers Benchmark," where users
                                           can navigate between pages, access mini-games, view a leaderboard, and explore other sections of the site.
- Programmer’s name: Tommy Lam, Ethan Dirkes, Chase Entwistle, Christopher Gronewold, Zonaid Prithu
- Date the code was created: Oct 24, 2024.
- Dates the code was revised:
    • Brief description of each revision & author:
        • Tommy Lam - Oct 24, 2024: Website creation
        • Ethan Dirkes - Oct 26, 2024: Seperate the style to index.css
        • Tommy Lam - Oct 27, 2024: Add prologue comment
        • Zonaid Prithu - November 24, 2024:  Added login-signin session and database functionality
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
    <link rel="stylesheet" type="text/css" href="index.css"> <!-- Link to external CSS file for styling -->
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
            <a href="index.php">Home</a>
            <a href="website/leaderboard/leaderboard.php">Leaderboard</a>
            <a href="website/about/about.php">About</a>
            <!-- Show logout and profile buttons only if logged in -->
            <?php if ($isLoggedIn): ?>
                <a href="website/log-signup/handlers/logout.php" class="btn">Sign Out</a>
                <a href="profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a>
            <?php else: ?>
                <!-- Show Login and Sign Up buttons if not logged in -->
                <a href="website/log-signup/login.php" class="btn">Login</a>
                <a href="website/log-signup/signup.php" class="btn">Sign Up</a>
            <?php endif; ?>
        </div>
    </div>

    <!-- Hero Section -->
    <div class="hero">
        <!-- Hero message inviting users to start playing games -->
        <h1>Test Your Skills</h1>
        <p>Challenge yourself with our variety of mini-games!</p>
        <button class="btn">Start Now</button> <!-- Button to start the game -->
    </div>

    <!-- Game Section -->
    <!--
        Notes on game buttons:
        The class "btn-d" denotes a disabled state for games that are not implemented yet.
        When a game is ready, change the class from "btn-d" to "btn" to make it clickable.
    -->
    <div class="games">
        <!-- Game Card: Maze Navigation -->
        <div class="game-card">
            <img src="images/maze.PNG" alt="Maze"> <!-- Image for the game -->
            <h3>Maze Navigation</h3>
            <p>Dodge the Minotaurs to make it to the treasure!</p>
            <button class="btn" onclick="window.location.href='games/maze_game/maze.html'">Play</button> <!-- Link to game page -->
        </div>
        
        <!-- Game Card: Estimate Number of Objects -->
        <div class="game-card">
            <img src="images/estimate.PNG" alt="Estimate"> <!-- Image for the game -->
            <h3>Estimate Number of Objects</h3>
            <p>How many numbers of object can you remember?</p>
            <button class="btn" onclick="window.location.href='games/estimate/estimate.php'">Play</button> <!-- Link to game page -->
        </div>
        
        <div class="game-card">
            <img src="images/spot.png" alt="Spot the Object"> <!-- Image for the game -->
            <h3>Spot the Object</h3>
            <p>Test your visual perception and find the object as fast as possible</p>
            <button class="btn" onclick="window.location.href='games/spot/spot.php'">Play</button> <!-- Link to game page -->
        </div>
        
        <!-- Game Card: Whack-A-Mole -->
        <div class="game-card">
            <img src="images/whackamole.png" alt="Whack-A-Mole"> <!-- Image for the game -->
            <h3>Whack-a-mole</h3>
            <p>Test your reaction time, hit as many Moles as you can</p>
            <button class="btn" onclick="window.location.href='games/whackamole/whackamole.php'">Play</button> <!-- Link to game page -->
        </div>

        <!-- Game Card: Baggle -->
        <div class="game-card">
            <img src="images/baggle.PNG" alt="Baggle"> <!-- Image for the game -->
            <h3>Baggle</h3>
            <p>How many words can you find?</p>
            <button class="btn" onclick="window.location.href='games/baggle/baggle.html'">Play</button> <!-- Link to game page -->
        </div>

        <div class="game-card">
            <img src="images/simon.png" alt="Simon Says"> <!-- Image for the game -->
            <h3>Simon Says</h3>
            <p></p>
            <button class="btn" onclick="window.location.href='games/sequence/sequence.php'">Play</button> <!-- Link to game page -->
        </div>

        <div class="game-card">
            <img src="images/rhythm.jpg" alt="Rhythm">
            <h3>Rhythm</h3>
            <p>How long can you keep up with the rhythm?</p>
            <button class="btn" onclick="window.location.href='games/rhythm_game/rhythm.html'">Play</button> <!-- Link to game page -->
        </div>

        <!-- Game Card: Bullet Hell -->
        <div class="game-card">
            <img src="images/bullethell.PNG" alt="Bullet Hell"> <!-- Image for the game -->
            <h3>Bullet Hell</h3>
            <p>Survive as long as you can in an epic space battle! (Headphones Recommended)</p>
            <button class="btn" onclick="window.location.href='games/bullet_hell/bullet_hell.html'">Play</button> <!-- Link to game page -->
        </div>

        <!-- Game Card: Speedrun -->
        <div class="game-card">
            <img src="images/speedrun.PNG" alt="Platformer"> <!-- Image for the game -->
            <h3>Platformer Speedrun</h3>
            <p>Complete a platformer quickly</p>
            <button class="btn" onclick="window.location.href='games/platformspeedrun/index.html'">Play</button> <!-- Link to game page -->
        </div>
      
    </div>

    <!-- Footer Section -->
    <div class="footer">
        <!-- Footer content including copyright and privacy policy link -->
        <p>&copy; 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </div>

</body>
</html>
