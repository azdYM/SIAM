import Board from './Board.ts'
import Case from './Case.ts'
import GameRules from './GameRules.ts'
import Player from './Player.ts'
import { PlayerByArea, ReservedArea } from './types.ts'

export default class Game {

  private players?: PlayerByArea
  private nextPlayer?: Player

  constructor(
    private board: Board,
    private gameRules: GameRules
  ) {}

  public setPlayers(playerBySide: PlayerByArea) {
    this.players = playerBySide
  }

  public start() {
    this.init()
    this.nextPlayer?.setTurn(true)
  }

  public getAvailableMovesFor(cell: Case, moveNumber: number): Case[] {
    if (cell.isReserve()) {
      const entryPoints = this.board.getEntryPointsForArea(cell.reservedArea!, moveNumber)
      return entryPoints.filter(entry => this.gameRules.isEntryAllowed(entry))
    }
    
    const adjacentCases = this.board.getAdjacentCases(cell, moveNumber)
    return adjacentCases.filter(entry => this.gameRules.isEntryAllowed(entry))
  }

  public setTurn(currentPlayer: Player) {
    currentPlayer.setTurn(false)
    this.nextPlayer = this.players?.get(currentPlayer.area === 'bottom' ? 'top' : 'bottom')
    this.nextPlayer?.setTurn(true)
  }

  private init() {
    if (!this.players) throw new Error('Les joueurs ne sont pas définis')
    this.board.setup()
    this.board.initalize(this.players)
    this.nextPlayer = this.players.get('bottom')
  }
}