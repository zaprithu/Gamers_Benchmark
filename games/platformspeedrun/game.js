/*
  Platformer Game
  JavaScript code for the game
  Made by: Christopher Gronewold

  Created 11/24/2024
  Edited 11/24/2024 (Christopher Gronewold):
      - Implemented game logic
      - Added player movement, collision detection, and animations
  Edited 11/24/2024 (Christopher Gronewold):
	  - Fixed bug that made the game freeze once completed.
  Preconditions:
      HTML canvas element must exist with id 'gameCanvas'
  Postconditions:
      Game is initialized and running
  Errors/exceptions:
      None
  Side effects:
      Game state changes based on user input and game logic
  Invariants:
      None
  Known faults:
      None
*/

const canvas = document.getElementById('gameCanvas'); // Gets the canvas element
const ctx = canvas.getContext('2d'); // Gets the 2D rendering context

const TILE_SIZE = 32; // Sets the size of each tile in pixels
const SPRITE_WIDTH = 50; // Sets the total width of sprite image
const SPRITE_HEIGHT = 37; // Sets the total height of sprite image
const SPRITE_MARGIN_X = 17; // Sets the empty space on each side of the sprite
const SPRITE_MARGIN_Y = 1; // Sets the empty space on top and bottom of the sprite
const SCALE = 2; // Sets the scale factor for the sprite
const PLAYER_WIDTH = (SPRITE_WIDTH - (SPRITE_MARGIN_X * 2)) * SCALE; // Calculates the player's collision width
const STANDING_HEIGHT = TILE_SIZE * 2; // Sets the player's standing height
const SLIDE_HEIGHT = TILE_SIZE - 1; // Sets the player's sliding height
const GRAVITY = 0.5; // Sets the gravity constant
const MAX_FALL_SPEED = 10; // Sets the maximum falling speed
const JUMP_FORCE = -10; // Sets the initial jump force
const MOVE_SPEED = 5; // Sets the player's movement speed
const SLIDE_DURATION = 1000; // Sets the duration of a slide in milliseconds
const WALL_JUMP_FORCE_X = 5; // Sets the horizontal force for wall jumps
const WALL_JUMP_FORCE_Y = -8; // Sets the vertical force for wall jumps
const COYOTE_TIME = 100; // Sets the coyote time in milliseconds
const WALL_JUMP_BUFFER = 100; // Sets the wall jump buffer time in milliseconds
const loadedImages = {}; // Object to store loaded images
const INITIAL_SLIDE_SPEED = MOVE_SPEED * 1.5; // Sets the initial sliding speed
const MIN_SLIDE_SPEED = MOVE_SPEED * 0.5; // Sets the minimum sliding speed
const ANIMATION_BUFFER_TIME = 50; // Sets the animation buffer time in milliseconds
let lastAnimationChange = 0; // Tracks the last animation change time
const CLIMB_SPEED = 3; // Sets the climbing speed
const VIEWPORT_WIDTH = 1300; // Sets the desired viewport width
let cameraX = 0; // Tracks the camera's X position
const HEADER_HEIGHT = 150; // Sets the space for controls at the top
let gameStartTime = Date.now(); // Tracks the game start time
let gameEndTime = null; // Tracks the game end time
let gameComplete = false; // Tracks if the game is complete
let SPAWN_X = 0; // Sets the initial spawn X coordinate
let SPAWN_Y = 0; // Sets the initial spawn Y coordinate

let map = [ // Defines the game map
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,1,1,0,0,0,1,1,1,0,1,0,1,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,0,1,0,1,0,0,1,0,0,1,1],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,1,1,1,1,0,1,1,0,1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,1,1,1,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,1,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,-1,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]; // Defines the game map layout

let player = { // Defines the player object with initial properties
    x: 0, // X position
    y: 0, // Y position
    vx: 0, // X velocity
    vy: 0, // Y velocity
    isJumping: false, // Jumping state
    isSliding: false, // Sliding state
    slideStartTime: 0, // Time when slide started
    facingRight: true, // Direction player is facing
    currentAnimation: 'idle', // Current animation state
    animationFrame: 0, // Current frame of animation
    onGround: false, // Whether player is on the ground
    onWall: false, // Whether player is on a wall
    lastGroundTime: 0, // Time when player was last on ground
    lastWallTime: 0, // Time when player was last on wall
    lastWallDirection: 0, // Direction of last wall touched
    lastAnimationUpdate: null, // Time of last animation update
    slideSpeed: 0, // Current slide speed
    slidingRight: true, // Direction of slide
    fallSpeed: 0, // Current fall speed
    touchingWall: false, // Whether player is touching a wall
    isWallClinging: false, // Whether player is wall clinging
    cornerForgivenessTime: 0, // Time for corner forgiveness
    CORNER_FORGIVENESS_BUFFER: 100 // Buffer time for corner forgiveness
};

