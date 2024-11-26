<!--
    leaderboard.php
    PHP file with html for game leaderboard page
    Made by: Tommy Lam

    Created 11/23/2024
    Edited 11/24/2024 (Tommy):
        - Added comments
    Edited 11/24/2024 (Zonaid):
        - Added login-signin session and database functionality
    Preconditions:
        • index.css must be properly linked and accessible
        • PHP server must be running to handle data requests
        • Database connection must be available for leaderboard data retrieval
    Postconditions:
        • Displays navigation bar with proper authentication links
        • Shows sidebar with all game categories
        • Presents leaderboard table with player rankings
        • Updates category selection when user clicks different games
        • Displays total player count for current category
    Errors:
        None
    Side effects:
        None
    Invariants:
        • Navigation bar remains fixed at top
        • Footer stays at bottom of page
        • Sidebar categories list remains constant
        • Active category is always highlighted
    Known faults:
        None
-->

<?php // Start of PHP code
session_start(); // Initialize the session to manage user authentication and session variables

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in']; // Determine if the session indicates a logged-in user

// Access the username stored in the session, default to null if not logged in
$username = $isLoggedIn ? $_SESSION['username'] : null; // Retrieve the logged-in user's username or set as null if not logged in

// Attempt to connect to the SQLite database
try { 
    $db = new PDO('sqlite:../log-signup/highscores.db'); // Connect to the SQLite database for retrieving leaderboard data
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Set error handling to throw exceptions
} catch (PDOException $e) { 
    die("Database connection failed: " . $e->getMessage()); // Display an error message and terminate the script if connection fails
}

// Function to map display game names to database table names
function getDbGameName($displayName) {
    $gameMap = [ // Map display names to their respective database names
        'Maze Navigation' => 'maze_game',
        'Estimate' => 'estimate',
        'Spot the Object' => 'spot',
        'Whack-A-Mole' => 'whackamole',
        'Boggle' => 'baggle',
        'Simon Says' => 'sequence',
        'Rhythm' => 'rhythm_game',
        'Bullet Hell' => 'bullet_hell',
    ];
    return $gameMap[$displayName] ?? $displayName; // Return the mapped name or default to the display name if not mapped
}

