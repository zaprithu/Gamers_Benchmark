const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const message = document.getElementById('message');

const CELL_SIZE = 40;
const COLS = 15;
const ROWS = 15;
const PLAYER_SPEED = 5;
const MINOTAUR_SPEED = 3;
const WALL_PADDING = 8;
const RESTART_DELAY = 1000;

canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

let maze = [];
let player = { 
    x: WALL_PADDING, 
    y: canvas.height - CELL_SIZE + WALL_PADDING,
    pixelX: WALL_PADDING,
    pixelY: canvas.height - CELL_SIZE + WALL_PADDING
};
let minotaur1 = { 
    x: WALL_PADDING,
    y: WALL_PADDING,
    pixelX: WALL_PADDING,
    pixelY: WALL_PADDING
};
let minotaur2 = { 
    x: canvas.width - CELL_SIZE + WALL_PADDING,
    y: canvas.height - CELL_SIZE + WALL_PADDING,
    pixelX: canvas.width - CELL_SIZE + WALL_PADDING,
    pixelY: canvas.height - CELL_SIZE + WALL_PADDING
};

let gameStarted = false;
let gameOver = false;
let canRestart = true;
let startTime;
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let heroImg = new Image();
let minotaurImg = new Image();
let treasureImg = new Image();

let loadedImages = 0;
function imageLoaded() {
    loadedImages++;
    if (loadedImages === 3) {
        startGame();
        gameLoop();
    }
}

heroImg.onload = imageLoaded;
minotaurImg.onload = imageLoaded;
treasureImg.onload = imageLoaded;

heroImg.src = 'Hero.PNG';
minotaurImg.src = 'Minotaur.png';
treasureImg.src = 'Treasure.jpeg';

function generateMaze() {
    // Initialize maze with walls
    for (let i = 0; i < ROWS; i++) {
        maze[i] = [];
        for (let j = 0; j < COLS; j++) {
            maze[i][j] = 1;
        }
    }

    // Recursive backtracking maze generation
    function carve(x, y) {
        const directions = [
            [0, -2], // up
            [2, 0],  // right
            [0, 2],  // down
            [-2, 0]  // left
        ];
        shuffleArray(directions);

        for (let [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;
            
            if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS && maze[newY][newX] === 1) {
                maze[y + dy/2][x + dx/2] = 0;
                maze[newY][newX] = 0;
                carve(newX, newY);
            }
        }
    }

    // Start from bottom left
    maze[ROWS-1][0] = 0;
    carve(0, ROWS-1);

    // Add additional paths, but with lower probability
    for (let y = 1; y < ROWS-1; y++) {
        for (let x = 1; x < COLS-1; x++) {
            if (maze[y][x] === 1 && Math.random() < 0.25) {
                let passages = 0;
                if (maze[y-1][x] === 0) passages++;
                if (maze[y+1][x] === 0) passages++;
                if (maze[y][x-1] === 0) passages++;
                if (maze[y][x+1] === 0) passages++;
                
                if (passages >= 2) {
                    maze[y][x] = 0;
                }
            }
        }
    }

    // Clear critical areas
    
    // Clear treasure area and guard spawn (top-right)
    for (let y = 0; y <= 1; y++) {
        for (let x = COLS - 2; x < COLS; x++) {
            maze[y][x] = 0;
        }
    }

    // Clear hunter spawn area (top-middle)
    const mid = Math.floor(COLS/2);
    for (let y = 0; y <= 1; y++) {
        for (let x = mid - 1; x <= mid + 1; x++) {
            if (x >= 0 && x < COLS) {
                maze[y][x] = 0;
            }
        }
    }

    // Clear player start area (bottom-left)
    for (let y = ROWS - 2; y < ROWS; y++) {
        for (let x = 0; x <= 1; x++) {
            maze[y][x] = 0;
        }
    }

    // Ensure critical paths
    maze[0][COLS-1] = 0; // Treasure location
    maze[ROWS-1][0] = 0; // Starting location
}