function preloadImages() { // Function to preload images
    console.log("Starting image preload"); // Log start of image preload
    for (const animationKey in animations) { // Loop through all animations
        animations[animationKey].frames.forEach(frameName => { // Loop through all frames in each animation
            if (!loadedImages[frameName]) { // If image not already loaded
                const img = new Image(); // Create new Image object
                img.src = frameName; // Set source of image
                loadedImages[frameName] = img; // Store image in loadedImages object
                console.log("Loaded image:", frameName); // Log loaded image
            }
        });
    }
}

const animations = { // Define animation frames and speeds
    idle: {
        frames: ['adventurer-idle-00.png', 'adventurer-idle-01.png', 'adventurer-idle-02.png', 'adventurer-idle-03.png'],
        speed: 150
    },
    run: {
        frames: ['adventurer-run-00.png', 'adventurer-run-01.png', 'adventurer-run-02.png', 'adventurer-run-03.png', 'adventurer-run-04.png', 'adventurer-run-05.png'],
        speed: 100
    },
    jump: {
        frames: ['adventurer-jump-00.png', 'adventurer-jump-01.png', 'adventurer-jump-02.png', 'adventurer-jump-03.png'],
        speed: 100
    },
    fall: {
        frames: ['adventurer-fall-00.png', 'adventurer-fall-01.png'],
        speed: 150
    },
    slide: {
        frames: ['adventurer-slide-00.png', 'adventurer-slide-01.png'],
        speed: 200
    },
    slideStandUp: {
        frames: ['adventurer-slide-stand-up-00.png', 'adventurer-slide-stand-up-01.png', 'adventurer-slide-stand-up-02.png'],
        speed: 100
    },
    wallCling: {
        frames: ['adventurer-wall-cling-00.png', 'adventurer-wall-cling-01.png'],
        speed: 200
    },
    wallJump: {
        frames: ['adventurer-wall-jmp-00.png', 'adventurer-wall-jmp-01.png'],
        speed: 100
    },
    climb: {
        frames: ['adventurer-climb-00.png', 'adventurer-climb-01.png', 'adventurer-climb-02.png', 'adventurer-climb-03.png'],
        speed: 150
    }
};

const keys = { // Object to track key states
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false
};

function initializeGame() { // Function to initialize the game
    canvas.width = VIEWPORT_WIDTH; // Set canvas width
    canvas.height = map.length * TILE_SIZE + HEADER_HEIGHT; // Set canvas height
    gameStartTime = Date.now(); // Set game start time
    gameEndTime = null; // Reset game end time
    gameComplete = false; // Reset game complete flag
    
    // Reset all player properties
    player = {
        x: SPAWN_X,
        y: SPAWN_Y,
        vx: 0,
        vy: 0,
        isJumping: false,
        isSliding: false,
        slideStartTime: 0,
        facingRight: true,
        currentAnimation: 'idle',
        animationFrame: 0,
        onGround: false,
        onWall: false,
        lastGroundTime: 0,
        lastWallTime: 0,
        lastWallDirection: 0,
        lastAnimationUpdate: null,
        slideSpeed: 0,
        slidingRight: true,
        fallSpeed: 0,
        touchingWall: false,
        isWallClinging: false,
        cornerForgivenessTime: 0,
        CORNER_FORGIVENESS_BUFFER: 100,
        scoreSubmitted: false
    };

    // Only find spawn point if we haven't found it yet
    if (SPAWN_X === 0 && SPAWN_Y === 0) { // If spawn point not set
        for (let y = 0; y < map.length; y++) { // Loop through map rows
            for (let x = 0; x < map[y].length; x++) { // Loop through map columns
                if (map[y][x] === -1) { // If spawn point found
                    SPAWN_X = x * TILE_SIZE; // Set spawn X
                    SPAWN_Y = y * TILE_SIZE - STANDING_HEIGHT; // Set spawn Y
                    player.x = SPAWN_X; // Set player X
                    player.y = SPAWN_Y; // Set player Y
                    map[y][x] = 0; // Clear spawn point from map
                    return; // Exit function
                }
            }
        }
    }
}

function updateCamera() { // Function to update camera position
    // Center the camera on the player
    cameraX = player.x - VIEWPORT_WIDTH / 2 + PLAYER_WIDTH / 2; // Calculate camera X position
    
    // Clamp camera to map bounds
    const maxCameraX = (map[0].length * TILE_SIZE) - VIEWPORT_WIDTH; // Calculate maximum camera X position
    cameraX = Math.max(0, Math.min(cameraX, maxCameraX)); // Clamp camera X position
}

