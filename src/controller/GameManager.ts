import Animal from "../model/Animal";
import Case from "../model/Case";
import Game from "./Game";
import Player from "../model/Player";
import { AnimalPosition } from "../types";
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

        if (target instanceof Animal) {
            return this.animalCanPushAnimal(animal, target)
        }

        return false
    }

    private animalCanPushRock(animal: Animal, cell: Case) {
        const direction = this.getFacingDirection(cell.index, animal.currentCell.index)
        if (animal.getPosition() !== direction) {
            return false
        }

        if (this.isEmptyNextCase(cell.index, direction)) {
            return direction
        }
        
        return false
    }

    private isEmptyNextCase(cellIndex: number, direction: AnimalPosition) {
        const nextCase = this.gameSession?.getNextCaseInDirection(cellIndex, direction)
        if (!nextCase) {
            return false
        }

        const nextCaseContent = nextCase.getContent()
        if (!nextCaseContent) {
            return true
        }

        return false
    }

    private animalCanPushAnimal(animal: Animal, animalWillPushed: Animal) {
        const caseForAnimalWillPushed = animalWillPushed.currentCell
        const direction = this.getFacingDirection(caseForAnimalWillPushed.index, animal.currentCell.index)
        
        if (animal.getPosition() !== direction) {
            return false
        }

        if (this.heFaceThemself(animal.getPosition(), animalWillPushed.getPosition())) {
            return false
        }

        if (this.isEmptyNextCase(caseForAnimalWillPushed.index, direction)) {
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

    private heFaceThemself(firstDirection: AnimalPosition, secondDirection: AnimalPosition) {
        const themSelf = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        }

        return themSelf[firstDirection] === secondDirection
    }

    public next() {
        if (!this.gameSession) {
            throw new Error("Aucun session en cours ! s'il s'agit d'une erreur appeler la methode setGame dans Game")
        }
        const nexPlayerArea = this.currentPlayer?.area === 'bottom' ? 'top' : 'bottom'
        return this.setTurn(
            this.gameSession.getPlayers().get(nexPlayerArea)
        )
    }
}