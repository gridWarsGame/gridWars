'use strict';

// function declarations

function fireMissles (event) {
  if (count === 0) {
    alert('You Lose!');
    fire.removeEventListener('submit', fireMissles);
  }
  event.preventDefault();
  event.stopPropagation();
  var x = parseInt(event.target.x.value);
  var y = parseInt(event.target.y.value);
  player.attack(x, y);
  count--;
  console.log(count);
}


function makeGridTable(board) {
  var size = board.size;
  var domTarget = document.getElementById('grid_table');
  var table = document.createElement('table');

  for (var i = 0; i < size; i++) {
    var row = document.createElement('tr');

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


// Coord object constructor and method

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
  if (this.sub){
    this.status = 'hit';
    this.squareRef.textContent = 'X';
    return true;
  }
  this.status = 'miss';
  this.squareRef.textContent = 'O';
  return false;
};


// GameBoard object constructor and method

function GameBoard(size) {
  if (localStorage.getItem('board') === null){
    this.size = size;
    this.grid = [];
    this.setupBoard(size);
    this.save();
    console.log('being created');
  }else {
    console.log('being restored');
    this.restore();
    this.setupBoard(size);
  }
}

GameBoard.prototype.addSub = function (x, y) {
  //subtract one so that grid coordinates start at 1.
  this.grid[x][y].sub = true;
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

GameBoard.prototype.guessed = function (x,y) {
  //subtract one so that grid coordinates start at 1.
  return this.grid[x - 1][y - 1].checkSub();
};

GameBoard.prototype.restore = function(){
  var boardProps = JSON.parse(localStorage.getItem('board'));
  for (var key in boardProps) {
    if (boardProps.hasOwnProperty(key)) {
      this[key] = boardProps[key];
    }
  }
};

GameBoard.prototype.save = function() {
  localStorage.setItem('board', JSON.stringify(this));
};


GameBoard.prototype.setupBoard = function (size) {
  this.createGrid(size);
};

GameBoard.prototype.updateBoard = function () {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      // var status = this.grid[i][j].status ;
      // var squareRef = this.grid[i][j].squareRef;
      if(this.grid[i][j].status === 'miss'){
        this.grid[i][j].squareRef.textContent = 'O';
      }else if(this.grid[i][j].status === 'hit'){
        this.grid[i][j].squareRef.textContent = 'X';
      }
    }
  }
};


// Sub object constructor and method

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

Sub.prototype.addToBoard = function() {
  // setting physical location of sub on board.
  var x = this.location[0];
  var y = this.location[1];
  for (var i = 0; i < this.length; i++) {
    console.log(x,y);
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

Sub.prototype.restore = function(){
  var subProps = JSON.parse(localStorage.getItem('sub'));
  for (var key in subProps) {
    if (subProps.hasOwnProperty(key)) {
      this[key] = subProps[key];
    }
  }
};

Sub.prototype.save = function() {
  localStorage.setItem('sub', JSON.stringify(this));
};


// Player object constructor and method

function Player() {
  if (localStorage.getItem('player') === null) {
    this.name = name;
    this.score = score;
    this.turns = [];
    this.save();
  }else {
    this.restore();
  }
}

Player.prototype.attack = function(x, y) {
  var result = board.guessed(x, y);
  board.save();
  if(result === true) {
    // Game Over!
    sub.hit();
    alert('Hit!');
    player.updateScore();
    if(sub.alive === false) {
      alert('You destroyed the sub!');
      player.updateScore();
      fire.removeEventListener('submit', fireMissles);
    }
  } else {
    alert('Miss!');
  }
  this.turns.push([x, y]);
  this.save();
};

Player.prototype.restore = function(){
  var playerProps = JSON.parse(localStorage.getItem('player'));
  for (var key in playerProps) {
    if (playerProps.hasOwnProperty(key)) {
      this[key] = playerProps[key];
    }
  }
};

Player.prototype.save = function() {
  localStorage.setItem('player', JSON.stringify(this));
};

Player.prototype.updateScore = function() {
  score = count;
  total += score;
  var scoreboard = document.getElementById('scoreboard');
  scoreboard.textContent = total;
};


// program flow

var board = new GameBoard(10);
makeGridTable(board);
board.updateBoard();
var score = 0;
var sub = new Sub(3);
var count = 10;
var total = 0;

var player = new Player();

var fire = document.getElementById('fire');
fire.addEventListener('submit', fireMissles);
