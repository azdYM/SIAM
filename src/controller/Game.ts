import Animal from '../model/Animal.ts'
import Board from '../model/Board.ts'
import Case from '../model/Case.ts'
import GameManager from './GameManager.ts'
import { AnimalPosition, PlayerByArea } from '../types.ts'

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
    this.gameManager.init(this)
    this.board.setupSections()
  }

  public play(animal: Animal, cell: Case, position: AnimalPosition) {
    if (this.gameManager.canEnterAnimal(animal, cell)) {
      animal.enterOnBoard(cell, position)
      this.gameManager.next()
      return this.board?.updateGrid(cell, animal)
    }

    if (this.gameManager.canMoveAnimal(animal, cell)) {
      animal.move(cell, position)
      this.gameManager.next()
      return this.board?.updateGrid(cell, animal)
    }

    const direction = this.gameManager.canAnimalPushContentCase(animal, cell)
    if (direction) {
      const caseContent = cell.getContent()
      if (!caseContent) {
        throw new Error('Ce case ne contient ni animal ni rochet')
      }

      const toCase = this.getNextCaseInDirection(cell.index, direction)
      if (toCase === undefined) {
        console.warn(`Impossible de déplacer ${animal.id}`)
        return
      }
      
      this.board?.updateGridWhenPush(animal, caseContent, toCase)
      animal.moveWithPush(caseContent)
      return this.gameManager.next()
    }
  }

  public getNextCaseInDirection(cellIndex: number, direction: AnimalPosition) {
    return this.board?.findNextCaseInDirection(cellIndex, direction)
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

  public getVirtualState() {
    return this.board?.getVirtualStateGame()
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