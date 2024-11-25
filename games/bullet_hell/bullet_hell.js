// bullet_hell.js
// Bullet Hell game logic and rendering
// Author: Christopher Gronewold
// Created: 11/10/2024
// Preconditions:
// Postconditions: Creates and runs a Bullet Hell game
// Error conditions: None explicitly handled
// Side effects:
// Invariants:
// Known faults: None

const canvas = document.getElementById('gameCanvas'); // Get canvas element
const ctx = canvas.getContext('2d'); // Get 2D rendering context
const startButton = document.getElementById('startButton'); // Get start button element
const backgroundMusic = document.getElementById('backgroundMusic'); // Get background music element

canvas.width = 800; // Set canvas width
canvas.height = 600; // Set canvas height

const ship = {
    x: canvas.width / 2, // Initial x position
    y: canvas.height / 2, // Initial y position
    width: 25, // Ship width
    height: 25, // Ship height
    speed: 4, // Ship speed
    hitboxScale: 0.2 // Hitbox scale
};

const boss = {
    x: canvas.width / 2, // Initial x position
    y: -100, // Initial y position (off-screen)
    width: 100, // Boss width
    height: 100, // Boss height
    speed: 1, // Boss speed
    angle: Math.PI / 2, // Initial angle
    active: false, // Boss active state
    revealComplete: false // Boss reveal state
};

const devMode = false; // Dev mode flag

const bullets = []; // Array to store bullets
const bossBullets = []; // Array to store boss bullets
const keys = {}; // Object to store key states

let gameLoop; // Variable to store game loop interval
let nextBulletTime = 0; // Time for next bullet spawn
const bpm = 158; // Beats per minute
const beatInterval = 60000 / bpm; // Interval between beats

const shipImage = new Image(); // Create ship image object
shipImage.src = 'ship.png'; // Set ship image source

const missileImage = new Image(); // Create missile image object
missileImage.src = 'missile.png'; // Set missile image source

const bossImage = new Image(); // Create boss image object
bossImage.src = 'boss_ship.png'; // Set boss image source

let bossBulletCount = 2; // Initial boss bullet count
const bulletCountIncreaseInterval = 10000; // Interval to increase bullet count
let lastBulletCountIncrease = 0; // Time of last bullet count increase

const gameOverText = {
    text: 'Game Over', // Game over text
    x: canvas.width / 2, // X position
    y: canvas.height / 2 - 50, // Y position
    font: '48px Arial', // Font style
    color: 'red' // Text color
};

function drawShip() {
    ctx.drawImage(shipImage, ship.x - ship.width / 2, ship.y - ship.height / 2, ship.width, ship.height); // Draw ship image

    ctx.beginPath(); // Begin drawing path
    ctx.arc(ship.x, ship.y, (ship.width / 2) * ship.hitboxScale, 0, Math.PI * 2); // Draw hitbox circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Set stroke style
    ctx.stroke(); // Stroke the path
}

function drawBoss() {
    if (!boss.active) return; // Return if boss is not active

    ctx.save(); // Save canvas state
    ctx.translate(boss.x, boss.y); // Translate to boss position
    ctx.rotate(boss.angle + Math.PI / 2); // Rotate canvas
    ctx.drawImage(bossImage, -boss.width / 2, -boss.height / 2, boss.width, boss.height); // Draw boss image
    ctx.restore(); // Restore canvas state
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.save(); // Save canvas state
        ctx.translate(bullet.x, bullet.y); // Translate to bullet position
        ctx.rotate(bullet.angle + Math.PI / 2); // Rotate canvas
        ctx.drawImage(missileImage, -10, -15, 20, 30); // Draw missile image
        ctx.restore(); // Restore canvas state
    });

    bossBullets.forEach(bullet => {
        ctx.beginPath(); // Begin drawing path
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2); // Draw bullet circle
        ctx.fillStyle = 'red'; // Set fill style
        ctx.fill(); // Fill the path
    });
}

function moveBullets() {
    const currentTime = backgroundMusic.currentTime * 1000; // Get current time in milliseconds
    bullets.forEach(bullet => {
        if (currentTime >= bullet.startTime) {
            bullet.x += Math.cos(bullet.angle) * bullet.speed; // Move bullet in x direction
            bullet.y += Math.sin(bullet.angle) * bullet.speed; // Move bullet in y direction
        }
    });

    bossBullets.forEach(bullet => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed; // Move boss bullet in x direction
        bullet.y += Math.sin(bullet.angle) * bullet.speed; // Move boss bullet in y direction
    });
}

