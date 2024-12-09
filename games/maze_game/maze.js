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

const canvas = document.getElementById('gameCanvas');                    // Get the canvas element
const ctx = canvas.getContext('2d');                                     // Get 2D rendering context
const overlay = document.getElementById('overlay');                      // Get overlay element for messages
const message = document.getElementById('message');                      // Get message display element

const CELL_SIZE = 40;                                                    // Size of each maze cell in pixels
const COLS = 15;                                                         // Number of columns in the maze
const ROWS = 15;                                                         // Number of rows in the maze
const PLAYER_SPEED = 5;                                                  // Player movement speed
const MINOTAUR_SPEED = 3;                                                // Minotaur movement speed
const WALL_PADDING = 8;                                                  // Padding around walls
const RESTART_DELAY = 1000;                                              // Delay before allowing restart

canvas.width = COLS * CELL_SIZE;                                         // Set canvas width based on maze size
canvas.height = ROWS * CELL_SIZE;                                        // Set canvas height based on maze size

let maze = [];                                                           // Array to hold maze structure
let player = {                                                           // Player object
    x: WALL_PADDING,                                                     // Initial X position
    y: canvas.height - CELL_SIZE + WALL_PADDING,                         // Initial Y position
    pixelX: WALL_PADDING,                                                // Pixel-precise X position
    pixelY: canvas.height - CELL_SIZE + WALL_PADDING                     // Pixel-precise Y position
};
let minotaur1 = {                                                        // First minotaur object
    x: WALL_PADDING,                                                     // Initial X position
    y: WALL_PADDING,                                                     // Initial Y position
    pixelX: WALL_PADDING,                                                // Pixel-precise X position
    pixelY: WALL_PADDING                                                 // Pixel-precise Y position
};
let minotaur2 = {                                                        // Second minotaur object
    x: canvas.width - CELL_SIZE + WALL_PADDING,                          // Initial X position
    y: canvas.height - CELL_SIZE + WALL_PADDING,                         // Initial Y position
    pixelX: canvas.width - CELL_SIZE + WALL_PADDING,                     // Pixel-precise X position
    pixelY: canvas.height - CELL_SIZE + WALL_PADDING                     // Pixel-precise Y position
};

