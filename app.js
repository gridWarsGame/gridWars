'use strict';

function makeGridTable(size) {
  var refSquares = [];

  var domTarget = document.getElementById('grid_table');
  var table = document.createElement('table');

  for (var i = 0; i < size; i++) {
    var row = document.createElement('tr');
    var refRow = [];

    for (var j = 0; j < size; j++) {
      var square = document.createElement('td');
      square.textContent = '—';
      refRow.push(square);
      row.appendChild(square);
    }

    refSquares.push(refRow);
    table.appendChild(row);
  }

  domTarget.appendChild(table);

  return refSquares;
}

function GameBoard() {
  this.grid = [];
}

GameBoard.prototype.updateBoard = function () {

};
GameBoard.prototype.setupBoard = function () {

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
    return true;
  }
  this.status = 'miss';
  return false;
};
