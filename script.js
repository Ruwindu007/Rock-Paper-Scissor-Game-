const choiceButtons = document.querySelectorAll('.choice-card');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const resultMessageEl = document.getElementById('result-message');
const playerChoiceEl = document.getElementById('player-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const resetButton = document.getElementById('reset-game');

let playerScore = 0;
let computerScore = 0;

const choiceDisplay = {
    rock: `
        <div class="flex flex-col items-center gap-2">
            <svg viewBox="0 0 120 120" aria-hidden="true" class="h-16 w-16">
                <defs>
                    <radialGradient id="rockGradientDisplay" cx="50%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#facc15"></stop>
                        <stop offset="45%" stop-color="#eab308"></stop>
                        <stop offset="100%" stop-color="#ca8a04"></stop>
                    </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="52" fill="url(#rockGradientDisplay)"></circle>
                <path d="M36 74c-2-12 4-21 15-24 2-7 7-11 14-11 10 0 18 7 20 17 7 3 11 10 10 18-1 10-11 23-28 23-16 0-30-10-31-23z" fill="#1c1917" opacity="0.85"></path>
            </svg>
            <span class="text-sm font-semibold tracking-[0.3em] text-slate-300">Rock</span>
        </div>
    `,
    paper: `
        <div class="flex flex-col items-center gap-2">
            <svg viewBox="0 0 120 120" aria-hidden="true" class="h-16 w-16">
                <defs>
                    <linearGradient id="paperGradientDisplay" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stop-color="#67e8f9"></stop>
                        <stop offset="50%" stop-color="#22d3ee"></stop>
                        <stop offset="100%" stop-color="#0ea5e9"></stop>
                    </linearGradient>
                </defs>
                <rect x="22" y="16" width="72" height="88" rx="12" fill="url(#paperGradientDisplay)"></rect>
                <path d="M36 32h48M36 48h48M36 64h36M36 80h28" stroke="#0f172a" stroke-width="6" stroke-linecap="round" opacity="0.7"></path>
            </svg>
            <span class="text-sm font-semibold tracking-[0.3em] text-slate-300">Paper</span>
        </div>
    `,
    scissors: `
        <div class="flex flex-col items-center gap-2">
            <svg viewBox="0 0 120 120" aria-hidden="true" class="h-16 w-16">
                <defs>
                    <linearGradient id="scissorsGradientDisplay" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stop-color="#fb7185"></stop>
                        <stop offset="50%" stop-color="#f43f5e"></stop>
                        <stop offset="100%" stop-color="#e11d48"></stop>
                    </linearGradient>
                </defs>
                <path d="M52 28l32 28-32 28" stroke="url(#scissorsGradientDisplay)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                <circle cx="38" cy="40" r="14" fill="#1f2937" stroke="#f43f5e" stroke-width="6"></circle>
                <circle cx="38" cy="80" r="14" fill="#1f2937" stroke="#f43f5e" stroke-width="6"></circle>
                <circle cx="38" cy="40" r="6" fill="#f8fafc"></circle>
                <circle cx="38" cy="80" r="6" fill="#f8fafc"></circle>
            </svg>
            <span class="text-sm font-semibold tracking-[0.3em] text-slate-300">Scissors</span>
        </div>
    `
};

choiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const playerChoice = button.dataset.choice;
        playRound(playerChoice);
    });
});

resetButton.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    updateScoreboard();
    resultMessageEl.textContent = 'Scores reset. Ready when you are!';
    playerChoiceEl.textContent = '—';
    computerChoiceEl.textContent = '—';
});

async function playRound(playerChoice) {
    disableChoices(true);
    try {
        const response = await fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ player: playerChoice })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        handleOutcome(data);
    } catch (error) {
        console.error(error);
        resultMessageEl.textContent = 'Connection issue. Please try again in a moment.';
    } finally {
        disableChoices(false);
    }
}

function handleOutcome({ playerChoice, computerChoice, result, message }) {
    if (result === 'win') {
        playerScore += 1;
    } else if (result === 'lose') {
        computerScore += 1;
    }

    updateScoreboard();

    resultMessageEl.textContent = message ?? 'Round complete.';
    playerChoiceEl.innerHTML = choiceDisplay[playerChoice] ?? '—';
    computerChoiceEl.innerHTML = choiceDisplay[computerChoice] ?? '—';
}

function updateScoreboard() {
    playerScoreEl.textContent = String(playerScore);
    computerScoreEl.textContent = String(computerScore);
}

function disableChoices(disabled) {
    choiceButtons.forEach((button) => {
        button.disabled = disabled;
        button.classList.toggle('opacity-50', disabled);
        button.classList.toggle('cursor-not-allowed', disabled);
    });
}
