'use strict';

var gameStart = {},
  gameSpeed = {},
  gameArea = {},
  gameAreaContext = {},
  snake = [],
  gameAreaWidth = 0,
  gameAreaHeight = 0,
  cellWidth = 0,
  playerScore = 0,
  snakeFood = {},
  snakeDirection = '',
  directionLeft = {},
  directionright = {},
  directionup = {},
  directiondown = {},
  speedSize = 0,
  timer = {};

function initElement() {
  gameStart = document.querySelector('#gameStart');
  gameSpeed = document.querySelector('#gameSpeed');
  gameArea = document.querySelector('#gameArea');
  directionLeft = document.querySelector('#left');
  directionright = document.querySelector('#right');
  directionup = document.querySelector('#up');
  directiondown = document.querySelector('#down');

  gameAreaContext = gameArea.getContext('2d');
  gameAreaWidth = 600;
  gameAreaHeight = 600;
  cellWidth = 20;
  gameArea.width = gameAreaWidth;
  gameArea.height = gameAreaHeight;
}

function createFood() {
  snakeFood = {
    x: Math.round(Math.random() * (gameAreaWidth - cellWidth) / cellWidth),
    y: Math.round(Math.random() * (gameAreaHeight - cellWidth) / cellWidth),
  };
}

function control(x, y, array) {
  for (var index = 0, length = array.length; index < length; index++) {
    if (array[index].x == x && array[index].y == y) return true;
  }
  return false;
}

function writeScore() {
  gameAreaContext.font = '50px sans-serif';
  gameAreaContext.fillStyle = '#FF0000';
  gameAreaContext.fillText('Score: ' + playerScore, (gameAreaWidth / 2) - 100, gameAreaHeight / 2);
}

function createSquare(x, y) {
  gameAreaContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}

function createGameArea() {
  var snakeX = snake[0].x;
  var snakeY = snake[0].y;

  gameAreaContext.fillStyle = '#FFFFFF';
  gameAreaContext.fillRect(0, 0, gameAreaWidth, gameAreaHeight);

  gameAreaContext.strokeStyle = '#000000';
  gameAreaContext.strokeRect(0, 0, gameAreaWidth, gameAreaHeight);

  snakeFood.fillStyle = '#000000';

  if (snakeDirection == 'right') {
    snakeX++;
  } else if (snakeDirection == 'left') {
    snakeX--;
  } else if (snakeDirection == 'down') {
    snakeY++;
  } else if (snakeDirection == 'up') {
    snakeY--;
  }

  if ((snakeX == -1) || (snakeX == gameAreaWidth / cellWidth) || (snakeY == -1) || (snakeY == gameAreaHeight / cellWidth) || control(snakeX, snakeY, snake)) {
    writeScore();
    clearInterval(timer);
    gameStart.disabled = false;
    return;
  }

  if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
    var newHead = { x: snakeX, y: snakeY };
    playerScore += speedSize;
    createFood();
  } else {
    var newHead = snake.pop();
    newHead.x = snakeX;
    newHead.y = snakeY;
  }

  snake.unshift(newHead);

  for (var index = 0, length = snake.length; index < length; index++) {
    gameAreaContext.fillStyle = '#00ff40';
    createSquare(snake[index].x, snake[index].y);
  }

  gameAreaContext.fillStyle = '#FF0000';
  createSquare(snakeFood.x, snakeFood.y);
}

function startGame() {
  snake = [];
  snake.push({ x: 0, y: cellWidth });

  createFood();

  clearInterval(timer);
  timer = setInterval(createGameArea, 1000 / speedSize);
}

function onStartGame() {
  this.disabled = true;

  playerScore = 0;
  snakeDirection = 'right';
  speedSize = parseInt(gameSpeed.value);

  if (speedSize > 20) {
    speedSize = 20;
  } else if (speedSize < 0) {
    speedSize = 1;
  }

  startGame();
}

function changeDirection(e) {
  var keys = e.which;
  if ((keys == '40' || e.currentTarget.defaultValue == 'down') && snakeDirection != 'up') snakeDirection = 'down';
  else if ((keys == '39' || e.currentTarget.defaultValue == 'right') && snakeDirection != 'left') snakeDirection = 'right';
  else if ((keys == '38' || e.currentTarget.defaultValue == 'up') && snakeDirection != 'down') snakeDirection = 'up';
  else if ((keys == '37' || e.currentTarget.defaultValue == 'left' ) && snakeDirection != 'right') snakeDirection = 'left';

}

function changeDirectionButton(e) {
  if (e == 'left') snakeDirection = 'left';
}

function initEvent() {
  gameStart.addEventListener('click', onStartGame);
  directionLeft.addEventListener('click', changeDirection);
  directionright.addEventListener('click', changeDirection);
  directionup.addEventListener('click', changeDirection);
  directiondown.addEventListener('click', changeDirection);
  window.addEventListener('keydown', changeDirection);
}

function init() {
  initElement();
  initEvent();
}

window.addEventListener('DOMContentLoaded', init);
