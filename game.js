/**
 * Pac-Man Game - Maintainable Version
 * Author: Refactored for better maintainability
 *
 * Features:
 * - Modular design with clear separation of concerns
 * - Configurable constants that don't break the game
 * - Proper collision detection
 * - Smooth animations and controls
 */

// ===========================
// GAME CONFIGURATION
// ===========================

const CONFIG = {
  // Canvas and display settings
  TILE_SIZE: 16, // Size of each maze tile in pixels
  MAZE_WIDTH: 28, // Number of tiles horizontally
  MAZE_HEIGHT: 31, // Number of tiles vertically
  PACMAN_SIZE: 12,
  // Game speed settings (pixels per frame)
  PAC_SPEED: 2, // Pac-Man movement speed
  GHOST_SPEED: 1.5, // Ghost movement speed

  // Visual settings
  COLLISION_MARGIN: 1, // Margin to prevent wall clipping
  DOT_RADIUS: 2, // Size of collectible dots
  MOUTH_OPENING: 0.2, // Pac-Man mouth opening angle

  // Game mechanics
  DOT_SCORE: 10, // Points per dot collected
  GHOST_DIRECTION_CHANGE: 0.3, // Probability of ghost changing direction

  // Colors
  COLORS: {
    BACKGROUND: "black",
    WALL: "#0000FF",
    DOT: "white",
    PACMAN: "yellow",
    GHOST: "red",
    GHOST_ACCENT: "black",
    TEXT: "white",
    WIN_TEXT: "yellow",
  },
};

// ===========================
// MAZE LAYOUT
// ===========================

// Maze codes: 1 = wall, 0 = path/dot, 2 = Pac-Man start, 3 = ghost start
const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// ===========================
// GAME STATE
// ===========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size based on maze dimensions
canvas.width = CONFIG.MAZE_WIDTH * CONFIG.TILE_SIZE;
canvas.height = CONFIG.MAZE_HEIGHT * CONFIG.TILE_SIZE;

// Game entities
const gameState = {
  pacman: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    direction: "right",
  },
  ghosts: [],
  dots: [],
  score: 0,
  gameWon: false,
};

