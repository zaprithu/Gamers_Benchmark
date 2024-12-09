<!--
- Name of code artifact: profile.php
- Brief description of what the code does: This php file shows the player their scores over time, visually, by querying the scores table of the database.
- Programmer’s name: Chase Entwistle, Tommy Lam
- Date the code was created: Nov 24, 2024.
- Preconditions:
• Acceptable Input:
    • Users must access this page using a compatible web browser that supports PHP
• Database:
    • The highscores.db file exists, and the scores table is correctly set up
- Postconditions:
• Return Values or Types:
    • Shows the player a graph of their previous best scores over time
    • A text form allows the user to view other player's graphs
    • Buttons for changing which game
-->
<?php
session_start();
// Connect to the SQLite database
try {
    $db = new PDO('sqlite:website/log-signup/highscores.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get selected game from the query parameter
$selectedGame = $_GET['game'] ?? 'baggle';

// Fetch personal best scores for the selected game

$isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'];

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
        'Platformer' => 'Platformer',
    ];
    return $gameMap[$displayName] ?? $displayName; // Return the mapped name or default to the display name if not mapped
}

if (isset($_GET['username'])) {
    $username = $_GET['username'];
}
else {
    if ($isLoggedIn) {
        // Refresh the page with the logged-in username
        $username = $_SESSION['username'];
    } else {
        // Refresh the page with a default username
        $username = "abc";
    }

    // Redirect to the same page with the username in the URL
    header("Location: " . $_SERVER['PHP_SELF'] . "?username=" . urlencode($username) . "&game=" . urlencode($selectedGame));
    exit;
}

// Get the current game category from the URL parameter, default to 'Maze Navigation' if not provided
$currentGame = $_GET['game'] ?? 'Maze Navigation';
?>


<!DOCTYPE html> <!-- Specifies the HTML document type -->
<html lang="en"> <!-- Declares the language of the document as English -->
<head> <!-- Metadata section of the document -->
    <meta charset="UTF-8"> <!-- Specifies character encoding as UTF-8 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Makes the page responsive for all screen sizes -->
    <title>Leaderboard - Gamers Benchmark</title> <!-- Page title displayed in the browser tab -->
    <link rel="stylesheet" href="../../index.css"> <!-- Links the external CSS file for styling -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
</head>
<body> <!-- Start of the body section -->

    <div class="navbar"> <!-- Navigation bar container -->
        <div class="logo"> <!-- Container for the site logo -->
            <h2>Gamers Benchmark</h2> <!-- Site name displayed as a heading -->
        </div>

        <div class="nav-links"> <!-- Navigation links container -->
            <a href="index.php">Home</a> <!-- Link to the homepage -->
            <a href="leaderboard.php">Leaderboard</a> <!-- Link to the leaderboard page -->
            <a href="website/about/about.php">About</a> <!-- Link to the about page -->

            <!-- Display these links only if the user is logged in -->
            <?php if ($isLoggedIn): ?>
                <a href="website/log-signup/handlers/logout.php" class="btn">Sign Out</a> <!-- Logout button -->
                <a href="profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$_SESSION['username']); ?>)</a> <!-- Link to the profile page with the username -->
            <?php else: ?>
                <!-- Display these links if the user is not logged in -->
                <a href="website/log-signup/login.php" class="btn">Login</a> <!-- Link to the login page -->
                <a href="website/log-signup/signup.php" class="btn">Sign Up</a> <!-- Link to the signup page -->
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
                               'Boggle', 'Simon Says', 'Rhythm', 'Bullet Hell', 'Platformer'];

                foreach ($categories as $category): 
                    $isActive = $category === $currentGame ? 'active' : ''; // Highlight the active category
                ?>
                    <a href="?username=<?php echo urlencode($username); ?>&game=<?php echo urlencode($category); ?>" 
                       class="category-item <?php echo $isActive; ?>">
                       <?php echo htmlspecialchars($category); ?>
                    </a> <!-- Render each category as a clickable link -->
                <?php endforeach; ?>
            </div>
        </aside>

        <main class="leaderboard-main"> <!-- Main leaderboard content -->
            <div class="leaderboard-header"> <!-- Header for the leaderboard -->
                <h1>Personal Best Scores</h1> <!-- Leaderboard title -->
                <div class="game-info"> <!-- Information about the selected game -->
                    <span class="current-game"><?php echo htmlspecialchars($currentGame); ?></span> <!-- Displays the selected game -->
                </div>
            </div>

            <form method="get" id="myForm">
                <label for="username">Usernames (comma-separated):</label>
                <input type="text" name="username" id="username" value="<?php echo htmlspecialchars($username); ?>" />

                <input type="hidden" name="game" id="game" value="<?php echo $currentGame; ?>"> <!-- Hidden input -->

                <button type="submit">Submit</button>
                <br>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="timeframe" value="day" onclick="submitForm()">
                        <span>Day</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="timeframe" value="week" onclick="submitForm()">
                        <span>Week</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="timeframe" value="month" onclick="submitForm()">
                        <span>Month</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="timeframe" value="year" onclick="submitForm()">
                        <span>Year</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="timeframe" value="all_time" onclick="submitForm()">
                        <span>All Time</span>
                    </label>
                </div>
            </form>

            <div class="leaderboard-content"> <!-- Table container for leaderboard -->
                <!-- Graph -->
                <canvas id="scoreChart" width="400" height="200"></canvas>
            </div>
        </main>
    </div>

    <footer> <!-- Footer of the page -->
        <p>© 2024 Gamers Benchmark. All rights reserved. | <a href="#">Privacy Policy</a></p> <!-- Copyright and privacy link -->
    </footer>
<script>
    const ctx = document.getElementById('scoreChart').getContext('2d');

<?php
// Assuming $username is a comma-separated list of usernames
$usernames = explode(',', $username);
$usernames = array_map('trim', $usernames); // Trim any whitespace

$datasets = [];
$labels = [];

// Prepare and execute the query for each username
foreach ($usernames as $user) {
    $query = "
        SELECT score, date 
        FROM scores 
        WHERE username = :username AND game = :game 
        ORDER BY date ASC";
    $stmt = $db->prepare($query);
    $stmt->execute([':username' => $user, ':game' => getDbGameName($selectedGame)]);

    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Create JavaScript labels and data for each username
    $labels = array_merge($labels, array_map(function($score) {
        return strtotime($score['date']) * 1000; // Convert date to Unix timestamp in milliseconds
    }, $scores));
    $data = json_encode(array_column($scores, 'score'));

    // Add to the datasets array
    $datasets[] = [
        'label' => $user,
        'data' => json_decode($data), // Decode to use as JavaScript array
        'pointBorderWidth' => 2 // Data point border width
    ];
}
?>
    const chartData = {
        labels: <?= json_encode($labels) ?>, // You can leave this empty as each dataset has its own labels
        datasets: <?= json_encode($datasets) ?>
    };

    // Create the chart
    const scoreChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    type: 'time', // Time scale
                    time: {
                        unit: 'minute', // You can adjust this to 'minute', 'hour', etc.
                        displayFormats: {
                            day: 'YYYY-MM-DD', // Format for the x-axis
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            }
        }
    });
    function submitForm() {
        document.getElementById('myForm').submit(); // Automatically submit the form
    }
</script>
</body>
</html>