function drawMap() { // Function to draw the map
    const startCol = Math.floor(cameraX / TILE_SIZE); // Calculate start column
    const endCol = Math.ceil((cameraX + VIEWPORT_WIDTH) / TILE_SIZE); // Calculate end column
    
    for (let y = 0; y < map.length; y++) { // Loop through map rows
        for (let x = startCol; x <= endCol; x++) { // Loop through visible columns
            if (map[y] && map[y][x] === 1) { // If tile is a wall
                ctx.fillStyle = '#000'; // Set fill color to black
                ctx.fillRect( // Draw rectangle
                    x * TILE_SIZE - cameraX,
                    y * TILE_SIZE + HEADER_HEIGHT,
                    TILE_SIZE,
                    TILE_SIZE
                );
            } else if (map[y] && map[y][x] === 2) { // If tile is a flag
                // Draw flag
                ctx.fillStyle = '#ff0000'; // Set fill color to red
                ctx.beginPath(); // Begin drawing path
                const flagX = x * TILE_SIZE - cameraX; // Calculate flag X position
                const flagY = y * TILE_SIZE + HEADER_HEIGHT; // Calculate flag Y position
                // Draw pole
                ctx.fillRect( // Draw rectangle for pole
                    flagX + TILE_SIZE/4,
                    flagY,
                    TILE_SIZE/8,
                    TILE_SIZE
                );
                // Draw flag part
                ctx.beginPath(); // Begin drawing path
                ctx.moveTo(flagX + TILE_SIZE/4, flagY); // Move to top of pole
                ctx.lineTo(flagX + TILE_SIZE - 5, flagY + TILE_SIZE/3); // Draw to right edge of flag
                ctx.lineTo(flagX + TILE_SIZE/4, flagY + TILE_SIZE/1.5); // Draw back to pole
                ctx.fill(); // Fill the flag shape
            }
        }
    }
}

function checkFlagCollision() { // Function to check for collision with flag
    if (gameComplete) return; // If game is complete, exit function
    
    const playerLeft = Math.floor(player.x / TILE_SIZE); // Calculate left edge of player
    const playerRight = Math.floor((player.x + PLAYER_WIDTH - 1) / TILE_SIZE); // Calculate right edge of player
    const playerTop = Math.floor(player.y / TILE_SIZE); // Calculate top edge of player
    const playerBottom = Math.floor((player.y + (player.isSliding ? SLIDE_HEIGHT : STANDING_HEIGHT) - 1) / TILE_SIZE); // Calculate bottom edge of player

    for (let y = playerTop; y <= playerBottom; y++) { // Loop through player's vertical space
        for (let x = playerLeft; x <= playerRight; x++) { // Loop through player's horizontal space
            if (map[y] && map[y][x] === 2) { // If flag is found
                gameComplete = true; // Set game as complete
                gameEndTime = Date.now(); // Set game end time
                return; // Exit function
            }
        }
    }
}

async function drawEndScreen() { // Function to draw the end screen
    const timeTaken = (gameEndTime - gameStartTime) / 1000; // Calculate time taken in seconds
    
    // Submit score if not already submitted
    if (!player.scoreSubmitted) { // If score not submitted
        try {
            await fetch('../../add_score.php', { // Send score to server
                method: 'POST',
                body: new URLSearchParams({
                    game: 'Platformer',
                    score: timeTaken
                })
            });
            player.scoreSubmitted = true; // Mark score as submitted
        } catch (error) {
            console.error('Error submitting score:', error); // Log error if submission fails
        }
    }
    
    // Darken the background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Set fill color to semi-transparent black
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill entire canvas
    
    // Draw completion message
    ctx.fillStyle = 'white'; // Set text color to white
    ctx.font = 'bold 32px Arial'; // Set font
    ctx.textAlign = 'center'; // Set text alignment
    ctx.fillText('Level Complete!', canvas.width/2, canvas.height/2 - 50); // Draw completion message
    
    // Draw time
    ctx.font = '24px Arial'; // Set font
    ctx.fillText(`Time: ${timeTaken.toFixed(2)} seconds`, canvas.width/2, canvas.height/2); // Draw time taken
    
    // Draw button
    const buttonWidth = 200; // Set button width
    const buttonHeight = 50; // Set button height
    const buttonX = canvas.width/2 - buttonWidth/2; // Calculate button X position
    const buttonY = canvas.height/2 + 50; // Calculate button Y position
    
    ctx.fillStyle = '#4CAF50'; // Set button color
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight); // Draw button
    
    ctx.fillStyle = 'white'; // Set text color to white
    ctx.font = '20px Arial'; // Set font
    ctx.fillText('Play Again', canvas.width/2, buttonY + buttonHeight/2 + 7); // Draw button text
    
    // Store button coordinates for click handling
    return {
        buttonX,
        buttonY,
        buttonWidth,
        buttonHeight
    };
}

