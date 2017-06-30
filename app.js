'use strict';

// DOM interaction code

var currentScore = document.getElementById('current_score');

var fire = document.getElementById('fire');
fire.addEventListener('submit', fireMissles);

var feedback = document.getElementById('feedback');
var turn = document.getElementById('turn');

var resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', function() {
  location.reload();
  localStorage.removeItem('board');
  localStorage.removeItem('sub');
  localStorage.removeItem('player');
});

// functions declarations

function makeGridTable(board) {

  var size = board.size;

  var domTarget = document.getElementById('grid_table');
  var table = document.createElement('table');

  table.appendChild(document.createElement('th'));
  
  for (var i = 1; i <= size; i++){
    var th = document.createElement('th');
    th.textContent = i;
    table.appendChild(th);
  }

  for (i = 0; i < size; i++) {
    var row = document.createElement('tr');

    var rowHeader = document.createElement('th');
    rowHeader.textContent = i+1;
    row.appendChild(rowHeader);

    for (var j = 0; j < size; j++) {
      var square = document.createElement('td');
      square.textContent = ' ';

      row.appendChild(square);
      board.addRef(i,j,square);

    }
    table.appendChild(row);
  }
  domTarget.appendChild(table);
}


function fireMissles (event) {
  event.preventDefault();
  event.stopPropagation();
  if (count === 0) {
    alert('You Lose!');
    fire.removeEventListener('submit', fireMissles);
    return;
  }
  var x = parseInt(event.target.x.value);
  var y = parseInt(event.target.y.value);
  player.attack(x, y);
  count--;
  turn.textContent = 'Turns left: ' + count;
}


// Object Constructors


// Coord constructor

function Coord (object) {
  if(object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        this[key] = object[key];
      }
    }
  }else {
    //the default is unseen; once coordinate is picked, status ==== hit || miss.
    this.status = 'unseen';
    //this tells whether there is a sub at this location.
    this.sub = false;
  }
}

Coord.prototype.checkSub = function () {
  if (this.status == 'unseen') {
    if (this.sub){
      this.status = 'hit';
      this.squareRef.textContent = 'X';
      return true;
    }
    this.status = 'miss';
    this.squareRef.textContent = 'O';
    return false;
  }
  else {
    alert('You need to pick a different square!');
    return false;
  }
};


// GameBoard constructor

function GameBoard(size) {
  if (localStorage.getItem('board') === null){
    this.size = size;
    this.grid = [];
    this.setupBoard(size);
    this.save();
    console.log('New game being created...');
  }else {
    console.log('Game being restored...');
    this.restore();
    this.setupBoard(size);
  }
}

GameBoard.prototype.save = function() {
  localStorage.setItem('board', JSON.stringify(this));
};

GameBoard.prototype.restore = function(){
  var boardProps = JSON.parse(localStorage.getItem('board'));
  for (var key in boardProps) {
    if (boardProps.hasOwnProperty(key)) {
      this[key] = boardProps[key];
    }
  }
};

GameBoard.prototype.updateBoard = function () {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      var status = this.grid[i][j].status ;
      var squareRef = this.grid[i][j].squareRef;

      if(status === 'miss'){
        squareRef.textContent = 'O';
      }else if(status === 'hit'){
        squareRef.textContent = 'X';
      }
    }
  }
};

GameBoard.prototype.setupBoard = function (size) {
  this.createGrid(size);
};

GameBoard.prototype.addRef = function (i,j,ref) {
  this.grid[i][j].squareRef = ref;
};

//make table
GameBoard.prototype.createGrid = function (size) {
  if(this.grid.length === 0) {
    for (var i = 0; i < size; i++) {
      var row = [];
      for (var j = 0; j < size; j++) {
        row.push(new Coord());
      }
      this.grid.push(row);
    }
  }else {
    for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++) {
        this.grid[i][j] = new Coord(this.grid[i][j]);
      }
    }
  }
};