// Function to retrieve leaderboard data for a specific game
function getLeaderboardData($game) {
    global $db; // Use the global database connection
    try {
        $dbGameName = getDbGameName($game); // Convert display name to database name
        $stmt = $db->prepare('
            SELECT username, score, date,
                   RANK() OVER (ORDER BY score DESC) as rank
            FROM scores
            WHERE game = :game
            ORDER BY score DESC
            LIMIT 10
        '); // Query to retrieve top 10 scores for the specified game, ordered by score
        $stmt->execute([':game' => $dbGameName]); // Execute the query with the game name as a parameter
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // Return all matching rows as an associative array
    } catch (PDOException $e) {
        return []; // Return an empty array if there is an error in the query
    }
}

// Function to retrieve the count of unique players for a specific game
function getPlayerCount($game) {
    global $db; // Use the global database connection
    try {
        $dbGameName = getDbGameName($game); // Convert display name to database name
        $stmt = $db->prepare('SELECT COUNT(DISTINCT username) FROM scores WHERE game = :game'); // Query to count distinct players for the game
        $stmt->execute([':game' => $dbGameName]); // Execute the query with the game name as a parameter
        return $stmt->fetchColumn(); // Return the count of unique players
    } catch (PDOException $e) {
        return 0; // Return 0 if there is an error in the query
    }
}

// Get the current game category from the URL parameter, default to 'Maze Navigation' if not provided
$currentGame = $_GET['game'] ?? 'Maze Navigation';

// Retrieve the leaderboard data for the current game
$leaderboardData = getLeaderboardData($currentGame); // Fetch the top 10 scores for the selected game
$playerCount = getPlayerCount($currentGame); // Fetch the total unique players for the selected game
?>


<!DOCTYPE html> <!-- Specifies the HTML document type -->
<html lang="en"> <!-- Declares the language of the document as English -->
<head> <!-- Metadata section of the document -->
    <meta charset="UTF-8"> <!-- Specifies character encoding as UTF-8 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Makes the page responsive for all screen sizes -->
    <title>Leaderboard - Gamers Benchmark</title> <!-- Page title displayed in the browser tab -->
    <link rel="stylesheet" href="../../index.css"> <!-- Links the external CSS file for styling -->
</head>
<body> <!-- Start of the body section -->

    <div class="navbar"> <!-- Navigation bar container -->
        <div class="logo"> <!-- Container for the site logo -->
            <h2>Gamers Benchmark</h2> <!-- Site name displayed as a heading -->
        </div>

        <div class="nav-links"> <!-- Navigation links container -->
            <a href="../../index.php">Home</a> <!-- Link to the homepage -->
            <a href="leaderboard.php">Leaderboard</a> <!-- Link to the leaderboard page -->
            <a href="../about/about.php">About</a> <!-- Link to the about page -->

            <!-- Display these links only if the user is logged in -->
            <?php if ($isLoggedIn): ?>
                <a href="../log-signup/handlers/logout.php" class="btn">Sign Out</a> <!-- Logout button -->
                <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a> <!-- Link to the profile page with the username -->
            <?php else: ?>
                <!-- Display these links if the user is not logged in -->
                <a href="../log-signup/login.php" class="btn">Login</a> <!-- Link to the login page -->
                <a href="../log-signup/signup.php" class="btn">Sign Up</a> <!-- Link to the signup page -->
            <?php endif; ?>
        </div>
    </div>

    <div class="leaderboard-container"> <!-- Main container for the leaderboard layout -->

        <aside class="category-sidebar"> <!-- Sidebar for category selection -->
            <h2>Categories</h2> <!-- Heading for the category section -->

            <div class="category-links"> <!-- Container for the category links -->
                <?php
                // Generate category links dynamically
                $categories = ['Maze Navigation', 'Estimate', 'Spot the Object', 'Whack-A-Mole', 
                               'Boggle', 'Simon Says', 'Rhythm', 'Bullet Hell'];

                foreach ($categories as $category): 
                    $isActive = $category === $currentGame ? 'active' : ''; // Highlight the active category
                ?>
                    <a href="?game=<?php echo urlencode($category); ?>" 
                       class="category-item <?php echo $isActive; ?>">
                       <?php echo htmlspecialchars($category); ?>
                    </a> <!-- Render each category as a clickable link -->
                <?php endforeach; ?>
            </div>
        </aside>

        <main class="leaderboard-main"> <!-- Main leaderboard content -->
            <div class="leaderboard-header"> <!-- Header for the leaderboard -->
                <h1>Leaderboard</h1> <!-- Leaderboard title -->
                <div class="game-info"> <!-- Information about the selected game -->
                    <span class="current-game"><?php echo htmlspecialchars($currentGame); ?></span> <!-- Displays the selected game -->
                    <span class="divider">|</span> <!-- Divider between game info elements -->
                    <span class="total-players">Total Players: <?php echo $playerCount; ?></span> <!-- Displays the total players -->
                </div>
            </div>

            <div class="leaderboard-content"> <!-- Table container for leaderboard -->
                <table class="leaderboard-table"> <!-- Leaderboard table -->
                    <thead> <!-- Table header -->
                        <tr> <!-- Table header row -->
                            <th>Rank/Name</th> <!-- Column for rank & player name -->

                            <th>Score</th> <!-- Column for player score -->
                            <th>Date</th> <!-- Column for date -->
                        </tr>
                    </thead>
                    <tbody> <!-- Table body -->
                        <?php if (empty($leaderboardData)): ?>
                            <tr> <!-- Row displayed when no leaderboard data is available -->
                                <td colspan="4" class="no-scores">No scores recorded yet</td> <!-- Message displayed across all columns -->
                            </tr>
                        <?php else: ?>
                            <?php foreach ($leaderboardData as $row): ?>
                                <tr> <!-- Table row for each player -->
                                    <td class="rank"><?php echo htmlspecialchars($row['rank']); ?></td> <!-- Player rank -->
                                    <td class="player-info">
                                        <span class="player-name">
                                            <a href="../../profile.php?username=<?php echo urlencode($row['username']); ?>&game=<?php echo urlencode(getDbGameName($currentGame)); ?>">
                                                <?php echo htmlspecialchars($row['username']); ?>
                                            </a> <!-- Link to the player's profile -->
                                        </span>
                                    </td>
                                    <td><?php echo number_format($row['score']); ?></td> <!-- Player score -->
                                    <td><?php echo htmlspecialchars($row['date']); ?></td> <!-- Date of the score -->
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <footer> <!-- Footer of the page -->
        <p>© 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p> <!-- Copyright and privacy link -->
    </footer>
</body>
</html>
