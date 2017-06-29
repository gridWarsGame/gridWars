
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5', 'Game 6', 'Game 7'],
    datasets: [{
      label: 'gridWarrior',
      data: [1, 9, 3, 4, 6, 3, 7],
      backgroundColor: "rgba(153,255,51,0.4)"
    }]
  },
  options: {
    legend: {
      labels: {
        fontColor: 'red'
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          max: 15,
          min: 0,
          stepSize: 1
        }
      }]
    }
  }
});