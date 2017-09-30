

function initializeGame() {
  var defaultBoard = [[null, null, null], [null, null, null], [null, null, null]];
  var defaultState = {
    currentPlayer: 'X',
    turn: 0,
    over: false,
    board: defaultBoard
  };
  
  return defaultState;
}

var state = initializeGame();
var container = document.querySelector('.container');
convertToBoard(container);
container.addEventListener('click', handleClick);

function setTurn(lastTurn) {
  if (lastTurn === 'X') {
    return 'O';
  }
  return 'X';
}

/**
 * Check if an event target is an eligible game node,
 *   if so, execute a player's turn
 * @param {Object} cell - a tic-tac-toe cell (div)
 */
function playTurn(cell) {
  if (cell.innerText === '') {
    cell.innerText = state.currentPlayer;
    state.turn++;
    var coordinates = cell.id.split('|');
    var row = coordinates[0];
    var col = coordinates[1];
    state.board[row][col] = state.currentPlayer;
  }
}

function convertToBoard(container) {
  var columns = container.children;
  for (let colIdx = 0; colIdx < 3; colIdx++) {
    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
      container.children[colIdx].children[rowIdx].id = `${rowIdx}|${colIdx}`;
      container.children[colIdx].children[rowIdx].className = 'cell';
    }
  }
}

function hasWinner(slot1, slot2, slot3) {
  if (slot1 === null || slot2 === null || slot3 === null) {
    return false;
  }
  return slot1 === slot2 && slot2 === slot3;
}

function didWin(board) {
  /* check rows and colums */
  for (let i = 0; i < board.length; i++) {
    // rows
    if (hasWinner(board[i][0], board[i][1], board[i][2])) {
      return true;
    }
    // columns
    if (hasWinner(board[0][i], board[1][i], board[2][i])) {
      return true;
    }
  }

  /* check diagonals */

  // left to right diagonal
  if (hasWinner(board[0][0], board[1][1], board[2][2])) {
    return true;
  }

  // right to left diagonal
  if (hasWinner(board[0][2], board[1][1], board[2][0])) {
    return true;
  }

  // if we haven't found a winner by here there is no winner
  return false;
}

function resetGame(event) {
  var cells = document.querySelectorAll('.cell');
  cells.forEach(function(cell) {
    cell.innerText = '';
  });
  state = initializeGame();
  setTimeout(function() {
    var startOverButton = document.querySelector('.startOver');
    startOverButton.remove();
  }, 1);
}

function addStartOverButton() {
  var container = document.querySelector('.container');
  var button = document.createElement('button');
  button.innerText = 'Start Over';
  button.className = 'startOver';
  button.addEventListener('click', resetGame);
  container.appendChild(button);
}

function processResult() {
  if (didWin(state.board)) {
    alert(`${state.currentPlayer} wins!`);
    state.over = true;
    addStartOverButton();
  } else if (state.turn === 9) {
    alert("It's a draw...");
    addStartOverButton();
    return;
  }
  state.currentPlayer = setTurn(state.currentPlayer);
}

function handleClick(event) {
  var node = event.target;
  if (node.parentNode.className === 'column' && !state.over) {
    playTurn(node);
    processResult();
  }
}
