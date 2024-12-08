/*
    Spot the Object Game
    Javascript functionality for game logic
    Made by: Tommy Lam

    Created: 11/9/2024
    Edited 11/10/2024 (Tommy):
        - Added comments
    Edited 12/8/2024 (Tommy):
        - Added audio to game
    Preconditions:
        - DOM must be loaded with required elements:
            - .game-container
            - #game-canvas
            - #hint-container
            - #start button
        - Only inputs are mouse clicks on game objects
    Postconditions:
        - Returns time taken to find target object
    Errors:
        None
    Side effects:
        - Modifies DOM by adding/removing game objects
        - Updates display properties of existing DOM elements
    Invariants:
        - Game configuration (shapes, colors, size)
        - Canvas dimensions
        - Number of distractor objects
    Known faults:
        None
*/

// Audio for the game
const CORRECT = new Audio("correct.mp3");
const WRONG = new Audio("wrong.mp3");
const MUSIC = new Audio("music.mp3");

// Configure music to loop
MUSIC.loop = true;

// Main game class for Spot the Object game
class SpotGame {
    // Initialize game properties and set up DOM element references
    constructor() {
        // Get DOM elements needed for game
        this.gameContainer = document.querySelector('.game-container');
        this.gameCanvas = document.getElementById('game-canvas');
        this.hintContainer = document.getElementById('hint-container');
        this.startButton = document.getElementById('start');
        this.startTime = null;
        
        // Game configuration object containing all constant game parameters
        this.config = {
            numDistractors: 15,                                             // Number of non-target objects
            objectSize: 40,                                                 // Size of game objects in pixels
            shapes: ['circle', 'square', 'triangle', 'star'],               // Available shapes
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']  // Available colors
        };

        // Set canvas positioning for proper object placement
        this.gameCanvas.style.position = 'relative';
        
        // Event listeners for game interactions
        this.startButton.addEventListener('click', () => this.startGame());
        
        // Handle window resize to maintain proper object positions
        window.addEventListener('resize', () => {
            if (this.gameCanvas.style.display === 'block') {
                this.updateObjectPositions();
            }
        });
    }

    // Generate random position for game objects within canvas boundaries
    getRandomPosition() {
        const margin = this.config.objectSize;
        const maxWidth = this.gameCanvas.clientWidth - (2 * margin);
        const hintHeight = this.hintContainer.offsetHeight || 70;
        const maxHeight = this.gameCanvas.clientHeight - (2 * margin) - hintHeight;
        
        return {
            x: margin + Math.random() * maxWidth,
            y: margin + Math.random() * maxHeight
        };
    }

    // Create a new game object with random shape and color
    createObject(isTarget = false) {
        // Create DOM element for game object
        const object = document.createElement('div');
        const shape = this.config.shapes[Math.floor(Math.random() * this.config.shapes.length)];
        const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        
        // Set basic object properties
        object.className = 'game-object';
        if (isTarget) object.classList.add('target');
        
        object.style.width = `${this.config.objectSize}px`;
        object.style.height = `${this.config.objectSize}px`;
        object.style.backgroundColor = color;
        
        // Apply different shape styles based on random selection
        switch(shape) {
            case 'circle':
                object.style.borderRadius = '50%';
                break;
            case 'triangle':
                object.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                break;
            case 'star':
                object.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                break;
        }
        
        // Set random position for the object
        const pos = this.getRandomPosition();
        object.style.left = `${pos.x}px`;
        object.style.top = `${pos.y}px`;
        
        // Add click event listeners for audio
        object.addEventListener('click', (e) => {
            if (object.classList.contains('target')) {
                // Correct target clicked
                CORRECT.play();
                this.handleGameEnd();
            } else {
                // Wrong object clicked
                WRONG.play();
                e.stopPropagation(); // Prevent further event propagation
            }
        });
        
        return { object, shape, color };
    }

    // Update positions of all objects when window is resized
    updateObjectPositions() {
        const objects = this.gameCanvas.getElementsByClassName('game-object');
        Array.from(objects).forEach(object => {
            const pos = this.getRandomPosition();
            object.style.left = `${pos.x}px`;
            object.style.top = `${pos.y}px`;
        });
    }

    // Display the target object as a hint to the player
    showHint(targetObject) {
        this.hintContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <p style="margin: 0; font-weight: bold;">Find this object:</p>
                <div style="
                    width: ${this.config.objectSize}px;
                    height: ${this.config.objectSize}px;
                    ${targetObject.object.style.cssText}
                    display: inline-block;
                    vertical-align: middle;
                "></div>
            </div>
        `;
        this.hintContainer.style.display = 'block';
    }

    // Handle end of game when target is found
    handleGameEnd() {
        // Stop background music
        MUSIC.pause();
        MUSIC.currentTime = 0;

        // Calculate time taken to find object
        const endTime = (Date.now() - this.startTime) / 1000;

        // Create and display results
        const resultDisplay = document.createElement('div');
        resultDisplay.className = 'result-display';
        resultDisplay.innerHTML = `
            <h2>Great job!</h2>
            <p style="align: center; white-space: nowrap;">You found the object in ${endTime.toFixed(2)} seconds!</p>
            <button class="btn" onclick="game.startGame()">Play Again</button>
        `;
        
        // Clear canvas and show results
        this.gameCanvas.innerHTML = '';
        this.gameCanvas.appendChild(resultDisplay);

        fetch('../../add_score.php', {
            method: 'POST',
            body: new URLSearchParams({
                game: 'spot',
                score: endTime
            })
        });
    }

    // Initialize and start a new game
    startGame() {
        // Stop any existing music and restart
        MUSIC.pause();
        MUSIC.currentTime = 0;
        MUSIC.play();

        // Hide start button and prepare game canvas
        this.startButton.style.display = 'none';
        this.gameCanvas.style.display = 'block';
        this.gameCanvas.innerHTML = '';
        this.hintContainer.style.display = 'block';
        
        // Create and add target object
        const target = this.createObject(true);
        this.gameCanvas.appendChild(target.object);
        
        // Show hint for target object
        this.showHint(target);
        
        // Create and add distractor objects
        for (let i = 0; i < this.config.numDistractors; i++) {
            const distractor = this.createObject();
            this.gameCanvas.appendChild(distractor.object);
        }
        
        // Initialize game timer
        this.startTime = Date.now();
    }
}

// Create game instance when DOM is fully loaded
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new SpotGame();
});
