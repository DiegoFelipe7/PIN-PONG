/**
 *Board function for the height and width of the main board
 *@param width board width
 *@param height board height
 */
(function () {
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playin = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
    this.playin = false;
  };

  self.Board.prototype = {
    get elements() {
      let elements = this.bars.map(function (bar) {
        return bar;
      });
      elements.push(this.ball);
      return elements;
    },
  };
})();
/**
 * @param x position on the x axis
 * @param y position on the y axis
 * @param radius radius of the ball
 * @param board board position
 */
(function () {
  self.Ball = function (x, y, radius, board) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedY = 0;
    this.speedX = 3;
    this.board = board;
    this.direction = 1;
    this.bounce_angle = 0;
    this.max_bounce_angle = Math.PI / 12;
    this.speed = 3;

    board.ball = this;
    this.kind = "circle";
  };
  self.Ball.prototype = {
    move: function () {
      this.x += this.speedX * this.direction;
      this.y += this.speedY * this.direction;
    },
    get width() {
      return this.radius * 2;
    },
    get height() {
      return this.radius * 2;
    },
    collision: function (bar) {
      let relative_intersect_y = bar.y + bar.height / 2 - this.y;

      let normalized_intersect_y = relative_intersect_y / (bar.height / 2);

      this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

      this.speedY = this.speed * -Math.sin(this.bounce_angle);
      this.speedX = this.speed * Math.cos(this.bounce_angle);

      if (this.x > this.board.width / 2) this.direction = -1;
      else this.direction = 1;
    },
  };
})();

/**
 * class that creates the sidebars on the game board
 * @param x x-axis coordinates
 * @param y y-axis coordinates
 * @param width bar width
 * @param height high of the bar
 * @param board
 */
(function () {
  self.Bar = function (x, y, width, height, board) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.board = board;
    this.board.bars.push(this);
    this.kind = "rectangle";
    this.speed = 8;
  };
  /**
   * functions that change the position of the sidebars
   */
  self.Bar.prototype = {
    down: function () {
      this.y += this.speed;
    },
    up: function () {
      this.y -= this.speed;
    },
    toString: function () {
      return "x: " + this.x + " y: " + this.y;
    },
  };
})();

(function () {
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  };

  self.BoardView.prototype = {
    clean: function () {
      this.ctx.clearRect(0, 0, board.width, board.height);
    },
    draw: function () {
      for (let i = this.board.elements.length - 1; i >= 0; i--) {
        let el = this.board.elements[i];

        draw(this.ctx, el);
      }
    },
    checkCollisions: function () {
      for (let i = this.board.bars.length - 1; i >= 0; i--) {
        let bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collision(bar);
        }
      }
    },
    play: function () {
      if (this.board.playin) {
        this.clean();
        this.draw();
        this.checkCollisions();
        this.board.ball.move();
      }
    },
  };
  /**
   * method that checks collisions
   * @param  a coordinates x
   * @param  b coordinates y
   * @returns boolean
   */
  function hit(a, b) {
    let hit = false;
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
    }
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
    }
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
    }
    return hit;
  }

  function draw(ctx, element) {
    switch (element.kind) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, 7);
        ctx.fill();
        ctx.closePath();
        break;
    }
  }
})();
/**
 * creation of objectss
 */

const board = new Board(1000, 600);
const bar = new Bar(20, 100, 40, 100, board);
const bar2 = new Bar(935, 100, 40, 100, board);
const canvas = document.getElementById("canvas");
const board_view = new BoardView(canvas, board);
const ball = new Ball(350, 100, 10, board);

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 38) {
    e.preventDefault();
    bar.up();
  } else if (e.keyCode == 40) {
    e.preventDefault();
    bar.down();
  } else if (e.keyCode === 87) {
    e.preventDefault();
    bar2.up();
  } else if (e.keyCode === 83) {
    e.preventDefault();
    bar2.down();
  } else if (e.keyCode === 32) {
    e.preventDefault();
    board.playin = !board.playin;
  }
});

window.requestAnimationFrame(Controller);
board_view.draw();
function Controller() {
  board_view.play();
  window.requestAnimationFrame(Controller);
}
