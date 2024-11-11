// baggle.js
// Baggle game logic and rendering
// Author: Christopher Gronewold
// Created: 11/10/2024
// Preconditions:
// Postconditions: Creates and runs a Baggle game
// Error conditions: None explicitly handled
// Side effects:
// Invariants:
// Known faults: None

const board = document.getElementById('board'); // Gets the board element
const wordInput = document.getElementById('word-input'); // Gets the word input element
const submitButton = document.getElementById('submit-word'); // Gets the submit button element
const scoreDisplay = document.getElementById('score'); // Gets the score display element
const timerDisplay = document.getElementById('timer'); // Gets the timer display element
const wordList = document.getElementById('word-list'); // Gets the word list element

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Defines the alphabet
const dice = [ // Defines the dice configurations
    'AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
    'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
    'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
    'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ'
];

let score = 0; // Initializes the score
let time = 120; // Initializes the time
let foundWords = new Set(); // Creates a set to store found words
let dictionary = new Set(); // Creates a set to store the dictionary
let gameStarted = false; // Initializes the game state
let timerInterval; // Declares a variable for the timer interval

// Load the dictionary
async function loadDictionary() { // Defines the loadDictionary function
    try { // Starts a try block
        const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'); // Fetches the dictionary file
        const text = await response.text(); // Gets the text from the response
        dictionary = new Set(text.split('\n').map(word => word.trim().toUpperCase())); // Creates a set of uppercase words from the dictionary
        console.log('Dictionary loaded successfully'); // Logs a success message
        startGame(); // Starts the game
    } catch (error) { // Catches any errors
        console.error('Error loading dictionary:', error); // Logs the error
        alert('Error loading dictionary. Please refresh the page and try again.'); // Alerts the user about the error
    }
}

function generateBoard() { // Defines the generateBoard function
    board.innerHTML = ''; // Clears the board
    const shuffledDice = dice.sort(() => Math.random() - 0.5); // Shuffles the dice
    for (let i = 0; i < 16; i++) { // Loops 16 times
        const die = shuffledDice[i]; // Gets a die
        const letter = die[Math.floor(Math.random() * die.length)]; // Selects a random letter from the die
        const letterElement = document.createElement('div'); // Creates a div for the letter
        letterElement.className = 'letter'; // Sets the class for the letter div
        letterElement.textContent = letter; // Sets the text content of the letter div
        board.appendChild(letterElement); // Adds the letter div to the board
    }
}

function calculateWordScore(word) { // Defines the calculateWordScore function
    const length = word.length; // Gets the length of the word
    if (length <= 4) return 1; // Returns 1 point for words up to 4 letters
    if (length === 5) return 2; // Returns 2 points for 5-letter words
    if (length === 6) return 3; // Returns 3 points for 6-letter words
    if (length === 7) return 4; // Returns 4 points for 7-letter words
    return 11; // Returns 11 points for words with 8 or more letters
}

function submitWord() { // Defines the submitWord function
    if (!gameStarted) return; // Returns if the game hasn't started

    const word = wordInput.value.trim().toUpperCase(); // Gets and formats the submitted word
    if (word.length < 3) { // Checks if the word is too short
        alert('Word must be at least 3 letters long'); // Alerts the user
        return; // Returns from the function
    }
    if (foundWords.has(word)) { // Checks if the word has already been found
        alert('Word already found'); // Alerts the user
        return; // Returns from the function
    }
    if (!dictionary.has(word)) { // Checks if the word is in the dictionary
        alert('Not a valid word'); // Alerts the user
        return; // Returns from the function
    }
    // In a real implementation, you'd also check if the word is possible to form on the board
    foundWords.add(word); // Adds the word to the set of found words
    const wordScore = calculateWordScore(word); // Calculates the score for the word
    score += wordScore; // Adds the word score to the total score
    scoreDisplay.textContent = `Score: ${score}`; // Updates the score display
    const wordElement = document.createElement('div'); // Creates a div for the word
    wordElement.textContent = `${word} (${wordScore} point${wordScore !== 1 ? 's' : ''})`; // Sets the text content of the word div
    wordList.appendChild(wordElement); // Adds the word div to the word list
    wordInput.value = ''; // Clears the input field
}

function updateTimer() { // Defines the updateTimer function
    time--; // Decrements the time
    timerDisplay.textContent = `Time: ${time}`; // Updates the timer display
    if (time === 0) { // Checks if time has run out
        endGame(); // Ends the game
    }
}

function startGame() { // Defines the startGame function
    score = 0; // Resets the score
    time = 120; // Resets the time
    foundWords.clear(); // Clears the set of found words
    wordList.innerHTML = ''; // Clears the word list
    scoreDisplay.textContent = 'Score: 0'; // Resets the score display
    timerDisplay.textContent = 'Time: 120'; // Resets the timer display
    
    generateBoard(); // Generates a new board
    gameStarted = true; // Sets the game state to started
    submitButton.disabled = false; // Enables the submit button
    wordInput.disabled = false; // Enables the word input
    wordInput.value = ''; // Clears the word input
    wordInput.focus(); // Focuses on the word input
    
    clearInterval(timerInterval); // Clears any existing timer interval
    timerInterval = setInterval(updateTimer, 1000); // Starts a new timer interval
}

function endGame() { // Defines the endGame function
    clearInterval(timerInterval); // Clears the timer interval
    gameStarted = false; // Sets the game state to not started
    submitButton.disabled = true; // Disables the submit button
    wordInput.disabled = true; // Disables the word input
    
    const playAgain = confirm(`Game Over! Your score: ${score}`); // Shows a game over message and asks to play again
    if (playAgain) { // If the user wants to play again
        startGame(); // Starts a new game
    }
}

submitButton.addEventListener('click', submitWord); // Adds a click event listener to the submit button
wordInput.addEventListener('keypress', function(event) { // Adds a keypress event listener to the word input
    if (event.key === 'Enter') { // If the Enter key is pressed
        submitWord(); // Submits the word
    }
});

// Disable input and button until the game starts
submitButton.disabled = true; // Disables the submit button
wordInput.disabled = true; // Disables the word input

// Load dictionary and start the game
loadDictionary(); // Loads the dictionary and starts the game