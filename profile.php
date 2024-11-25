<?php
session_start();
// Connect to the SQLite database
try {
    $db = new PDO('sqlite:website/log-signup/highscores.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

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
    header("Location: " . $_SERVER['PHP_SELF'] . "?username=" . urlencode($username) . "&game=" . urlencode($_GET['game']));
    exit;
}

// Get selected game from the query parameter
$selectedGame = $_GET['game'] ?? 'baggle';

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
            <a href="index.html">Home</a>
            <a href="leaderboard.html">Leaderboard</a>
            <a href="website/about/about.html">About</a>
            <a href="website/log-signup/login.html">Login/Signup</a>
        </div>
    </div>
    <h1>Personal Best Scores for <?= htmlspecialchars($selectedGame) ?></h1>

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
    </form>

    <!-- Graph -->
    <canvas id="scoreChart" width="400" height="200"></canvas>

    <script>
        const ctx = document.getElementById('scoreChart').getContext('2d');
        const chartData = {
            labels: <?= json_encode(array_column($scores, 'date')) ?>,
            datasets: [{
                label: 'Personal Best Scores',
                data: <?= json_encode(array_column($scores, 'score')) ?>,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const scoreChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    x: {
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
