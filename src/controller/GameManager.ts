import Animal from "../model/Animal";
import Case from "../model/Case";
import Game from "./Game";
import Player from "../model/Player";
import { AnimalPosition, VirtualGridType } from "../types";
import Rock from "../model/Rock";
import BoardSetupper from "../service/BoardSetupper";


export default class GameManager {

    private currentPlayer?: Player

    private gameSession?: Game

    public init(game: Game) {
        const firstPlayer = game.getPlayers().get('bottom')
        this.gameSession = game
        this.setTurn(firstPlayer)
    }
    
    public setTurn(nextPlayer?: Player) {
        this.currentPlayer?.setTurn(false)
        this.currentPlayer = nextPlayer?.setTurn(true)
    }
    
    public canEnterAnimal(animal: Animal, cell: Case) {
        if (animal.currentCell.isReserve() && this.isAvailableCase(cell)) {
            return true
        }

        return false
    }

    public canMoveAnimal(animal: Animal, cell: Case) {
        if (animal.currentCell.id === cell.id) {
            return true
        }

        if (!animal.currentCell.isReserve() && this.isAvailableCase(cell)) {
            return true
        }

        return false
    }

    public isAvailableCase(cell: Case) {
        if (this.gameSession?.getVirtualState()?.get(cell.index) === null) {
            return true
        }

        return false
    }

    public canMoveAnimalAndPushContent(animal: Animal, cell: Case) {
        if (this.canAnimalPushContentCase(animal, cell)) {
            return true
        }

        return false
    }

    public canAnimalPushContentCase(animal: Animal, cell: Case) {
        const target = cell.getContent()
        if (target instanceof Rock) {
            return this.animalCanPushRock(animal, cell)
        }

        return false
    }

    private animalCanPushRock(animal: Animal, cell: Case) {
        const direction = this.getFacingDirection(cell.index, animal.currentCell.index)
        console.log(direction, "direction")
        if (animal.getPosition() === direction) {
            return direction
        }

        return false
    }

    private getFacingDirection(fromCaseIndex: number, toCaseIndex: number): AnimalPosition|null {
        if (fromCaseIndex + BoardSetupper.CASE_COLUMN_NUMBER === toCaseIndex) {
            return 'top'
        }

        if (fromCaseIndex - BoardSetupper.CASE_COLUMN_NUMBER === toCaseIndex) {
            return 'bottom'
        }

        if (fromCaseIndex + 1 === toCaseIndex) {
            return 'left'
        }

        if (fromCaseIndex - 1 === toCaseIndex) {
            return 'right'
        }

        return null
    }

    public next() {
        if (!this.gameSession) {
            throw new Error("Aucun session en cours ! s'il s'agit d'une erreur appelé la methode setGame dans Game")
        }
        const nexPlayerArea = this.currentPlayer?.area === 'bottom' ? 'top' : 'bottom'
        return this.setTurn(
            this.gameSession.getPlayers().get(nexPlayerArea)
        )
    }
}