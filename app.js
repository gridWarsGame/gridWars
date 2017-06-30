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

  for (var i = 0; i < 5; i++) {
    localStorage.removeItem('sub' + i);
  }

});

// functions declarations

function makeGridTable(board) {

  var size = board.size;

  var domTarget = document.getElementById('grid_table');
  var table = document.createElement('table');

  for (var i = 0; i <= size; i++){
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
  try {
    var x = parseInt(event.target.x.value);
    var y = parseInt(event.target.y.value);
    player.attack(x, y);
  } catch (e) {
    alert('Enter a coordinate...');
  }
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
    this.subList = [];
  }
}

Coord.prototype.checkSub = function () {
  if (this.status == 'unseen') {
    if (this.sub){
      this.status = 'hit';
      this.squareRef.textContent = 'X';

      feedback.textContent = 'Hit!';

      var subList = this.subList;
      console.log('Subs Hit: ' + subList);

      for (var i = 0; i < subList.length; i++) {
        player.updateScore();
        subArray[subList[i]].hit();
        subArray[subList[i]].save(subList[i]);
      }
      return true;
    }
    feedback.textContent = 'Miss!';
    this.squareRef.textContent = 'O';
    count--;
    localStorage.setItem('count', count);
    turn.textContent = 'Misses left: ' + count;
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

GameBoard.prototype.showSubs = function () {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {

      var subTrueFalse = this.grid[i][j].sub;
      var squareRef = this.grid[i][j].squareRef;
      if (subTrueFalse){
        squareRef.textContent = 'X';
      }
    }
  }
};

GameBoard.prototype.hideUnseenSubs = function () {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {

      var subTrueFalse = this.grid[i][j].sub;
      var squareRef = this.grid[i][j].squareRef;
      var status = this.grid[i][j].status;
      if (subTrueFalse && status === 'unseen'){
        squareRef.textContent = ' ';
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

GameBoard.prototype.addSub = function (x, y, index) {
  //subtract one so that grid coordinates start at 1.
  this.grid[x][y].sub = true;
  this.grid[x][y].subList.push(index);
};

GameBoard.prototype.guessed = function (x,y) {
  //subtract one so that grid coordinates start at 1.
  return this.grid[x - 1][y - 1].checkSub();
};


// Sub constructor

function Sub(length) {
  this.alive = true;
  this.length = length;
  this.lifePoints = this.length;
  this.orientation = this.getOriention();
  this.location = this.getLocation();
  this.shown = false;
}

Sub.prototype.save = function(suffix) {
  localStorage.setItem('sub' + suffix, JSON.stringify(this));
};

Sub.prototype.restore = function(suffix){
  var subProps = JSON.parse(localStorage.getItem('sub' + suffix));
  for (var key in subProps) {
    if (subProps.hasOwnProperty(key)) {
      this[key] = subProps[key];
    }
  }
  return this;
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
};

Sub.prototype.addToBoard = function(index) {
  // setting physical location of sub on board.
  var x = this.location[0];
  var y = this.location[1];
  for (var i = 0; i < this.length; i++) {
    console.log('Sub Coords: [' + (x+1) + ', ' + (y+1) + ']');
    board.addSub(x, y, index);
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
    for (var i = 0; i < subArray.length; i++){
      var sub = subArray[i];
      if(sub.alive === false && sub.shown == false) {
        alert('You destroyed a sub!');
        sub.shown = true;
      }
    }
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

Player.prototype.updateScore = function () {
  this.score++;
};

// Program flow

var board = new GameBoard(10);
makeGridTable(board);
board.updateBoard();

var subArray = [];

for (var i = 0; i < 5; i++) {
  var sub = new Sub(4);
  if (localStorage.getItem('sub' + i) === null) {
    sub.addToBoard(i);
    sub.save(i);
  }
  else {
    sub.restore(i);
  }
  subArray.push(sub);
}

var count;

if (localStorage.getItem('count') === null)
  count = 10;
else {
  count = localStorage.getItem('count');
}
turn.textContent = 'Misses left: ' + count;

var player = new Player();

if (localStorage.getItem('playerName') === null){
  player.getName();
} else {
  player.name = localStorage.getItem('playerName');
}
