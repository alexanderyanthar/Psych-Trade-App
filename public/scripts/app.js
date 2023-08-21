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

// form submission
// front-end JavaScript (front-end-js-file.js)

document.getElementById('signup-Button').addEventListener('click', () => {
  window.location.href = 'http://psych-trade-app.eba-gawxqyim.us-east-1.elasticbeanstalk.com/signup';
})

// document.getElementById('signup-Button').addEventListener('click', () => {
//   window.location.href = 'http://localhost:3000/signup';
// })

document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = 'http://psych-trade-app.eba-gawxqyim.us-east-1.elasticbeanstalk.com/login';
})