function drawPlayer() { // Function to draw the player
    const currentFrame = animations[player.currentAnimation].frames[player.animationFrame]; // Get current animation frame
    const img = loadedImages[currentFrame]; // Get image for current frame
    
    if (!img || !img.complete) return; // If image not loaded, exit function
    
    const currentHeight = player.isSliding ? SLIDE_HEIGHT : STANDING_HEIGHT; // Get current player height
    
    // Calculate scaled sprite dimensions
    const scaledSpriteHeight = SPRITE_HEIGHT * SCALE; // Calculate scaled sprite height
    const scaledSpriteWidth = SPRITE_WIDTH * SCALE; // Calculate scaled sprite width
    const scaledMarginX = SPRITE_MARGIN_X * SCALE; // Calculate scaled margin X
    
    // Position sprite at the bottom of the collision box, add 1 pixel to base Y position
    let drawY = player.y + (currentHeight - scaledSpriteHeight) + 2 + HEADER_HEIGHT; // Calculate draw Y position
    let drawX = player.x - scaledMarginX - cameraX; // Calculate draw X position

    // Adjust X position when climbing
    if (player.currentAnimation === 'climb') { // If player is climbing
        if (player.facingRight) { // If facing right
            drawX += 2; // Adjust X position
        } else { // If facing left
            drawX -= 2; // Adjust X position
        }
    }
    
    try {
        if (player.facingRight) { // If player is facing right
            ctx.drawImage(img, // Draw image
                drawX, 
                drawY, 
                scaledSpriteWidth, 
                scaledSpriteHeight);
        } else { // If player is facing left
            ctx.save(); // Save canvas state
            ctx.scale(-1, 1); // Flip horizontally
            ctx.drawImage(img, // Draw flipped image
                -(drawX + scaledSpriteWidth), 
                drawY, 
                scaledSpriteWidth, 
                scaledSpriteHeight);
            ctx.restore(); // Restore canvas state
        }
    } catch (e) {
        console.error("Error drawing player:", e); // Log error if drawing fails
    }
}

function updatePlayerAnimation() { // Function to update player animation
    const currentAnim = animations[player.currentAnimation]; // Get current animation
    
    // Only update animation frame every speed milliseconds
    const now = Date.now(); // Get current timestamp
    if (!player.lastAnimationUpdate || now - player.lastAnimationUpdate >= currentAnim.speed) { // If it's time to update animation
        player.animationFrame = (player.animationFrame + 1) % currentAnim.frames.length; // Update animation frame
        player.lastAnimationUpdate = now; // Update last animation update time
    }
}

function updatePlayerState() { // Function to update player state
    const now = Date.now(); // Get current timestamp
    let newAnimation = 'idle'; // Set default animation to idle

    // Check for climbing first - uses touchingWall
    if (player.touchingWall && !player.isSliding && keys.w) { // If player is touching wall, not sliding, and pressing 'w'
        if ((player.lastWallDirection === 1 && keys.d && !keys.a) || 
            (player.lastWallDirection === -1 && keys.a && !keys.d)) { // If player is pressing correct direction key
            newAnimation = 'climb'; // Set animation to climb
        }
    } else if (player.isSliding) { // If player is sliding
        newAnimation = 'slide'; // Set animation to slide
    } else if (player.canWallCling && !player.onGround) { // If player can wall cling and is not on ground
        newAnimation = 'wallCling'; // Set animation to wall cling
        if ((player.lastWallDirection === 1 && keys.d) || 
            (player.lastWallDirection === -1 && keys.a)) { // If player is pressing against wall
            player.vy = 0; // Stop vertical movement
        }
    } else if (player.vy < 0) { // If player is moving upwards
        newAnimation = 'jump'; // Set animation to jump
    } else if (player.vy > 0) { // If player is moving downwards
        newAnimation = 'fall'; // Set animation to fall
    } else if (Math.abs(player.vx) > 0) { // If player is moving horizontally
        newAnimation = 'run'; // Set animation to run
    }

    // Only change animation if enough time has passed since last change
    if (newAnimation !== player.currentAnimation && 
        now - lastAnimationChange >= ANIMATION_BUFFER_TIME) { // If animation should change and buffer time has passed
        player.currentAnimation = newAnimation; // Update current animation
        lastAnimationChange = now; // Update last animation change time
        player.animationFrame = 0; // Reset animation frame
    }
}

