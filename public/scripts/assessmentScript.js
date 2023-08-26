const questions = document.querySelectorAll('.question');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const submitButton = document.getElementById('submitButton');
const questionError = document.getElementById('questionError');
const submissionError = document.getElementById('submissionError');
const assessmentForm = document.getElementById('assessmentForm');
let currenQuestionIndex = 0;

const updateButtonState = () => {
    prevButton.disabled = currenQuestionIndex === 0;
    nextButton.style.display = currenQuestionIndex === questions.length - 1 ? 'none' : 'block';
    submitButton.style.display = currenQuestionIndex === questions.length - 1 ? 'block' : 'none';
}

const showQuestion = (index) => {
    questions.forEach((question, i) => {
        if (i === index) {
            question.classList.remove('hidden');
        } else {
            question.classList.add('hidden');
        }
    });
}

const isQuestionAnswered = (index) => {
    const selectedOption = questions[index].querySelector('input:checked');
    return !!selectedOption;
}

prevButton.addEventListener('click', () => {
    currenQuestionIndex--;
    showQuestion(currenQuestionIndex);
    updateButtonState();
});

nextButton.addEventListener('click', () => {
    if (isQuestionAnswered(currenQuestionIndex)) {
        currenQuestionIndex++;
        showQuestion(currenQuestionIndex);
        updateButtonState();
        questionError.style.display = 'none';
    } else {
        questionError.style.display = 'block';
        setTimeout(() => {
            questionError.style.opacity = '0';
            setTimeout(() => {
                questionError.style.display = 'none'
                questionError.style.opacity = '1';
            }, 500)
        }, 5000);
    }
});

assessmentForm.addEventListener('submit', (e) => {
    const questionsArray = Array.from(questions);
    if (!questionsArray.every((question, index) => isQuestionAnswered(index))) {
        e.preventDefault();
        submissionError.style.display = 'block';
        setTimeout(() => {
            submissionError.style.opacity = '0';
            setTimeout(() => {
                submissionError.style.display = 'none'
                submissionError.style.opacity = '1';
            }, 500);
        }, 5000); // Display error message for 5 seconds
    }
});

updateButtonState();
showQuestion(currenQuestionIndex);