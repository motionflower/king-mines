let diamondsAndBombs = [];
let betSettings = document.querySelector(`#betsettings`);
let balance = parseFloat(localStorage.getItem('balance')) || 10;
let bombClicked = false; 
let cashoutClicked = false;
let nprofitElement = document.querySelector(`.nprofit`);
let multCurrentDisplayed = document.querySelector(`.multcurrent`);
let cashoutButtonDisplay = document.querySelector(`.cashoutamount`);
let multNextDisplayed = document.querySelector(`.multnext`);
let cashoutbutton = document.getElementById(`cashout`);
let resetbutton = document.getElementById(`resetbalance`);
const cashoutpopup = document.getElementById("cashoutpopup");

var betbutton = document.getElementById("startgame");
var boxes = document.querySelectorAll('.box');

let nprofit = 0;
// Define the exponential base

function toggleBar() {
  const slidingBar = document.getElementById("sliding-bar");
  if (slidingBar.style.width === "0px" || slidingBar.style.width === "") {
      slidingBar.style.width = "400px"; // Adjust the width as needed
  } else {
      slidingBar.style.width = "0";
  }
}

function updateBalanceInLocalStorage() {	
  localStorage.setItem('balance', balance.toString());	
}

function updateUIBalance() {
  document.querySelector('.totalamount').textContent = balance.toFixed(2);
}


resetbutton.addEventListener("click", function() {
  balance = 100;
  console.log(`balance reset`, balance);
  updateBalanceInLocalStorage();
  updateUIBalance();
});

// Function to update nprofit with the actual profit value
function updateProfit(profit) {
  nprofit = profit;
  nprofitElement.textContent = nprofit.toString();
}

