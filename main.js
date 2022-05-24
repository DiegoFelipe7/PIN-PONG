/*
 *Creacion de la clase trablero con las propiedades de alto y ancho
 *
 */
(function () {
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
  };
  self.Board.prototype = {
    get elements() {
      let elements = this.bars;
      elements.push(ball);
      return elements;
    },
  };
})();
/**
 * Creacion de la clase vista del table con
 *
 *
 *
 **/
(function () {
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = this.board;
    this.ctx = canvas.getContext("2d");
  };
})();

self.addEventListener("load", main);
function main() {
  let board = new Board(800, 400);
  console.log(board);
  let canvas = document.getElementById("canvas");
  let board_view = new self.BoardView(canvas, board);
  console.log(board_view);
}