function findPath(startX, startY, endX, endY) {
    const openSet = new Set();
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    const start = `${startX},${startY}`;
    const goal = `${endX},${endY}`;
    
    openSet.add(start);
    gScore.set(start, 0);
    fScore.set(start, heuristic(startX, startY, endX, endY));
    
    function heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    
    while (openSet.size > 0) {
        let current = null;
        let lowestF = Infinity;
        
        for (let pos of openSet) {
            if (fScore.get(pos) < lowestF) {
                lowestF = fScore.get(pos);
                current = pos;
            }
        }
        
        if (current === goal) {
            const path = [];
            let temp = current;
            while (cameFrom.has(temp)) {
                const [x, y] = temp.split(',').map(Number);
                path.unshift([x, y]);
                temp = cameFrom.get(temp);
            }
            path.unshift([startX, startY]);
            return path;
        }
        
        openSet.delete(current);
        closedSet.add(current);
        
        const [x, y] = current.split(',').map(Number);
        const neighbors = [
            [x+1, y], [x-1, y],
            [x, y+1], [x, y-1]
        ];
        
        for (let [nx, ny] of neighbors) {
            if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS || maze[ny][nx] === 1) {
                continue;
            }
            
            const neighbor = `${nx},${ny}`;
            if (closedSet.has(neighbor)) {
                continue;
            }
            
            const tentativeG = gScore.get(current) + 1;
            
            if (!openSet.has(neighbor)) {
                openSet.add(neighbor);
            } else if (tentativeG >= gScore.get(neighbor)) {
                continue;
            }
            
            cameFrom.set(neighbor, current);
            gScore.set(neighbor, tentativeG);
            fScore.set(neighbor, tentativeG + heuristic(nx, ny, endX, endY));
        }
    }
    
    return null;
}

