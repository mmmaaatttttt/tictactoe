var state;

$(function() {
  state = initializeGame();
  var $container = $(".container");
  convertToBoard($container);
  $container.on("click", handleClick);
});

/**
 * Set up the initial game state from a fresh object
 */
function initializeGame() {
  var defaultBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  var defaultState = {
    currentPlayer: "X",
    turn: 0,
    over: false,
    board: defaultBoard
  };

  return defaultState;
}

/**
 * Determine whose turn it is based on the last turn
 * @param {String} lastTurn - 'X' or 'O', the last player to take a turn
 */
function setTurn(lastTurn) {
  if (lastTurn === "X") {
    return "O";
  }
  return "X";
}

/**
 * Check if an event target is an eligible game node,
 *   if so, execute a player's turn
 * @param {Object} cell - a tic-tac-toe cell (div)
 */
function playTurn($cell) {
  if ($cell.text() === "") {
    $cell.text(state.currentPlayer);
    state.turn++;
    var coordinates = $cell.attr("id").split("|");
    var row = coordinates[0];
    var col = coordinates[1];
    state.board[row][col] = state.currentPlayer;
  }
}

/**
 * Covert the divs to a 2-dimensional array
 * @param {Node} container - a dom node container holding the board of divs
 */
function convertToBoard($container) {
  var $columns = $container.children();
  $columns.each(function(i, col) {
    $(col)
      .children()
      .attr("id", function(j) {
        return j + "|" + i;
      })
      .addClass("cell");
  });
}

/**
 * A function that takes three slots and checks for 
 *   equality to determine a win or not
 * @param {Any} slot1
 * @param {Any} slot2
 * @param {Any} slot3
 */
function hasWinner(slot1, slot2, slot3) {
  if (slot1 === null || slot2 === null || slot3 === null) {
    return false;
  }
  return slot1 === slot2 && slot2 === slot3;
}

/**
 * An algorithm that takes a 2-dimensional array and checks for winning positions
 * @param {Array} board - a 2-dimensional (3x3) array
 */
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

/**
 * Event handler callback for returning the game to a new initial state
 * @param {Object} event - a DOM event object
 */
function resetGame(event) {
  var $cells = $(".cell");
  $cells.text("");
  state = initializeGame();
  setTimeout(function() {
    var $startOverButton = $(".startOver");
    $startOverButton.remove();
  }, 1);
}

/**
 * Create a new button used to start the game over
 */
function addStartOverButton() {
  var $container = $(".container");
  var $button = $("<button>")
    .text("Start Over")
    .addClass("startOver")
    .on("click", resetGame);
  $container.append($button);
}

/**
 * A function that checks the board after each turn 
 *  to see if there are any winners or if it's a draw
 *  and then call other helper functions to manage the gameOver
 */
function processResult() {
  if (didWin(state.board)) {
    alert(state.currentPlayer + " wins!");
    state.over = true;
    addStartOverButton();
  } else if (state.turn === 9) {
    alert("It's a draw...");
    addStartOverButton();
    return;
  }
  state.currentPlayer = setTurn(state.currentPlayer);
}

/**
 * Click handler for allowing players to take turns
 * @param {Object} event - a DOM click event
 */
function handleClick(event) {
  var $node = $(event.target);
  if ($node.parent().hasClass("column") && !state.over) {
    playTurn($node);
    processResult();
  }
}