let gameStarted = false;                                                 // Flag to track if game has started
let gameOver = false;                                                    // Flag to track if game is over
let canRestart = true;                                                   // Flag to control restart ability
let startTime;                                                           // Timestamp when game starts
let keys = {                                                             // Object to track key presses
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let heroImg = new Image();                                               // Create image object for hero
let minotaurImg = new Image();                                           // Create image object for minotaur
let treasureImg = new Image();                                           // Create image object for treasure

let loadedImages = 0;                                                    // Counter for loaded images
function imageLoaded() {                                                 // Function to handle image load
    loadedImages++;                                                      // Increment loaded images count
    if (loadedImages === 3) {                                            // If all images are loaded
        startGame();                                                     // Start the game
        gameLoop();                                                      // Begin game loop
    }
}

heroImg.onload = imageLoaded;                                            // Set onload handler for hero image
minotaurImg.onload = imageLoaded;                                        // Set onload handler for minotaur image
treasureImg.onload = imageLoaded;                                        // Set onload handler for treasure image

heroImg.src = 'Hero.PNG';                                                // Set source for hero image
minotaurImg.src = 'Minotaur.png';                                        // Set source for minotaur image
treasureImg.src = 'Treasure.jpeg';                                       // Set source for treasure image

function generateMaze() {                                                // Function to generate maze
    // Initialize maze with walls
    for (let i = 0; i < ROWS; i++) {                                     // Loop through rows
        maze[i] = [];                                                    // Initialize row array
        for (let j = 0; j < COLS; j++) {                                 // Loop through columns
            maze[i][j] = 1;                                              // Set cell as wall (1)
        }
    }

    // Recursive backtracking maze generation
    function carve(x, y) {                                               // Inner function for carving paths
        const directions = [                                             // Possible directions
            [0, -2], // up
            [2, 0],  // right
            [0, 2],  // down
            [-2, 0]  // left
        ];
        shuffleArray(directions);                                        // Randomize directions

        for (let [dx, dy] of directions) {                               // Loop through directions
            let newX = x + dx;                                           // Calculate new X
            let newY = y + dy;                                           // Calculate new Y
            
            if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS && maze[newY][newX] === 1) {  // If within bounds and is a wall
                maze[y + dy/2][x + dx/2] = 0;                            // Carve path
                maze[newY][newX] = 0;                                    // Carve destination
                carve(newX, newY);                                       // Recursively continue from new position
            }
        }
    }

    // Start from bottom left
    maze[ROWS-1][0] = 0;                                                 // Set starting point as path
    carve(0, ROWS-1);                                                    // Start carving from bottom left

    // Add additional paths, but with lower probability
    for (let y = 1; y < ROWS-1; y++) {                                   // Loop through rows (excluding edges)
        for (let x = 1; x < COLS-1; x++) {                               // Loop through columns (excluding edges)
            if (maze[y][x] === 1 && Math.random() < 0.25) {              // 25% chance to consider adding a path
                let passages = 0;                                        // Count adjacent passages
                if (maze[y-1][x] === 0) passages++;                      // Check above
                if (maze[y+1][x] === 0) passages++;                      // Check below
                if (maze[y][x-1] === 0) passages++;                      // Check left
                if (maze[y][x+1] === 0) passages++;                      // Check right
                
                if (passages >= 2) {                                     // If at least two adjacent passages
                    maze[y][x] = 0;                                      // Convert to passage
                }
            }
        }
    }

    // Clear critical areas
    
    // Clear treasure area and guard spawn (top-right)
    for (let y = 0; y <= 1; y++) {                                       // Loop through top two rows
        for (let x = COLS - 2; x < COLS; x++) {                          // Loop through rightmost two columns
            maze[y][x] = 0;                                              // Set as passage
        }
    }

    // Clear hunter spawn area (top-middle)
    const mid = Math.floor(COLS/2);                                      // Calculate middle column
    for (let y = 0; y <= 1; y++) {                                       // Loop through top two rows
        for (let x = mid - 1; x <= mid + 1; x++) {                       // Loop through middle three columns
            if (x >= 0 && x < COLS) {                                    // Ensure within bounds
                maze[y][x] = 0;                                          // Set as passage
            }
        }
    }

    // Clear player start area (bottom-left)
    for (let y = ROWS - 2; y < ROWS; y++) {                              // Loop through bottom two rows
        for (let x = 0; x <= 1; x++) {                                   // Loop through leftmost two columns
            maze[y][x] = 0;                                              // Set as passage
        }
    }

    // Ensure critical paths
    maze[0][COLS-1] = 0;                                                 // Ensure treasure location is accessible
    maze[ROWS-1][0] = 0;                                                 // Ensure starting location is accessible
}

function findPath(startX, startY, endX, endY) {                          // A* pathfinding algorithm
    const openSet = new Set();                                           // Set of nodes to be evaluated
    const closedSet = new Set();                                         // Set of nodes already evaluated
    const cameFrom = new Map();                                          // Map to reconstruct path
    const gScore = new Map();                                            // Map of current best known path to node
    const fScore = new Map();                                            // Map of estimated total cost from start to goal through node
    
    const start = `${startX},${startY}`;                                 // String representation of start node
    const goal = `${endX},${endY}`;                                      // String representation of goal node
    
    openSet.add(start);                                                  // Add start node to open set
    gScore.set(start, 0);                                                // Set g-score of start node to 0
    fScore.set(start, heuristic(startX, startY, endX, endY));            // Set f-score of start node
    
    function heuristic(x1, y1, x2, y2) {                                 // Heuristic function (Manhattan distance)
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);                    // Calculate Manhattan distance
    }
    
    while (openSet.size > 0) {                                           // While there are nodes to evaluate
        let current = null;                                              // Current node being evaluated
        let lowestF = Infinity;                                          // Lowest f-score found
        
        for (let pos of openSet) {                                       // Find node with lowest f-score
            if (fScore.get(pos) < lowestF) {                             // If this node has lower f-score
                lowestF = fScore.get(pos);                               // Update lowest f-score
                current = pos;                                           // Set as current node
            }
        }
        
        if (current === goal) {                                          // If goal reached
            const path = [];                                             // Array to hold path
            let temp = current;                                          // Start from goal
            while (cameFrom.has(temp)) {                                 // Reconstruct path
                const [x, y] = temp.split(',').map(Number);              // Convert string to coordinates
                path.unshift([x, y]);                                    // Add to start of path
                temp = cameFrom.get(temp);                               // Move to previous node
            }
            path.unshift([startX, startY]);                              // Add start node to path
            return path;                                                 // Return complete path
        }
        
        openSet.delete(current);                                         // Remove current from open set
        closedSet.add(current);                                          // Add current to closed set
        
        const [x, y] = current.split(',').map(Number);                   // Get coordinates of current node
        const neighbors = [                                              // Define neighbor coordinates
            [x+1, y], [x-1, y],
            [x, y+1], [x, y-1]
        ];
        
        for (let [nx, ny] of neighbors) {                                // For each neighbor
            if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS || maze[ny][nx] === 1) {  // If out of bounds or wall
                continue;                                                // Skip this neighbor
            }
            
            const neighbor = `${nx},${ny}`;                              // String representation of neighbor
            if (closedSet.has(neighbor)) {                               // If already evaluated
                continue;                                                // Skip this neighbor
            }
            
            const tentativeG = gScore.get(current) + 1;                  // Calculate tentative g-score
            
            if (!openSet.has(neighbor)) {                                // If not in open set
                openSet.add(neighbor);                                   // Add to open set
            } else if (tentativeG >= gScore.get(neighbor)) {             // If this path is not better
                continue;                                                // Skip this neighbor
            }
            
            cameFrom.set(neighbor, current);                             // Record best path
            gScore.set(neighbor, tentativeG);                            // Update g-score
            fScore.set(neighbor, tentativeG + heuristic(nx, ny, endX, endY));  // Update f-score
        }
    }
    
    return null;                                                         // No path found
}

