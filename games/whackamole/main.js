// main.js
// Whack-A-Mole game logic and rendering
// Author: Zonaid Prithu
// Created: 11/04/2024
// Preconditions: Requires HTML5 canvas and modern JavaScript support
// Postconditions: Creates and runs a Whack-A-Mole game
// Error conditions: None explicitly handled
// Side effects: Modifies DOM, uses browser storage for images
// Invariants: Game state consistency
// Known faults: None

const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.hole')]
const scoreEl = document.querySelector('.score span')
const timerEl = document.querySelector('.timer span')
const startButton = document.querySelector('.start-button')
const endScreen = document.querySelector('.end-screen')
const finalScoreEl = document.querySelector('.final-score')
const playAgainButton = document.querySelector('.play-again-button')

// Game state variables
let score = 0               // Player's score
let timeLeft = 30           // Time left in the game (in seconds)
let gameInterval             // Interval for the game timer
let moleTimeout, bombTimeout // Timeouts for mole and bomb animations

// Initializes and starts a new game
function startGame() {
    // Reset the board: remove any existing moles and bombs
    holes.forEach(hole => {
        hole.innerHTML = ''; // Clear all child elements from each hole
    });

    // Reset game state variables
    score = 0
    timeLeft = 30
    scoreEl.textContent = score
    timerEl.textContent = timeLeft
    startButton.style.display = 'none'
    endScreen.style.display = 'none'
    
    // Start the game timer and mole generation
    gameInterval = setInterval(updateTimer, 1000)
    run()  // Begin spawning moles and bombs
}

// Updates the game timer each second and ends the game if time is up
function updateTimer() {
    timeLeft--
    timerEl.textContent = timeLeft
    if (timeLeft <= 0) {
        endGame()  // Trigger game end if the timer reaches 0
    }
}

// Ends the game, stops all intervals, and displays the final score
function endGame() {
    clearInterval(gameInterval)   // Stop the timer interval
    clearTimeout(moleTimeout)     // Clear mole timeout to prevent further spawning
    clearTimeout(bombTimeout)     // Clear bomb timeout
    endScreen.style.display = 'flex' // Show the end screen
    finalScoreEl.textContent = score  // Display the final score
    startButton.style.display = 'none' // Keep start button hidden
    fetch('../../add_score.php', { // publish score to database
        method: 'POST',
        body: new URLSearchParams({
            game: 'whackamole',
            score: score
        })
    });
}

// Main game loop: spawns a mole, with a chance to spawn a bomb in a different hole
function run() {
    const moleHoleIndex = Math.floor(Math.random() * holes.length) // Random hole for mole
    const moleHole = holes[moleHoleIndex]

    // Create and configure mole element
    const moleImg = document.createElement('img')
    moleImg.classList.add('mole')
    moleImg.src = 'assets/mole.png'

    // Increase score when mole is clicked
    moleImg.addEventListener('click', () => {
        score += 10
        scoreEl.textContent = score
        moleImg.src = 'assets/mole-whacked.png' // Change mole to "whacked" image
        clearTimeout(moleTimeout) // Clear mole timeout to avoid premature removal
        setTimeout(() => {
            moleHole.removeChild(moleImg)
            if (timeLeft > 0) run()  // Spawn a new mole if the game is still running
        }, 200)
    })

    moleHole.appendChild(moleImg)

    // Remove mole after a set time if not clicked
    moleTimeout = setTimeout(() => {
        moleHole.removeChild(moleImg)
        if (timeLeft > 0) run()
    }, 800)

    // 50% chance of spawning a bomb
    const spawnBomb = Math.random() < 0.5
    if (spawnBomb) {
        let bombHoleIndex
        do {
            bombHoleIndex = Math.floor(Math.random() * holes.length)
        } while (bombHoleIndex === moleHoleIndex)  // Ensure bomb is in a different hole

        const bombHole = holes[bombHoleIndex]
        const bombImg = document.createElement('img')
        bombImg.classList.add('bomb')
        bombImg.src = 'assets/bomb.png'

        // Decrease score when bomb is clicked
        bombImg.addEventListener('click', () => {
            score -= 10
            scoreEl.textContent = score
            bombImg.src = 'assets/explosion.png' // Change bomb to explosion image
            clearTimeout(bombTimeout) // Clear bomb timeout to prevent removal delay
            setTimeout(() => {
                bombHole.removeChild(bombImg)
            }, 200)
        })

        bombHole.appendChild(bombImg)

        // Remove bomb after a set time if not clicked
        bombTimeout = setTimeout(() => {
            bombHole.removeChild(bombImg)
        }, 800)  // Bomb disappears after 800 ms if not clicked
    }
}

// Event listeners for game controls
startButton.addEventListener('click', startGame)
playAgainButton.addEventListener('click', startGame)

// Mouse events for cursor animation (hammer effect)
window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px'
    cursor.style.left = e.pageX + 'px'
})
window.addEventListener('mousedown', () => {
    cursor.classList.add('active')
})
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active')
})
