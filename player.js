'use strict';
var score = 0;

function Sub() {
  this.alive = true;
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
  if(!sub) {
    alert('Miss!');
    turns.push(coordinates);
  } else {
    // Game Over!
  }
};

Player.prototype.updateScore = function() {

};
