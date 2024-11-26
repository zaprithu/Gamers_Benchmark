<!--
- Name of code artifact: signup_handler.php
- Brief description of what the code does: This php file shows the player their scores over time, visually, by querying the scores table of the database.
- Programmer’s name: Chase Entwistle
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

$query = "
    SELECT score, date 
    FROM scores 
    WHERE username = :username AND game = :game 
    ORDER BY date ASC";
$stmt = $db->prepare($query);
$stmt->execute([':username' => $username, ':game' => $selectedGame]);

$scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Basic HTML metadata for page setup -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamers Benchmark</title>
    <link rel="stylesheet" type="text/css" href="index.css"> <!-- Link to external CSS file for styling -->

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
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
                <a href="profile.php" class="btn">Profile (<?php echo htmlspecialchars((string)$_SESSION['username']); ?>)</a>
            <?php else: ?>
                <!-- Show Login and Sign Up buttons if not logged in -->
                <a href="website/log-signup/login.php" class="btn">Login</a>
                <a href="website/log-signup/signup.php" class="btn">Sign Up</a>
            <?php endif; ?>
        </div>
    </div>
    <h1><?= $username ?>'s Personal Best Scores for <?= htmlspecialchars($selectedGame) ?></h1>

    <!-- Game Selection Dropdown -->
    <form method="get">
        <label for="game">Select a Game:</label>
        <select name="game" id="game" onchange="this.form.submit()">
            <?php
            $games = ["baggle", "bullet_hell", "sequence", "maze_game", "spot", "estimate", "rhythm_game", "whackamole"];
            foreach ($games as $game) {
                $selected = $game === $selectedGame ? 'selected' : '';
                echo "<option value=\"$game\" $selected>$game</option>";
            }
            ?>
        </select>

        <br>
        <br>

        <!-- Username Field -->
        <label for="username">Enter Username:</label>
        <input type="text" name="username" id="username" value="<?php echo htmlspecialchars($username); ?>" />

        <button type="submit">Submit</button>
    </form>

    <!-- Graph -->
    <canvas id="scoreChart" width="400" height="200"></canvas>


<script>
    const ctx = document.getElementById('scoreChart').getContext('2d');

    // Convert date strings to JavaScript timestamps
    const labels = <?= json_encode(array_map(function($score) {
        return strtotime($score['date']) * 1000; // Convert date to Unix timestamp in milliseconds
    }, $scores)) ?>;
console.log(labels);

    // Extract scores
    const data = <?= json_encode(array_column($scores, 'score')) ?>;

    // Chart.js data configuration
    const chartData = {
        labels: labels, // Timestamps as labels
        datasets: [{
            label: 'Personal Best Scores',
            data: data,
            backgroundColor: 'rgba(255, 0, 0, 0.2)', // Area color (below the line)
            borderColor: 'rgba(255, 0, 0, 1)', // Line color
            borderWidth: 2, // Thickline
            pointRadius: 4, // Large data points
            pointBackgroundColor: 'rgba(255, 0, 0, 1)', // Data point color
            pointBorderWidth: 2 // Border width for the data points
        }]
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
</script>
</body>
</html>
