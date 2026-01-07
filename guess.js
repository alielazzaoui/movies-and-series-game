// Series data
const series = [
    {
        name: "Better Call Saul",
        image: "images/bettercallsoul.png"
    },
    {
        name: "The Walking Dead",
        image: "images/thewalkingdead.png"
    },
    {
        name: "Stranger Things",
        image: "images/ST5.png"
    },
    {
        name: "Game of Thrones",
        image: "images/GOT.jpg"
    },
    {
        name: "La Casa De Papel",
        image: "images/lacasa.png"
    },
    {
        name: "Mr Robot",
        image: "images/Robot.png"
    },
    {
        name: "Dexter",
        image: "images/Dexter.png"
    },
    {
        name: "Black Mirror",
        image: "images/Black Mirror.png"
    },
    {
        name: "Peaky Blinders",
        image: "images/Peaky Blinders.png"
    },
    {
        name: "13 Reasons Why",
        image: "images/13 Reasons Why.png"
    },
    {
        name: "Squid Game",
        image: "images/Squid Game.png"
    },
    {
        name: "Breaking Bad",
        image: "images/Breaking Bad.png"
    },
    {
        name: "Lucifer",
        image: "images/Lucifer.png"
    },
    {
        name: "Peacemaker",
        image: "images/Peacemaker.png"
    },
    {
        name: "Rick And Morty",
        image: "images/Rick And Morty.png"
    },
    {
        name: "Vikings",
        image: "images/Vikings.png"
    },
    {
        name: "The Amazing Spider Man",
        image: "images/The Amazing Spider-Man.png"
    },
    {
        name: "Deadpool And Wolverine",
        image: "images/Deadpool And Wolverine.png"
    },
    {
        name: "The Sopranos",
        image: "images/thesopranos.png"
    },
    {
        name: "Fleabag",
        image: "images/Fleabag.png"
    },
    {
        name: "The Boys",
        image: "images/theboys.png"
    },
    {
        name: "John Wick",
        image: "images/John Wick.png"
    },
    {
        name: "The Witcher",
        image: "images/thewitcher.png"
    },
    {
        name: "Pirates of the Caribbean",
        image: "images/Pirates of the Caribbean.png"
    },
    {
        name: "It Welcome Derry",
        image: "images/it.png"
    },
    {
        name: "Harry Potter",
        image: "images/harrypotter.png"
    }

];

// Game state
let currentSeriesIndex = 0;
let currentPixelLevel = 0;
let currentSeries = null;
let score = 0;
let imagesRevealed = 1;
let gameState = 'playing';
let timerInterval = null;
let timeLeft = 10;
let timerDuration = 10;
let difficulty = 'normal';
let playerName = '';
let allScores = []; // Store all player scores
let shuffledSeries = []; // Shuffled order of series

const pixelLevels = [
    'pixelated-medium-high',
    'pixelated-medium',
    'pixelated-medium-low',
    'pixelated-low',
    'pixelated-very-low',
    'clear'
];

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const playerNameInput = document.getElementById('player-name');
const startGameBtn = document.getElementById('start-game-btn');
const playerDisplay = document.getElementById('player-display');
const finalScreen = document.getElementById('final-screen');
const finalPlayerName = document.getElementById('final-player-name');
const finalScoreDisplay = document.getElementById('final-score');
const scoreTableBody = document.getElementById('score-table-body');
const playAgainBtn = document.getElementById('play-again-btn');

const imageBox = document.getElementById('image-box');
const seriesImage = document.getElementById('series-image');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const playingSection = document.getElementById('playing-section');
const resultSection = document.getElementById('result-section');
const resultEmoji = document.getElementById('result-emoji');
const resultTitle = document.getElementById('result-title');
const seriesNameDisplay = document.getElementById('series-name');
const resultPoints = document.getElementById('result-points');
const footerText = document.getElementById('footer-text');

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing game...');
    
    // Get difficulty buttons
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Select medium difficulty by default
    const mediumBtn = document.querySelector('[data-difficulty="medium"]');
    if (mediumBtn) {
        mediumBtn.classList.add('selected');
    }
    
    // Difficulty selection
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Difficulty button clicked');
            difficultyBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            difficulty = this.getAttribute('data-difficulty');
            
            // Set timer duration based on difficulty
            if (difficulty === 'easy') {
                timerDuration = 15;
            } else if (difficulty === 'medium') {
                timerDuration = 10;
            } else if (difficulty === 'hard') {
                timerDuration = 5;
            }
            
            console.log('Difficulty set to:', difficulty, 'Timer:', timerDuration);
        });
    });
    
    // Start game button
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function() {
            console.log('Start button clicked');
            startGameFromWelcome();
        });
    }
    
    // Allow Enter key on name input
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter pressed in name input');
                startGameFromWelcome();
            }
        });
    }
    
    // Event listeners for game controls
    if (submitBtn) {
        submitBtn.addEventListener('click', checkGuess);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', startNewSeries);
    }
    if (guessInput) {
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkGuess();
            }
        });
    }
    
    // Play again button
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            finalScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
            
            // Reset for new game
            currentSeriesIndex = 0;
            score = 0;
        });
    }
});