function checkCollision(x, y) {                                          // Function to check for collisions
    const padding = 2;                                                   // Padding to prevent getting stuck on walls
    if (x < padding || x > canvas.width - (CELL_SIZE - WALL_PADDING * 2) - padding || 
        y < padding || y > canvas.height - (CELL_SIZE - WALL_PADDING * 2) - padding) {  // If out of bounds
        return true;                                                     // Collision detected
    }

    const entitySize = CELL_SIZE - WALL_PADDING * 2;                     // Size of entity (player/minotaur)
    const cellX = Math.floor(x / CELL_SIZE);                             // Get cell X coordinate
    const cellY = Math.floor(y / CELL_SIZE);                             // Get cell Y coordinate
    
    for (let dy = -1; dy <= 1; dy++) {                                   // Check surrounding cells
        for (let dx = -1; dx <= 1; dx++) {                               // Including diagonals
            const checkX = cellX + dx;                                   // Calculate check X
            const checkY = cellY + dy;                                   // Calculate check Y
            
            if (checkX >= 0 && checkX < COLS && checkY >= 0 && checkY < ROWS) {  // If within bounds
                if (maze[checkY][checkX] === 1) {                        // If cell is a wall
                    const wallX = checkX * CELL_SIZE;                    // Wall X coordinate
                    const wallY = checkY * CELL_SIZE;                    // Wall Y coordinate
                    
                    if (x + entitySize > wallX + WALL_PADDING && 
                        x < wallX + CELL_SIZE - WALL_PADDING &&
                        y + entitySize > wallY + WALL_PADDING && 
                        y < wallY + CELL_SIZE - WALL_PADDING) {          // If entity overlaps with wall
                        return true;                                     // Collision detected
                    }
                }
            }
        }
    }
    return false;                                                        // No collision
}

