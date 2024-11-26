import Board from './Board.ts'
import Player from './Player.ts'

export default class Game {

  constructor(
    private board: Board,
    private players: Player[]
  ) {}

  init() {
    this.board.setup()
    this.board.initalize()
  }

  start() {
    
  }
}