function update() { // Function to update game state
    if (gameComplete) return; // If game is complete, exit function
    
    const now = Date.now(); // Get current timestamp

    // Handle wall climbing - uses touchingWall instead of canWallCling
    let isClimbing = false; // Initialize climbing flag
    if (player.touchingWall && !player.isSliding && keys.w) { // If player is touching wall, not sliding, and pressing 'w'
        if ((player.lastWallDirection === 1 && keys.d && !keys.a) || 
            (player.lastWallDirection === -1 && keys.a && !keys.d)) { // If player is pressing correct direction key
            isClimbing = true; // Set climbing flag
            player.vy = -CLIMB_SPEED; // Set vertical velocity to climbing speed
        }
    }

    // Wall cling gravity check - now uses canWallCling
    if (!player.onGround && 
        !(player.canWallCling && !player.onGround && 
          !player.isSliding &&  
          ((player.lastWallDirection === 1 && keys.d) || 
           (player.lastWallDirection === -1 && keys.a)) && 
          !keys.shift) && 
        !isClimbing) { // If player is not on ground, not wall clinging, not sliding, and not climbing
        player.vy += GRAVITY; // Apply gravity
    }

    // Reset velocity before applying movement
    if (!player.isSliding) { // If player is not sliding
        player.vx = 0; // Reset horizontal velocity
    }

    // Handle basic movement
    if (!player.isSliding) { // If player is not sliding
        if (keys.a && !(player.lastWallDirection === 1 && player.canWallCling && !player.onGround)) { // If 'a' is pressed and not wall clinging on right wall
            player.vx = -MOVE_SPEED; // Move left
            player.facingRight = false; // Face left
        } else if (keys.d && !(player.lastWallDirection === -1 && player.canWallCling && !player.onGround)) { // If 'd' is pressed and not wall clinging on left wall
            player.vx = MOVE_SPEED; // Move right
            player.facingRight = true; // Face right
        }
    }

    // Handle jumping
    if (keys.space && !player.isSliding && (player.onGround || player.touchingWall)) { // If space is pressed, not sliding, and on ground or touching wall
        // Only allow jumping if we're not in corner forgiveness buffer period
        if (now - player.cornerForgivenessTime >= player.CORNER_FORGIVENESS_BUFFER) { // If corner forgiveness buffer has passed
            if (player.touchingWall && !player.onGround) { // If wall jumping
                if (player.lastWallDirection === 1) {  // Right wall
                    // Wall jump only if NOT holding right (D) or ONLY holding left (A)
                    if (!keys.d || (keys.a && !keys.d)) { // If not holding right or only holding left
                        player.vy = WALL_JUMP_FORCE_Y; // Set vertical velocity
                        player.vx = -WALL_JUMP_FORCE_X; // Set horizontal velocity
                        player.facingRight = false; // Face left
                        player.currentAnimation = 'wallJump'; // Set animation to wall jump
                        player.isJumping = true; // Set jumping flag
                        player.touchingWall = false; // Set not touching wall
                        player.lastWallTime = now + 200; // Set last wall time
                    }
                } else if (player.lastWallDirection === -1) {  // Left wall
                    // Wall jump only if NOT holding left (A) or ONLY holding right (D)
                    if (!keys.a || (keys.d && !keys.a)) { // If not holding left or only holding right
                        player.vy = WALL_JUMP_FORCE_Y; // Set vertical velocity
                        player.vx = WALL_JUMP_FORCE_X; // Set horizontal velocity
                        player.facingRight = true; // Face right
                        player.currentAnimation = 'wallJump'; // Set animation to wall jump
                        player.isJumping = true; // Set jumping flag
                        player.touchingWall = false; // Set not touching wall
                        player.lastWallTime = now + 200; // Set last wall time
                    }
                }
            } else if (player.onGround) { // If on ground
                player.vy = JUMP_FORCE; // Set vertical velocity to jump force
                player.isJumping = true; // Set jumping flag
                player.onGround = false; // Set not on ground
            }
        }
    }

    // Handle sliding
    if (player.isSliding) { // If player is sliding
        const slideProgress = (now - player.slideStartTime) / SLIDE_DURATION; // Calculate slide progress
        player.slideSpeed = Math.max(INITIAL_SLIDE_SPEED * (1 - slideProgress), MIN_SLIDE_SPEED); // Calculate slide speed
        
        // Allow direction change during slide
        if (keys.a && !keys.d) { // If 'a' is pressed and 'd' is not
            player.slidingRight = false; // Slide left
            player.facingRight = false; // Face left
        } else if (keys.d && !keys.a) { // If 'd' is pressed and 'a' is not
            player.slidingRight = true; // Slide right
            player.facingRight = true; // Face right
        }
        
        // Apply velocity based on current direction
        player.vx = player.slidingRight ? player.slideSpeed : -player.slideSpeed; // Set horizontal velocity based on slide direction
        
        if (slideProgress >= 1 || !keys.shift) { // If slide is complete or shift is released
            const canStandUp = !checkCollisionAtPosition( // Check if player can stand up
                player.x, 
                player.y - (STANDING_HEIGHT - SLIDE_HEIGHT), 
                PLAYER_WIDTH, 
                STANDING_HEIGHT
            );

            if (canStandUp) { // If player can stand up
                player.y -= (STANDING_HEIGHT - SLIDE_HEIGHT); // Adjust player position
                player.isSliding = false; // End slide
                player.vx = 0; // Reset horizontal velocity
            }
        }
    }

    // Start sliding
    if (keys.shift && !player.isSliding && (keys.a || keys.d)) { // If shift is pressed, not sliding, and moving horizontally
        player.isSliding = true; // Start slide
        player.slideStartTime = now; // Set slide start time
        // Set initial slide direction based on input
        player.slidingRight = keys.d; // Set slide direction
        player.facingRight = keys.d; // Set facing direction
        player.slideSpeed = INITIAL_SLIDE_SPEED; // Set initial slide speed
        player.y += (STANDING_HEIGHT - SLIDE_HEIGHT); // Adjust player position
    }

    // Cap fall speed
    player.vy = Math.min(player.vy, MAX_FALL_SPEED); // Limit fall speed

    checkCollisionsAndMove(); // Check collisions and move player
    updatePlayerState(); // Update player state
    updatePlayerAnimation(); // Update player animation
    checkFlagCollision(); // Check for flag collision
}

