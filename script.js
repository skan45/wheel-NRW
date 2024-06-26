const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];

// Challenge names corresponding to each value
const challengeNames = {
  1: "Run a Marathon",
  2: "Read a Book",
  3: "Cook a New Recipe",
  4: "Learn a New Language",
  5: "Take a Trip",
  6: "Start a Blog"
};

// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
var pieColors = [
  "#8B4513",
  "#D2B48C",
  "#8B4513",
  "#D2B48C",
  "#8B4513",
  "#D2B48C",
];

// Create chart
let myChart = new Chart(wheel, {
  // Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  // Chart Type Pie
  type: "pie",
  data: {
    // Labels(values which are to be displayed on chart)
    labels: [1, 2, 3, 4, 5, 6],
    // Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    // Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      // Hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      // Display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

// Check if the arrow is on the border line
const isOnBorder = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue === i.minDegree || angleValue === i.maxDegree) {
      return true;
    }
  }
  return false;
};

// Display value based on the randomAngle
const valueGenerator = (angleValue) => {
  if (isOnBorder(angleValue)) {
    spinAgain();
    return;
  }

  for (let i of rotationValues) {
    // If the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const challengeName = challengeNames[i.value];
      Swal.fire({
        title: "Congratulations!",
        text: `You got "${challengeName}". Do you want to accept this challenge?`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          finalValue.innerHTML = `<p>Challenge "${challengeName}" Accepted!</p>`;
        } else {
          spinAgain();
        }
      });
      spinBtn.disabled = false;
      break;
    }
  }
};

// Spinner count
let count = 0;
// 100 rotations for animation and last rotation for result
let resultValue = 101;

// Function to start the spinning
const startSpinning = () => {
  spinBtn.disabled = true;
  // Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  // Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    // Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    // Update chart with new value
    myChart.update();
    // If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
};

// Function to trigger spin again
const spinAgain = () => {
  setTimeout(startSpinning, 500);
};

// Start spinning when button is clicked
spinBtn.addEventListener("click", startSpinning);
