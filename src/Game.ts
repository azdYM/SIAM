import Animal from './Animal.ts'
import Board from './Board.ts'
import Case from './Case.ts'
import GameRules from './GameRules.ts'
import Player from './Player.ts'
import { PlayerByArea } from './types.ts'

export default class Game {

  private players?: PlayerByArea
  private nextPlayer?: Player
  private selectedAnima?: Animal

  constructor(
    public board: Board,
    private gameRules: GameRules
  ) {}

  public setPlayers(playerBySide: PlayerByArea) {
    this.players = playerBySide
  }

  public start() {
    this.init()
    this.nextPlayer?.setTurn(true)
  }

  public isSameAnimalSelected(animal: Animal) {
    return this.selectedAnima === animal
  }

  public updateSelectedAnimal(animal: Animal) {
    this.board.clearLastHiglightCases()
    this.selectedAnima = animal
  }

  public getAvailableCases(moveNumber: number): Case[] {
    const animalCell = this.selectedAnima?.currentCell
    if (!animalCell) {
      throw new Error(`l'animal ${this.selectedAnima?.name} n'a pas de case`)
    }

    if (animalCell.isReserve()) {
      const entryPoints = this.board.getEntryPointsForArea(animalCell.reservedArea!, moveNumber)
      return entryPoints.filter(entry => this.gameRules.isEntryAllowed(entry))
    }
    
    const adjacentCases = this.board.getAdjacentCases(animalCell, moveNumber)
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