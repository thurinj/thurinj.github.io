// Updated Script with Subdued Colors and Rain/Droplet Effects

const animationConfigs = {
    home: {
        vowels: [' ', ' '], // Characters are not used in this animation
        baseProbability: 0.0, // Not used in this animation
        colors: ['#7d7d7d'],  // Base color for the grid (will be overridden)
        tickSpeed: 100,
        animationType: 'randomSearchMisfit' // New animation type
    },
    research: {
        vowels: ['~', '-', '_', '.', '=', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        baseProbability: 0.02,
        colors: ['#ced9ec', '#66b0c7', '#34419d'],
        tickSpeed: 800,
        animationType: 'default'
    },
    publications: {
        vowels: [' '], // Game of Life uses spaces or blocks
        baseProbability: 0.3, // Initial live cell probability
        colors: ['#000000', '#FFFFFF'], // Dead and live cell colors
        tickSpeed: 800,
        animationType: 'gameOfLife' // New animation type
    },
    // about: {
    //     vowels: ['#', '@', '%', ' '],
    //     baseProbability: 0.08,
    //     colors: ['#4a4e69', '#22223b', '#9a8c98'], // Muted purples and grays
    //     tickSpeed: 200,
    //     animationType: 'spiral' // Adjusted to use subdued colors
    // },
    cv: {
        vowels: ['-', '|', '+', ' '],
        baseProbability: 0.1,
        colors: ['#c9ada7', '#9a8c98', '#4a4e69'], // Soft neutral colors
        tickSpeed: 250,
        animationType: 'expandingCircles' // Adjusted to use subdued colors
    },
    // Additional configurations for posts with default animation
    post1: {
        vowels: ['<', '>', '+', '-', ' ', ' ', ' ', ' '],
        baseProbability: 0.02,
        colors: ['#d5dd90', '#e6bb45', '#ef9770'],
        tickSpeed: 800,
        animationType: 'default'
    },
    post2: {
        vowels: [' ', ' '], // Characters are not used in this animation
        baseProbability: 0.0, // Not used in this animation
        colors: ['#7d7d7d'],  // Base color for the grid (will be overridden)
        tickSpeed: 100,
        animationType: 'randomSearchMisfit' // New animation type
    },
    // ... other post configurations
};

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('animatedTextContainer');
    let currentInterval = null;
    let frameCount = 0; // Global frame counter for animations

    // Map URLs to data-id values
    const pageMappings = {
        '/': 'home',
        '/research': 'research',
        '/publications': 'publications',
        '/about/': 'about',
        '/cv': 'cv',

    };

    // Determine the current page's data-id
    const currentPage = window.location.pathname;
    let currentId = pageMappings[currentPage] || 'home';  // Default to 'home' if no match

    // For dynamically generated post URLs
    const postLinks = document.querySelectorAll('.recent-posts a');
    postLinks.forEach((link, index) => {
        if (currentPage === new URL(link.href).pathname) {
            currentId = `post${index + 1}`;
        }
    });

    const initialTitle = document.querySelector(`[data-id="${currentId}"]`).getAttribute('data-title');
    let hoverTitle = initialTitle;

    // Function to create a line of text with a given configuration
    function createLine(isTitleLine = false, isPaddingOnly = false, title = initialTitle, config) {
        const line = document.createElement('div');
        line.classList.add(isTitleLine ? 'title-line' : 'line');
        line.style.textAlign = 'center';

        const charsPerLine = 85;
        const titlePadding = 3;
        const titleStart = Math.floor((charsPerLine - title.length) / 2) - titlePadding;
        const titleEnd = titleStart + title.length + 2 * titlePadding;

        for (let i = 0; i < charsPerLine; i++) {
            const char = document.createElement('span');
            char.classList.add('char');
            char.style.display = 'inline-block';
            char.style.opacity = 1; // Reset opacity

            if (isTitleLine && i >= titleStart && i < titleEnd) {
                if (i < titleStart + titlePadding || i >= titleEnd - titlePadding || isPaddingOnly) {
                    char.textContent = ' ';
                    char.classList.add('no-animation');
                } else {
                    char.textContent = title[i - titleStart - titlePadding];
                    char.style.fontWeight = 'bold';
                    char.style.color = 'black';
                    char.classList.add('no-animation');
                }
            } else {
                char.textContent = getRandomVowel(config.vowels);
                char.style.color = getRandomColor(config.colors);
            }

            line.appendChild(char);
        }
        container.appendChild(line);
    }

    // Function to generate random vowels
    function getRandomVowel(vowels) {
        return vowels[Math.floor(Math.random() * vowels.length)];
    }

    // Function to generate random colors
    function getRandomColor(colors) {
        if (colors.length === 0) {
            // Return a default color if no colors are specified
            return '#FFFFFF';
        }
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Animation functions for different animation types
    function animateChars(config) {
        frameCount++;

        const lines = document.querySelectorAll('.line, .title-line');

        switch (config.animationType) {
            case 'rain':
                animateRain(lines, config);
                break;
            case 'droplet':
                animateDroplet(lines, config);
                break;
            case 'radialFade':
                animateRadialFade(lines, config);
                break;
            case 'spiral':
                animateSpiral(lines, config);
                break;
            case 'expandingCircles':
                animateExpandingCircles(lines, config);
                break;
            case 'randomSearchMisfit':
                animateRandomSearchMisfit(lines, config);
                break;
            case 'blob':
                animateBlob(lines, config);
                break;                    
            case 'gameOfLife':
                animateGameOfLife(lines, config);
                break;
            default:
                animateDefault(lines, config);
                break;
            
        }
    }

    // Random Search Algorithm uncovering a hidden misfit map with multiple walkers
    let walkers = [];
    let misfitMap = [];
    const numWalkers = 5; // Number of walkers
    const misfitColors = [
        '#8B0000', // Dark Red (Muted Red)
        '#CD5C5C', // Indian Red
        '#F08080', // Light Coral
        '#D3D3D3', // Light Grey
        '#87CEFA', // Light Sky Blue
        '#4682B4', // Steel Blue
        '#00008B',  // Dark Blue (Muted Blue)
        '#0000FF'  // Blue
    ];


    function initializeMisfitMap(lines, config) {
        const totalLines = lines.length;
        const charsPerLine = lines[0].querySelectorAll('.char').length;
    
        // Step 1: Generate random misfit values
        misfitMap = [];
        for (let i = 0; i < totalLines; i++) {
            misfitMap[i] = [];
            for (let j = 0; j < charsPerLine; j++) {
                misfitMap[i][j] = Math.random();
            }
        }
    
        // Step 2: Apply a smoothing filter
        const smoothMisfitMap = [];
        for (let i = 0; i < totalLines; i++) {
            smoothMisfitMap[i] = [];
            for (let j = 0; j < charsPerLine; j++) {
                let sum = 0;
                let count = 0;
                // Define the smoothing radius
                const radius = 1;
                for (let di = -radius; di <= radius; di++) {
                    for (let dj = -radius; dj <= radius; dj++) {
                        const ni = i + di;
                        const nj = j + dj;
                        if (ni >= 0 && ni < totalLines && nj >= 0 && nj < charsPerLine) {
                            sum += misfitMap[ni][nj];
                            count++;
                        }
                    }
                }
                smoothMisfitMap[i][j] = sum / count;
            }
        }
        misfitMap = smoothMisfitMap;
    }

    function getMisfitColor(value) {
        // Map value (0 to 1) to a color from blue to red
        const index = Math.floor(value * (misfitColors.length - 1));
        return misfitColors[index];
    }

    function animateRandomSearchMisfit(lines, config) {
        const totalLines = lines.length;
        const charsPerLine = lines[0].querySelectorAll('.char').length;

        // Initialize walkers if not already done
        if (walkers.length === 0) {
            for (let w = 0; w < numWalkers; w++) {
                const startI = Math.floor(Math.random() * totalLines);
                const startJ = Math.floor(Math.random() * charsPerLine);
                walkers.push({ i: startI, j: startJ });
            }
        }

        // Move each walker
        walkers.forEach(walker => {
            // Mark current position as explored
            const currentChar = lines[walker.i].querySelectorAll('.char')[walker.j];
            const misfitValue = misfitMap[walker.i][walker.j];
            const misfitColor = getMisfitColor(misfitValue);

            if (!currentChar.classList.contains('no-animation')) {
                currentChar.textContent = '+'; // Use a dot to mark explored area
                currentChar.style.color = misfitColor;
            }

            // Randomly move to a new position
            const directions = [
                { di: -1, dj: 0 }, // Up
                { di: 1, dj: 0 },  // Down
                { di: 0, dj: -1 }, // Left
                { di: 0, dj: 1 },  // Right
            ];

            let possibleMoves = directions.filter(dir => {
                const newI = walker.i + dir.di;
                const newJ = walker.j + dir.dj;
                return newI >= 0 && newI < totalLines && newJ >= 0 && newJ < charsPerLine;
            });

            if (possibleMoves.length > 0) {
                const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                walker.i += move.di;
                walker.j += move.dj;
            }

            // Mark new walker position
            const newChar = lines[walker.i].querySelectorAll('.char')[walker.j];
            if (!newChar.classList.contains('no-animation')) {
                newChar.textContent = '@'; // Walker symbol
                newChar.style.color = '#FFFFFF'; // Walker color (white)
            }
        });
    }


    // Rain effect animation
    function animateRain(lines, config) {
        // Move droplets down each frame
        for (let i = lines.length - 1; i >= 0; i--) {
            const chars = lines[i].querySelectorAll('.char');
            for (let j = 0; j < chars.length; j++) {
                const char = chars[j];
                if (!char.classList.contains('no-animation')) {
                    if (i === 0) {
                        // Generate new droplets at the top line
                        char.textContent = Math.random() < config.baseProbability ? getRandomVowel(config.vowels) : ' ';
                        char.style.color = getRandomColor(config.colors);
                    } else {
                        const charsAbove = lines[i - 1].querySelectorAll('.char');
                        const charAbove = charsAbove[j];
                        char.textContent = charAbove.textContent;
                        char.style.color = charAbove.style.color;
                    }
                }
            }
        }
    }

    // Game of Life simulation
    let gameOfLifeGrid = []; // 2D array representing the grid

    function animateGameOfLife(lines, config) {
        // Initialize the grid if it's empty
        if (gameOfLifeGrid.length === 0) {
            initializeGameOfLifeGrid(lines, config);
        }

        const newGrid = [];

        // Apply Game of Life rules to each cell
        for (let i = 0; i < gameOfLifeGrid.length; i++) {
            newGrid[i] = [];
            for (let j = 0; j < gameOfLifeGrid[i].length; j++) {
                const cell = gameOfLifeGrid[i][j];
                const neighbors = countLiveNeighbors(i, j);
                if (cell === 1) {
                    // Live cell
                    if (neighbors < 2 || neighbors > 3) {
                        newGrid[i][j] = 0; // Cell dies
                    } else {
                        newGrid[i][j] = 1; // Cell lives
                    }
                } else {
                    // Dead cell
                    if (neighbors === 3) {
                        newGrid[i][j] = 1; // Cell becomes alive
                    } else {
                        newGrid[i][j] = 0; // Cell remains dead
                    }
                }
            }
        }

        gameOfLifeGrid = newGrid;

        // Update the display
        for (let i = 0; i < lines.length; i++) {
            const chars = lines[i].querySelectorAll('.char');
            for (let j = 0; j < chars.length; j++) {
                const char = chars[j];
                if (!char.classList.contains('no-animation')) {
                    const state = gameOfLifeGrid[i][j];
                    if (state === 1) {
                        char.textContent = '÷'; // Use a full block for live cells
                        char.style.color = '#79444a'; // White color
                    } else {
                        char.textContent = ' '; // Empty space for dead cells
                        char.style.color = '#d1b187'; // Black color
                    }
                }
            }
        }
    }

    function initializeGameOfLifeGrid(lines, config) {
        for (let i = 0; i < lines.length; i++) {
            const chars = lines[i].querySelectorAll('.char');
            gameOfLifeGrid[i] = [];
            for (let j = 0; j < chars.length; j++) {
                if (!chars[j].classList.contains('no-animation')) {
                    // Initialize each cell with a random state
                    gameOfLifeGrid[i][j] = Math.random() < config.baseProbability ? 1 : 0;
                } else {
                    gameOfLifeGrid[i][j] = 0; // For non-animated chars
                }
            }
        }
    }

    function countLiveNeighbors(x, y) {
        const dirs = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],         [0, 1],
            [ 1, -1], [ 1, 0], [1, 1]
        ];

        let count = 0;
        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < gameOfLifeGrid.length && ny >= 0 && ny < gameOfLifeGrid[0].length) {
                count += gameOfLifeGrid[nx][ny];
            }
        }
        return count;
    }


    // Droplet effect animation
    let dropletPositions = []; // Positions where droplets have landed

    function animateDroplet(lines, config) {
        // Generate new droplets at random positions at the top
        const topLineChars = lines[0].querySelectorAll('.char');
        for (let j = 0; j < topLineChars.length; j++) {
            if (Math.random() < config.baseProbability) {
                topLineChars[j].textContent = getRandomVowel(config.vowels);
                topLineChars[j].style.color = getRandomColor(config.colors);
                dropletPositions.push({ i: 0, j: j });
            }
        }

        // Move droplets down
        const newDropletPositions = [];
        dropletPositions.forEach(pos => {
            const { i, j } = pos;
            if (i < lines.length - 1) {
                const currentChar = lines[i].querySelectorAll('.char')[j];
                const nextChar = lines[i + 1].querySelectorAll('.char')[j];
                if (!nextChar.classList.contains('no-animation')) {
                    nextChar.textContent = currentChar.textContent;
                    nextChar.style.color = currentChar.style.color;
                    currentChar.textContent = ' ';
                    newDropletPositions.push({ i: i + 1, j: j });
                }
            } else {
                // Droplet has reached the bottom, create splash effect
                const chars = lines[i].querySelectorAll('.char');
                for (let k = -1; k <= 1; k++) {
                    const splashIndex = j + k;
                    if (splashIndex >= 0 && splashIndex < chars.length) {
                        const splashChar = chars[splashIndex];
                        if (!splashChar.classList.contains('no-animation')) {
                            splashChar.textContent = getRandomVowel(['*', '.', ' ']);
                            splashChar.style.color = getRandomColor(config.colors);
                        }
                    }
                }
                currentChar.textContent = ' ';
            }
        });

        dropletPositions = newDropletPositions;
    }

    // Radial fade animation (with subdued colors)
    function animateRadialFade(lines, config) {
        const centerI = Math.floor(lines.length / 2);
        const centerJ = Math.floor(lines[0].querySelectorAll('.char').length / 2);
        const distanceCache = [];
    
        // Pre-calculate distances to avoid recalculating every frame
        lines.forEach((line, i) => {
            const chars = line.querySelectorAll('.char');
            chars.forEach((char, j) => {
                if (!char.classList.contains('no-animation')) {
                    const distance = Math.sqrt(Math.pow(i - centerI, 2) + Math.pow(j - centerJ, 2));
                    distanceCache.push({ char, distance });
                }
            });
        });
    
        // Throttle updates to reduce load
        let frameCount = 0;
        function update() {
            frameCount += 1;
    
            distanceCache.forEach(({ char, distance }) => {
                const fadeValue = Math.sin((distance - frameCount / 10)) * 0.5 + 0.5;
                char.style.opacity = fadeValue;
    
                if (Math.random() < config.baseProbability / 2) { // Reduced probability to limit changes
                    char.textContent = getRandomVowel(config.vowels);
                    char.style.color = getRandomColor(config.colors);
                }
            });
    
            requestAnimationFrame(update);
        }
    
        update();
    }

    // Spiral animation (with subdued colors)
    function animateSpiral(lines, config) {
        const centerI = Math.floor(lines.length / 2);
        const centerJ = Math.floor(lines[0].querySelectorAll('.char').length / 2);

        lines.forEach((line, i) => {
            const chars = line.querySelectorAll('.char');
            chars.forEach((char, j) => {
                if (!char.classList.contains('no-animation')) {
                    const dx = j - centerJ;
                    const dy = i - centerI;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);

                    const spiralValue = distance - frameCount / 5 + angle * 5;

                    const fadeValue = Math.sin(spiralValue) * 0.5 + 0.5;

                    const opacity = fadeValue;
                    char.style.opacity = opacity;

                    if (Math.random() < config.baseProbability) {
                        char.textContent = getRandomVowel(config.vowels);
                        char.style.color = getRandomColor(config.colors);
                    }
                }
            });
        });
    }

    let blobPositions = []; // Store current positions of the blob

    function animateBlob(lines, config) {
        if (blobPositions.length === 0) {
            // Initialize blob at the center
            const centerI = Math.floor(lines.length / 2);
            const centerJ = Math.floor(lines[0].querySelectorAll('.char').length / 2);
            blobPositions.push({ i: centerI, j: centerJ });
        }
    
        const newBlobPositions = [];
    
        blobPositions.forEach(pos => {
            const { i, j } = pos;
            const line = lines[i];
            if (line) {
                const chars = line.querySelectorAll('.char');
                const char = chars[j];
                if (char && !char.classList.contains('no-animation')) {
                    const newChar = getRandomVowel(config.vowels);
                    const newColor = getRandomColor(config.colors);
                    char.textContent = newChar;
                    char.style.color = newColor;
    
                    // Randomly move to neighboring positions
                    const directions = [
                        { di: -1, dj: 0 },
                        { di: 1, dj: 0 },
                        { di: 0, dj: -1 },
                        { di: 0, dj: 1 }
                    ];
    
                    directions.forEach(dir => {
                        if (Math.random() < 0.25) { // 25% chance to move in each direction
                            const ni = i + dir.di;
                            const nj = j + dir.dj;
                            if (ni >= 0 && ni < lines.length) {
                                const nLine = lines[ni];
                                const nChars = nLine.querySelectorAll('.char');
                                if (nj >= 0 && nj < nChars.length) {
                                    newBlobPositions.push({ i: ni, j: nj });
                                }
                            }
                        }
                    });
                }
            }
        });
    
        blobPositions = newBlobPositions;
    }

    // Expanding circles animation (with subdued colors)
    function animateExpandingCircles(lines, config) {
        const centerI = Math.floor(lines.length / 2);
        const centerJ = Math.floor(lines[0].querySelectorAll('.char').length / 2);

        const radius = frameCount % 50;

        lines.forEach((line, i) => {
            const chars = line.querySelectorAll('.char');
            chars.forEach((char, j) => {
                if (!char.classList.contains('no-animation')) {
                    const dx = j - centerJ;
                    const dy = i - centerI;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (Math.abs(distance - radius) < 1) {
                        char.style.opacity = 1;
                        if (Math.random() < config.baseProbability) {
                            char.textContent = getRandomVowel(config.vowels);
                            char.style.color = getRandomColor(config.colors);
                        }
                    } else {
                        char.style.opacity = 0;
                    }
                }
            });
        });
    }

    // Default random animation
    function animateDefault(lines, config) {
        lines.forEach(line => {
            const chars = line.querySelectorAll('.char');
            chars.forEach(char => {
                if (!char.classList.contains('no-animation')) {
                    if (Math.random() < config.baseProbability) {
                        const newChar = getRandomVowel(config.vowels);
                        const newColor = getRandomColor(config.colors);

                        char.textContent = newChar;
                        char.style.color = newColor;
                    }
                }
            });
        });
    }

    // Function to start the animation with a specific config
    function startAnimation(config) {
        if (currentInterval) clearInterval(currentInterval);
        frameCount = 0; // Reset frame count
        walkers = [];   // Reset walkers
        misfitMap = []; // Reset misfit map
        const lines = document.querySelectorAll('.line, .title-line');
        initializeMisfitMap(lines, config);
        currentInterval = setInterval(() => animateChars(config), config.tickSpeed);
    }

    // Function to regenerate lines with a new title and configuration
    function regenerateLines(newTitle, config) {
        container.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const isMiddleLine = i === Math.floor(9 / 2);
            const isTitleLine = i >= Math.floor(9 / 2) - 1 && i <= Math.floor(9 / 2) + 1;
            const isPaddingOnly = !isMiddleLine && isTitleLine;

            createLine(isTitleLine, isPaddingOnly, newTitle, config);
        }
    }

    // Start the continuous animation with the correct configuration for the current page
    const config = animationConfigs[currentId];
    regenerateLines(initialTitle, config);
    startAnimation(config);

    // Change title and characters on hover for both the navigation and recent posts
    const allLinks = document.querySelectorAll('header nav a, .recent-posts a');

    allLinks.forEach(link => {
        link.addEventListener('mouseover', function() {
            const linkId = link.getAttribute('data-id');
            const config = animationConfigs[linkId];
            hoverTitle = link.getAttribute('data-title');
            if (hoverTitle !== initialTitle) {
                regenerateLines(hoverTitle, config);
                startAnimation(config);
            }
        });

        link.addEventListener('mouseleave', function() {
            if (hoverTitle !== initialTitle) {
                regenerateLines(initialTitle, animationConfigs[currentId]);
                startAnimation(animationConfigs[currentId]);
            }
        });
    });
});


