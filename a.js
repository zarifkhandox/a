const crypto = require('crypto');
const readline = require('readline');

// Generate a cryptographically secure random number (0 or 1)
function secureRandom() {
    return crypto.randomBytes(1)[0] % 2;
}

// Simulate and determine the best choice
async function calculateChoice(history) {
    const trials = 100000;
    let headsCount = 0;
    let tailsCount = 0;

    // Simulate outcomes
    for (let i = 0; i < trials; i++) {
        const random = secureRandom();
        if (random === 1) headsCount++;
        else tailsCount++;
    }

    // Calculate probabilities
    const headsProbability = headsCount / trials;
    const tailsProbability = tailsCount / trials;

    console.log(`\nHeads Probability: ${(headsProbability * 100).toFixed(2)}%`);
    console.log(`Tails Probability: ${(tailsProbability * 100).toFixed(2)}%`);

    // Use history to refine choice
    const lastOutcome = history.length > 0 ? history[history.length - 1] : null;
    if (lastOutcome === 'heads') return 'tails'; // Switch if last was heads
    if (lastOutcome === 'tails') return 'heads'; // Switch if last was tails

    // Default to higher probability
    return headsProbability > tailsProbability ? 'heads' : 'tails';
}

// Main function
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let history = [];
    let balance = 1000000; // Example starting balance
    const maxBet = 250000;

    async function gameLoop() {
        console.log(`\nCurrent Balance: ${balance} cowoncy`);
        rl.question('Enter your bet amount (1 - 250,000): ', async (input) => {
            const betAmount = parseInt(input);

            if (isNaN(betAmount) || betAmount < 1 || betAmount > maxBet) {
                console.log('Invalid bet amount. Please enter a value between 1 and 250,000.');
                return gameLoop();
            }

            if (betAmount > balance) {
                console.log('Insufficient balance for this bet.');
                return gameLoop();
            }

            const choice = await calculateChoice(history);
            console.log(`\nBased on calculations, you should choose: ${choice.toUpperCase()}`);

            // Simulate the game's outcome
            const outcome = secureRandom() === 1 ? 'heads' : 'tails';
            console.log(`\nThe coin landed on: ${outcome.toUpperCase()}`);

            if (outcome === choice) {
                console.log(`You won ${betAmount} cowoncy!`);
                balance += betAmount;
            } else {
                console.log(`You lost ${betAmount} cowoncy.`);
                balance -= betAmount;
            }

            history.push(outcome);

            if (balance <= 0) {
                console.log('You are out of cowoncy. Game over!');
                rl.close();
                return;
            }

            // Loop again
            gameLoop();
        });
    }

    gameLoop();
}

// Run the program
main();