function moveMinotaur(minotaur, isGuard) {                               // Function to move minotaur
    let targetCell;                                                      // Target cell for minotaur
    if (isGuard) {                                                       // If this is the guard minotaur
        const playerX = Math.floor(player.pixelX / CELL_SIZE);           // Get player's cell X
        const playerY = Math.floor(player.pixelY / CELL_SIZE);           // Get player's cell Y
        
        const inGuardTerritory = 
            playerX >= Math.floor(COLS * 0.5) && 
            playerY <= Math.floor(ROWS * 0.5);                           // Check if player is in guard's territory
            
        if (inGuardTerritory) {                                          // If player is in guard's territory
            targetCell = {                                               // Set target to player's position
                x: playerX,
                y: playerY
            };
        } else {                                                         // If player is not in guard's territory
            targetCell = {                                               // Set target to guard post
                x: COLS - 2,
                y: 1
            };
            
            // Only consider at post if exactly at position
            const atPost = 
                Math.abs(minotaur.pixelX - (targetCell.x * CELL_SIZE + WALL_PADDING)) < MINOTAUR_SPEED &&
                Math.abs(minotaur.pixelY - (targetCell.y * CELL_SIZE + WALL_PADDING)) < MINOTAUR_SPEED;
                
            if (atPost) {                                                // If at guard post
                minotaur.pixelX = targetCell.x * CELL_SIZE + WALL_PADDING;  // Snap to exact position
                minotaur.pixelY = targetCell.y * CELL_SIZE + WALL_PADDING;
                return;                                                  // Stay perfectly still when at post
            }
        }
    } else {                                                             // If this is the hunter minotaur
        targetCell = {                                                   // Always target player
            x: Math.floor(player.pixelX / CELL_SIZE),
            y: Math.floor(player.pixelY / CELL_SIZE)
        };
    }

    const currentX = Math.floor(minotaur.pixelX / CELL_SIZE);            // Get minotaur's current cell X
    const currentY = Math.floor(minotaur.pixelY / CELL_SIZE);            // Get minotaur's current cell Y

    // Update path if needed
    const targetKey = `${targetCell.x},${targetCell.y}`;                 // Create key for target cell
    if (!minotaur.currentPath || 
        minotaur.currentPath.length <= 1 || 
        minotaur.targetKey !== targetKey) {                              // If path needs updating
        
        const path = findPath(currentX, currentY, targetCell.x, targetCell.y);  // Find new path
        if (path && path.length > 0) {                                   // If path found
            minotaur.currentPath = path;                                 // Set new path
            minotaur.targetKey = targetKey;                              // Update target key
            minotaur.nextCellIndex = 1;                                  // Reset next cell index
        }
    }

    // Move along path
    if (minotaur.currentPath && minotaur.currentPath.length > 1 && minotaur.nextCellIndex < minotaur.currentPath.length) {
        const nextCell = minotaur.currentPath[minotaur.nextCellIndex];   // Get next cell in path
        const targetX = nextCell[0] * CELL_SIZE + WALL_PADDING;          // Calculate target X
        const targetY = nextCell[1] * CELL_SIZE + WALL_PADDING;          // Calculate target Y

        const dx = targetX - minotaur.pixelX;                            // Calculate X distance
        const dy = targetY - minotaur.pixelY;                            // Calculate Y distance
        const distance = Math.sqrt(dx * dx + dy * dy);                   // Calculate total distance

        if (distance >= MINOTAUR_SPEED) {                                // If not close to target
            // Normal movement
            const moveX = (dx / distance) * MINOTAUR_SPEED;              // Calculate X movement
            const moveY = (dy / distance) * MINOTAUR_SPEED;              // Calculate Y movement

            minotaur.pixelX += moveX;                                    // Move in X direction
            minotaur.pixelY += moveY;                                    // Move in Y direction
        } else if (distance > 0) {                                       // If very close to target
            // Snap to position if very close
            minotaur.pixelX = targetX;                                   // Snap to target X
            minotaur.pixelY = targetY;                                   // Snap to target Y
            minotaur.nextCellIndex++;                                    // Move to next cell in path
            
            if (minotaur.nextCellIndex >= minotaur.currentPath.length) { // If reached end of path
                minotaur.currentPath = null;                             // Clear current path
            }
        }

        // Update grid position
        minotaur.x = Math.floor(minotaur.pixelX / CELL_SIZE);            // Update cell X
        minotaur.y = Math.floor(minotaur.pixelY / CELL_SIZE);            // Update cell Y
    }

    // Force path recalculation if stuck
    if (!minotaur.lastPos) {                                             // If no last position recorded
        minotaur.lastPos = { x: minotaur.pixelX, y: minotaur.pixelY };   // Record current position
        minotaur.stuckFrames = 0;                                        // Reset stuck frame counter
    } else {                                                             // If last position exists
        const movedDistance = Math.hypot(                                // Calculate moved distance
            minotaur.pixelX - minotaur.lastPos.x,
            minotaur.pixelY - minotaur.lastPos.y
        );
        
        if (movedDistance < MINOTAUR_SPEED * 0.1) {                      // If barely moved
            minotaur.stuckFrames++;                                      // Increment stuck frame counter
            if (minotaur.stuckFrames > 10) {                             // If stuck for too long
                minotaur.currentPath = null;                             // Force path recalculation
                minotaur.stuckFrames = 0;                                // Reset stuck frame counter
            }
        } else {                                                         // If moved significantly
            minotaur.stuckFrames = 0;                                    // Reset stuck frame counter
        }
        
        minotaur.lastPos = { x: minotaur.pixelX, y: minotaur.pixelY };   // Update last position
    }
}