// Start game from welcome screen
function startGameFromWelcome() {
    console.log('startGameFromWelcome function called');
    playerName = playerNameInput.value.trim();
    
    if (playerName === '') {
        alert('Please enter your name!');
        return;
    }
    
    console.log('Player name:', playerName);
    console.log('Difficulty:', difficulty);
    console.log('Timer duration:', timerDuration);
    
    // Shuffle the series array for random order
    shuffledSeries = [...series].sort(() => Math.random() - 0.5);
    console.log('Series shuffled for random order');
    
    // Update footer text
    if (footerText) {
        footerText.textContent = `Image becomes clearer every ${timerDuration} seconds. Guess faster for higher score!`;
    }
    
    // Hide welcome screen, show game screen
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
    }
    if (gameScreen) {
        gameScreen.classList.remove('hidden');
    }
    
    // Display player name
    if (playerDisplay) {
        playerDisplay.textContent = playerName;
    }
    
    // Reset game state
    currentSeriesIndex = 0;
    score = 0;
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }
    
    // Start first series
    startNewSeries();
}

// Start a new series
function startNewSeries() {
    console.log('Starting new series, index:', currentSeriesIndex);
    console.log('Total series:', shuffledSeries.length);
    
    // If shuffledSeries is empty (shouldn't happen, but safety check)
    if (shuffledSeries.length === 0) {
        shuffledSeries = [...series].sort(() => Math.random() - 0.5);
        console.log('Emergency shuffle performed');
    }
    
    // Check if all series are completed
    if (currentSeriesIndex >= shuffledSeries.length) {
        console.log('All series completed! Ending game...');
        endGame();
        return;
    }
    
    // Clear any existing timer
    stopTimer();
    
    // Get current series from shuffled array
    currentSeries = shuffledSeries[currentSeriesIndex];
    console.log('Current series:', currentSeries.name);
    console.log('Shuffled series order:', shuffledSeries.map(s => s.name));
    
    // Start with highest pixelation
    currentPixelLevel = 0;
    
    // Reset state
    imagesRevealed = 1;
    gameState = 'playing';
    if (guessInput) {
        guessInput.value = '';
    }
    timeLeft = timerDuration;
    
    // Update UI - show image with high pixelation
    if (seriesImage) {
        seriesImage.src = currentSeries.image;
        applyPixelation();
    }
    if (imageBox) {
        imageBox.classList.remove('disabled');
    }
    updateTimerDisplay();
    
    // Show/hide sections
    if (playingSection) {
        playingSection.classList.remove('hidden');
    }
    if (resultSection) {
        resultSection.classList.add('hidden');
    }
    
    if (guessInput) {
        guessInput.focus();
    }
    
    // Start countdown timer
    startTimer();
}

