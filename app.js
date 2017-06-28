'use strict';

function makeGridTable(board) {

  var size = board.size;

  var domTarget = document.getElementById('grid_table');
  var table = document.createElement('table');

  for (var i = 0; i < size; i++) {
    var row = document.createElement('tr');

    for (var j = 0; j < size; j++) {
      var square = document.createElement('td');
      square.textContent = '—';

      row.appendChild(square);
      board.addRef(i,j,square);

    }
    table.appendChild(row);
  }
  domTarget.appendChild(table);
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

function GameBoard(size) {
  this.size = size;
  this.grid = [];
  this.setupBoard(size);
}

GameBoard.prototype.updateBoard = function () {

};

GameBoard.prototype.setupBoard = function (size) {
  this.createGrid(size);
};

GameBoard.prototype.addRef = function (i,j,ref) {
  this.grid[i][j].squareRef = ref;
};

//make table
GameBoard.prototype.createGrid = function (size) {
  for (var i = 0; i < size; i++) {
    var row = [];
    for (var j = 0; j < size; j++) {
      row.push(new Coord());
    }
    this.grid.push(row);
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

function Coord () {
  //the default is unseen; once coordinate is picked, status ==== hit || miss.
  this.status = 'unseen';
  //this tells whether there is a sub at this location.
  this.sub = false;
}

var board = new GameBoard(5);
makeGridTable(board);

// paste from player.js
var score = 0;

function Sub(length) {
  this.alive = true;
  this.length = length;
  this.lifePoints = this.length;
  this.orientation = this.getOriention();
  this.location = this.getLocation();
  this.addToBoard();
}

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
};

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

var sub = new Sub(3);

function Player() {
  this.name = name;
  this.score = score;
  this.turns = [];
}

Player.prototype.attack = function(x, y) {
  var result = board.guessed(x, y);
  if(result === true) {
    // Game Over!
    sub.hit();
    alert('Hit!');
    if(sub.alive === false) {
      alert('You destroyed the sub!');
    }
  } else {
    alert('Miss!');
  }
  this.turns.push([x, y]);
};

Player.prototype.updateScore = function() {

};

var player = new Player();

var fire = document.getElementById('fire');
fire.addEventListener('submit', function(event) {
  event.preventDefault();
  event.stopPropagation();
  var x = parseInt(event.target.x.value);
  var y = parseInt(event.target.y.value);
  player.attack(x, y);
});