// Input handling
const inputState = {
  keys: {},
  lastInputTime: 0,
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Converts grid coordinates to pixel coordinates
 * @param {number} gridX - X coordinate in grid units
 * @param {number} gridY - Y coordinate in grid units
 * @returns {object} - Pixel coordinates {x, y}
 */
function gridToPixel(gridX, gridY) {
  return {
    x: gridX * CONFIG.TILE_SIZE,
    y: gridY * CONFIG.TILE_SIZE,
  };
}

/**
 * Converts pixel coordinates to grid coordinates
 * @param {number} pixelX - X coordinate in pixels
 * @param {number} pixelY - Y coordinate in pixels
 * @returns {object} - Grid coordinates {x, y}
 */
function pixelToGrid(pixelX, pixelY) {
  return {
    x: Math.floor(pixelX / CONFIG.TILE_SIZE),
    y: Math.floor(pixelY / CONFIG.TILE_SIZE),
  };
}

/**
 * Gets the center point of a tile in pixels
 * @param {number} gridX - X coordinate in grid units
 * @param {number} gridY - Y coordinate in grid units
 * @returns {object} - Center coordinates {x, y}
 */
function getTileCenter(gridX, gridY) {
  return {
    x: gridX * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
    y: gridY * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
  };
}

/**
 * Checks if coordinates are within maze bounds
 * @param {number} gridX - X coordinate in grid units
 * @param {number} gridY - Y coordinate in grid units
 * @returns {boolean} - True if within bounds
 */
function isInBounds(gridX, gridY) {
  return gridX >= 0 && gridX < CONFIG.MAZE_WIDTH && gridY >= 0 && gridY < CONFIG.MAZE_HEIGHT;
}

// ===========================
// COLLISION DETECTION
// ===========================

/**
 * Checks if an entity would collide with walls at given position
 * Uses multiple collision points for accurate detection
 * @param {number} pixelX - X position in pixels
 * @param {number} pixelY - Y position in pixels
 * @returns {boolean} - True if collision detected
 */
function checkWallCollision(pixelX, pixelY) {
  const margin = CONFIG.COLLISION_MARGIN;
  const size = CONFIG.TILE_SIZE - margin * 2;

  // Check multiple points around the entity
  const collisionPoints = [
    { x: pixelX + margin, y: pixelY + margin }, // top-left
    { x: pixelX + size, y: pixelY + margin }, // top-right
    { x: pixelX + margin, y: pixelY + size }, // bottom-left
    { x: pixelX + size, y: pixelY + size }, // bottom-right
    { x: pixelX + CONFIG.TILE_SIZE / 2, y: pixelY + margin }, // top-center
    { x: pixelX + CONFIG.TILE_SIZE / 2, y: pixelY + size }, // bottom-center
  ];

  for (const point of collisionPoints) {
    const grid = pixelToGrid(point.x, point.y);

    // Check bounds
    if (!isInBounds(grid.x, grid.y)) {
      return true;
    }

    // Check wall collision
    if (MAZE_LAYOUT[grid.y][grid.x] === 1) {
      return true;
    }
  }

  return false;
}

// ===========================
// GAME INITIALIZATION
// ===========================

/**
 * Initializes the game state by parsing the maze layout
 * Sets up player, ghosts, and collectible dots
 */
function initializeGame() {
  // Reset game state
  gameState.ghosts = [];
  gameState.dots = [];
  gameState.score = 0;
  gameState.gameWon = false;

  // Parse maze layout
  for (let y = 0; y < CONFIG.MAZE_HEIGHT; y++) {
    for (let x = 0; x < CONFIG.MAZE_WIDTH; x++) {
      const tileType = MAZE_LAYOUT[y][x];
      const pixelPos = gridToPixel(x, y);

      switch (tileType) {
        case 2: // Pac-Man starting position
          gameState.pacman.x = pixelPos.x;
          gameState.pacman.y = pixelPos.y;
          gameState.pacman.dx = 0;
          gameState.pacman.dy = 0;
          gameState.pacman.direction = "right";
          break;

        case 3: // Ghost starting position
          gameState.ghosts.push({
            x: pixelPos.x,
            y: pixelPos.y,
            dx: CONFIG.GHOST_SPEED,
            dy: 0,
            lastDirection: "right",
          });
          break;

        case 0: // Path with dot
          const center = getTileCenter(x, y);
          gameState.dots.push({
            x: center.x,
            y: center.y,
          });
          break;
      }
    }
  }
}

// ===========================
// INPUT HANDLING
// ===========================

// Event listeners for keyboard input
document.addEventListener("keydown", (e) => {
  inputState.keys[e.key] = true;
  inputState.lastInputTime = Date.now();
});

document.addEventListener("keyup", (e) => {
  inputState.keys[e.key] = false;
});

/**
 * Processes player input and updates Pac-Man movement
 * Includes input buffering for responsive controls
 */
function handlePlayerInput() {
  const pacman = gameState.pacman;
  let newDx = 0;
  let newDy = 0;
  let newDirection = pacman.direction;
  let inputDetected = false;

  // Check for directional input
  if (inputState.keys["ArrowUp"] || inputState.keys["w"] || inputState.keys["W"]) {
    newDx = 0;
    newDy = -CONFIG.PAC_SPEED;
    newDirection = "up";
    inputDetected = true;
  } else if (inputState.keys["ArrowDown"] || inputState.keys["s"] || inputState.keys["S"]) {
    newDx = 0;
    newDy = CONFIG.PAC_SPEED;
    newDirection = "down";
    inputDetected = true;
  } else if (inputState.keys["ArrowLeft"] || inputState.keys["a"] || inputState.keys["A"]) {
    newDx = -CONFIG.PAC_SPEED;
    newDy = 0;
    newDirection = "left";
    inputDetected = true;
  } else if (inputState.keys["ArrowRight"] || inputState.keys["d"] || inputState.keys["D"]) {
    newDx = CONFIG.PAC_SPEED;
    newDy = 0;
    newDirection = "right";
    inputDetected = true;
  }

  // Only process if input was detected
  if (inputDetected) {
    const nextX = pacman.x + newDx;
    const nextY = pacman.y + newDy;

    // Check if the new direction is valid
    if (!checkWallCollision(nextX, nextY)) {
      pacman.dx = newDx;
      pacman.dy = newDy;
      pacman.direction = newDirection;
    }
  }
}

// ===========================
// GAME LOGIC UPDATES
// ===========================

/**
 * Updates Pac-Man position and handles wall collisions
 */
function updatePacman() {
  const pacman = gameState.pacman;

  // Calculate next position
  const nextX = pacman.x + pacman.dx;
  const nextY = pacman.y + pacman.dy;

  // Move if no collision, otherwise stop
  if (!checkWallCollision(nextX, nextY)) {
    pacman.x = nextX;
    pacman.y = nextY;
  } else {
    pacman.dx = 0;
    pacman.dy = 0;
  }
}

/**
 * Updates ghost positions with improved AI
 * Ghosts prefer to continue in their current direction
 */
function updateGhosts() {
  const possibleDirections = [
    { dx: CONFIG.GHOST_SPEED, dy: 0, name: "right" },
    { dx: -CONFIG.GHOST_SPEED, dy: 0, name: "left" },
    { dx: 0, dy: CONFIG.GHOST_SPEED, name: "down" },
    { dx: 0, dy: -CONFIG.GHOST_SPEED, name: "up" },
  ];

  gameState.ghosts.forEach((ghost) => {
    // Find valid directions (no wall collisions)
    const validDirections = possibleDirections.filter(
      (dir) => !checkWallCollision(ghost.x + dir.dx, ghost.y + dir.dy)
    );

    if (validDirections.length === 0) return; // Ghost is stuck (shouldn't happen)

    // Try to continue in current direction
    const currentDirection = validDirections.find((dir) => dir.name === ghost.lastDirection);

    let chosenDirection;

    // 70% chance to continue straight, 30% chance to change direction
    if (currentDirection && Math.random() > CONFIG.GHOST_DIRECTION_CHANGE) {
      chosenDirection = currentDirection;
    } else {
      // Pick random valid direction
      chosenDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
    }

    // Update ghost position and direction
    ghost.x += chosenDirection.dx;
    ghost.y += chosenDirection.dy;
    ghost.lastDirection = chosenDirection.name;
  });
}

/**
 * Checks for dot collection and updates score
 */
function updateDotCollection() {
  const pacman = gameState.pacman;
  const pacmanCenterX = pacman.x + CONFIG.TILE_SIZE / 2;
  const pacmanCenterY = pacman.y + CONFIG.TILE_SIZE / 2;

  // Filter out collected dots
  gameState.dots = gameState.dots.filter((dot) => {
    const distance = Math.hypot(pacmanCenterX - dot.x, pacmanCenterY - dot.y);

    if (distance < CONFIG.TILE_SIZE / 2) {
      gameState.score += CONFIG.DOT_SCORE;
      return false; // Remove this dot
    }

    return true; // Keep this dot
  });

  // Check win condition
  if (gameState.dots.length === 0) {
    gameState.gameWon = true;
  }
}

/**
 * Main game update function
 * Coordinates all game logic updates
 */
function updateGame() {
  if (gameState.gameWon) return; // Don't update if game is won

  handlePlayerInput();
  updatePacman();
  updateGhosts();
  updateDotCollection();
}

// ===========================
// RENDERING
// ===========================

/**
 * Clears the canvas with background color
 */
function clearCanvas() {
  ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Renders the maze walls
 */
function drawMaze() {
  ctx.fillStyle = CONFIG.COLORS.WALL;

  for (let y = 0; y < CONFIG.MAZE_HEIGHT; y++) {
    for (let x = 0; x < CONFIG.MAZE_WIDTH; x++) {
      if (MAZE_LAYOUT[y][x] === 1) {
        const pixelPos = gridToPixel(x, y);
        ctx.fillRect(pixelPos.x, pixelPos.y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
      }
    }
  }
}

/**
 * Renders all collectible dots
 */
function drawDots() {
  ctx.fillStyle = CONFIG.COLORS.DOT;

  gameState.dots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, CONFIG.DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Renders Pac-Man with proper rotation and mouth animation
 * Uses configurable size for tight corridor navigation
 */
function drawPacman() {
  const pacman = gameState.pacman;
  const centerX = pacman.x + CONFIG.TILE_SIZE / 2;
  const centerY = pacman.y + CONFIG.TILE_SIZE / 2;
  const radius = CONFIG.TILE_SIZE / 2; // Використовуємо PACMAN_SIZE замість TILE_SIZE

  ctx.fillStyle = CONFIG.COLORS.PACMAN;
  ctx.save();

  // Move to pac-man center
  ctx.translate(centerX, centerY);

  // Rotate based on direction
  const rotationAngles = {
    right: 0,
    left: Math.PI,
    up: -Math.PI / 2,
    down: Math.PI / 2,
  };

  ctx.rotate(rotationAngles[pacman.direction] || 0);

  // Draw pac-man with mouth
  ctx.beginPath();
  ctx.arc(0, 0, radius, CONFIG.MOUTH_OPENING, Math.PI * 2 - CONFIG.MOUTH_OPENING);
  ctx.lineTo(0, 0);
  ctx.fill();

  ctx.restore();
}

/**
 * Renders all ghosts with classic ghost shape
 */
function drawGhosts() {
  gameState.ghosts.forEach((ghost, index) => {
    const centerX = ghost.x + CONFIG.TILE_SIZE / 2;
    const centerY = ghost.y + CONFIG.TILE_SIZE / 2;
    const radius = CONFIG.TILE_SIZE / 2;

    // Different colors for different ghosts
    const ghostColors = ["red", "pink", "cyan", "orange"];
    ctx.fillStyle = ghostColors[index % ghostColors.length];

    // Ghost body (rounded top)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI, true);
    ctx.fill();

    // Ghost bottom (rectangle)
    ctx.fillRect(ghost.x + 1, centerY, CONFIG.TILE_SIZE - 2, radius);

    // Ghost bottom spikes
    ctx.fillStyle = CONFIG.COLORS.GHOST_ACCENT;
    const spikeWidth = 2;
    const spikeHeight = 3;
    const spikes = Math.floor((CONFIG.TILE_SIZE - 2) / (spikeWidth + 1));

    for (let i = 0; i < spikes; i++) {
      const spikeX = ghost.x + 1 + i * (spikeWidth + 1);
      const spikeY = ghost.y + CONFIG.TILE_SIZE - spikeHeight;
      ctx.fillRect(spikeX, spikeY, spikeWidth, spikeHeight);
    }
  });
}

/**
 * Renders game UI (score, win message, etc.)
 */
function drawUI() {
  ctx.fillStyle = CONFIG.COLORS.TEXT;
  ctx.font = "16px Arial";

  // Score display
  ctx.fillText(`Score: ${gameState.score}`, 10, 20);

  // Win message
  if (gameState.gameWon) {
    ctx.fillStyle = CONFIG.COLORS.WIN_TEXT;
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "start"; // Reset alignment
  }
}

/**
 * Main rendering function
 * Coordinates all drawing operations
 */
function renderGame() {
  clearCanvas();
  drawMaze();
  drawDots();
  drawPacman();
  drawGhosts();
  drawUI();
}

// ===========================
// MAIN GAME LOOP
// ===========================

/**
 * Main game loop using requestAnimationFrame
 * Provides smooth 60fps animation
 */
function gameLoop() {
  updateGame();
  renderGame();
  requestAnimationFrame(gameLoop);
}

// ===========================
// GAME INITIALIZATION
// ===========================

/**
 * Start the game
 */
function startGame() {
  console.log("🎮 Starting Pac-Man Game...");
  console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
  console.log(`Maze size: ${CONFIG.MAZE_WIDTH}x${CONFIG.MAZE_HEIGHT} tiles`);

  initializeGame();
  gameLoop();
}

// Start the game when script loads
startGame();
