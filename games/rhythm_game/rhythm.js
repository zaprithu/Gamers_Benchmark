// maze.js
// Maze game logic and rendering
// Author: Christopher Gronewold
// Created: 10/26/2024
// Preconditions: Requires HTML5 canvas and modern JavaScript support
// Postconditions: Creates and runs a playable maze game
// Error conditions: None explicitly handled
// Side effects: Modifies DOM, uses browser storage for images
// Invariants: Game state consistency
// Known faults: None

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');                      // Get overlay element for messages

var gameStarted = false;

const hitZones = [
    { key: 'A', x: 50, width: 100 },
    { key: 'S', x: 150, width: 100 },
    { key: 'D', x: 250, width: 100 },
    { key: 'F', x: 350, width: 100 }
];

var notes = []; // List of active notes
var noteSpeed = 0.2; // Pixels per millisecond
const hitZoneY = canvas.height - 60; // Y-position for hit detection
const noteHeight = 100; // Size of each note square
const noteWidth = 20; // Size of each note square
let score = 0;

function drawHitZones() {
    hitZones.forEach(zone => {
        ctx.fillStyle = '#AAA';
        ctx.fillRect(zone.x, hitZoneY, zone.width, 10);
        ctx.fillStyle = '#000';
        ctx.fillText(zone.key, zone.x + zone.width / 2 - 5, hitZoneY + 30);
    });
}

function spawnNote() {
    const zone = hitZones[Math.floor(Math.random() * hitZones.length)];
    var y;
    if (notes.length == 0) {
        y = 0;
    }
    else {
        y = notes[notes.length - 1].y;
    }
    notes.push({ x: zone.x + zone.width / 2 - noteWidth / 2, y: y - 100, key: zone.key });
}

function updateNotes(delta) {
    notes.forEach(note => {
        note.y += delta * noteSpeed;
    });

    // Remove notes that have gone past the bottom
    if (notes.length > 0 && notes[0].y > canvas.height) {
        endGame();
    }
}

async function endGame() {
    overlay.style.display = 'flex';                                      // Show overlay
    gameStarted = false;                                                 // Game is no longer running
    noteSpeed = 0.2;
    notes = [];
    if (score <= 0) return;
    console.log(score);
    await fetch('../../add_score.php', {
        method: 'POST',
        body: new URLSearchParams({
            game: 'rhythm_game',
            score: score
        })
    });
}

function drawNotes() {
    ctx.fillStyle = '#FF6347';
    notes.forEach(note => {
        ctx.fillRect(note.x, note.y, noteWidth, noteHeight);
    });
}

function checkHit(key) {
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if (note.key === key && note.y > hitZoneY - noteHeight && note.y < hitZoneY + 10) {
            score += 10;
            notes.splice(i, 1); // Remove hit note
            return;
        }
    }
    endGame();
}

let lastTime = performance.now();
function gameLoop() {
    const deltaTime = performance.now() - lastTime; // Time since the last frame
    lastTime = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNotes();
    drawHitZones();
    if (gameStarted) {
        updateNotes(deltaTime);
        noteSpeed *= 1 + (0.000025 * deltaTime); // accelerating notes
        if (notes.length == 0 || notes[notes.length - 1].y > -noteHeight) {
            if (gameStarted) spawnNote();
        }
    }
    else {
        noteSpeed = 0.2;
    }


    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${score}`, 10, 20);

    requestAnimationFrame(gameLoop);
}
gameLoop();

document.addEventListener('keydown', event => {
    if (['a', 's', 'd', 'f'].includes(event.key.toLowerCase())) {
        checkHit(event.key.toUpperCase());
    }
    else if (event.key == ' ' && !gameStarted) {                      // If game can be started/restarted
        overlay.style.display = 'none';                                      // Hide overlay
        gameStarted = true;
        score = 0;
        return;                                                          // Exit function
    }
});
