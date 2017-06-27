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
      square.textContent = '-';
      refRow.push(square);
      row.appendChild(square);
    }

    refSquares.push(refRow);
    table.appendChild(row);
  }

  domTarget.appendChild(table);

  return refSquares;
}
