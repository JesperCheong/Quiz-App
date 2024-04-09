async function fetchQuestions() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=18");
    const data = await response.json();
    if (data.response_code === 0) {
      console.log("Success: Returned results successfully.");
      questions = data.results.map(item => {
        //shuffle options
        const tempOptions = [...item.incorrect_answers, item.correct_answer]
        const randomizedOptions = shuffleArray(tempOptions);
        //assign key value pair
        return {
          question: item.question,
          answer: item.correct_answer,
          options: randomizedOptions,
        }
      });
    }
    // handle error according to API documentation for response_code
    else if (data.response_code === 1) {
      console.error("Error: No Results. Could not return results. The API doesn't have enough questions for your query.");
    } else if (data.response_code === 2) {
      console.error("Error: Invalid Parameter. Contains an invalid parameter. Arguments passed in aren't valid.");
    } else if (data.response_code === 3) {
      console.error("Error: Token Not Found. Session Token does not exist.");
    } else if (data.response_code === 4) {
      console.error("Error: Token Empty. Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.");
    } else if (data.response_code === 5) {
      console.error("Error: Rate Limit. Too many requests have occurred. Each IP can only access the API once every 5 seconds.");
    } else {
      // for any unexpected error
      console.error("Error: Unknown Error.");
    }
  } catch (error) {
    // for any other network error
    console.error("Error: Network Error:", error.message);
  }
}

// "Fisher-Yates" for shuffling options
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// need to iterate through "questions" and display question 1 by 1 on html
async function displayQuestions() {
  await fetchQuestions();
  console.log(questions);

  const questionsSection = document.getElementById("questions");

  questions.forEach((question, index) => {
    //wrapper
    const questionWrapper = document.createElement("div");
    questionWrapper.className = "col-md-6 p-3 p-xxl-5";
    //question number
    const questionCounter = document.createElement("h5");
    questionCounter.textContent = `Question ${index + 1}`;
    questionWrapper.appendChild(questionCounter);
    //question text
    const questionText = document.createElement("div");
    questionText.className = "pb-3";
    questionText.textContent = question.question;
    questionWrapper.appendChild(questionText);
    //options
    question.options.forEach((option, index) => {
      const form = document.createElement("div");
      form.className = "form-check";
      //create input
      const input = document.createElement("input");
      input.className = "form-check-input";
      input.type = "radio";
      input.value = option;
      form.appendChild(input);
      //create label
      const label = document.createElement("label");
      label.className = "form-check-label";
      label.textContent = option;
      form.appendChild(label);
      questionWrapper.appendChild(form);
    });
  questionsSection.appendChild(questionWrapper);
  });
}

/* function checkAnswer() {
  choosenAnswer = document.querySelector("input[name='flexRadioDefault']:checked");
  if (choosenAnswer.value === questions.answer) {
    console.log("correct");
  } else {
    console.log("wrong");
  }
} */



let questions = [];

/* const questionDisplay = document.getElementById("question");
const radioBtn = document.querySelectorAll(".form-check-input");
const optionDisplays = document.querySelectorAll(".form-check-label"); */

displayQuestions();