function checkCollisionsAndMove() { // Function to check collisions and move player
    const currentHeight = player.isSliding ? SLIDE_HEIGHT : STANDING_HEIGHT; // Get current player height
    const blocksNeededForPush = player.isSliding ? 1 : 2; // Set blocks needed for push
    const CORNER_FORGIVENESS = 0.4; // Set corner forgiveness value
    const WALL_CLING_HEIGHT_THRESHOLD = 0.4; // Set wall cling height threshold
    
    const newX = player.x + player.vx; // Calculate new X position
    let collision = false; // Initialize collision flag
    
    const leftTile = Math.floor(newX / TILE_SIZE); // Calculate left tile
    const rightTile = Math.floor((newX + PLAYER_WIDTH - 1) / TILE_SIZE); // Calculate right tile
    const topTile = Math.floor(player.y / TILE_SIZE); // Calculate top tile
    const bottomTile = Math.floor((player.y + currentHeight - 1) / TILE_SIZE); // Calculate bottom tile
    
    player.touchingWall = false; // Reset touching wall flag
    player.canWallCling = false; // Reset can wall cling flag
    
    const wallCheckBottomTile = Math.floor((player.y + (currentHeight * WALL_CLING_HEIGHT_THRESHOLD)) / TILE_SIZE); // Calculate wall check bottom tile

    // Horizontal collision check
    for (let y = topTile; y <= bottomTile; y++) { // Loop through vertical tiles
        for (let x = leftTile; x <= rightTile; x++) { // Loop through horizontal tiles
            if (map[y] && map[y][x] === 1) { // If tile is a wall
                const blockTop = y * TILE_SIZE; // Calculate block top
                const blockBottom = (y + 1) * TILE_SIZE; // Calculate block bottom
                const playerBottom = player.y + currentHeight; // Calculate player bottom
                
                const overlapTop = Math.max(0, playerBottom - blockTop); // Calculate top overlap
                const overlapBottom = Math.max(0, blockBottom - player.y); // Calculate bottom overlap
                const overlap = Math.min(overlapTop, overlapBottom); // Calculate total overlap
                const overlapPercentage = overlap / TILE_SIZE; // Calculate overlap percentage

                // Handle corner cases first
                if (overlapPercentage <= CORNER_FORGIVENESS) { // If overlap is within corner forgiveness
                    if (overlapTop < overlapBottom) { // If top overlap is smaller
                        let canPushUp = true; // Initialize can push up flag
                        for (let i = 1; i <= blocksNeededForPush; i++) { // Check blocks above
                            if (map[y-i] && map[y-i][x] === 1) { // If block is a wall
                                canPushUp = false; // Set can't push up
                                break; // Exit loop
                            }
                        }
                        if (canPushUp) { // If can push up
                            player.y = blockTop - currentHeight; // Adjust player position
                            player.vy = 0; // Reset vertical velocity
                            player.onGround = true; // Set on ground
                            player.cornerForgivenessTime = Date.now(); // Set corner forgiveness time
                            continue; // Continue to next iteration
                        }
                    } else { // If bottom overlap is smaller
                        let canPushDown = true; // Initialize can push down flag
                        for (let i = 1; i <= blocksNeededForPush; i++) { // Check blocks below
                            if (map[y+i] && map[y+i][x] === 1) { // If block is a wall
                                canPushDown = false; // Set can't push down
                                break; // Exit loop
                            }
                        }
                        if (canPushDown) { // If can push down
                            player.y = blockBottom; // Adjust player position
                            player.vy = 0; // Reset vertical velocity
                            player.cornerForgivenessTime = Date.now(); // Set corner forgiveness time
                            continue; // Continue to next iteration
                        }
                    }
                }
                
                // Only handle wall collision if not in corner forgiveness zone
                if (overlapPercentage > CORNER_FORGIVENESS) { // If overlap is greater than corner forgiveness
                    collision = true; // Set collision flag
                    if (player.vx > 0) { // If moving right
                        player.x = x * TILE_SIZE - PLAYER_WIDTH; // Adjust player position
                        if (!player.isSliding) { // If not sliding
                            player.lastWallDirection = 1; // Set last wall direction
                            player.touchingWall = true; // Set touching wall
                            if (y <= wallCheckBottomTile) { // If within wall cling height
                                player.canWallCling = true; // Set can wall cling
                            }
                            player.lastWallTime = Date.now(); // Set last wall time
                        }
                    } else if (player.vx < 0) { // If moving left
                        player.x = (x + 1) * TILE_SIZE; // Adjust player position
                        if (!player.isSliding) { // If not sliding
                            player.lastWallDirection = -1; // Set last wall direction
                            player.touchingWall = true; // Set touching wall
                            if (y <= wallCheckBottomTile) { // If within wall cling height
                                player.canWallCling = true; // Set can wall cling
                            }
                            player.lastWallTime = Date.now(); // Set last wall time
                        }
                    }
                    player.vx = 0; // Reset horizontal velocity
                    break; // Exit loop
                }
            }
        }
        if (collision) break; // If collision occurred, exit loop
    }

    if (!collision) { // If no collision occurred
        player.x = newX; // Update player position
    }

    // Handle vertical movement
    const newY = player.y + player.vy; // Calculate new Y position
    collision = false; // Reset collision flag

    // Update tile checks for new position
    const newTopTile = Math.floor(newY / TILE_SIZE); // Calculate new top tile
    const newBottomTile = Math.floor((newY + currentHeight - 1) / TILE_SIZE); // Calculate new bottom tile
    const leftTileVert = Math.floor(player.x / TILE_SIZE); // Calculate left tile for vertical check
    const rightTileVert = Math.floor((player.x + PLAYER_WIDTH - 1) / TILE_SIZE); // Calculate right tile for vertical check

    player.onGround = false; // Reset on ground flag

    // Vertical collision check
    for (let x = leftTileVert; x <= rightTileVert; x++) { // Loop through horizontal tiles
        for (let y = newTopTile; y <= newBottomTile; y++) { // Loop through vertical tiles
            if (map[y] && map[y][x] === 1) { // If tile is a wall
                collision = true; // Set collision flag
                
                if (player.vy > 0) { // If moving downward
                    const blockTop = y * TILE_SIZE; // Calculate block top
                    player.y = blockTop - currentHeight; // Adjust player position
                    player.onGround = true; // Set on ground
                } else if (player.vy < 0) { // If moving upward
                    player.y = (y + 1) * TILE_SIZE; // Adjust player position
                }
                
                player.vy = 0; // Reset vertical velocity
                break; // Exit loop
            }
        }
        if (collision) break; // If collision occurred, exit loop
    }

    if (!collision) { // If no collision occurred
        player.y = newY; // Update player position
    }

    // Ground check when not moving vertically
    if (!player.onGround && Math.abs(player.vy) < 0.1) { // If not on ground and not moving vertically
        const groundCheckY = player.y + currentHeight + 1; // Calculate ground check Y position
        const groundTile = Math.floor(groundCheckY / TILE_SIZE); // Calculate ground tile
        for (let x = Math.floor(player.x / TILE_SIZE); x <= Math.floor((player.x + PLAYER_WIDTH - 1) / TILE_SIZE); x++) { // Loop through player width
            if (map[groundTile] && map[groundTile][x] === 1) { // If ground tile is a wall
                player.onGround = true; // Set on ground
                player.y = groundTile * TILE_SIZE - currentHeight; // Adjust player position
                player.vy = 0; // Reset vertical velocity
                break; // Exit loop
            }
        }
    }

    // Check if we need to stand up from sliding due to ceiling
    if (player.isSliding) { // If player is sliding
        const canStandUp = !checkCollisionAtPosition( // Check if player can stand up
            player.x, 
            player.y - (STANDING_HEIGHT - SLIDE_HEIGHT), 
            PLAYER_WIDTH, 
            STANDING_HEIGHT
        );
        if (!canStandUp) { // If can't stand up
            player.isSliding = true; // Keep sliding
        }
    }
}

