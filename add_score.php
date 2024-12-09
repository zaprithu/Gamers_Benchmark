<?php
/*
- Name of code artifact: add_score.php
- Brief description of what the code does: This php file allows programmatic access for games to add scores to the scores table of the database. In javascript code, a fetch is made to this page which sends a POST request containing the score and the game that is being played.
- Programmer’s name: Chase Entwistle
- Date the code was created: Nov 27, 2024.
- Preconditions:
• Acceptable Input:
    • The sender of the request should send a POST request containing JSON data
    • The JSON should contain both a "game" key and a "score" key
    • The "score" key should be the name of the game, ie. one of the folder names within the "games" folder
    • The "game" key should be numeric
    • The user sending should be logged in
• Database:
    • The highscores.db file exists, and the scores table is correctly set up
- Postconditions:
    • The scores table of the database is updated with the new score, if it is the player's personal best in that game.
• Return Values or Types:
    • The columns added to the table are "username", "game", "score", and "date"
    • The date column will be in the format YYYY-MM-DD XX:XX:XX
*/
session_start(); // Start the session for accessing session variables

function getScorePercentile($score, $game) {
    // Determine if the game uses "lower is better" scoring
    // Add games where lower scores are better
    $lowerIsBetter = in_array($game, ['maze_game', 'spot', 'estimate', 'Platformer']);

    global $db; // Use the global database connection
    try {
        $stmt = $db->prepare('
            WITH PersonalBestScores AS (
                SELECT username, ' . ($lowerIsBetter ? "MIN" : "MAX") . '(score) AS best_score
                FROM scores
                WHERE game = :game
                GROUP BY username
            )
            SELECT :score AS current_score,
                   100.0 * (SELECT COUNT(*)
                            FROM PersonalBestScores
                            WHERE best_score ' . ($lowerIsBetter ? ">" : "<") . ' CAST(:score AS REAL)) / 
                   (SELECT COUNT(*) FROM PersonalBestScores) AS percentile
            FROM PersonalBestScores
            LIMIT 1;
        '); // Query to calculate the percentile of the given score
        $stmt->execute([':score' => $score, ':game' => $game]); // Execute with the given score
        $result = $stmt->fetch(PDO::FETCH_ASSOC); // Fetch the result as an associative array

        return min(floor($result['percentile']), 99); // Return the percentile value
    } catch (PDOException $e) {
        return null; // Return null if there is an error
    }
}

// Connect to the SQLite database
try {
    $db = new PDO('sqlite:website/log-signup/highscores.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Check if the user is logged in
$isLoggedIn = isset($_SESSION['username']);
$username = $isLoggedIn ? $_SESSION['username'] : null;

// Get game name and score from POST data
$game = $_POST['game'] ?? null;
$score = $_POST['score'] ?? null;

// Validate input
if (!$game || !is_numeric($score) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Invalid game or score."]);
    exit;
}

$pile = getScorePercentile($score, $game);

// Check if the request method is POST
// If so, try adding score to database
if ($isLoggedIn) {
    // Determine if the game uses "lower is better" scoring
    ; // Add games where lower scores are better
    $lowerIsBetter = in_array($game, ['maze_game', 'spot', 'estimate', 'Platformer']);

    // Check if this score is a personal best
    $query = "
        SELECT " . ($lowerIsBetter ? "MIN(score)" : "MAX(score)") . " AS best_score
        FROM scores
        WHERE username = :username AND game = :game";
    $stmt = $db->prepare($query);
    $stmt->execute([':username' => $username, ':game' => $game]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $currentBest = $result['best_score'] ?? ($lowerIsBetter ? PHP_FLOAT_MAX : PHP_FLOAT_MIN);

    $isPersonalBest = $lowerIsBetter ? $score < $currentBest : $score > $currentBest;

    if ($isPersonalBest) {
        // Insert the new score as a personal best
        $insertQuery = "
            INSERT INTO scores (username, game, score, date) 
            VALUES (:username, :game, :score, CURRENT_TIMESTAMP)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->execute([':username' => $username, ':game' => $game, ':score' => $score]);
    }
}

// Even if user is not logged in, try returning the percentile
echo json_encode(["success" => true, "percentile" => $pile]);
?>
