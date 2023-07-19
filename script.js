let diamondsAndBombs = [];
let betSettings = document.querySelector(`#betsettings`);
let balance;
let bombClicked = false; 
let nprofitElement = document.querySelector(`.nprofit`);
var cashoutbutton = document.getElementById("cashout");
const nprofit = parseFloat(nprofitElement.textContent);

balance = parseFloat(document.querySelector(`.totalamount`).textContent);
localStorage.setItem('balance', balance.toString());


document.addEventListener("DOMContentLoaded", function() {
  var betbutton = document.getElementById("startgame");
  var boxes = document.querySelectorAll('.box');

  betbutton.addEventListener("click", function() {

    if (nprofit > 0) {
      cashoutbutton.addEventListener("click", function() {
        // Assuming you have the initial balance stored in the `balance` variable
        let balance = parseFloat(localStorage.getItem('balance'));
        balance += nprofit;
        console.log("New balance:", balance);
        localStorage.setItem('balance', balance.toString());
      });
    }
    
    let bombClicked = false; 
    
    const betAmount = document.getElementById(`betamount`);

    if (betAmount.value.trim() === "") {
      return;
    }
    
    if (parseInt(betAmount.value) > balance) {
      alert(`not enough balance`);
      event.preventDefault();
      return;
    }
    
    // disable betbutton
    betbutton.disabled = true;
    
    const difficulty = document.getElementById(`mines`);
    const generatedArray = generateArray();
    const position = findPositions(generatedArray);
    let profit = parseInt(betAmount.value);
    
    console.log(generatedArray);
    console.log(betAmount.value);

    boxes.forEach(function(box) {
      box.classList.remove('greyed-out');
      box.classList.remove('gold');
      box.classList.remove('bomb');
    });

    // bet amount coding
    
    let mines = 25 - difficulty.value;
    
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

    //when clicking on box, check array position 
    boxes.forEach((box, index) => {
      const clickHandler = () => {

        if (bombClicked) {
          return; // Exit the click handler if a bomb has already been clicked
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
          profit = 0;
          nprofitElement.innerHTML = profit;

          // make grid not clickable
          boxes.forEach((tile) => {
            tile.removeEventListener('click', clickHandler);
          });

        } else if (value === 0) {
          box.classList.add('gold');
          profit *= 2;
          nprofitElement.innerHTML = profit;
          box.removeEventListener('click', clickHandler); // Remove the click event listener
          // Continue the game
        }
      };
    
      box.addEventListener('click', clickHandler);
    });

    console.log(position);
    });
  });
