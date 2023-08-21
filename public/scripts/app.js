//  feature container pop up

const featureContainer = document.querySelectorAll('.feature-container');

featureContainer.forEach((container) => {
    container.addEventListener('mouseover', () => {
        container.classList.add('active');
    })
    container.addEventListener('mouseout', (e) => {
        container.classList.remove('active');
        console.log(e.target);
    })
})

const backgroundCover = document.querySelectorAll('.background-cover');

backgroundCover.forEach((cover) => {
    cover.addEventListener('mouseover', () => {
        cover.classList.add('active');
    })
    cover.addEventListener('mouseout', () => {
        cover.classList.remove('active');
    })
})

// hamburger menu

const hamburgerMenu = document.querySelector('.hamburger-menu-container');
const headerNav = document.querySelector('.header-nav');
const ham = document.querySelector('.ham');
const hamRotate = document.querySelector('.hamRotate');
const headerLink = document.querySelectorAll('.header-link');

let menuOpen = false;

headerLink.forEach(link => {
    link.addEventListener('click', () => {
        headerNav.classList.remove('active');
        ham.classList.remove('active');
        hamRotate.classList.remove('active');
        menuOpen = false;
    })
})

hamburgerMenu.addEventListener('click', () => {
    if (!menuOpen) {
        headerNav.classList.add('active');
        ham.classList.add('active');
        hamRotate.classList.add('active');
        menuOpen = true;

    } else {
        headerNav.classList.remove('active');
        ham.classList.remove('active');
        hamRotate.classList.remove('active');
        menuOpen = false;
    }
})

// front-end JavaScript (front-end-js-file.js)

document.getElementById('signup-Button').addEventListener('click', () => {
  window.location.href = 'http://psych-trade-app.eba-gawxqyim.us-east-1.elasticbeanstalk.com/signup';
})

document.getElementById('signup-Button').addEventListener('click', () => {
  window.location.href = 'http://localhost:3000/signup';
})

document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = 'http://localhost:3000/login';
})

// document.getElementById('login-btn').addEventListener('click', () => {
//     window.location.href = 'http://psych-trade-app.eba-gawxqyim.us-east-1.elasticbeanstalk.com/login';
// })

// error handling for sign up form

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const username = form.querySelector('#username').value;
    const password = form.querySelector('#password').value;

    const usernameError = form.querySelector('#username-error');
    const passwordError = form.querySelector('#password-error');
    const errorDiv = form.querySelector('#form-error');

    usernameError.textContent = '';
    passwordError.textContent = '';
    errorDiv.textContent = '';

    let hasError = false;

    if (username.length < 6 || !/^[a-zA-Z0-9]+$/.test(username)) {
        usernameError.textContent = 'Invalid username. Username must be at least 6 characters long with only letters and numbers.';
        hasError = true;
    }

    if (password.length < 8 || !/(?=.*[0-9])(?=.*[@#$%^&+=]).*$/.test(password)) {
        passwordError.textContent = 'Invalid Password. Password must be 8 Characters long and contain 1 symbol and number.';
        hasError = true;
    }

    if (!hasError) {
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            const errorDiv = form.querySelector('#error-message');

            if (response.ok) {
                // Redirect or handle successful signup
                window.location.href = '/profile';
            } else {
                errorDiv.textContent = data.errorMessage;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const username = form.querySelector('#username').value;
    const password = form.querySelector('#password').value;

    const errorDiv = form.querySelector('#form-error');

    errorDiv.textContent = '';

    let hasError = false;

    if (!hasError) {
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            const errorDiv = form.querySelector('#error-message');

            if (response.ok) {
                // Redirect or handle successful signup
                window.location.href = '/profile';
            } else {
                errorDiv.textContent = data.errorMessage;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }
});










