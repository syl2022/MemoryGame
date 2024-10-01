import {startTimer, stopTimer} from "./timer";
import '../styles/index.scss';

const cardImages = [
    {url:'http://localhost:3002/png/img1/100',name: 'image 1'},
    {url:'http://localhost:3002/png/img2/100',name: 'image 2'},
    {url:'http://localhost:3002/png/img3/100',name: 'image 3'},
    {url:'http://localhost:3002/png/img4/100',name: 'image 4'},
    {url:'http://localhost:3002/png/img5/100',name: 'image 5'},
    {url:'http://localhost:3002/png/img6/100',name: 'image 6'},
    {url:'http://localhost:3002/png/img7/100',name: 'image 7'},
    {url:'http://localhost:3002/png/img8/100',name: 'image 8'},
];
const cards = [...cardImages, ...cardImages]; // Duplicate card images

let players = [];
export let scores = [];
let currentPlayerIndex = 0;
let flippedCards = 0;
let cardOne = null;
let lockBoard = false;

const restartButton = document.getElementById('restart-button');
const startBtn=document.getElementById('startGame');
// Utility functions
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function initializeGame(numPlayers) {
    players = Array.from({ length: numPlayers }, (_, index) => `Player ${index + 1}`);
    scores = Array(numPlayers).fill(0);
    currentPlayerIndex = 0;
    flippedCards = 0;
    lockBoard = false;

    // Hide the setup UI and start the game
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startTimer();
    updateScoreboard();
    updateCurrentPlayerDisplay();
    createCardElements();
}

function updateCurrentPlayerDisplay() {
    document.getElementById('currentPlayer').innerText = `Current Player: ${players[currentPlayerIndex]}`;
}

function updateScoreboard() {
    const scoreboardElement = document.getElementById('scoreboard');
    scoreboardElement.innerHTML = ''; // Clear previous scoreboard
    players.forEach((player, index) => {
        scoreboardElement.innerHTML += `<div>${player} Score: ${scores[index]}</div>`;
    });
}

function updateScore() {
    scores[currentPlayerIndex] += 10;
    updateScoreboard();
}

function switchPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateCurrentPlayerDisplay();
}

function createCardElements() {

    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = ''; // Clear the grid
    const shuffledCards = shuffle(cards);

    shuffledCards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.imageUrl = image.url;
        card.dataset.imageName = image.name;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', index); // Make it focusable
        card.setAttribute('aria-label', 'card '+index);
        card.addEventListener('click', handleCardFlip);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') handleCardFlip(e);
        });
        gameGrid.appendChild(card);
    });
}

function handleCardFlip(e) {
    if (lockBoard) return;
    const clickedCard = e.target;

    if (clickedCard === cardOne || clickedCard.classList.contains('flipped')) return;

    clickedCard.classList.add('flipped');
    const img = document.createElement('img');
    img.src = clickedCard.dataset.imageUrl;
    img.alt = clickedCard.dataset.imageName;
    img.style.width = '100px';
    img.style.height = '100px';
    clickedCard.appendChild(img);

    if (!cardOne) {
        cardOne = clickedCard;
    } else {
        checkForMatch(clickedCard);
    }
}

function checkForMatch(cardTwo) {
    if (cardOne.dataset.imageUrl === cardTwo.dataset.imageUrl) {
        disableCards(cardOne, cardTwo);
        updateScore();
        flippedCards += 2;
        if (flippedCards === cards.length) {
            declareWinner();
        }
    } else {
        switchPlayer();
        unflipCards(cardOne, cardTwo);
    }
}

export function declareWinner() {
    stopTimer();
    let maxScore = Math.max(...scores);
    let winners = players.filter((_, index) => scores[index] === maxScore);
    let message;
    if (winners.length === 1) {
        message=`${winners[0]} wins with a score of ${maxScore}!`; // Declare a single winner
    } else {
        message=`It's a tie between ${winners.join(' and ')} with a score of ${maxScore}!`; // Handle ties
    }
    alert(message); // Visual alert
    document.getElementById('game-grid').setAttribute('aria-live', 'assertive');
    document.getElementById('game-grid').textContent = message;
}

function disableCards(cardOne, cardTwo) {
    cardOne.removeEventListener('click', handleCardFlip);
    cardTwo.removeEventListener('click', handleCardFlip);
    resetBoard();
}

function unflipCards(cardOne, cardTwo) {
    lockBoard = true;
    setTimeout(() => {
        cardOne.classList.remove('flipped');
        cardOne.innerHTML = '';
        cardTwo.classList.remove('flipped');
        cardTwo.innerHTML = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [cardOne, lockBoard] = [null, false];
}

function restartGame() {
    location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
// Event listeners
restartButton.addEventListener('click', restartGame);
startBtn.addEventListener('click', () => {
    const numPlayers = parseInt(document.getElementById('numPlayers').value, 10);
    initializeGame(numPlayers);
});


startBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const numPlayers = parseInt(document.getElementById('numPlayers').value, 10);
        initializeGame(numPlayers);
    }
});
});

