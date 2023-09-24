let diamondsAndBombs = [];
let balance;
let nprofit;
let gameOver = false;

// DOM Elements
const boxes = document.querySelectorAll(`.tile`);
const nprofitElement = document.querySelector(`.nprofit`);
const multCurrentDisplayed = document.querySelector(`.multcurrent`);
const multNextDisplayed = document.querySelector(`.multnext`);
const cashoutButtonDisplay = document.querySelector(`.cashoutamount`);
const cashoutpopup = document.getElementById(`cashoutpopup`);
const betSettings = document.getElementById(`betsettings`);
const cashoutbutton = document.getElementById(`cashout`);
const resetbutton = document.getElementById(`resetbalance`);
const betbutton = document.getElementById(`startgame`);
const minesInput = document.getElementById(`mines`);
const betAmount = document.getElementById(`betamount`);
const difficulty = document.getElementById(`mines`);

// ANIMATIONS SECTION

// Animation for the tiles
boxes.forEach((box) => {
  let isPressed = false;

  box.addEventListener("mouseenter", () => {
    if (!isPressed) {
      box.style.transition = "transform 0.05s ease-in-out"; // Add transition on hover
      box.style.transform = "rotateX(20deg) rotateY(20deg)"; // Rotate slightly on hover
    }
  });

  box.addEventListener("mouseleave", () => {
    if (!isPressed) {
      box.style.transition = "transform 0.5s ease-in-out"; // Add transition on hover out
      box.style.transform = "rotateX(0deg) rotateY(0deg)"; // Reset rotation
    }
  });

  box.addEventListener("mousedown", () => {
    isPressed = true;
    box.style.transition = "transform 0.05s ease-in-out"; // Add transition on press
    box.style.transform = "rotateX(40deg) rotateY(40deg)"; // Rotate to the specified angle

    // Reset if you move out of the tile while clicking
    box.addEventListener("mouseleave", () => {
      if (isPressed) {
        box.style.transition = "transform 0.2s ease-in-out"; // Add transition on hover out
        box.style.transform = "rotateX(0deg) rotateY(0deg)"; // Reset rotation
        isPressed = false;
      }
    });
  });

  document.addEventListener("mouseup", () => {
    if (isPressed) {
      // Allow the hover animation to take over when not pressed
      box.style.transition = "transform 0.2s ease-in-out"; // Add transition on release
      box.style.transform = "rotateX(20deg) rotateY(20deg)"; // Return to hover state
      isPressed = false;
    }
  });

  box.addEventListener("click", () => {
    box.classList.toggle("flipped"); // Toggle the flipped class
  });
});

// Animation for cashout
function cashoutAnimation() {
  if (cashoutpopup.style.display === "block") {
    cashoutpopup.style.display = "none"; // Hide the cashoutpopup
  } else {
    cashoutpopup.style.display = "block"; // Show the cashoutpopup
    setTimeout(() => {
      cashoutpopup.style.display = "none"; // Hide the cashoutpopup after 3 seconds
    }, 3000); // Change to 3000 milliseconds (3 seconds)
  }
}

// CODE SECTION

// Updates the balance in local storage
function updateBalanceInLocalStorage() {
  localStorage.setItem("balance", balance.toString());
}

// Updates the balance on top left
function updateUIBalance() {
  document.querySelector(".totalamount").textContent = balance.toFixed(2);
}

// Function to update nprofit with the actual profit value
function updateProfit(profit) {
  nprofit = profit;
  nprofitElement.textContent = nprofit.toString();
}

// Reveals everything under the tiles
function revealAllTiles() {
  boxes.forEach(function (box, i) {
    const tileValue = diamondsAndBombs[i];

    setTimeout(() => {
      if (tileValue === 0) {
        box.classList.add("gold"); // Add a class to display gold
      } else if (tileValue === 1) {
        box.classList.add("bomb"); // Add a class to display bombs
      }

      setTimeout(() => {
        box.classList.remove("greyed-out");
      }, 200); // Adjust the class removal delay as needed
    }, i * 30); // Adjust the delay between tile reveals as needed
  });
}

// Function that generates the bomb spots
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

