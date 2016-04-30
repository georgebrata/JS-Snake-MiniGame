var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
var DIR_LEFT = 3, DIR_UP = 0, DIR_RIGHT = 1, DIR_DOWN = 2;
var TIMER_INTERVAL = 10, FRUIT_TIME = 8000;
var snake = [];
var direction = [DIR_RIGHT], currentDirection;
var placeFruitInterval, fruitTimerInverval, fruitShowTimerInterval,
  fruitShowTimerClearIntervalTimeout, moveInterval, scoreInterval;
var millisecondsInTheGame = 0;
var fruit = {left: 0, top: 0, id: "fruit"};


function placeFruit() {
    //alege doua coordonate la intamplare in interiorul jocului
    //Math.random returneaza un float random intre 0 si 1 -> deaia face inmultirile
    fruit.left = Math.round(Math.random() * 63) * 10;
    fruit.top = Math.round(Math.random() * 47) * 10;

    //daca a pus fructul pe sarpe, va repune fructul
    if (fruitIsOnTopOfSnake()) {
      return placeFruit();
    }

    //seteeaza pozitia fructului pe ecran
    fruit.style.left = fruit.left + 'px';
    fruit.style.top = fruit.top + 'px';
  }

function createFruit() {
    //creeaza un fruct si il aseaza pe ecran
    fruit = document.createElement('div');
    fruit.setAttribute("id", "fruit");
    fruit.style.position = 'absolute';
    fruit.style.width = '10px';
    fruit.style.height = '10px';
    fruit.style.backgroundColor = 'violet';
    fruit.style.border = '1px solid black';
    fruit.style.zIndex = -1;
    document.getElementById("stage").appendChild(fruit);
    return fruit;
  }

function showFruitTime() {
    var milliseconds = FRUIT_TIME;
    var paragraph = document.getElementById("fruitTime");
    fruitShowTimerInterval = setInterval(function() {
        //la fiecare TIMER_INTERVAL secunde seteaza textul din paragraful cu IDul #fruitTime la "milisecunde"
        //merge descrescator
        paragraph.innerHTML = "\tFruit time: " + displayTime(milliseconds/1000);
        milliseconds -= TIMER_INTERVAL;
      }, TIMER_INTERVAL);

    //dupa FRUIT_TIME scunde distruge timerul de mai sus - frunctul a expirat
    fruitShowTimerClearIntervalTimeout = setTimeout(function() {
      clearInterval(fruitShowTimerInterval);
    }, FRUIT_TIME - TIMER_INTERVAL);
  }

function fruitIsOnTopOfSnake() {
    //aici doar verifica daca pozitia fructului e peste sarpe
    //functia asta o foloseste cand creaza un nou fruct - verifica sa nu-l puna peste sarpe
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].left == fruit.left && snake[i].top == fruit.top) {
        return true;
      }
    }
    return false;
  }

function removeFruitAndResetTimer() {
    //functia asta se apeleaza atunci cand se mananca un fruct inainte sa fie expirat
    //codul reseteaza timerele specifice fructului respectiv si pune un nou fruct in scena si apoi ii creeaza timerele

    //asta e in plus fata de proiectul celalalt - updatez scorul
    var scorePar = document.getElementById("score");
    scorePar.innerHTML = snake.length -3;



    clearInterval(placeFruitInterval);
    clearInterval(fruitTimerInverval);
    clearInterval(fruitShowTimerInterval);
    clearTimeout(fruitShowTimerClearIntervalTimeout);
    placeFruit();
    showFruitTime();
    placeFruitInterval = setInterval(placeFruit, FRUIT_TIME);
    fruitTimerInverval = setInterval(showFruitTime, FRUIT_TIME);
  }

function snakeCanEatFruit() {
    //aici verifica dca sarpele a mancat frunctul
    return snake[0].left == fruit.left && snake[0].top == fruit.top;
}

function startGame() {
  // make start button stop button
  var button = document.getElementById("startButton");
  button.innerHTML = "Stop";
  button.onclick = gameOver;

  // create snake and move
  //face 3 segmente de inceput
  createSnakeSegment({left: 60, top: 50, id:0});
  createSnakeSegment({left: 50, top: 50, id:1});
  createSnakeSegment({left: 40, top: 50, id:2});

  //si isi creaza intervalul moveInterval - pe care il va opri la finalul jocului
  //asta apeleaza functia "move" de 100 de ori pe secunda
  moveInterval = setInterval(move, 100);

  // create fruit, place it and show timer
  createFruit();
  placeFruit();
  showFruitTime();

  //timerele asta apeleaza functiile "placeFruit" si "showFruitTime" o data la FRUIT_TIME milisencunde (5 secunde)
  //pracic dupa 5 secunde recreeaza un fruct si porneste timerul corestunzator - daca frunctul nu e mancat in alea 5 secunde, se recreeaza alt fruct
  placeFruitInterval = setInterval(placeFruit, FRUIT_TIME);
  fruitTimerInverval = setInterval(showFruitTime, FRUIT_TIME);

  // asta doar calculeaza si afiseaza scorul in paragraful de langa joc
  showScoreTime();
}

function gameOver() {
  //clear all timers
  clearInterval(placeFruitInterval);
  clearInterval(fruitTimerInverval);
  clearInterval(fruitShowTimerInterval);
  clearTimeout(fruitShowTimerClearIntervalTimeout);
  clearInterval(moveInterval);
  clearInterval(scoreInterval);

  //display info about the game
  var gameOverParagrpah = document.getElementById("gameOver");
  gameOverParagrpah.innerHTML = "\tGame over!";
  var finalScoreParagraph = document.getElementById("finalScore");
  finalScoreParagraph.innerHTML = "\tYour final score is: " + (snake.length - 3) + " in " + (millisecondsInTheGame / 1000) + " seconds.";
}

