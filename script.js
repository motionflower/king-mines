let diamondsAndBombs = [];
let betSettings = document.querySelector(`#betsettings`);
let balance = document.querySelector(`.totalamount`).textContent;


document.addEventListener("DOMContentLoaded", function() {
  var button = document.getElementById("startgame");

  button.addEventListener("click", function() {
    button.disabled = true;

      const difficulty = document.getElementById(`mines`);
      const betAmount = document.getElementById(`betamount`);

      console.log(betAmount.value);
      console.log(difficulty.value);

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
      
      const generatedArray = generateArray();
      const position = findPositions(generatedArray);
      
      
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

      console.log(generatedArray);
      
      // select all my divs and put them into an array
      // put a question mark on the divs that should have the bomb
      let mydivs = document.querySelectorAll(`div.box`);
      position.forEach(position => {
        if (position >= 0 && position < mydivs.length) {
          mydivs[position].textContent = `?`;
        }
      });

      console.log(mines);
    });
  });