// End game and show final screen
function endGame() {
    console.log('Game ended! Final score:', score);
    
    // Save score to leaderboard
    allScores.push({
        name: playerName,
        score: score
    });
    
    // Sort scores (highest first)
    allScores.sort((a, b) => b.score - a.score);
    
    console.log('Hiding game screen...');
    // Hide game screen, show final screen
    if (gameScreen) {
        gameScreen.classList.add('hidden');
        console.log('Game screen hidden');
    }
    if (finalScreen) {
        finalScreen.classList.remove('hidden');
        console.log('Final screen shown');
    }
    
    console.log('Final screen element:', finalScreen);
    console.log('Final screen classes:', finalScreen ? finalScreen.className : 'not found');
    
    // Display final score
    if (finalPlayerName) {
        finalPlayerName.textContent = playerName;
    }
    if (finalScoreDisplay) {
        finalScoreDisplay.textContent = score;
    }
    
    // Build leaderboard table
    if (scoreTableBody) {
        scoreTableBody.innerHTML = '';
        allScores.forEach((player, index) => {
            const row = document.createElement('tr');
            
            // Highlight current player
            if (player.name === playerName && player.score === score) {
                row.style.background = 'rgba(251, 191, 36, 0.2)';
            }
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
            `;
            scoreTableBody.appendChild(row);
        });
    }
    
    console.log('End game complete!');
}

// Apply pixelation effect to image
function applyPixelation() {
    if (!seriesImage) return;

    // Remove all old pixelation classes
    seriesImage.classList.remove(...pixelLevels);

    // Add current pixelation level
    const levelClass = pixelLevels[currentPixelLevel];
    seriesImage.classList.add(levelClass);
    
    // Remove the scaling effect - keep image at full size
    seriesImage.style.transform = 'scale(1)';
}

// Update timer display
function updateTimerDisplay() {
    if (timerDisplay) {
        timerDisplay.textContent = timeLeft;
        timerDisplay.style.display = 'block';
        
        // Add warning class when time is low
        if (timeLeft <= 3) {
            timerDisplay.classList.add('warning');
        } else {
            timerDisplay.classList.remove('warning');
        }
    }
}

// Start the countdown timer
function startTimer() {
    console.log('Starting timer with duration:', timerDuration);
    
    timerInterval = setInterval(() => {
        if (gameState !== 'playing') {
            stopTimer();
            return;
        }
        
        timeLeft--;
        updateTimerDisplay();
        
        console.log('Time left:', timeLeft);
        
        // When timer reaches 0, reduce pixelation
        if (timeLeft <= 0) {
            if (currentPixelLevel < pixelLevels.length - 1) {
                console.log('Timer reached 0, reducing pixelation');
                reducePixelation();
                timeLeft = timerDuration;
                updateTimerDisplay();
            } else {
                console.log('Already at clearest level');
                stopTimer();
                if (timerDisplay) {
                    timerDisplay.style.display = 'none';
                }
            }
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        console.log('Timer stopped');
    }
}

// Reduce pixelation level (make image clearer)
function reducePixelation() {
    if (gameState !== 'playing') return;
    
    if (currentPixelLevel >= pixelLevels.length - 1) {
        return;
    }
    
    currentPixelLevel++;
    imagesRevealed++;
    
    console.log('Reduced pixelation to level:', currentPixelLevel);
    
    applyPixelation();
}

// Check the guess
function checkGuess() {
    if (gameState !== 'playing') return;
    
    const guess = guessInput.value.trim().toLowerCase();
    const correctAnswer = currentSeries.name.toLowerCase();
    
    console.log('Checking guess:', guess, 'vs', correctAnswer);
    
    if (guess === '') {
        alert('Please enter a series name!');
        return;
    }
    
    // Stop the timer
    stopTimer();
    
    if (guess === correctAnswer) {
        // Correct!
        console.log('Correct answer!');
        gameState = 'won';
        const points = Math.max(10 - imagesRevealed, 2);
        score += points;
        
        // Show full clear image
        currentPixelLevel = pixelLevels.length - 1;
        applyPixelation();
        
        showResult(true, points);
        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }
        if (imageBox) {
            imageBox.classList.add('disabled');
        }
        if (timerDisplay) {
            timerDisplay.style.display = 'none';
        }
        
        // Move to next series
        currentSeriesIndex++;
    } else {
        // Wrong!
        console.log('Wrong answer');
        if (currentPixelLevel >= pixelLevels.length - 1) {
            // Already at clearest level, game over
            console.log('Game over - no more clarity levels');
            gameState = 'lost';
            
            // Show full clear image
            currentPixelLevel = pixelLevels.length - 1;
            applyPixelation();
            
            showResult(false, 0);
            if (scoreDisplay) {
                scoreDisplay.textContent = score;
            }
            if (imageBox) {
                imageBox.classList.add('disabled');
            }
            if (timerDisplay) {
                timerDisplay.style.display = 'none';
            }
            
            // Move to next series
            currentSeriesIndex++;
        } else {
            // Reduce pixelation and let them try again
            console.log('Wrong - reducing pixelation and continuing');
            currentPixelLevel++;
            imagesRevealed++;
            
            applyPixelation();
            if (guessInput) {
                guessInput.value = '';
                guessInput.focus();
            }
            
            // Reset and restart timer
            timeLeft = timerDuration;
            updateTimerDisplay();
            startTimer();
            
            // Show brief message
            if (guessInput) {
                guessInput.placeholder = 'Wrong! Try again...';
                setTimeout(() => {
                    guessInput.placeholder = 'Enter series name...';
                }, 2000);
            }
        }
    }
}

// Show result
function showResult(won, points) {
    console.log('Showing result, won:', won, 'points:', points);
    
    if (playingSection) {
        playingSection.classList.add('hidden');
    }
    if (resultSection) {
        resultSection.classList.remove('hidden');
    }
    
    if (won) {
        if (resultSection) {
            resultSection.className = 'result won';
        }
        if (resultEmoji) {
            resultEmoji.textContent = '🎉';
        }
        if (resultTitle) {
            resultTitle.textContent = 'Correct!';
        }
        if (resultPoints) {
            resultPoints.textContent = `You earned ${points} points!`;
        }
    } else {
        if (resultSection) {
            resultSection.className = 'result lost';
        }
        if (resultEmoji) {
            resultEmoji.textContent = '😢';
        }
        if (resultTitle) {
            resultTitle.textContent = 'Wrong!';
        }
        if (resultPoints && guessInput) {
            resultPoints.textContent = `Your guess: ${guessInput.value}`;
        }
    }
    
    if (seriesNameDisplay) {
        seriesNameDisplay.textContent = currentSeries.name;
    }
    
    // Update next button text based on whether there are more series
    if (nextBtn) {
        if (currentSeriesIndex >= shuffledSeries.length) {
            nextBtn.innerHTML = '<span>🏁</span> Finish Game';
        } else {
            nextBtn.innerHTML = '<span>↻</span> Next Series';
        }
    }
}