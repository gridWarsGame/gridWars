'use strict';

function makeGridTable(size) {

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

function Coord () {
  //the default is unseen; once coordinate is picked, status ==== hit || miss.
  this.status = 'unseen';
  this.sub = false;
}

function GameBoard() {
  this.grid = [];
  this.setupBoard();
}

GameBoard.prototype.updateBoard = function () {

};

GameBoard.prototype.setupBoard = function () {
  this.createGrid(4);
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

GameBoard.prototype.addSub = function (x,y) {
  //subtract one so that grid coordinates start at 1.
  this.grid[x - 1][y - 1].sub = true;
};

GameBoard.prototype.guessed = function (x,y) {
  //subtract one so that grid coordinates start at 1.
  return this.grid[x - 1][y - 1].checkSub();
};

var board = new GameBoard();
makeGridTable(4);