function checkCollisionAtPosition(x, y, width, height) { // Function to check collision at a specific position
    const leftTile = Math.floor(x / TILE_SIZE); // Calculate left tile
    const rightTile = Math.floor((x + width - 1) / TILE_SIZE); // Calculate right tile
    const topTile = Math.floor(y / TILE_SIZE); // Calculate top tile
    const bottomTile = Math.floor((y + height - 1) / TILE_SIZE); // Calculate bottom tile

    for (let row = topTile; row <= bottomTile; row++) { // Loop through vertical tiles
        for (let col = leftTile; col <= rightTile; col++) { // Loop through horizontal tiles
            if (map[row] && map[row][col] === 1) { // If tile is a wall
                return true; // Return true (collision detected)
            }
        }
    }
    return false; // Return false (no collision)
}

function drawControls() { // Function to draw game controls
    ctx.save(); // Save canvas state
    // Draw separator line
    ctx.fillStyle = '#333'; // Set fill color
    ctx.fillRect(0, HEADER_HEIGHT - 1, canvas.width, 1); // Draw separator line
    
    // Draw controls background
    ctx.fillStyle = '#f0f0f0'; // Set fill color
    ctx.fillRect(0, 0, canvas.width, HEADER_HEIGHT - 1); // Draw controls background
    
    ctx.font = 'bold 16px Arial'; // Set font
    ctx.fillStyle = '#333'; // Set text color
    const controls = [ // Define control instructions
        'Controls:',
        'Move left/right - A/D',
        'Climb walls - W',
        'Jump - SPACE',
        'Slide - SHIFT + A/D',
        'Wall jump: Jump while against wall + opposite direction'
    ];
    
    controls.forEach((text, index) => { // Loop through control instructions
        ctx.fillText(text, 20, 30 + (index * 22)); // Draw each instruction
    });
    ctx.restore(); // Restore canvas state
}

