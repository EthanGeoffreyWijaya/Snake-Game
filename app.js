'use strict';

const button = document.querySelector('.btn');
const gameBox = document.getElementById('gameBox');
const title = document.getElementById('Title');

var time = 0;
var score = 0;
var state = 0;
var snake = [2828, 2827, 2826, 2825];
var loop;
var foodLoop;
var clock;
var direction;
var goverScreen;
var againBt;
var insText;
var hash = Array(3025);
var foodLoc;

function h(n) {
    var x = Math.floor(n/100);
    var y = n % 100;
    return x * 55 + y;
}

window.addEventListener("load", function () {
    //console.log("Running animation.");
for (var i = 0; i < 30; i++) {
    var newBox = document.createElement('div');
    newBox.classList.add('box');
    newBox.style.animationDelay = 0.08 * i + 's';
    document.body.appendChild(newBox);
}
});

button.addEventListener("click", function() {
    this.remove();
    gameBox.style.backgroundColor = 'black';
    document.getElementById('time').textContent = 'Time: ' + time + 's';
    document.getElementById('score').textContent = 'Score: ' + score;

    setTimeout(createGrids, 1000);
}
);

function createGrids() {
    for (var i = 0; i < 55; i++) {
        for (var j = 0; j < 55; j++) {
        var newGrid = document.createElement('div');
        newGrid.style.border = '1px solid black';
       // newGrid.style.backgroundColor = 'red';
        var yVal = (i < 10)? yVal = '0' + i: yVal = i;
        if (j == 0) j = '';
        newGrid.setAttribute('id', j + '' + yVal);
        gameBox.appendChild(newGrid);
        }
        gameBox.style.gridTemplateColumns += ' auto';
    }

    insText = document.createElement('div');
    insText.appendChild(document.createTextNode("Press any arrow key except up"));
    insText.style.position = 'absolute';
    insText.style.color = 'white'
    insText.style.fontFamily = 'arial';
    insText.style.fontSize = '15';
    insText.style.top = '100px';
    insText.style.left = '175px';
    insText.setAttribute('id', 'insText');

    initSnake();
}

function initSnake() {
    for (var i = 0; i < snake.length; i++) {
        hash[h(snake[i])] = 1;
        document.getElementById(snake[i]).style.backgroundColor = 'white';
    }
    gameBox.appendChild(insText);
    state = 1;
}

window.addEventListener('keydown', function(e) {
    //this.clearInterval(loop);
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    if (state == 0) {
        return;
    } else if (state == 1) {
        if (e.key == "ArrowUp") {
            return;
        }
        //var exists = document.getElementById('insText');
        if (insText != null) {
            gameBox.removeChild(insText);
        }
        state = 2;
        direction = e;
        enableClock();
        spawnFood();
        loop = setInterval(move, 100);
        //loop = setInterval(move, (score < 80)? 100 * (Math.pow(0.85, Math.floor(score / 10))) : 25);
    }

    if (direction != null) {
    switch (direction.key) {
        case "ArrowLeft":
            if (e.key == "ArrowRight") {
                e = direction;
            }
        break;
        case "ArrowRight":
            if (e.key == "ArrowLeft") {
                e = direction;
            }
        break;
        case "ArrowUp":
            if (e.key == "ArrowDown") {
                e = direction;
            }
        break;
        case "ArrowDown":
            if (e.key == "ArrowUp") {
                e = direction;
            }
        break;
    }
    }

    direction = e;
    //loop = setInterval(move, (score < 270)? 100 * (Math.pow(0.95, Math.floor(score / 10))) : 25);
});

function enableClock() {
    clock = setInterval(function () {
        time++;
        document.getElementById('time').textContent = "Time: " + Math.floor(time/60) + "m " + time % 60 + "s";
    }, 1000);
}

function move() {
    switch (direction.key) {
        case "ArrowLeft":
            if (snake[0] - 100 < 0 || hash[h(snake[0] - 100)] == 1) {
                gameOver();
                return;
            }
            snake.unshift(snake[0] - 100);
        break;
        case "ArrowRight":
            if (Math.floor((snake[0] + 100) /100) > 54 || hash[h(snake[0] + 100)] == 1) {
                gameOver();
                return;
            }
            snake.unshift(snake[0] + 100);
        break;
        case "ArrowUp":
            if (snake[0] % 100 - 1 < 0 || hash[h(snake[0] - 1)] == 1) {
                gameOver();
                return;
            }
            snake.unshift(snake[0] - 1);
        break;
        case "ArrowDown":
            if ((snake[0] + 1) % 100 > 54 || hash[h(snake[0] + 1)] == 1) {
                gameOver();
                return;
            }
            snake.unshift(snake[0] + 1);
        break;
    }
    if (hash[h(snake[0])] == 2) {
        console.log("gotem: " + snake[0]);
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        deleteFood(snake[0]);
        if (score % 10 == 0) {
            clearInterval(loop);
            loop = setInterval(move, (score < 80)? 100 * (Math.pow(0.85, Math.floor(score / 10))) : 25);
        }
    } else {
        document.getElementById('' + snake[snake.length - 1]).style.backgroundColor = 'black';
        hash[h(snake[snake.length - 1])] = null;
        snake.pop();
    }
    hash[h(snake[0])] = 1;
    document.getElementById('' + snake[0]).style.backgroundColor = 'white';
    //console.log(snake);
} 

function spawnFood() {
    //if (state == 0) return;
    var num = 0;
    do {
        num = Math.floor(Math.random() * hash.length);
    } while (hash[num] == 1)
    //console.log("orig: " + num);
    hash[num] = 2;
    var y = num % 55;
    var x = (num - y) / 55;
    num = x * 100 + y;
    //console.log("hcode:" + num);
    foodLoc = num;
    document.getElementById('' + num).style.backgroundColor = 'red';
    //foodLife(num);
    foodLoop = setTimeout(deleteFood, 7000, num);
}
/*
function foodLife(food) {
    setTimeout(deleteFood, 7000, food);
}*/

function deleteFood(num) {
    if (hash[h(num)] != 2) {
        return;
    }
    hash[h(num)] = null;
    document.getElementById('' + num).style.backgroundColor = 'black';
    spawnFood();
}

function gameOver() {
    clearInterval(loop);
    clearInterval(clock);
    clearTimeout(foodLoop);
    state = 0;
    console.log("GAME OVER:" + snake);

    goverScreen = document.createElement('div');
    goverScreen.appendChild(document.createTextNode('GAME OVER'));
    goverScreen.classList.add('goverBox');
    gameBox.appendChild(goverScreen);

    againBt = document.createElement('button');
    againBt.appendChild(document.createTextNode('Try again?'));
    againBt.classList.add('overbtn');
    gameBox.appendChild(againBt);

    //againBt.addEventListener("click", window.location.reload.bind(window.location));
    againBt.addEventListener("click", function() {reset()});
    window.addEventListener("keydown", function(e) {
        if (e.key == "r") {
            reset();
        }
    });
    //return;
}

function reset() {
    goverScreen.remove();
    againBt.remove();
    time = 0;
    score = 0;
    direction = null;
    document.getElementById('' + foodLoc).style.backgroundColor = 'black';
    for (var i = 0; i < snake.length; i++) {
        document.getElementById('' + snake[i]).style.backgroundColor = 'black';
    }
    snake = [2828, 2827, 2826, 2825];
    document.getElementById('time').textContent = 'Time:';
    document.getElementById('score').textContent = 'Score:';
    hash = Array(3025);
    initSnake();
}

