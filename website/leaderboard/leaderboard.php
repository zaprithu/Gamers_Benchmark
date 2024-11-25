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

<?php
session_start();

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'];

// Access the username stored in the session, with a fallback
$username = $isLoggedIn ? $_SESSION['username'] : null;

// Connect to the SQLite database with correct path
try {
    $db = new PDO('sqlite:../highscores.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Function to convert display name to database name
function getDbGameName($displayName) {
    $gameMap = [
        'Maze Navigation' => 'maze_game',
        'Estimate' => 'estimate',
        'Spot the Object' => 'spot',
        'Whack-A-Mole' => 'whackamole',
        'Boggle' => 'baggle',
        'Simon Says' => 'sequence',
        'Rhythm' => 'rhythm_game',
        'Bullet Hell' => 'bullet_hell',
    ];
    return $gameMap[$displayName] ?? $displayName;
}

// Function to get leaderboard data for a specific game
function getLeaderboardData($game) {
    global $db;
    try {
        $dbGameName = getDbGameName($game);
        // Get the top scores for each user (only their best score)
        $stmt = $db->prepare('
            SELECT username, score, date,
                   RANK() OVER (ORDER BY score DESC) as rank
            FROM scores 
            WHERE game = :game
            ORDER BY score DESC
            LIMIT 10
        ');
        $stmt->execute([':game' => $dbGameName]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }
}

// Get current game category (default to Maze Navigation)
$currentGame = $_GET['game'] ?? 'Maze Navigation';

// Get player count for current game
function getPlayerCount($game) {
    global $db;
    try {
        $dbGameName = getDbGameName($game);
        $stmt = $db->prepare('SELECT COUNT(DISTINCT username) FROM scores WHERE game = :game');
        $stmt->execute([':game' => $dbGameName]);
        return $stmt->fetchColumn();
    } catch (PDOException $e) {
        return 0;
    }
}

// Get leaderboard data
$leaderboardData = getLeaderboardData($currentGame);
$playerCount = getPlayerCount($currentGame);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard - Gamers Benchmark</title>
    <link rel="stylesheet" href="../../index.css">
</head>
<body>
    <div class="navbar">
        <div class="logo">
            <h2>Gamers Benchmark</h2>
        </div>

        <div class="nav-links">
            <a href="../../index.php">Home</a>
            <a href="leaderboard.php">Leaderboard</a>
            <a href="../about/about.php">About</a>
            <!-- Show logout and profile buttons only if logged in -->
            <?php if ($isLoggedIn): ?>
                <a href="../log-signup/handlers/logout.php" class="btn">Sign Out</a>
                <a href="../../profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$username); ?>)</a>
            <?php else: ?>
                <!-- Show Login and Sign Up buttons if not logged in -->
                <a href="../log-signup/login.html" class="btn">Login</a>
                <a href="../log-signup/signup.php" class="btn">Sign Up</a>
            <?php endif; ?>
        </div>
    </div>

    <div class="leaderboard-container">
        <h2>Categories</h2>
        
        <div class="category-links">
            <?php
            $categories = [
                'Maze Navigation', 'Estimate', 'Spot the Object', 'Whack-A-Mole',
                'Boggle', 'Simon Says', 'Rhythm', 'Bullet Hell'
            ];
            
            foreach ($categories as $category) {
                $isActive = $category === $currentGame ? 'active' : '';
                echo '<a href="?game=' . urlencode($category) . '" 
                        class="category-item ' . $isActive . '">' . 
                        htmlspecialchars($category) . '</a>';
            }
            ?>
        </div>

        <main class="leaderboard-main">
            <div class="leaderboard-header">
                <h1>Leaderboard</h1>
                <div class="game-info">
                    <span class="current-game"><?php echo htmlspecialchars($currentGame); ?></span>
                    <span class="divider">|</span>
                    <span class="total-players">Total Players: <?php echo $playerCount; ?></span>
                </div>
            </div>

            <div class="leaderboard-content">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($leaderboardData as $row): ?>
                            <tr>
                                <td class="rank"><?php echo htmlspecialchars($row['rank']); ?></td>
                                <td class="player-info">
                                    <span class="player-name">
                                        <a href="profile.php?username=<?php echo urlencode($row['username']); ?>&game=<?php echo urlencode(getDbGameName($currentGame)); ?>">
                                            <?php echo htmlspecialchars($row['username']); ?>
                                        </a>
                                    </span>
                                </td>
                                <td><?php echo number_format($row['score']); ?></td>
                                <td><?php echo htmlspecialchars($row['date']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($leaderboardData)): ?>
                            <tr>
                                <td colspan="4" class="no-scores">No scores recorded yet</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <footer>
        <p>© 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p>
    </footer>
</body>
</html>