function createBullet() {
    const side = Math.floor(Math.random() * 4); // Choose random side
    let x, y, angle;

    switch (side) {
        case 0: x = Math.random() * canvas.width; y = 0; angle = Math.PI / 2; break; // Top side
        case 1: x = canvas.width; y = Math.random() * canvas.height; angle = Math.PI; break; // Right side
        case 2: x = Math.random() * canvas.width; y = canvas.height; angle = -Math.PI / 2; break; // Bottom side
        case 3: x = 0; y = Math.random() * canvas.height; angle = 0; break; // Left side
    }

    const dx = ship.x - x; // Calculate x distance to ship
    const dy = ship.y - y; // Calculate y distance to ship
    angle = Math.atan2(dy, dx); // Calculate angle to ship

    bullets.push({
        x: x, // Bullet x position
        y: y, // Bullet y position
        speed: 5, // Bullet speed
        startTime: nextBulletTime, // Bullet start time
        angle: angle // Bullet angle
    });
}

function createBossBullet() {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const frontX = boss.x + Math.cos(boss.angle) * boss.height / 2; // Calculate front x position
    const frontY = boss.y + Math.sin(boss.angle) * boss.height / 2; // Calculate front y position

    bossBullets.push({
        x: frontX, // Boss bullet x position
        y: frontY, // Boss bullet y position
        speed: 2, // Boss bullet speed
        angle: angle // Boss bullet angle
    });
}

function increaseBossBulletCount(currentTime) {
    if (currentTime - lastBulletCountIncrease >= bulletCountIncreaseInterval) {
        bossBulletCount = bossBulletCount + 1; // Increase boss bullet count
        lastBulletCountIncrease = currentTime; // Update last increase time
    }
}

function checkCollision() {
    if (devMode) return; // Skip collision check in dev mode

    const hitboxRadius = (ship.width / 2) * ship.hitboxScale; // Calculate hitbox radius

    bullets.forEach(bullet => {
        const dx = ship.x - bullet.x; // Calculate x distance
        const dy = ship.y - bullet.y; // Calculate y distance
        const distance = Math.sqrt(dx * dx + dy * dy); // Calculate distance

        if (distance < hitboxRadius + 10) {
            endGame(); // End game if collision detected
        }
    });

    bossBullets.forEach(bullet => {
        const dx = ship.x - bullet.x; // Calculate x distance
        const dy = ship.y - bullet.y; // Calculate y distance
        const distance = Math.sqrt(dx * dx + dy * dy); // Calculate distance

        if (distance < hitboxRadius + 4) {
            endGame(); // End game if collision detected
        }
    });
}

function moveShip() {
    let dx = 0; // Initialize x movement
    let dy = 0; // Initialize y movement

    // Arrow keys
    if (keys.ArrowLeft || keys.KeyA) dx -= 1; // Move left
    if (keys.ArrowRight || keys.KeyD) dx += 1; // Move right
    if (keys.ArrowUp || keys.KeyW) dy -= 1; // Move up
    if (keys.ArrowDown || keys.KeyS) dy += 1; // Move down

    if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2; // Normalize diagonal movement
        dy *= Math.SQRT1_2; // Normalize diagonal movement
    }

    ship.x += dx * ship.speed; // Update ship x position
    ship.y += dy * ship.speed; // Update ship y position

    ship.x = Math.max(ship.width / 2, Math.min(canvas.width - ship.width / 2, ship.x)); // Constrain x position
    ship.y = Math.max(ship.height / 2, Math.min(canvas.height - ship.height / 2, ship.y)); // Constrain y position
}

let bossStartTime = 20; // Boss start time
let bossRevealDuration = 4; // Boss reveal duration
let bossLoopStartAngle = -Math.PI / 2; // Boss loop start angle

