// Configuración inicial del juego
const BOARD_SIZE = 5;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
const INITIAL_MOVES = 12;
const TOTAL_SHIPS = 3;

// Estado dinámico del juego
let shipPositions = [];
let movesRemaining = INITIAL_MOVES;
let shipsSunk = 0;
let isGameOver = false;

// Elementos del DOM
const boardElement = document.getElementById('board');
const movesDisplay = document.getElementById('moves-count');
const shipsDisplay = document.getElementById('ships-count');
const messageDisplay = document.getElementById('game-message');
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const restartButton = document.getElementById('restart-btn');

// Inicializar Aplicación al cargar
document.addEventListener('DOMContentLoaded', initGame);
restartButton.addEventListener('click', initGame);

function initGame() {
    // 1. Resetear Variables de Estado
    movesRemaining = INITIAL_MOVES;
    shipsSunk = 0;
    isGameOver = false;
    shipPositions = [];

    // Actualizar interfaz visual de métricas
    movesDisplay.textContent = movesRemaining;
    shipsDisplay.textContent = TOTAL_SHIPS - shipsSunk;
    messageDisplay.textContent = "¡Sistemas online. Fuego a discreción!";
    messageDisplay.style.color = "#00f0ff";
    
    // Ocultar Modal de fin de juego si está activo
    modal.classList.add('hidden');

    // 2. Generar posiciones de barcos de forma aleatoria (sin duplicados)
    while (shipPositions.length < TOTAL_SHIPS) {
        const randomPos = Math.floor(Math.random() * TOTAL_CELLS);
        if (!shipPositions.includes(randomPos)) {
            shipPositions.push(randomPos);
        }
    }

    // 3. Renderizar y reconstruir el tablero estático
    boardElement.innerHTML = '';
    for (let i = 0; i < TOTAL_CELLS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        
        // Asignación de evento nativo rápido
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = parseInt(cell.dataset.index);

    // Guardas de seguridad frente al flujo del juego
    if (isGameOver) return;
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;

    // Reducir movimientos
    movesRemaining--;
    movesDisplay.textContent = movesRemaining;

    // Evaluar impacto
    if (shipPositions.includes(index)) {
        // ¡TOCADO!
        cell.classList.add('hit');
        shipsSunk++;
        shipsDisplay.textContent = TOTAL_SHIPS - shipsSunk;
        messageDisplay.textContent = "¡IMPACTO DIRECTO!";
        messageDisplay.style.color = "#ff0055";
    } else {
        // ¡AGUA!
        cell.classList.add('miss');
        cell.textContent = "X";
        messageDisplay.textContent = "Agua... Reajustando coordenadas.";
        messageDisplay.style.color = "#8a99ad";
    }

    // Comprobación de condiciones finales
    checkGameStatus();
}

function checkGameStatus() {
    if (shipsSunk === TOTAL_SHIPS) {
        endGame(true);
    } else if (movesRemaining === 0) {
        endGame(false);
    }
}

function endGame(isVictory) {
    isGameOver = true;
    
    if (isVictory) {
        modalTitle.textContent = "¡VICTORIA!";
        modalTitle.style.color = "#ffea00";
        modal.style.borderColor = "#ffea00";
        modalMessage.textContent = "Has neutralizado todas las amenazas del cuadrante con éxito. Excelente estrategia, comandante.";
    } else {
        modalTitle.textContent = "DERROTA";
        modalTitle.style.color = "#ff0055";
        modal.style.borderColor = "#ff0055";
        modalMessage.textContent = "Te has quedado sin combustible táctico. Los barcos enemigos sobrevivientes han escapado.";
        
        // Revelar posiciones restantes de los barcos enemigos en el tablero como feedback educativo
        revealEnemies();
    }

    // Mostrar el modal flotante
    modal.classList.remove('hidden');
}

function revealEnemies() {
    const cells = boardElement.getElementsByClassName('cell');
    shipPositions.forEach(pos => {
        const targetCell = cells[pos];
        if (!targetCell.classList.contains('hit')) {
            targetCell.style.border = "2px dashed #ffea00";
            targetCell.style.background = "rgba(255, 234, 0, 0.2)";
        }
    });
}
