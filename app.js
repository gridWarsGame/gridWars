'use strict';

var board = new GameBoard();

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

function GameBoard() {
  this.grid = [];
  this.setupBoard();
}

GameBoard.prototype.updateBoard = function () {

};
GameBoard.prototype.setupBoard = function () {
  this.createGrid(5);
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

function Coord () {
  //the default is unseen; once coordinate is picked, status ==== hit || miss.
  this.status = 'unseen';
  this.sub = false;
}

Coord.prototype.guess = function () {
  if (this.sub){
    this.status = 'hit';
    this.squareRef.textContent = 'X';
    return true;
  }
  this.status = 'miss';
  this.squareRef.textContent = 'O';
  return false;
};
