/*
    Simon Says Game
    Javascript functionality for game logic
    Made by: Ethan Dirkes
    Audio generated from sfxr.me

    Created 11/9/2024
    Edited 11/10/2024 (Ethan):
        - Added comments
        - Fixed bug where yellow was never picked for sequence
        - Fixed timing of flashes so repeated colors now do seperate flashes
            instead of a long flash
        - Added time after last flash of sequence before player can start guessing
    Edited 12/7/2024 (Ethan):
        - Added audio to game
    
    Preconditions:
        Only inputs are mouse clicks on the color buttons
    Postconditions:
        Only return value is the final score
    Errors:
        None
    Side effects:
        None
    Invariants:
        - Colors present in game
        - Values for game states
        - References to DOM elements
    Known faults:
        None
*/

const COLORS = ['blue', 'red', 'green', 'yellow'];    // Colors for game
let sequence = []                                   // Generated sequence for current game
let level = 0;                                      // Level the player is at
let num_guesses = 0;                                // The number of guesses the player has for the current round
let state = undefined;                              // State of the game
let mouseover = false;                              // If the mouse is over a button

// sounds for when each color is shown or pressed, wrong button press, and next level achieved
const TONE1 = new Audio("tone1.wav");
const TONE2 = new Audio("tone2.wav");
const TONE3 = new Audio("tone3.wav");
const TONE4 = new Audio("tone4.wav");
const WRONG = new Audio("wrong.wav");
const LVLUP = new Audio("levelup.wav");

// Enum for game states
const STATES = Object.freeze({
    START:      0,
    NEXTRND:    1,
    SHOWSEQ:    2,
    PLAYERSEQ:  3,
    GAMEOVER:   4
});

// Get DOM elements from page
const START_BUTTON = document.getElementById('start');
const GAMEBOARD = document.getElementById('gameboard');
const COLOR_ELEMENTS = document.querySelectorAll('.color'); // Select all color button elements
const RESULTS = document.getElementById('results');

// Listen for when game is started
START_BUTTON.addEventListener('click', startGame);

// Initialize the game
function startGame() {
    state = STATES.START;   // Set state

    // Disable button
    START_BUTTON.classList.remove('btn');
    START_BUTTON.classList.add('btn-d')
    RESULTS.style.visibility="visible"; // Show results messages
    sequence = [];              // Reset sequence
    level = 0;                  // Reset level
    state = STATES.NEXTRND;     // Change to next state
    nextRound();                // Begin first round
}

// Begin next round
function nextRound() {
    level++;            // Increase level
    num_guesses = 0;    // Reset number of guesses
    const next_color = COLORS[Math.floor(Math.random() * COLORS.length)];   // Pick random color for sequence
    sequence.push(next_color);  // Push that color to the sequence array

    COLOR_ELEMENTS.forEach(color => color.classList.remove('active'));  // Remove active tag from each color button
    RESULTS.innerHTML="Level " + level; // Display current level
    showSequence(); // Show the generated sequence
}

// Show the current sequence in full
function showSequence() {
    state = STATES.SHOWSEQ; // Update state
    let i = 0;  // i: index of sequence array to display

    // Display a color over a set interval
    const interval = setInterval(() =>{
        // Get the ID of the color element to flash and add the 'active' tag to it
        const COLOR = document.getElementById(sequence[i]);
        COLOR.classList.add('active');
        playColorAudio(sequence[i]);    // play tone corresponding to color

        // Remove 'active' tag after a time
        setTimeout(() => COLOR.classList.remove('active'), Math.max(1000/Math.sqrt(sequence.length), 100));
        i++;    // Increase index counter

        // Break out of interval loop if end of sequence reached
        if (i >= sequence.length) {
            setTimeout(() => {
                clearInterval(interval);
                state = STATES.PLAYERSEQ;   // Change state
            }, Math.max(1000/Math.sqrt(sequence.length), 100));
        }
    }, Math.max(2000/Math.sqrt(sequence.length), 200));
}

// Add event listeners to each color button
COLOR_ELEMENTS.forEach(colorElement => {
    colorElement.addEventListener('click', (event) => {     // Event for when the button is clicked
        if (state != STATES.PLAYERSEQ) return;  // If not in player guessing state, return

        num_guesses++;  // Increase number of guesses

        // Get ID of button clicked and check if click was correct
        const COLOR = event.target.id;
        event.target.classList.remove('hover');
        let res = checkSequence(COLOR);

        // Do as result of sequence check
        switch(res) {
            // Incorrect, game over
            case 0:
                WRONG.play();   // play incorrect sound
                gameOver();
                break;
            // Correct, end of sequence, next round
            case 1:
                state = STATES.NEXTRND;
                RESULTS.innerHTML = "Correct! Beginning next level...";
                LVLUP.play();   // play level up sound
                setTimeout(nextRound(), 1000);
                break;
            // Correct
            default:
                playColorAudio(COLOR);  // play tone corresponding to color
                event.target.classList.add('hover');
        }
    });

    // Event for if mouse is over, add hover tag if true
    colorElement.addEventListener('mouseover', (event) =>{
        if (state != STATES.PLAYERSEQ) return;

        mouseover = true;
        event.target.classList.add('hover');
    });

    // Event for if mouse is no longer over, remove hover tag if true
    colorElement.addEventListener('mouseout', (event) => {
        if (state != STATES.PLAYERSEQ) return;

        mouseover = false;
        event.target.classList.remove('hover');
    });
});


/*
    Check if the ID of the color clicked matches the color at the current index
    Return 0 if guess incorrect
    Return 1 if guess was last in sequence
    Return -1 if guess was correct
*/
function checkSequence(color) {
    if (color !== sequence[num_guesses - 1]) {
        return 0;
    }

    if (num_guesses == sequence.length) {
        return 1;
    }
    return -1;
}


// Sequence incorrectly matched, game is over
function gameOver() {
    state = STATES.GAMEOVER;    // Change state
    RESULTS.innerHTML = "Game over! Final score: " + (level - 1);   // Display final score

    // Enable play button
    START_BUTTON.classList.remove('btn-d');
    START_BUTTON.classList.add('btn');
    fetch('../../add_score.php', { // publish score to database
        method: 'POST',
        body: new URLSearchParams({
            game: 'sequence',
            score: level - 1
        })
    });
}

// play a tone corresponding to the color passed into the function
// frequency/pitch increases from tone 1 to 4 and are tied to
// the colors on the board, left-to-right, top-to-bottom
function playColorAudio(color) {
    switch(color) {
        case 'blue':
            TONE1.play();
            return;
        case 'red':
            TONE2.play();
            return;
        case 'green':
            TONE3.play();
            return;
        default:
            TONE4.play();
    }
}