async function gameLoop() { // Main game loop function
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawControls(); // Draw the control instructions
    updateCamera(); // Update the camera position
    drawMap(); // Draw the game map
    update(); // Update game state
    drawPlayer(); // Draw the player character
    
    if (gameComplete) { // If the game is finished
        const buttonPos = await drawEndScreen(); // Draw end screen and get button position
        window.currentButtonPos = buttonPos; // Store button position globally for click handler
    }
    
    requestAnimationFrame(gameLoop); // Request next frame
}

document.addEventListener('keydown', (e) => { // Event listener for key press
    if (e.code === 'Space') { // If space key is pressed
        keys.space = true; // Set space key state to true
    } else if (e.key.toLowerCase() in keys) { // If pressed key is in keys object
        keys[e.key.toLowerCase()] = true; // Set key state to true
    }
});

document.addEventListener('keyup', (e) => { // Event listener for key release
    if (e.code === 'Space') { // If space key is released
        keys.space = false; // Set space key state to false
    } else if (e.key.toLowerCase() in keys) { // If released key is in keys object
        keys[e.key.toLowerCase()] = false; // Set key state to false
    }
});

document.addEventListener('keydown', (e) => { // Event listener for key press (for debugging)
    console.log('Key pressed:', e.key); // Log pressed key
    if (e.code === 'Space') { // If space key is pressed
        keys.space = true; // Set space key state to true
    } else if (e.key.toLowerCase() in keys) { // If pressed key is in keys object
        keys[e.key.toLowerCase()] = true; // Set key state to true
    }
});

canvas.addEventListener('click', (e) => { // Add click event listener to canvas
    if (!gameComplete) return; // Exit if game isn't complete
    
    const rect = canvas.getBoundingClientRect(); // Get canvas position
    const clickX = e.clientX - rect.left; // Calculate click X position relative to canvas
    const clickY = e.clientY - rect.top; // Calculate click Y position relative to canvas
    
    const buttonPos = window.currentButtonPos; // Get stored button position
    
    if (buttonPos && // Check if button position exists
        clickX >= buttonPos.buttonX && // Check if click is within button X bounds
        clickX <= buttonPos.buttonX + buttonPos.buttonWidth && // Check if click is within button width
        clickY >= buttonPos.buttonY && // Check if click is within button Y bounds
        clickY <= buttonPos.buttonY + buttonPos.buttonHeight) { // Check if click is within button height
        gameComplete = false; // Reset game complete flag
        gameStartTime = Date.now(); // Reset game start time
        gameEndTime = null; // Reset game end time
        initializeGame(); // Initialize new game
    }
});

initializeGame(); // Initialize game
preloadImages(); // Preload game images
gameLoop(); // Start game loop