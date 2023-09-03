let diamondsAndBombs = [];
let betSettings = document.querySelector(`#betsettings`);
let balance = parseFloat(localStorage.getItem('balance')) || 10;
let bombClicked = false; 
let cashoutClicked = false;
let nprofitElement = document.querySelector(`.nprofit`);
let cashoutbutton = document.getElementById(`cashout`);

var betbutton = document.getElementById("startgame");
var boxes = document.querySelectorAll('.box');

let nprofit = 0;

function updateBalanceInLocalStorage() {	
  localStorage.setItem('balance', balance.toString());	
}

function updateUIBalance() {
  document.querySelector('.totalamount').textContent = balance.toFixed(2);
}

cashoutbutton.addEventListener("click", function() {
  // Assuming you have the initial balance stored in the `balance` variable
  balance += nprofit;
  updateBalanceInLocalStorage();

  console.log(`cashout balance`, balance);
  
  // Update the .totalamount element with the new balance
  updateUIBalance();
  
  alert('Cashed out!');

  cashoutClicked = true;

  boxes.forEach(function(box) {
    box.classList.add('greyed-out');
    box.classList.remove('gold');
    box.classList.remove('bomb');
  });

  // Reset the nprofit to 0 after cashing out
  nprofitElement.innerHTML = "0";
  betbutton.disabled = false;
  cashoutbutton.disabled = true;
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

    console.log(`difficulty`, difficulty.value);

    boxes.forEach(function(box) {
      box.classList.remove('greyed-out');
      box.classList.remove('gold');
      box.classList.remove('bomb');
    });

    // bet amount coding
    
    let goldspots = 25 - difficulty.value;
    console.log(goldspots);
    
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
    position.forEach(position => {
      if (position >= 0 && position < boxes.length) {
        boxes[position].textContent = `?`;
      }
    });

    function calculateMultiplier(minesRemaining, goldSpotsClicked, totalGoldSpots, difficultylevel) {
      // Calculate the ratio of gold spots clicked to total gold spots
      const goldSpotRatio = goldSpotsClicked / totalGoldSpots;
    
      // Calculate the ratio of mines remaining to the total mines
      const minesRatio = minesRemaining / totalGoldSpots;
    
      // Calculate the multiplier based on difficulty, gold spot ratio, and mines ratio
      const multiplier = (1 + (1 - difficultylevel)) * (1 + goldSpotRatio - minesRatio);
    
      // Ensure the multiplier is at least 1 (no negative multipliers)
      return Math.max(1, multiplier);
    }
    
    // Example usage:
    const difficultylevel = 0.5; // Adjust the difficulty as needed (between 0 and 1)
    const totalGoldSpots = goldspots; // Total number of gold spots on the field
    const minesRemaining = difficulty.value; // Number of mines remaining on the field
    const goldSpotsClicked = 0; // Number of gold spots clicked so far
    
    const multiplier = calculateMultiplier(minesRemaining, goldSpotsClicked, totalGoldSpots, difficultylevel);
    console.log(`Current Multiplier: ${multiplier}`);

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
        if (value === 1) {
          box.classList.add('bomb');
          bombClicked = true;
          boxes.forEach(function(box) {
            box.classList.add('greyed-out');
            box.removeEventListener('click', clickHandler);
          });
          alert('You lost');
          betbutton.disabled = false;
          cashoutbutton.disabled = true;
          profit = 0;
          nprofitElement.innerHTML = profit;

          // make grid not clickable
          boxes.forEach((tile) => {
            tile.removeEventListener('click', clickHandler);
          });

        } else if (value === 0) {
          box.classList.add('gold');
          profit *= 2;
          updateProfit(profit); 
          box.removeEventListener('click', clickHandler); // Remove the click event listener
          // Continue the game
          goldSpotsClicked++;
          minesRemaining--;
        }
      };
      
      box.addEventListener('click', clickHandler);
    });
    });
  });
