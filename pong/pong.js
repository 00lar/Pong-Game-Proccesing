 let leftPaddle, rightPaddle;
    let ball;
    let leftScore = 0, rightScore = 0;
    let ballSpeed;
    let gameTime = 0;

    function setup() {
      createCanvas(800, 600);
      leftPaddle = new Paddle(20, height / 2, color(255, 0, 0));
      rightPaddle = new Paddle(width - 20, height / 2, color(0, 0, 255));
      ball = new Ball(width / 2, height / 2, 15);
      ballSpeed = createVector(5, 5);
    }

    function draw() {
      background(0);

      // Draw paddles
      leftPaddle.show();
      rightPaddle.show();

      // Draw ball
      ball.show();
      ball.update();
      ball.checkCollision(leftPaddle);
      ball.checkCollision(rightPaddle);

      // Move paddles
      leftPaddle.move();
      rightPaddle.move();


      // Draw scores
      fill(255);
      textSize(32);
      text(leftScore, width / 4, 50);
      text(rightScore, 3 * width / 4, 50);

      // Check for score
      if (ball.isOut()) {
        if (ball.x < 0) {
          rightScore++;
        } else {
          leftScore++;
        }
        ball.reset();
      }

      // Check for game end
      if (leftScore >= 9 && leftScore - rightScore >= 2) {
        alert("Left player wins!");
        resetGame();
      } else if (rightScore >= 9 && rightScore - leftScore >= 2) {
        alert("Right player wins!");
        resetGame();
      }

      // Increment ball speed every minute
      gameTime += deltaTime;
      if (gameTime >= 60000) {
        gameTime = 0;
        ballSpeed.add(1, 1);
      }
    }

    function resetGame() {
      leftScore = 0;
      rightScore = 0;
      ball.reset();
      ballSpeed = createVector(5, 5);
    }

    class Paddle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 80;
        this.color = color;
      }

      show() {
        fill(this.color);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
      }
  //Controles
      move() {
        if (keyIsDown(UP_ARROW) && this.y - this.h / 2 > 0) {
          this.y -= 5;
        }
        if (keyIsDown(DOWN_ARROW) && this.y + this.h / 2 < height) {
          this.y += 5;
        }
      }
    }

    class Ball {
      constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.reset();
      }

      show() {
        fill(255);
        ellipse(this.x, this.y, this.r * 2);
      }

      update() {
        this.x += ballSpeed.x;
        this.y += ballSpeed.y;

        // Check boundaries
        if (this.y - this.r < 0 || this.y + this.r > height) {
          ballSpeed.y *= -1;
        }
      }

      checkCollision(paddle) {
        if (
          this.x - this.r < paddle.x + paddle.w / 2 &&
          this.x + this.r > paddle.x - paddle.w / 2 &&
          this.y - this.r < paddle.y + paddle.h / 2 &&
          this.y + this.r > paddle.y - paddle.h / 2
        ) {
          ballSpeed.x *= -1;
        }
      }

      isOut() {
        return this.x - this.r < 0 || this.x + this.r > width;
      }

      reset() {
        this.x = width / 2;
        this.y = height / 2;
      }
    }
