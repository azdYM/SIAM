import Animal from './Animal.ts'
import Board from './Board.ts'
import Case from './Case.ts'
import GameManager from './GameManager.ts'
import Player from './Player.ts'
import { AnimalPosition, PlayerByArea } from './types.ts'

export default class Game {

  private players?: PlayerByArea
  private currentPlayer?: Player
  private selectedAnimal?: Animal
  public board?: Board

  constructor(
    private gameManager: GameManager
  ) {}

  public start() {
    if (!this.players) throw new Error('Les joueurs ne sont pas définit')
    if (!this.board) throw new Error("Le plateau n'est pas définit")
    this.init()
    this.setTurn(this.players.get('bottom')!)
  }

  public move(animal: Animal, cell: Case, position: AnimalPosition) {
    if (animal.currentCell.isReserve()) {
      animal.enterOnBoard(cell, position)
      return this.next()
    }

    if (this.gameManager.canMoveAnimal(animal)) {
      animal.moveToEmptyCase(cell, position)
      return this.next()
    }

    if (this.gameManager.canMoveAnimalAndPushContent()) {
      const caseContent = cell.getContent()
      if (!caseContent) {
        throw new Error('Ce case ne contient ni animal ni rochet')
      }
      animal.moveWithPush(caseContent)
      return this.next()
    }
  }

  private next() {
    const nexPlayerArea = this.currentPlayer?.area === 'bottom' ? 'top' : 'bottom'
    return this.setTurn(this.players?.get(nexPlayerArea))
  }

  public isSameAnimalSelected(animal: Animal) {
    return this.selectedAnimal === animal
  }

  public updateSelectedAnimal(animal: Animal) {
    this.board!.clearLastHiglightCases()
    this.selectedAnimal = animal
  }

  public getAvailableCases(moveNumber: number): Case[] {
    if (!this.selectedAnimal) throw new Error('Aucun animal sélectionner')
    return this.gameManager.getAvailableCasesForSelectedAnimal(this.selectedAnimal, moveNumber)
  }

  public setTurn(nextPlayer?: Player) {
    this.currentPlayer?.setTurn(false)
    this.currentPlayer = nextPlayer?.setTurn(true)
  }

  public setPlayers(playerBySide: PlayerByArea) {
    this.players = playerBySide
    return this
  }

  public getPlayers() {
    return this.players!
  }

  public setBoard(board: Board) {
    this.board = board
    return this
  }

  private init() {
    this.gameManager.initGame(this)
    this.board!.setupSections(
      this.gameManager.getGridCases(), 
      this.gameManager.getReserveCases()
    )
  }
}