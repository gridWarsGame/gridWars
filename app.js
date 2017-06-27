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

function Coord () {
  //the default is unseen; once coordinate is picked, status ==== hit || miss.
  this.status = 'unseen';
  this.sub = false;
}

// Coord.prototype.guessed = function () {
//   if (this.sub){
//     this.status = 'hit';
//   }
//   else{
//     this.status = 'miss';
//   }
// };

//make table