function checkCollision(x, y) {
    const padding = 2;
    if (x < padding || x > canvas.width - (CELL_SIZE - WALL_PADDING * 2) - padding || 
        y < padding || y > canvas.height - (CELL_SIZE - WALL_PADDING * 2) - padding) {
        return true;
    }

    const entitySize = CELL_SIZE - WALL_PADDING * 2;
    const cellX = Math.floor(x / CELL_SIZE);
    const cellY = Math.floor(y / CELL_SIZE);
    
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const checkX = cellX + dx;
            const checkY = cellY + dy;
            
            if (checkX >= 0 && checkX < COLS && checkY >= 0 && checkY < ROWS) {
                if (maze[checkY][checkX] === 1) {
                    const wallX = checkX * CELL_SIZE;
                    const wallY = checkY * CELL_SIZE;
                    
                    if (x + entitySize > wallX + WALL_PADDING && 
                        x < wallX + CELL_SIZE - WALL_PADDING &&
                        y + entitySize > wallY + WALL_PADDING && 
                        y < wallY + CELL_SIZE - WALL_PADDING) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function moveMinotaur(minotaur, isGuard) {
    let targetCell;
    if (isGuard) {
        const playerX = Math.floor(player.pixelX / CELL_SIZE);
        const playerY = Math.floor(player.pixelY / CELL_SIZE);
        
        const inGuardTerritory = 
            playerX >= Math.floor(COLS * 0.5) && 
            playerY <= Math.floor(ROWS * 0.5);
            
        if (inGuardTerritory) {
            targetCell = {
                x: playerX,
                y: playerY
            };
        } else {
            targetCell = {
                x: COLS - 2,
                y: 1
            };
            
            // Only consider at post if exactly at position
            const atPost = 
                Math.abs(minotaur.pixelX - (targetCell.x * CELL_SIZE + WALL_PADDING)) < MINOTAUR_SPEED &&
                Math.abs(minotaur.pixelY - (targetCell.y * CELL_SIZE + WALL_PADDING)) < MINOTAUR_SPEED;
                
            if (atPost) {
                minotaur.pixelX = targetCell.x * CELL_SIZE + WALL_PADDING;
                minotaur.pixelY = targetCell.y * CELL_SIZE + WALL_PADDING;
                return; // Stay perfectly still when at post
            }
        }
    } else {
        targetCell = {
            x: Math.floor(player.pixelX / CELL_SIZE),
            y: Math.floor(player.pixelY / CELL_SIZE)
        };
    }

    const currentX = Math.floor(minotaur.pixelX / CELL_SIZE);
    const currentY = Math.floor(minotaur.pixelY / CELL_SIZE);

    // Update path if needed
    const targetKey = `${targetCell.x},${targetCell.y}`;
    if (!minotaur.currentPath || 
        minotaur.currentPath.length <= 1 || 
        minotaur.targetKey !== targetKey) {
        
        const path = findPath(currentX, currentY, targetCell.x, targetCell.y);
        if (path && path.length > 0) {
            minotaur.currentPath = path;
            minotaur.targetKey = targetKey;
            minotaur.nextCellIndex = 1;
        }
    }

    // Move along path
    if (minotaur.currentPath && minotaur.currentPath.length > 1 && minotaur.nextCellIndex < minotaur.currentPath.length) {
        const nextCell = minotaur.currentPath[minotaur.nextCellIndex];
        const targetX = nextCell[0] * CELL_SIZE + WALL_PADDING;
        const targetY = nextCell[1] * CELL_SIZE + WALL_PADDING;

        const dx = targetX - minotaur.pixelX;
        const dy = targetY - minotaur.pixelY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= MINOTAUR_SPEED) {
            // Normal movement
            const moveX = (dx / distance) * MINOTAUR_SPEED;
            const moveY = (dy / distance) * MINOTAUR_SPEED;

            minotaur.pixelX += moveX;
            minotaur.pixelY += moveY;
        } else if (distance > 0) {
            // Snap to position if very close
            minotaur.pixelX = targetX;
            minotaur.pixelY = targetY;
            minotaur.nextCellIndex++;
            
            if (minotaur.nextCellIndex >= minotaur.currentPath.length) {
                minotaur.currentPath = null;
            }
        }

        // Update grid position
        minotaur.x = Math.floor(minotaur.pixelX / CELL_SIZE);
        minotaur.y = Math.floor(minotaur.pixelY / CELL_SIZE);
    }

    // Force path recalculation if stuck
    if (!minotaur.lastPos) {
        minotaur.lastPos = { x: minotaur.pixelX, y: minotaur.pixelY };
        minotaur.stuckFrames = 0;
    } else {
        const movedDistance = Math.hypot(
            minotaur.pixelX - minotaur.lastPos.x,
            minotaur.pixelY - minotaur.lastPos.y
        );
        
        if (movedDistance < MINOTAUR_SPEED * 0.1) {
            minotaur.stuckFrames++;
            if (minotaur.stuckFrames > 10) {
                minotaur.currentPath = null;
                minotaur.stuckFrames = 0;
            }
        } else {
            minotaur.stuckFrames = 0;
        }
        
        minotaur.lastPos = { x: minotaur.pixelX, y: minotaur.pixelY };
    }
}

function moveMinotaurs() {
    moveMinotaur(minotaur1, false);
    moveMinotaur(minotaur2, true);

    const catchDistance = CELL_SIZE / 2;
    if (Math.hypot(minotaur1.pixelX - player.pixelX, minotaur1.pixelY - player.pixelY) < catchDistance ||
        Math.hypot(minotaur2.pixelX - player.pixelX, minotaur2.pixelY - player.pixelY) < catchDistance) {
        endGame(false);
    }
}

function movePlayer() {
    let targetX = player.pixelX;
    let targetY = player.pixelY;
    let moving = false;
    
    const diagonalSpeed = PLAYER_SPEED / Math.sqrt(2);
    
    if (keys.ArrowLeft && keys.ArrowUp) {
        targetX -= diagonalSpeed;
        targetY -= diagonalSpeed;
        moving = true;
    } else if (keys.ArrowLeft && keys.ArrowDown) {
        targetX -= diagonalSpeed;
        targetY += diagonalSpeed;
        moving = true;
    } else if (keys.ArrowRight && keys.ArrowUp) {
        targetX += diagonalSpeed;
        targetY -= diagonalSpeed;
        moving = true;
    } else if (keys.ArrowRight && keys.ArrowDown) {
        targetX += diagonalSpeed;
        targetY += diagonalSpeed;
        moving = true;
    } else {
        if (keys.ArrowLeft) { targetX -= PLAYER_SPEED; moving = true; }
        if (keys.ArrowRight) { targetX += PLAYER_SPEED; moving = true; }
        if (keys.ArrowUp) { targetY -= PLAYER_SPEED; moving = true; }
        if (keys.ArrowDown) { targetY += PLAYER_SPEED; moving = true; }
    }
    
    if (moving) {
        if (!checkCollision(targetX, player.pixelY)) {
            player.pixelX = targetX;
        }
        if (!checkCollision(player.pixelX, targetY)) {
            player.pixelY = targetY;
        }
        player.x = Math.floor(player.pixelX / CELL_SIZE);
        player.y = Math.floor(player.pixelY / CELL_SIZE);
    }
}

function drawMaze() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    const entitySize = CELL_SIZE - WALL_PADDING * 2;
    ctx.drawImage(treasureImg, (COLS-1) * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
    ctx.drawImage(heroImg, player.pixelX, player.pixelY, entitySize, entitySize);
    ctx.drawImage(minotaurImg, minotaur1.pixelX, minotaur1.pixelY, entitySize, entitySize);
    ctx.drawImage(minotaurImg, minotaur2.pixelX, minotaur2.pixelY, entitySize, entitySize);
}

function startGame() {
    generateMaze();
    
    player = { 
        x: 0, y: ROWS - 1,
        pixelX: WALL_PADDING,
        pixelY: canvas.height - CELL_SIZE + WALL_PADDING
    };
    
    minotaur1 = { 
        x: COLS - 2, y: 0,
        pixelX: (COLS - 2) * CELL_SIZE + WALL_PADDING,
        pixelY: WALL_PADDING,
        currentPath: null,
        targetKey: null,
        nextCellIndex: 1,
        lastPos: null,
        stuckFrames: 0
    };
    
    minotaur2 = { 
        x: COLS - 1, y: 1,
        pixelX: (COLS - 1) * CELL_SIZE + WALL_PADDING,
        pixelY: CELL_SIZE + WALL_PADDING,
        currentPath: null,
        targetKey: null,
        nextCellIndex: 1,
        lastPos: null,
        stuckFrames: 0
    };
    
    gameStarted = true;
    gameOver = false;
    overlay.style.display = 'none';
    startTime = Date.now();
    
    keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };
}

function endGame(won) {
    gameOver = true;
    gameStarted = false;
    canRestart = false;
    overlay.style.display = 'flex';
    if (won) {
        const time = (Date.now() - startTime) / 1000;
        message.textContent = `You won! Time: ${time.toFixed(2)}s\nPress any key to play again`;
    } else {
        message.textContent = 'Game Over! Press any key to play again';
    }
    
    setTimeout(() => {
        canRestart = true;
    }, RESTART_DELAY);
}

function gameLoop() {
    if (gameStarted && !gameOver) {
        moveMinotaurs();
        
        if (Object.values(keys).some(key => key)) {
            movePlayer();
        }
        
        drawMaze();
        
        if (Math.floor(player.pixelX / CELL_SIZE) === COLS - 1 && 
            Math.floor(player.pixelY / CELL_SIZE) === 0) {
            endGame(true);
        }
    }
    requestAnimationFrame(gameLoop);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('keydown', (e) => {
    if ((!gameStarted || gameOver) && canRestart) {
        startGame();
        return;
    }
    if (e.key in keys) {
        keys[e.key] = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});