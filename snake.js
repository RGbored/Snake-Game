document.addEventListener("keydown", registerMove);
let score = 0;
const board = document.getElementById("board");
const ctx = board.getContext("2d");
const square = 20;
let snake = [{x: 280, y: 220}];
let move = {x: square, y: 0};
let moves = [];
let changingDirection = false;
let game_over = false;
let food_x = -1;
let food_y = -1;

function random_food(min, max){
    return Math.round((Math.random()*(max-min)-min)/square)*square;
}

function gen_food(){
    food_x = random_food(0, board.width-square);
    food_y = random_food(0, board.height-square);
    snake.forEach(function snake_has_eaten(part){
        const hasEaten = part.x === food_x && part.y === food_y;
        if(hasEaten) gen_food();
    });
}

function drawFood(){
    ctx.fillStyle = "red";
    ctx.strokestyle = "brown";
    ctx.fillRect(food_x, food_y, square, square);
    ctx.strokeRect(food_x, food_y, square, square);
}

function draw_rect(snake_part){
    ctx.fillStyle = "lightblue";
    ctx.strokestyle = "darkblue";
    ctx.fillRect(snake_part.x, snake_part.y, square, square);
    ctx.strokeRect(snake_part.x, snake_part.y, square, square);
}

function clear_canvas(){
    ctx.fillStyle = "white";
    ctx.strokestyle = "black";
    ctx.fillRect(0, 0, board.width, board.height);
    ctx.strokeRect(0, 0, board.width, board.height);
}

function draw_snake(){
    snake.forEach(snake_part => {
        draw_rect(snake_part)
    });
}

function moveSnake()
{
    let head = {x: snake[0].x+move.x, y: snake[0].y + move.y};
    snake.unshift(head);
    const hasEaten = snake[0].x === food_x && snake[0].y === food_y;
    if(hasEaten){
        score += 1;
        document.getElementById("score").innerHTML = "Score: "+score;
        gen_food();
    }
    else{
        snake.pop();
    }
}

function checkGameOver(){
    for(let i=2; i<snake.length; i++)
    {
        if(snake[i].x===snake[0].x && snake[i].y===snake[0].y) {
            game_over = true;
        }
    }
    let head = snake[0];
    if(head.x<0 || head.y<0 || head.x > board.width - square  || head.y > board.height - square)
    {
        game_over = true;
    }
    if(game_over)
    document.getElementById("score").innerHTML+="<Br> Game Over!    "
}

function registerMove(event)
{
    moves.push(event);
}
function changeDirection(event){
    const LeftKey = 37;
    const RightKey = 39;
    const UpKey = 38;
    const DownKey = 40;

    const keypressed = event.keyCode;
    const goingUp = move.y === -square;
    const goingDown = move.y === square;
    const goingLeft = move.x === -square;
    const goingRight = move.x === square;
    // console.log(goingUp, goingDown, goingLeft, goingRight);
    if(changingDirection) return;
    changingDirection = true;

    if(keypressed===LeftKey && !goingRight)
    {
        move.x = -square;
        move.y = 0;
    }
    if(keypressed===RightKey && !goingLeft)
    {
        move.x = square;
        move.y = 0;
    }
    if(keypressed===UpKey && !goingDown)
    {
        move.x = 0;
        move.y = -square;
    }
    if(keypressed===DownKey && !goingUp)
    {
        move.x = 0;
        move.y = square;
    }
}


function main(){
    if(game_over) return;
    changingDirection = false;
    setTimeout(function onTick(){
        clear_canvas();
        if(food_x ===-1 && food_y === -1) gen_food();
        if(moves.length!=0)
        {
            changeDirection(moves[0]);
            moves.shift();
        }
        moveSnake();
        draw_snake(snake);
        drawFood();
        checkGameOver();
        main();
    }, 100)
}

main();