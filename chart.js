
var score;
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5', 'Game 6', 'Game 7'],
    datasets: [{
      label: 'gridWarrior',
      data: score,
      backgroundColor: "rgba(153,255,51,0.4)"
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          max: 20,
          min: 0,
          stepSize: 1
        }
      }]
    }
  }
});