function moveMinotaurs() {                                               // Function to move both minotaurs
    moveMinotaur(minotaur1, false);                                      // Move hunter minotaur
    moveMinotaur(minotaur2, true);                                       // Move guard minotaur

    const catchDistance = CELL_SIZE / 2;                                 // Distance at which minotaur catches player
    if (Math.hypot(minotaur1.pixelX - player.pixelX, minotaur1.pixelY - player.pixelY) < catchDistance ||
        Math.hypot(minotaur2.pixelX - player.pixelX, minotaur2.pixelY - player.pixelY) < catchDistance) {
        endGame(false);                                                  // End game if player is caught
    }
}

function movePlayer() {                                                  // Function to move player
    let targetX = player.pixelX;                                         // Initialize target X
    let targetY = player.pixelY;                                         // Initialize target Y
    let moving = false;                                                  // Flag to track if player is moving
    
    const diagonalSpeed = PLAYER_SPEED / Math.sqrt(2);                   // Calculate diagonal speed
    
    if (keys.ArrowLeft && keys.ArrowUp) {                                // If moving diagonally up-left
        targetX -= diagonalSpeed;                                        // Move left
        targetY -= diagonalSpeed;                                        // Move up
        moving = true;                                                   // Set moving flag
    } else if (keys.ArrowLeft && keys.ArrowDown) {                       // If moving diagonally down-left
        targetX -= diagonalSpeed;                                        // Move left
        targetY += diagonalSpeed;                                        // Move down
        moving = true;                                                   // Set moving flag
    } else if (keys.ArrowRight && keys.ArrowUp) {                        // If moving diagonally up-right
        targetX += diagonalSpeed;                                        // Move right
        targetY -= diagonalSpeed;                                        // Move up
        moving = true;                                                   // Set moving flag
    } else if (keys.ArrowRight && keys.ArrowDown) {                      // If moving diagonally down-right
        targetX += diagonalSpeed;                                        // Move right
        targetY += diagonalSpeed;                                        // Move down
        moving = true;                                                   // Set moving flag
    } else {                                                             // If moving in a single direction
        if (keys.ArrowLeft) { targetX -= PLAYER_SPEED; moving = true; }  // Move left
        if (keys.ArrowRight) { targetX += PLAYER_SPEED; moving = true; } // Move right
        if (keys.ArrowUp) { targetY -= PLAYER_SPEED; moving = true; }    // Move up
        if (keys.ArrowDown) { targetY += PLAYER_SPEED; moving = true; }  // Move down
    }
    
    if (moving) {                                                        // If player is moving
        if (!checkCollision(targetX, player.pixelY)) {                   // Check horizontal collision
            player.pixelX = targetX;                                     // Update X if no collision
        }
        if (!checkCollision(player.pixelX, targetY)) {                   // Check vertical collision
            player.pixelY = targetY;                                     // Update Y if no collision
        }
        player.x = Math.floor(player.pixelX / CELL_SIZE);                // Update cell X
        player.y = Math.floor(player.pixelY / CELL_SIZE);                // Update cell Y
    }
}

function drawMaze() {                                                    // Function to draw maze and entities
    ctx.fillStyle = '#fff';                                              // Set background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);                     // Clear canvas

    ctx.fillStyle = '#000';                                              // Set wall color
    for (let y = 0; y < ROWS; y++) {                                     // Loop through rows
        for (let x = 0; x < COLS; x++) {                                 // Loop through columns
            if (maze[y][x] === 1) {                                      // If cell is a wall
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);  // Draw wall
            }
        }
    }

    const entitySize = CELL_SIZE - WALL_PADDING * 2;                     // Calculate entity size
    ctx.drawImage(treasureImg, (COLS-1) * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);  // Draw treasure
    ctx.drawImage(heroImg, player.pixelX, player.pixelY, entitySize, entitySize);  // Draw player
    ctx.drawImage(minotaurImg, minotaur1.pixelX, minotaur1.pixelY, entitySize, entitySize);  // Draw hunter minotaur
    ctx.drawImage(minotaurImg, minotaur2.pixelX, minotaur2.pixelY, entitySize, entitySize);  // Draw guard minotaur
}

