# Pac-Man Game

A classic Pac-Man game built with HTML5 Canvas, CSS, and JavaScript, with assistance from Grok 3 by xAI. This project features an authentic look with a blue maze, yellow Pac-Man, red ghosts, and white dots, all controllable via keyboard inputs. Deployed on GitHub Pages, it’s a lightweight, efficient recreation of the arcade legend.

## Description

This is a simplified yet functional version of Pac-Man. The game includes:
- A 28x31 tile maze based on the original Pac-Man layout.
- Pac-Man, who moves with arrow keys and eats dots to increase your score.
- A single ghost with basic random movement (expandable to more ghosts or smarter AI).
- Score tracking as you collect dots.

The game runs smoothly at 60 FPS using `requestAnimationFrame` and is styled to evoke the retro arcade feel.

## How to Play

1. **Open the Game**: Visit the deployed game on GitHub Pages (URL provided after deployment) or run it locally by opening `index.html` in a browser.
2. **Controls**:
   - **Arrow Up**: Move Pac-Man up.
   - **Arrow Down**: Move Pac-Man down.
   - **Arrow Left**: Move Pac-Man left.
   - **Arrow Right**: Move Pac-Man right.
3. **Objective**: Guide Pac-Man to eat all the white dots in the maze while avoiding the ghost. Each dot adds 10 points to your score.
4. **Game Over**: Currently, the game runs indefinitely until all dots are eaten. (Future updates could add win/lose conditions.)

## Architecture and Logic

### File Structure
- `index.html`: The entry point, sets up the canvas and links CSS/JS files.
- `styles.css`: Centers the canvas and applies a black background for that arcade vibe.
- `game.js`: Contains all game logic, rendering, and input handling.

### Key Components
1. **Maze**:
   - Defined as a 2D array where `1` is a wall, `0` is a path/dot, `2` is Pac-Man’s start, and `3` is the ghost’s start.
   - Rendered as blue rectangles on a black canvas.

2. **Pac-Man**:
   - A yellow circle with a "mouth" that adjusts based on direction.
   - Moves at a constant speed (`pacSpeed`) and stops at walls using collision detection.

3. **Ghosts**:
   - Red semi-circles with a rectangular base, moving randomly for now.
   - Speed is slightly slower than Pac-Man’s (`ghostSpeed`).

4. **Dots**:
   - Small white circles placed on every path tile.
   - Removed when Pac-Man collides with them, incrementing the score.

5. **Game Loop**:
   - `gameLoop()` handles input, updates game state, and redraws the canvas using `requestAnimationFrame`.
   - Efficiently clears and redraws only what’s necessary each frame.

6. **Collision Detection**:
   - Checks the maze array to prevent Pac-Man and ghosts from passing through walls.
   - Uses tile-based coordinates for simplicity and speed.

### Logic Flow
- **Initialization**: Places Pac-Man, ghosts, and dots based on the maze layout.
- **Input Handling**: Listens for arrow key presses/releases to set Pac-Man’s direction.
- **Update**: Moves Pac-Man and ghosts, checks for dot collisions, and updates the score.
- **Render**: Draws the maze, dots, Pac-Man, ghosts, and score in that order.

## Deployment on GitHub Pages

Follow these steps to deploy the game to GitHub Pages:

### Prerequisites
- A GitHub account.
- Git installed on your computer.

### Steps
1. **Initialize Repository**:
   - Create a folder (e.g., `pacman-game`) and add `index.html`, `styles.css`, and `game.js`.
   - In the terminal, navigate to the folder and run:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"```

2. Push to GitHub:
    - Create a new repository on GitHub (e.g., pacman-game).
    - Link and push to local repo
    ```bash
    git remote add origin https://github.com/yourusername/pacman-game.git
    git branch -M main
    git push -u origin main```

3. Enable GitHub Pages:
    - Go to your GitHub repository on the web.
    - Navigate to Settings > Pages.
    - Under "Source," select the main branch and / (root) folder, then click Save.
    - After a few minutes, GitHub will provide a URL (e.g., https://yourusername.github.io/pacman-game/).

4. Verify:
    - Visit the URL in your browser. The game should load and be playable with arrow keys.

5. Troubleshooting
    - Ensure file paths in index.html are correct (styles.css, game.js).
    - If the page doesn’t load, check GitHub Pages settings and confirm the files are pushed to the main branch.