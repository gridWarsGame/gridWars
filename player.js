'use strict';
var score = 0;

function Sub() {
  this.alive = true;
  this.location = getLocation();
}

Sub.prototype.addToBoard = function() {
  // setting physical location of sub on board.
};

Sub.prototype.getLocation = function() {
  var x = Math.floor(Math.random() * 3);
  var y = Math.floor(Math.random() * 3);
  return x, y;
};

function Player() {
  this.name = name;
  this.score = score;
  this.turns = [];
}

Player.prototype.attack = function(coordinates) {
  var result = Board.grid[coordinates[0]][coordinates[1]].guessed();
  if(result === true) {
    // Game Over!
    this.sub.alive = false;
    alert('You Win!');
  } else {
    turns.push(coordinates);
    alert('Miss!');
  }
};

Player.prototype.updateScore = function() {

};
