import Animal from './Animal.ts'
import Board from './Board.ts'
import Case from './Case.ts'
import GameManager from './GameManager.ts'
import { AnimalPosition, PlayerByArea } from './types.ts'

export default class Game {

  private players?: PlayerByArea
  public board?: Board
  private selectedAnimal?: Animal

  constructor(
    private gameManager: GameManager
  ) {}

  public start() {
    if (!this.players) throw new Error('Les joueurs ne sont pas définit')
    if (!this.board) throw new Error("Le plateau n'est pas définit")
    this.board.setupSections()
    this.gameManager.init(this)
  }

  public play(animal: Animal, cell: Case, position: AnimalPosition) {
    if (this.gameManager.canEnterAnimal(animal, cell)) {
      animal.enterOnBoard(cell, position)
      this.board?.updateVirtualGrid(cell.index, animal)
      return this.gameManager.next()
    }

    if (this.gameManager.canMoveAnimal(animal, cell)) {
      animal.moveToEmptyCase(cell, position)
      this.board?.updateVirtualGrid(cell.index, animal)
      return this.gameManager.next()
    }

    if (this.gameManager.canMoveAnimalAndPushContent()) {
      const caseContent = cell.getContent()
      if (!caseContent) {
        throw new Error('Ce case ne contient ni animal ni rochet')
      }
      animal.moveWithPush(caseContent)
      this.board?.updateVirtualGrid(cell.index, animal)
      return this.gameManager.next()
    }
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
    return this.board!.getAvailableCasesForSelectedAnimal(this.selectedAnimal, moveNumber)
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
}