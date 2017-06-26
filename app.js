'use strict';

function GameBoard() {
  this.grid = [];
}

GameBoard.prototype.updateBoard = function () {

};
GameBoard.prototype.setupBoard = function () {

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