function moveBoss() {
    if (!boss.active) return; // Return if boss is not active

    const currentTime = backgroundMusic.currentTime; // Get current time
    const centerX = canvas.width / 2; // Calculate center x
    const centerY = canvas.height / 2; // Calculate center y
    const radius = Math.min(canvas.width, canvas.height) * 0.4; // Calculate radius
    const topY = centerY - radius; // Calculate top y position

    if (currentTime < bossStartTime) {
        // Boss is not visible yet
        boss.x = centerX; // Set boss x position
        boss.y = -boss.height; // Set boss y position off-screen
    } else if (currentTime < bossStartTime + bossRevealDuration) {
        // Reveal phase
        const revealProgress = (currentTime - bossStartTime) / bossRevealDuration; // Calculate reveal progress
        boss.x = centerX; // Set boss x position
        boss.y = -boss.height + (topY + boss.height) * revealProgress; // Set boss y position
        boss.revealComplete = false; // Set reveal not complete
    } else {
        // Circular movement phase
        if (!boss.revealComplete) {
            boss.revealComplete = true; // Set reveal complete
            boss.y = topY; // Set boss y position
        }

        const circularSpeed = 0.25; // Circular movement speed
        const angle = bossLoopStartAngle + (currentTime - (bossStartTime + bossRevealDuration)) * circularSpeed; // Calculate angle
        boss.x = centerX + Math.cos(angle) * radius; // Set boss x position
        boss.y = centerY + Math.sin(angle) * radius; // Set boss y position
    }

    // Always face the center
    boss.angle = Math.atan2(centerY - boss.y, centerX - boss.x); // Calculate boss angle
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    moveShip(); // Move ship
    moveBoss(); // Move boss
    moveBullets(); // Move bullets
    checkCollision(); // Check for collisions

    drawShip(); // Draw ship
    drawBoss(); // Draw boss
    drawBullets(); // Draw bullets

    const currentTime = backgroundMusic.currentTime * 1000; // Get current time in milliseconds

    // Only create bullets before the 20-second mark
    if (currentTime < 20000 && currentTime >= nextBulletTime) {
        createBullet(); // Create bullet
        nextBulletTime += beatInterval; // Update next bullet time
    }

    if (boss.active && currentTime >= 24000) {
        increaseBossBulletCount(currentTime); // Increase boss bullet count
        if (Math.random() < 0.3) { // 30% chance to fire
            for (let i = 0; i < bossBulletCount; i++) {
                createBossBullet(); // Create boss bullet
            }
        }
    }

    // Add dev mode indicator with bullet count
    if (devMode) {
        ctx.font = '20px Arial'; // Set font
        ctx.fillStyle = 'yellow'; // Set fill style
        ctx.textAlign = 'left'; // Set text alignment
        ctx.fillText('DEV MODE', 10, 30); // Draw dev mode text

        // Display boss bullet count
        ctx.fillText(`Boss Bullet Count: ${bossBulletCount}`, 10, 60); // Draw boss bullet count
    }
}

function startGame() {
    startButton.style.display = 'none'; // Hide start button
    backgroundMusic.play(); // Play background music
    nextBulletTime = 0; // Reset next bullet time
    boss.active = true; // Activate boss
    boss.revealComplete = false; // Reset boss reveal state
    boss.x = canvas.width / 2; // Set boss x position
    boss.y = -boss.height; // Set boss y position off-screen
    bossBulletCount = 2; // Reset boss bullet count
    lastBulletCountIncrease = 0; // Reset last bullet count increase time
    gameLoop = setInterval(update, 1000 / 60); // Start game loop
}

function endGame() {
    clearInterval(gameLoop); // Stop game loop
    const survivalTime = backgroundMusic.currentTime.toFixed(2); // Calculate survival time
    backgroundMusic.pause(); // Pause background music
    backgroundMusic.currentTime = 0; // Reset music time
    bullets.length = 0; // Clear bullets
    bossBullets.length = 0; // Clear boss bullets
    ship.x = canvas.width / 2; // Reset ship x position
    ship.y = canvas.height / 2; // Reset ship y position
    boss.active = false; // Deactivate boss
    boss.y = -100; // Move boss off-screen

    for (let key in keys) {
        keys[key] = false; // Reset all key states
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Game Over text
    ctx.font = gameOverText.font; // Set font
    ctx.fillStyle = gameOverText.color; // Set fill style
    ctx.textAlign = 'center'; // Set text alignment
    ctx.fillText(gameOverText.text, canvas.width / 2, canvas.height / 3); // Draw game over text

    // Survival Time text
    ctx.font = '24px Arial'; // Set font
    ctx.fillStyle = 'white'; // Set fill style
    ctx.fillText(`You survived for ${survivalTime} seconds`, canvas.width / 2, canvas.height / 3 + 50); // Draw survival time text

    startButton.style.display = 'block'; // Show start button
    fetch('../../add_score.php', {
        method: 'POST',
        body: new URLSearchParams({
            game: 'bullet_hell',
            score: survivalTime
        })
    });
}

startButton.addEventListener('click', startGame); // Add click event listener to start button

document.addEventListener('keydown', (e) => {
    keys[e.code] = true; // Set key state to true on keydown
    e.preventDefault(); // Prevent default action
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false; // Set key state to false on keyup
    e.preventDefault(); // Prevent default action
});

window.addEventListener('blur', () => {
    for (let key in keys) {
        keys[key] = false; // Reset all key states when window loses focus
    }
});
