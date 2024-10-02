// Game element references
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');

// Game variables
let score = 0;
let bombClicks = 0;
let missedParachutes = 0;
let gameActive = true;

// Function to create a falling object (either a bomb or parachute)
function createFallingObject() {
    const fallingObject = document.createElement('div');

    // Adjust size for larger visuals
    const size = Math.random() * 100 + 100; // Random size between 100px to 200px
    const xPos = Math.random() * (window.innerWidth - size); // Random horizontal position
    const fallDuration = Math.random() * 2 + 2; // Faster fall duration (2-4 seconds)

    // Decide randomly to create a bomb or parachute
    const isBomb = Math.random() < 0.5; // 50% chance for bomb or parachute
    let imageUrl, soundEffect, popImage;

    if (isBomb) {
        // Bomb properties
        const bombImages = [
            'bomb1.png',
            'bomb2.png',
            'bomb3.png',
            'bomb4.png',
            'bomb5.png'
        ];
        const randomIndex = Math.floor(Math.random() * bombImages.length);
        imageUrl = bombImages[randomIndex];
        soundEffect = 'bombing.mp3';
        popImage = 'bombpop.png';
    } else {
        // Parachute properties
        const parachuteImages = [
            'parashute1.png',
            'parashute2.png',
            'parashute3.png',
            'parashute4.png',
            'parashute5.png',
            'parashute6.png'
        ];
        const randomIndex = Math.floor(Math.random() * parachuteImages.length);
        imageUrl = parachuteImages[randomIndex];
        soundEffect = 'explosion.mp3'; // Same sound for parachute
        popImage = 'explosion.png'; // Change to explosion image for parachute
    }

    // Set the properties of the falling object
    fallingObject.classList.add('falling-object');
    fallingObject.style.backgroundImage = `url("${imageUrl}")`;
    fallingObject.style.width = `${size}px`;
    fallingObject.style.height = `${size}px`;
    fallingObject.style.left = `${xPos}px`;
    fallingObject.style.top = '-100px'; // Start just above the screen
    fallingObject.style.animationDuration = `${fallDuration}s`;

    gameArea.appendChild(fallingObject);

    // Handle object click
    fallingObject.addEventListener('click', () => {
        if (isBomb) {
            // Handle bomb click
            popBomb(fallingObject, soundEffect, popImage);
        } else {
            // Handle parachute popping
            popParachute(fallingObject, soundEffect, popImage);
        }
    });

    // Remove object if it reaches the bottom of the screen
    setTimeout(() => {
        if (gameActive && fallingObject.parentNode) { // Check if object is still on screen and game is active
            fallingObject.remove(); // Remove object that reached the bottom
            if (!isBomb) {
                // Count parachute misses
                missedParachute();
            }
        }
    }, fallDuration * 1000);
}

// Function to handle popping of parachutes
function popParachute(object, soundEffect, popImage) {
    if (!gameActive) return;

    // Play the respective sound effect
    const sound = new Audio(soundEffect);
    sound.play();

    // Change the image to the pop image
    object.style.backgroundImage = `url("${popImage}")`; // Change to explosion image
    object.removeEventListener('click', popParachute); // Disable further clicks

    // Remove the object after the effect
    setTimeout(() => {
        object.remove();
    }, 500);

    // Increase score for popping the parachute
    score++;
    updateScore();
}

// Function to handle bomb clicks
function popBomb(object, soundEffect, popImage) {
    if (!gameActive) return;

    // Play the bomb sound effect
    const sound = new Audio(soundEffect);
    sound.play();

    // Change bomb to bombpop image
    object.style.backgroundImage = `url("${popImage}")`;
    object.removeEventListener('click', popBomb);

    // Remove bomb after the effect
    setTimeout(() => {
        object.remove();
    }, 500);

    // Increase bomb click count
    bombClicks++;

    // End game if bomb is clicked 3 times
    if (bombClicks >= 1) {
        endGame();
    }
}

// Function to handle missed parachutes
function missedParachute() {
    if (!gameActive) return;

    missedParachutes++;
    updateScore();

    // End game if 3 parachutes are missed
    if (missedParachutes >= 3) {
        endGame();
    }
}

// Function to update the score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score} | Missed Parachutes: ${missedParachutes}`;
}

// Function to end the game
function endGame() {
    gameActive = false;
    finalScore.textContent = score;
    gameOverScreen.style.display = 'block';
}

// Function to start the game
function startGame() {
    gameActive = true;
    bombClicks = 0;
    missedParachutes = 0;
    score = 0;
    gameOverScreen.style.display = 'none';
    updateScore();

    // Drop objects at intervals
    const objectDropInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(objectDropInterval); // Stop dropping objects if game ends
        }
        createFallingObject(); // Create a new falling object (bomb or parachute)
    }, 800); // Faster interval (drops objects every 800ms)
}

// Function to restart the game
function restartGame() {
    gameArea.innerHTML = ''; // Clear all remaining objects
    startGame(); // Restart the game
}

// Start the game on page load
startGame();