document.addEventListener("DOMContentLoaded", function() {


  balance = parseFloat(localStorage.getItem('balance')) || 10;
  console.log(`balance when reload`, balance);
  updateUIBalance();

  betbutton.addEventListener("click", function(event) {
    bombClicked = false; 
    cashoutClicked = false; 
    
    const betAmount = document.getElementById(`betamount`);
    
    if (parseInt(betAmount.value) > balance) {
      alert(`not enough balance`);
      event.preventDefault();
      return;
    }
    else {
      balance -= betAmount.value.trim();
      updateUIBalance();
      updateBalanceInLocalStorage();
    }

    console.log(`balance`, balance);
  
    if (betAmount.value.trim() === "") {
      return;
    }

    if (betAmount.value == 0) {
      alert(`value can't be 0`);
      event.preventDefault();
      return;
    }
    
    //disable betbutton
    betbutton.disabled = true;

    //enable cashoutbutton again
    cashoutbutton.disabled = false;
    
    const difficulty = document.getElementById(`mines`);
    const generatedArray = generateArray();
    const position = findPositions(generatedArray);
    let profit = parseInt(betAmount.value);

    function revealAllTiles() {
      boxes.forEach(function (box, i) {
        const tileValue = generatedArray[i];
    
        setTimeout(() => {
          if (tileValue === 0) {
            box.classList.add('gold'); // Add a class to display gold
          } else if (tileValue === 1) {
            box.classList.add('bomb'); // Add a class to display bombs
          }
    
          setTimeout(() => {
            box.classList.remove('greyed-out');
          }, 1000); // Adjust the class removal delay as needed
        }, i * 20); // Adjust the delay between tile reveals as needed
      });
    }

    console.log(`generated array`, generatedArray);

    boxes.forEach(function(box) {
      box.classList.remove('greyed-out');
      box.classList.remove('gold');
      box.classList.remove('bomb');
    });

    let goldspots = 25 - difficulty.value;
    console.log(`goldspots`, goldspots);

    // Function to generate an array with a certain number of bombs
    function generateArray() {
      const array = Array(25).fill(0); // Fill the array with 25 zeros
      for (let i = 0; i < difficulty.value; i++) {
        let index = Math.floor(Math.random() * array.length);
        while (array[index] === 1) {
          // Generate a new index if the current one already contains 1
          index = Math.floor(Math.random() * array.length);
        }
        array[index] = 1; // Set the element at the random index to 1
      }
      return array;
    }
    
    // check on what positions of the generated array, the number 1 is contained
    function findPositions(array) {
      const positions = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i] === 1) {
          positions.push(i);
        }
      }
      return positions;
    }
    
    // put a question mark on the divs that should have the bomb
    // also will display a bomb and grey out betbutton and div again 
    // position.forEach(position => {
    //   if (position >= 0 && position < boxes.length) {
    //     boxes[position].textContent = `?`;
    //   }
    // });  

    let multiplier = 1; // Initial multiplier of clicking a bomb

    let growthBase = 1;

    //set multiplier based on difficulty
    if (difficulty.value == 5) {
      growthBase = 1.05;
    }
    else if (difficulty.value == 10) {
      growthBase = 1.5;
    }
    else if (difficulty.value == 15) {
      growthBase = 2;
    }
    else if (difficulty.value == 20) {
      growthBase = 6;
    }
    else if (difficulty.value == 24) {
      growthBase = 100;
    }

    console.log(`growth`, growthBase);

    // Variable to keep track of the exponent
    let exponent = 1;

    // function to calculate multiplier
    function clickGoldTile() {
      // Update the multiplier exponentially
      multiplier *= Math.pow(growthBase, exponent);
      exponent++; // Increment the exponent for the next click
      
      // Return the updated multiplier
      return multiplier;
    }
    
    // Example usage:
    console.log("Initial multiplier: " + multiplier); // Initial multiplier

    cashoutbutton.addEventListener("click", function() {
  if (nprofit > 0) {
    cashoutClicked = true;
    // Assuming you have the initial balance stored in the `balance` variable
    console.log(`nprofit`, nprofit);
    console.log(`balance`, balance);
    balance += nprofit;
    updateBalanceInLocalStorage();
  
    console.log(`cashout balance`, balance);
    
    // Update the .totalamount element with the new balance
    updateUIBalance();
    revealAllTiles();
    
    multCurrentDisplayed.innerHTML = 0;
    cashoutButtonDisplay.innerHTML = nprofit;
    
    console.log(cashoutButtonDisplay);
    
    if (cashoutpopup.style.display === "block") {
      cashoutpopup.style.display = "none"; // Hide the cashoutpopup
    } else {
      cashoutpopup.style.display = "block"; // Show the cashoutpopup
      setTimeout(() => {
          cashoutpopup.style.display = "none"; // Hide the cashoutpopup after 3 seconds
      }, 3000); // Change to 3000 milliseconds (3 seconds)
    }
  
    // Reset the nprofit to 0 after cashing out
    nprofitElement.innerHTML = "0";
    betbutton.disabled = false;
    cashoutbutton.disabled = true;
  }
  nprofit = 0;
});

    //when clicking on box, check array position 
    boxes.forEach((box, index) => {
      const clickHandler = () => {
  
          if (bombClicked) {
              return; // Exit the click handler if a bomb has already been clicked
          }
  
          if (cashoutClicked) {
              return; // Exit the click handler if the cashout has already been clicked
          }
  
          const value = generatedArray[index];
  
          console.log(`generated array 1`, generatedArray[index]);
  
        if (value === 1) {
          box.classList.add('bomb');
          bombClicked = true;
          boxes.forEach(function(box) {
            box.classList.add('greyed-out');
            box.removeEventListener('click', clickHandler);
            //reveal all spots
          });
          revealAllTiles();
          betbutton.disabled = false;
          cashoutbutton.disabled = true;
          profit = 0;
          nprofitElement.innerHTML = profit;
          multCurrentDisplayed.innerHTML = 0;
          multNextDisplayed.innerHTML = 0;

          // make grid not clickable
          boxes.forEach((tile) => {
            tile.removeEventListener('click', clickHandler);
          });

        } else if (value === 0) {
          box.classList.add('gold');
          box.removeEventListener('click', clickHandler); // Remove the click event listener
          multiplier = clickGoldTile();
          profit = (Math.round(betAmount.value.trim() * multiplier * 100) / 100);
          updateProfit(profit); 
          console.log(`profit`, profit);

          if (multiplier < 10) {
            multCurrentDisplayed.innerHTML = (Math.round(multiplier * 100) / 100) + `x`;
            // multNextDisplayed.innerHTML = (Math.round(multiplier * 100) / 100) + `x`;
          }
          else {
            multCurrentDisplayed.innerHTML = Math.trunc(multiplier) + `x`;
            // multNextDisplayed.innerHTML = (Math.trunc(multiplier) + `x`;
          }

          console.log("After Click " + multiplier);

        }
      };
      box.addEventListener('click', clickHandler);
    });
    });
  });

  