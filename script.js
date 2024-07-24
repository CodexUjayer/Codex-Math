document.addEventListener("DOMContentLoaded", function () {
  var audioElement = document.getElementById("backgroundMusic");
  audioElement.play();
});

let currentQuestion = {};
const answerInput = document.getElementById("answer");
const additionCheckbox = document.getElementById("additionCheckbox");
const subtractionCheckbox = document.getElementById("subtractionCheckbox");
const multiplicationCheckbox = document.getElementById(
  "multiplicationCheckbox"
);
const divisionCheckbox = document.getElementById("divisionCheckbox");
const squareCheckbox = document.getElementById("squareCheckbox");
const cubeCheckbox = document.getElementById("cubeCheckbox");
const sqrtCheckbox = document.getElementById("sqrtCheckbox");

const digitSelector = document.getElementById("digitSelector");

// Load checkbox states from localStorage or use default values
const loadSavedItems = (checkbox, key) => {
  const storedValue = localStorage.getItem(key);
  if (storedValue !== null) {
    checkbox.checked = JSON.parse(storedValue);
  }
};

// Save checkbox state to localStorage
const saveCheckboxState = (checkbox, key) => {
  localStorage.setItem(key, JSON.stringify(checkbox.checked));
};

// Initialize checkbox states
loadSavedItems(additionCheckbox, "additionCheckbox");
loadSavedItems(subtractionCheckbox, "subtractionCheckbox");
loadSavedItems(multiplicationCheckbox, "multiplicationCheckbox");
loadSavedItems(divisionCheckbox, "divisionCheckbox");
loadSavedItems(squareCheckbox, "squareCheckbox");
loadSavedItems(cubeCheckbox, "cubeCheckbox");
loadSavedItems(sqrtCheckbox, "sqrtCheckbox");

loadSavedItems(digitSelector, "digitSelector");
// Add event listeners to checkboxes for real-time updates
const checkboxes = [
  additionCheckbox,
  subtractionCheckbox,
  multiplicationCheckbox,
  divisionCheckbox,
  squareCheckbox,
  cubeCheckbox,
  sqrtCheckbox,
];

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    saveCheckboxState(this, this.id);
    generateQuestion();
    answerInput.focus();
  });
});

// Save digit selector state to localStorage
const saveDigitSelectorState = (digitSelector, key) => {
  localStorage.setItem(key, JSON.stringify(digitSelector.value));
};
// Initialize digit selector state
const savedDigitSelectorValue = localStorage.getItem("digitSelector");
if (savedDigitSelectorValue !== null) {
  digitSelector.value = JSON.parse(savedDigitSelectorValue);
}
digitSelector.addEventListener("change", function () {
  saveDigitSelectorState(digitSelector, "digitSelector");
  generateQuestion();
  answerInput.focus();
});

answerInput.addEventListener("input", function () {
  this.style.width = this.scrollWidth + "px";
  this.style.left = `-${this.scrollWidth}px`;
});