function startGame() {                                                   // Function to start or restart game
    generateMaze();                                                      // Generate new maze
    
    player = {                                                           // Reset player position
        x: 0, y: ROWS - 1,
        pixelX: WALL_PADDING,
        pixelY: canvas.height - CELL_SIZE + WALL_PADDING
    };
    
    minotaur1 = {                                                        // Reset hunter minotaur
        x: COLS - 2, y: 0,
        pixelX: (COLS - 2) * CELL_SIZE + WALL_PADDING,
        pixelY: WALL_PADDING,
        currentPath: null,
        targetKey: null,
        nextCellIndex: 1,
        lastPos: null,
        stuckFrames: 0
    };
    
    minotaur2 = {                                                        // Reset guard minotaur
        x: COLS - 1, y: 1,
        pixelX: (COLS - 1) * CELL_SIZE + WALL_PADDING,
        pixelY: CELL_SIZE + WALL_PADDING,
        currentPath: null,
        targetKey: null,
        nextCellIndex: 1,
        lastPos: null,
        stuckFrames: 0
    };
    
    gameStarted = true;                                                  // Set game as started
    gameOver = false;                                                    // Reset game over flag
    overlay.style.display = 'none';                                      // Hide overlay
    startTime = Date.now();                                              // Record start time
    
    keys = {                                                             // Reset key states
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };
}

async function endGame(won) {                                                  // Function to end game
    gameOver = true;                                                     // Set game as over
    gameStarted = false;                                                 // Game is no longer running
    canRestart = false;                                                  // Prevent immediate restart
    overlay.style.display = 'flex';                                      // Show overlay
    if (won) {                                                           // If player won
        const time = (Date.now() - startTime) / 1000;                    // Calculate time taken
        let res = await fetch('../../add_score.php', {
            method: 'POST',
            body: new URLSearchParams({
                game: 'maze_game',
                score: time
            })
        });
        let pile = JSON.parse(await res.text()).percentile;
        message.textContent = `Time: ${time.toFixed(2)}s\r\nPercentile: ${pile}\r\nPress any key to play again`;  // Show win message
        console.log(1);
    } else {                                                             // If player lost
        message.textContent = 'Game Over! Press any key to play again';  // Show lose message
    }
    
    setTimeout(() => {                                                   // Set timeout to allow restart
        canRestart = true;                                               // Allow restart after delay
    }, RESTART_DELAY);
}

function gameLoop() {                                                    // Main game loop
    if (gameStarted && !gameOver) {                                      // If game is running
        moveMinotaurs();                                                 // Move minotaurs
        
        if (Object.values(keys).some(key => key)) {                      // If any movement key is pressed
            movePlayer();                                                // Move player
        }
        
        drawMaze();                                                      // Draw game state
        
        if (Math.floor(player.pixelX / CELL_SIZE) === COLS - 1 && 
            Math.floor(player.pixelY / CELL_SIZE) === 0) {               // If player reached treasure
            endGame(true);                                               // End game as win
        }
    }
    requestAnimationFrame(gameLoop);                                     // Request next animation frame
}

function shuffleArray(array) {                                           // Function to shuffle array
    for (let i = array.length - 1; i > 0; i--) {                         // Loop through array backwards
        const j = Math.floor(Math.random() * (i + 1));                   // Pick random earlier element
        [array[i], array[j]] = [array[j], array[i]];                     // Swap elements
    }
    return array;                                                        // Return shuffled array
}

document.addEventListener('keydown', (e) => {                            // Event listener for key press
    if ((!gameStarted || gameOver) && canRestart) {                      // If game can be started/restarted
        startGame();                                                     // Start/restart game
        return;                                                          // Exit function
    }
	if (e.key in keys) {                                                 // If pressed key is a movement key
		keys[e.key] = true;                                              // Set key state to pressed
		e.preventDefault();                                              // Prevent default action
	}
});

document.addEventListener('keyup', (e) => {                              // Event listener for key release
	if (e.key in keys) {                                                 // If released key is a movement key
		keys[e.key] = false;                                             // Set key state to not pressed
	}
});
