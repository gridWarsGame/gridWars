'use strict';

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

GameBoard.prototype.addSub = function (x,y) {
  //subtract one so that grid coordinates start at 1.
  this.grid[x - 1][y - 1].sub = true;
};

function Coord () {
  //the default is unseen; once coordinate is picked, status ==== hit || miss.
  this.status = 'unseen';
  //this tells whether there is a sub at this location.
  this.sub = false;
}

Coord.prototype.guessed = function () {
  if (this.sub){
    this.status = 'hit';
    return true;
  }
  this.status = 'miss';
  return false;
};
