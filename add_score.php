<?php
session_start(); // Start the session for accessing session variables

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

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get game name and score from POST data
    $game = $_POST['game'] ?? null;
    $score = $_POST['score'] ?? null;

    // Validate input
    if (!$game || !is_numeric($score)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid game or score."]);
        exit;
    }

    // Determine if the game uses "lower is better" scoring
    $lowerIsBetterGames = ['maze_game', 'spot']; // Add games where lower scores are better
    $lowerIsBetter = in_array($game, $lowerIsBetterGames);

    // Check if this score is a personal best
    $query = "
        SELECT MAX(score) AS max_score 
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

        echo json_encode(["success" => true, "message" => "New personal best recorded!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Score is not a personal best."]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Invalid request method."]);
}
?>
