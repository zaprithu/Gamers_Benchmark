/*
    Simon Says Game
    Javascript functionality for game logic
    Made by: Ethan Dirkes

    Created 11/9/2024

    Known bugs:
        - Yellow color never gets selected for sequence
        - showSequence doesn't fade out when same color is selected back to back
            (i.e. red->red shows a long flash of red rather than two short flashes)
    Tweaks needed:
        - Add comments
        - Timing needs to be adjusted
*/

const COLORS = ['blue', 'red', 'green', 'blue'];
let sequence = []
let level = 0;
let num_guesses = 0;
let state = undefined;
let mouseover = false;

// Enum for game states
const STATES = Object.freeze({
    START:      0,
    NEXTRND:    1,
    SHOWSEQ:    2,
    PLAYERSEQ:  3,
    GAMEOVER:   4
});

const START_BUTTON = document.getElementById('start');
const GAMEBOARD = document.getElementById('gameboard');
const COLOR_ELEMENTS = document.querySelectorAll('.color');
const RESULTS = document.getElementById('results');

START_BUTTON.addEventListener('click', startGame);

function startGame() {
    state = STATES.START;
    START_BUTTON.classList.remove('btn');
    START_BUTTON.classList.add('btn-d')
    RESULTS.style.visibility="visible";
    sequence = [];
    num_guesses = 0;
    level = 0;
    state = STATES.NEXTRND;
    nextRound();
}

function nextRound() {
    level++;
    num_guesses = 0;
    const next_color = COLORS[Math.floor(Math.random() * COLORS.length)];
    sequence.push(next_color);

    COLOR_ELEMENTS.forEach(color => color.classList.remove('active'));
    RESULTS.innerHTML="Level " + level;
    showSequence();
}

function showSequence() {
    state = STATES.SHOWSEQ;
    let i = 0;
    const interval = setInterval(() =>{
        const COLOR = document.getElementById(sequence[i]);
        COLOR.classList.add('active');
        setTimeout(() => COLOR.classList.remove('active'), Math.max(2000/sequence.length, 100));
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            state = STATES.PLAYERSEQ;
        }
    }, Math.max(2000/sequence.length, 100));
}

COLOR_ELEMENTS.forEach(colorElement => {
    colorElement.addEventListener('click', (event) => {
        if (state != STATES.PLAYERSEQ) return;

        num_guesses++;
        const COLOR = event.target.id;
        event.target.classList.remove('hover');
        event.target.classList.add('active');
        let res = checkSequence(COLOR);

        switch(res) {
            case 0:
                event.target.classList.remove('active');
                gameOver();
                break;
            case 1:
                state = STATES.NEXTRND;
                RESULTS.innerHTML = "Correct! Beginning next level...";
                setTimeout(nextRound(), 1000);
                event.target.classList.remove('active')
                break;
            default:
                event.target.classList.remove('active');
                event.target.classList.add('hover');
        }
    });
    colorElement.addEventListener('mouseover', (event) =>{
        if (state != STATES.PLAYERSEQ) return;

        mouseover = true;
        event.target.classList.add('hover');
    });
    colorElement.addEventListener('mouseout', (event) => {
        if (state != STATES.PLAYERSEQ) return;

        mouseover = false;
        event.target.classList.remove('hover');
    });
});

function checkSequence(color) {
    if (color !== sequence[num_guesses - 1]) {
        return 0;
    }

    if (num_guesses == sequence.length) {
        return 1;
    }
    return -1;
}

function gameOver() {
    state = STATES.GAMEOVER;
    RESULTS.innerHTML = "Game over! Final score: " + (level - 1);
    START_BUTTON.classList.remove('btn-d');
    START_BUTTON.classList.add('btn');
}