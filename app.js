const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const sound = new Audio('music.mp3')
const gameOver = new Audio('gameover.mp3')
const driver = new Audio('driver.mp3')

// const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

let keys = {
    ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false
}; // if pressed then the value will be true

let player = { start: false, speed: 10, point: 0 };

startScreen.addEventListener("click", startGame);  // it looks for any click on the startScreen div
document.addEventListener("keydown", pressOn); //looks for if any key pressed
document.addEventListener("keyup", pressOff); // looks for if any key up after pressed


function moveLine() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function (line) {
        if (line.y > 750)            // if the line goes more than 750 then this sets the value to 0 and starts form the top again ,                                  
        {                        //basically inreasing the value of line.y and when it goes out of screen downwards it sets the value to 0 and it starts from the top again
            line.y -= 1000;
        }
        line.y += player.speed - 4;
        line.style.top = line.y + "px";
    })
}

function moveEnemy() {
    let enemy = document.querySelectorAll(".enemy");
    enemy.forEach(function (ene) {
        if (ene.y > 1500)            // if the line goes more than 750 then this sets the value to 0 and starts form the top again ,                                  
        {                        //basically inreasing the value of line.y and when it goes out of screen downwards it sets the value to 0 and it starts from the top again
            ene.y = - 600;
            ene.style.left = Math.floor(Math.random() * 250) + "px";
            ene.style.backgroundColor = generateLightColorHex();
        }
        ene.y += player.speed - 3;
        ene.style.top = ene.y + "px";
    })
}


function isCollide(a, b) {
    let carD = a.getBoundingClientRect();
    let i = false;
    b.forEach(function (ene) {
        let enemyD = ene.getBoundingClientRect();
        if (carD.x + carD.width >= enemyD.x &&
            carD.x <= enemyD.x + enemyD.width &&
            carD.y + carD.height >= enemyD.y +2 &&
            carD.y <= enemyD.y + enemyD.height) {

            i = true;
        }
    })
    return i;
}

function gameEngine() {
    let car = document.querySelector(".car");
    let enemy = document.querySelectorAll(".enemy");
    moveLine();
    moveEnemy();

    if (isCollide(car, enemy)) {

        gameEnd();



    }



    let road = gameArea.getBoundingClientRect();
    if (player.start) {

        if (keys.ArrowUp && player.y > road.top) {
            player.y -= (player.speed + 5);
        }
        if (keys.ArrowDown && player.y < road.bottom) {
            player.y += (player.speed + 5);
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed +5;
        }
        if (keys.ArrowRight && player.x < (road.width - 50)) {  //-50 because it's the width of the car in the css file
            player.x += player.speed +5;
        }

        car.style.left = player.x + "px";
        car.style.top = player.y + "px";
        // above is the main logic that moves the object

        player.point++;
        score.innerText = "SCORE: " + player.point;

        if(player.point % 500 == 0)
        {
            player.speed +=1;


        }

        if(player.point == 3000)
        {
            driver.play();
        }

        window.requestAnimationFrame(gameEngine);
    }
}

function pressOn(e) {
    e.preventDefault(); //prevents the default action
    keys[e.key] = true;
}
function pressOff(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function gameEnd() {
    player.start = false;
    score.innerHTML = "GAME OVER <BR> SCORE WAS: " + player.point + "<br>Koi baat nahi,better luck next time :)";
    startScreen.classList.remove("hide");
    sound.pause();
    gameOver.play();
}

function startGame() {

    sound.play();

    startScreen.classList.add("hide");   // adds the hide class in the start Screen div
    gameArea.classList.remove("hide");   // removes the hide class from the gamearea div
    score.classList.remove("hide")
    gameArea.innerHTML = "";
    player.start = true;

    player.point = 0;
    player.speed = 10;

    for (let i = 0; i < 3; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.y = i * 150;
        line.style.top = (i * 150) + "px";
        gameArea.appendChild(line);
    }

    window.requestAnimationFrame(gameEngine);

    var car = document.createElement("div");

    car.setAttribute("class", "car");
    gameArea.appendChild(car); // adds the car div inside the game area div

    player.x = car.offsetLeft; //returns the left position(in px) relative to the parent
    player.y = car.offsetTop; //returns the top position(in px) relative to the parent

    for (let i = 0; i < 7; i++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.y = (i + 1) * 600 * -1; //it gives a negetive value for y so the cars stays outside of the view area at starting
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * 280) + "px";  // gives random position of the car

        enemy.style.backgroundColor = generateLightColorHex();
        gameArea.appendChild(enemy);
    }
}


function generateLightColorHex() {
    let color = "#";
    for (let i = 0; i < 3; i++)
        color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
    return color;
}

// function getRandomColor()
// {
//     let hexColor = "#";

//     for (let i = 0; i < 6; i++) {
//         hexColor += hex[getRandomNumber()];
//     }

//     return hexColor;

// }
// function getRandomNumber() {

//     return Math.floor(Math.random() * hex.length);
// }
