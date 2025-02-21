const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const tileSize = 16;
const mazeWidth = 28; // Standard Pac-Man maze width
const mazeHeight = 31; // Standard Pac-Man maze height
const pacSpeed = 2;
const ghostSpeed = 1.5;

// Maze layout (1 = wall, 0 = path/dot, 2 = Pac-Man start, 3 = ghost start)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Game objects
let pacman = { x: 0, y: 0, dx: 0, dy: 0, angle: 0 };
let ghosts = [];
let dots = [];
let score = 0;

// Initialize game
function init() {
    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 2) {
                pacman.x = x * tileSize;
                pacman.y = y * tileSize;
            } else if (maze[y][x] === 3) {
                ghosts.push({ x: x * tileSize, y: y * tileSize, dx: ghostSpeed, dy: 0 });
            } else if (maze[y][x] === 0) {
                dots.push({ x: x * tileSize + tileSize / 2, y: y * tileSize + tileSize / 2 });
            }
        }
    }
}

// Keyboard controls
let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function handleInput() {
    let newDx = pacman.dx;
    let newDy = pacman.dy;

    if (keys['ArrowUp']) { newDx = 0; newDy = -pacSpeed; pacman.angle = Math.PI; }
    if (keys['ArrowDown']) { newDx = 0; newDy = pacSpeed; pacman.angle = 0; }
    if (keys['ArrowLeft']) { newDx = -pacSpeed; newDy = 0; pacman.angle = Math.PI * 1.5; }
    if (keys['ArrowRight']) { newDx = pacSpeed; newDy = 0; pacman.angle = Math.PI / 2; }

    // Check collision with walls
    let nextX = pacman.x + newDx;
    let nextY = pacman.y + newDy;
    if (!isWall(nextX, nextY)) {
        pacman.dx = newDx;
        pacman.dy = newDy;
    }
}

// Collision detection
function isWall(x, y) {
    let tileX = Math.floor(x / tileSize);
    let tileY = Math.floor(y / tileSize);
    return maze[tileY] && maze[tileY][tileX] === 1;
}

// Update game state
function update() {
    // Move Pac-Man
    let nextX = pacman.x + pacman.dx;
    let nextY = pacman.y + pacman.dy;
    if (!isWall(nextX, nextY)) {
        pacman.x = nextX;
        pacman.y = nextY;
    } else {
        pacman.dx = 0;
        pacman.dy = 0;
    }

    // Move ghosts (simple random movement)
    ghosts.forEach(ghost => {
        let directions = [
            { dx: ghostSpeed, dy: 0 },
            { dx: -ghostSpeed, dy: 0 },
            { dx: 0, dy: ghostSpeed },
            { dx: 0, dy: -ghostSpeed }
        ];
        let validMove = false;
        let move;
        while (!validMove) {
            move = directions[Math.floor(Math.random() * directions.length)];
            if (!isWall(ghost.x + move.dx, ghost.y + move.dy)) validMove = true;
        }
        ghost.x += move.dx;
        ghost.y += move.dy;
    });

    // Check dot collection
    dots = dots.filter(dot => {
        let dist = Math.hypot(pacman.x + tileSize / 2 - dot.x, pacman.y + tileSize / 2 - dot.y);
        if (dist < tileSize / 2) {
            score += 10;
            return false;
        }
        return true;
    });
}

// Render game
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    ctx.fillStyle = '#0000FF';
    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw dots
    ctx.fillStyle = 'white';
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Pac-Man
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + tileSize / 2, pacman.y + tileSize / 2, tileSize / 2, pacman.angle + 0.2, pacman.angle + 1.8 * Math.PI);
    ctx.lineTo(pacman.x + tileSize / 2, pacman.y + tileSize / 2);
    ctx.fill();

    // Draw ghosts
    ctx.fillStyle = 'red';
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x + tileSize / 2, ghost.y + tileSize / 2, tileSize / 2, 0, Math.PI);
        ctx.fillRect(ghost.x, ghost.y + tileSize / 2, tileSize, tileSize / 2);
        ctx.fill();
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Game loop
function gameLoop() {
    handleInput();
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
init();
gameLoop();