// changes direction onkeydown
function changeDirection(event) {
  var lastDirection;
  //verifica daca s-a modificat sau nu directia
  if (direction.length > 0) {
    lastDirection = direction[0];
  }
  else {
    lastDirection = currentDirection;
  }

  //aici verifica daca tasta apasata e sageate LEFT (si-a declarat codurile fiecarei sageti la inceput)
  //si mai verifica daca directia actuala NU e dreapta - daca mergi spre dreapta nu poti sa te intorci brusc spre stanga
  if (event.keyCode == LEFT && lastDirection != DIR_RIGHT) {
    //adauga DIR_LEFT la unceputul array-ului
    direction.unshift(DIR_LEFT);
  }
  //idem
  if (event.keyCode == UP && lastDirection != DIR_DOWN) {
    //adauga DIR_UP la inceputul array-ului
    direction.unshift(DIR_UP);
  }
  if (event.keyCode == RIGHT && lastDirection != DIR_LEFT) {
    //idem
    direction.unshift(DIR_RIGHT);
  }
  if (event.keyCode == DOWN && lastDirection != DIR_UP) {
    direction.unshift(DIR_DOWN);
  }
}

function showScoreTime() {
  millisecondsInTheGame = 0;
  //ia elementul cu id-ul score din HTML
  //si ii modifica continutul la fiecare TIMER_INTERVAL milisencde
  var paragraph2 = document.getElementById("time");
  scoreInterval = scoreTimer = setInterval(function() {
      //updateaza scorul - paragraful cu id-ul "score" din HTML la fiecare TIMER_INTERVAL milisencunde
      paragraph2.innerHTML = "\t Time: " + displayTime(millisecondsInTheGame/1000);
      millisecondsInTheGame += TIMER_INTERVAL;
    }, TIMER_INTERVAL);
}

function snakeHitBorderOrHimself() {
  //asta returneaza true daca sarpele s-a lovit de perete sau de el insusi
  //functia asta o apeleaza la fiecare miscare - sa verifice daca jocul continua
  if (snake[0].left < 0 || snake[0].left > 630 || snake[0].top < 0 || snake[0].top > 470) {
    return true;
  }
  for (var i = 1; i < snake.length; i++) {
    if (snake[0].left == snake[i].left && snake[0].top == snake[i].top) {
      return true;
    }
  }
  return false;
}

function move() {
  //functia asta e apelata de 100 de ori pe secunde (vezi StartGame) si face sarpele sa se miste
  //desigur, ai mai multe cazuri

  //daca sarpele mananca un fruct
  if (snakeCanEatFruit()) {
    var c = snake[snake.length - 1];
    //creaza un nou div in coada lui
    createSnakeSegment({left: c.left, top: c.top, id: snake.length});
    //si se reseteaza fructul si timer-ul
    removeFruitAndResetTimer();
  }

  //daca moare - Game over
  if (snakeHitBorderOrHimself()) {
    gameOver();
    return;
  }
  var cap = snake[0];
  var coada = snake.pop();
  coada.left = cap.left;
  coada.top = cap.top;

  //adauga coada sarpelui la inceputul array-ului
  snake.splice(1, 0, coada);
  if (direction.length > 0) {
    // scoate ultima directe din arrayul de directii
    currentDirection = direction.pop();
  }

  //capul devenind coada, acum muta capul conform directiai in care se misca sarpele
  if (currentDirection == DIR_LEFT) {
    cap.left -= 10;
  } else if (currentDirection == DIR_UP) {
    cap.top -= 10;
  } else if (currentDirection == DIR_RIGHT) {
    cap.left += 10;
  } else if (currentDirection == DIR_DOWN) {
    cap.top += 10;
  }
  //si la sfarsit il deseneaza - remember - 100 de ori pe secunda
  drawSnake();
}

function drawSnake() {
  var cap = snake[0];
  var capDiv = document.getElementById(cap.id);
  capDiv.style.left = cap.left + 'px';
  capDiv.style.top = cap.top + 'px';
  var coada = snake[1];
  var coadaDiv = document.getElementById(coada.id);
  coadaDiv.style.left = coada.left + 'px';
  coadaDiv.style.top = coada.top + 'px';
}

// segment is like this {left: y, top: x, id: divId}
//cand se mananca un fruct, se adauga un nou patratel la caoda sarpelui
function createSnakeSegment(segment) {
  snake.push(segment);
  //creaza un nou patratel(div) in html-ul nostru
  var segmentDiv = document.createElement('div');

  //seteaza stilul
  segmentDiv.setAttribute("id", segment.id);
  segmentDiv.style.position = 'absolute';
  segmentDiv.style.width = '10px';
  segmentDiv.style.height = '10px';

  if (snake.length != 1) {
    segmentDiv.style.backgroundColor = 'blue';
    segmentDiv.style.zIndex = 2;
  }
  else {
    segmentDiv.style.backgroundColor = 'red';
    segmentDiv.style.zIndex = 3;
  }

  //ii seteaza noua positie
  segmentDiv.style.left = segment.left + 'px';
  segmentDiv.style.top = segment.top + 'px';
  document.getElementById("stage").appendChild(segmentDiv);
}

function displayTime(secs) {
    if (secs < 59) {
        if (secs < 10) {
            return ("0" + secs);
        }
        else {
            return (secs);
        }
    }
    else {
        if (secs % 60 < 10) {
            return (Math.floor(secs / 60) + ":0" + Math.floor(secs % 60));
        }
        else {
            return (Math.floor(secs / 60) + ":" + Math.floor(secs % 60));
        }
    }
}