function generateQuestion() {
  const selectedOption = digitSelector.value;
  let num1, num2;

  switch (selectedOption) {
    case "1":
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
      break;
    case "2":
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
      break;
    case "3":
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * 900) + 100;
      break;
    case "4":
      num1 = Math.floor(Math.random() * 9000) + 1000;
      num2 = Math.floor(Math.random() * 9000) + 1000;
      break;
    case "5":
      num1 = Math.floor(Math.random() * 90000) + 10000;
      num2 = Math.floor(Math.random() * 90000) + 10000;
      break;
    case "6":
      num1 = Math.floor(Math.random() * 1e5);
      num2 = Math.floor(Math.random() * 1e5);
      break;
    case "7":
      num1 = Math.floor(Math.random() * 1e15);
      num2 = Math.floor(Math.random() * 1e15);
      break;
    default:
      break;
  }

  const operations = [];

  additionCheckbox.checked && operations.push("+");
  subtractionCheckbox.checked && operations.push("-");
  multiplicationCheckbox.checked && operations.push("*");
  divisionCheckbox.checked && operations.push("/");
  squareCheckbox.checked && operations.push("^2");
  cubeCheckbox.checked && operations.push("^3");
  sqrtCheckbox.checked && operations.push("sqrt");

  if (operations.length === 0) {
    alert("Please select at least one operation.");
    return;
  }

  const randomOperation =
    operations[Math.floor(Math.random() * operations.length)];

  let questionText;

  switch (randomOperation) {
    case "+":
      questionText = `${num1} ${randomOperation} ${num2}`;
      currentQuestion.answer = num1 + num2;
      break;
    case "-":
      questionText = `${num1} ${randomOperation} ${num2}`;
      currentQuestion.answer = num1 - num2;
      break;
    case "*":
      questionText = `${num1} ${randomOperation} ${num2}`;
      currentQuestion.answer = num1 * num2;
      break;
    case "/":
      const quotient = Math.floor(num1 / num2);
      const remainder = num1 % num2;
      if (remainder === 0) {
        questionText = `${num1} ${randomOperation} ${num2}`;
        currentQuestion.answer = quotient;
      } else {
        generateQuestion();
        return;
      }
      break;
    case "^2":
      questionText = `${num1}<sup>2</sup>`;
      currentQuestion.answer = num1 ** 2;
      break;
    case "^3":
      questionText = `${num1}<sup>3</sup>`;
      currentQuestion.answer = num1 ** 3;
      break;
    case "sqrt":
      const perfectSquare = Math.pow(Math.floor(Math.sqrt(num1)), 2);
      if (perfectSquare === num1) {
        questionText = `√${num1}`;
        currentQuestion.answer = Math.sqrt(num1);
      } else {
        generateQuestion();
        return;
      }
      break;
    default:
      break;
  }

  document.getElementById("question").innerHTML = questionText;
  answerInput.value = "";
  document.getElementById("result").innerHTML = "";
}

function checkAnswer() {
  const userAnswer = parseInt(answerInput.value);

  if (isNaN(userAnswer)) {
    return;
  }

  if (userAnswer === currentQuestion.answer) {
    document.getElementById("result").innerText = "Correct! Well done.";

    answerInput.style.color = "#4D804D";

    setTimeout(function () {
      answerInput.style.color = "";
      generateQuestion();
      setTimeout(function () {
        document.getElementById("result").innerText = "";
      }, 500);
    }, 500);
  }
}

generateQuestion();

window.onload = function () {
  answerInput.focus();
};

answerInput.addEventListener("input", checkAnswer);

document.addEventListener("keydown", function (event) {
  // Check if the pressed key is "r"
  if (event.key === "r") {
    generateQuestion();
    answerInput.focus();
    event.preventDefault();
  }
});

// Modal elements
const settingsModal = document.getElementById("settingsModal");
const settingsButton = document.getElementById("settingsButton");
const closeModal = document.getElementById("closeModal");

// Show modal on button click
settingsButton.addEventListener("click", function () {
  settingsModal.style.display = "block";
});

// Close modal on close button click
closeModal.addEventListener("click", function () {
  settingsModal.style.display = "none";
  answerInput.focus();
});

// Close modal if clicked outside of it
window.addEventListener("click", function (event) {
  if (event.target === settingsModal) {
    settingsModal.style.display = "none";
    answerInput.focus();
  }
});

const github_Button = document.getElementById("github_Button");

const uploadMusicButton = document.getElementById("uploadMusic");

uploadMusicButton.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    backgroundMusic.src = reader.result;
    localStorage.setItem("customMusic", reader.result);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

window.onload = function () {
  const customMusic = localStorage.getItem("customMusic");

  if (customMusic) {
    backgroundMusic.src = customMusic;
  }
};

backgroundMusic.onvolumechange = function () {
  localStorage.setItem("volume", backgroundMusic.volume);
};
backgroundMusic.onmuted = function () {
  localStorage.setItem("muted", backgroundMusic.onmuted);
};
backgroundMusic.onpause = function () {
  localStorage.setItem("paused", true);
};
backgroundMusic.onplay = function () {
  localStorage.removeItem("paused");
};

window.onload = function () {
  const customMusic = localStorage.getItem("customMusic");
  const volume = localStorage.getItem("volume");
  const muted = localStorage.getItem("muted");
  const paused = localStorage.getItem("paused");

  if (paused) {
    backgroundMusic.pause();
  }

  if (customMusic) {
    backgroundMusic.src = customMusic;
  }

  if (volume) {
    backgroundMusic.volume = volume;
  }

  if (muted) {
    backgroundMusic.onmuted = muted;
  }
};