GameBoard.prototype.addSub = function (x, y) {
  //subtract one so that grid coordinates start at 1.
  this.grid[x][y].sub = true;
};

GameBoard.prototype.guessed = function (x,y) {
  //subtract one so that grid coordinates start at 1.
  return this.grid[x - 1][y - 1].checkSub();
};


// Sub constructor

function Sub(length) {
  if (localStorage.getItem('sub') === null) {
    this.alive = true;
    this.length = length;
    this.lifePoints = this.length;
    this.orientation = this.getOriention();
    this.location = this.getLocation();
    this.save();
  } else {
    this.restore();
  }
  this.addToBoard();
}

Sub.prototype.save = function() {
  localStorage.setItem('sub', JSON.stringify(this));
};

Sub.prototype.restore = function(){
  var subProps = JSON.parse(localStorage.getItem('sub'));
  for (var key in subProps) {
    if (subProps.hasOwnProperty(key)) {
      this[key] = subProps[key];
    }
  }
};

Sub.prototype.getOriention = function() {
  var coin = Math.round(Math.random());
  if (coin) {
    return 'north-south';
  } else {
    return 'east-west';
  }
};

Sub.prototype.hit = function() {
  this.lifePoints--;
  if (this.lifePoints === 0) {
    this.alive = false;
  }
  this.save();
};

Sub.prototype.addToBoard = function() {
  // setting physical location of sub on board.
  var x = this.location[0];
  var y = this.location[1];
  for (var i = 0; i < this.length; i++) {
    console.log('Sub Coords: [' + (x+1) + ', ' + (y+1) + ']');
    board.addSub(x, y);
    if (this.orientation === 'north-south') {
      y++;
    } else {
      x++;
    }
  }
  board.save();
};

Sub.prototype.getLocation = function() {
  var offsetX = 0;
  var offsetY = 0;
  if (this.orientation === 'north-south') {
    offsetY = this.length - 1;
  } else {
    offsetX = this.length - 1;
  }
  var x = Math.floor(Math.random() * (board.size - offsetX));
  var y = Math.floor(Math.random() * (board.size - offsetY));
  return [x, y];
};

function Player() {
  if (localStorage.getItem('player') === null) {
    this.name = name;
    this.score = 0;
    this.turns = [];
    this.save();
  }else {
    this.restore();
  }
  currentScore.textContent = this.score;
}

// Player constructor

Player.prototype.save = function() {
  localStorage.setItem('player', JSON.stringify(this));
};

Player.prototype.restore = function(){
  var playerProps = JSON.parse(localStorage.getItem('player'));
  for (var key in playerProps) {
    if (playerProps.hasOwnProperty(key)) {
      this[key] = playerProps[key];
    }
  }
};

Player.prototype.attack = function(x, y) {
  var result = board.guessed(x, y);
  board.save();
  if(result === true) {
    // Game Over!
    sub.hit();
    feedback.textContent = 'Hit!';
    this.score++;
  } else {
    feedback.textContent = 'Miss!';
  }
  if(sub.alive === false) {
    alert('You destroyed the sub!');
    fire.removeEventListener('submit', fireMissles);
    result = false;
  }
  this.turns.push([x, y]);
  this.save();
  currentScore.textContent = this.score;
};

Player.prototype.getName = function () {
  this.name = prompt('Let\'s get started! What is your name?');
  player.save();
  localStorage.setItem('playerName', this.name);
};


// Program flow

var board = new GameBoard(10);
makeGridTable(board);
board.updateBoard();

var sub = new Sub(3);

var count = 10;
turn.textContent = 'Turns left: ' + count;

var player = new Player();

if (localStorage.getItem('playerName') === null){
  player.getName();
} else {
  player.name = localStorage.getItem('playerName');
}


var saveArray = [];
if ( count === 0 || sub.alive === false) {
  saveArray.push(player.score);
  localStorage.setItem('savedScore', JSON.stringify(saveArray));
}