// Button on top right that resets balance to 100$
resetbutton.addEventListener("click", function () {
  balance = 100;
  updateBalanceInLocalStorage();
  updateUIBalance();
});

// What happens when the page loads
document.addEventListener("DOMContentLoaded", function () {
  balance = parseFloat(localStorage.getItem("balance")) || 100;
  updateUIBalance();

  betbutton.addEventListener("click", function (event) {
    //Input validation
    if (parseInt(betAmount.value) > balance) {
      alert(`not enough balance`);
      event.preventDefault();
      return;
    }

    if (betAmount.value.trim() === "") {
      event.preventDefault();
      return;
    }

    if (betAmount.value == 0) {
      event.preventDefault();
      return;
    }

    // Reset game
    balance -= betAmount.value.trim();
    diamondsAndBombs = generateArray();
    updateUIBalance();
    updateBalanceInLocalStorage();
    
    gameOver = false;
    betbutton.disabled = true;
    cashoutbutton.disabled = false;
    minesInput.disabled = true;
    betAmount.disabled = true;

    boxes.forEach(function (box) {
      box.classList.remove("greyed-out");
      box.classList.remove("gold");
      box.classList.remove("bomb");
    });

    let profit = parseInt(betAmount.value);

    // Function to calculate multiplier
    function calculateMultiplier() {
      multiplier *= Math.pow(growthBase, exponent);
      exponent++; // Increment the exponent for the next click
      
      nextMultiplier = multiplier * Math.pow(growthBase, exponent);

      // Return the updated multiplier
      return multiplier;
    }

    let multiplier = 1;
    let nextMultiplier = 1;
    let growthBase = 1;
    let exponent = 1;

    // Number of bombs : Multiplier growth base
    const growthBases = {
      5: 1.10,
      10: 1.5,
      15: 3,
      20: 6,
      24: 100,
    };
        
    growthBase = growthBases[difficulty.value] || 0;

    
    boxes.forEach((box, index) => {
      const clickHandler = () => {
        if (gameOver) {
          return; // Exit the click handler if the cashout has already been clicked
        }

        const value = diamondsAndBombs[index];

        if (value === 1) {
          boxes.forEach(function (box) {
            box.classList.add("greyed-out");
            box.removeEventListener("click", clickHandler);
          });
          box.classList.add("bomb");
          gameOver = true;
          betbutton.disabled = false;
          cashoutbutton.disabled = true;
          minesInput.disabled = false;
          betAmount.disabled = false;
          profit = 0;
          nprofit = 0;
          multCurrentDisplayed.innerHTML = 0;
          multNextDisplayed.innerHTML = 0;
          nprofitElement.innerHTML = profit;
          revealAllTiles();
          diamondsAndBombs = [];
        } 

        else if (value === 0) {
          box.classList.add("gold");
          box.removeEventListener("click", clickHandler);
          multiplier = calculateMultiplier();
          profit = Math.round(betAmount.value.trim() * multiplier * 100) / 100;
          updateProfit(profit);

          if (multiplier < 10) {
            multCurrentDisplayed.innerHTML = Math.round(multiplier * 100) / 100 + `x`;
            multNextDisplayed.innerHTML = (Math.round(nextMultiplier * 100) / 100) + `x`;
          } else {
            multCurrentDisplayed.innerHTML = Math.trunc(multiplier) + `x`;
            multNextDisplayed.innerHTML = Math.trunc(nextMultiplier) + `x`;
          }
        }
      };
      box.addEventListener("click", clickHandler);
    });
  });

  cashoutbutton.addEventListener("click", function () {
    if (nprofit > 0) {
      gameOver = true;
      betbutton.disabled = false;
      cashoutbutton.disabled = true;
      minesInput.disabled = false;
      betAmount.disabled = false;
      balance += nprofit;
      revealAllTiles();
      updateBalanceInLocalStorage();
      updateUIBalance();
      cashoutAnimation();
      cashoutButtonDisplay.innerHTML = nprofit;
      multCurrentDisplayed.innerHTML = 0;
      multNextDisplayed.innerHTML = 0;
      nprofitElement.innerHTML = "0";
      nprofit = 0;
      diamondsAndBombs = [];
    }
  });
});

