
import Case from "./Case";
import InteractorHTMLElement from "./InteractorHTMLElement";
import Player from "./Player";
import Rock from "./Rock";
import { AnimalName, AnimalPosition, ReservedArea } from "./types";

export default class Animal {
    public reservedArea?: ReservedArea
    public position?: AnimalPosition
    private interactorHTML?: InteractorHTMLElement
    
    constructor(
        public id: string,
        public name: AnimalName,
        public currentCell: Case,
        public player: Player,
    ) {
        this.position = currentCell.reservedArea === 'bottom' ? 'top' : 'bottom'
        this.reservedArea = currentCell.reservedArea
    }

    public onMove() {
        this.player.onPlay(this)
    }

    public setInteractorHTML(interactorHTML: InteractorHTMLElement) {
        this.interactorHTML = interactorHTML
    }

    public getPosition() {
        if (!this.position) {
            this.position = this.reservedArea === 'bottom' ? 'top' : 'bottom'
        }

        return this.position
    }

    public enterOnBoard(cell: Case, position: AnimalPosition) {
        this.handleMove(cell, position)
    }

    public moveToEmptyCase(cell: Case, position: AnimalPosition) {
        this.handleMove(cell, position)
    }

    public rotateAnimal(position: AnimalPosition) {

    }

    public removeFromBoard(cell: Case) {

    }

    public moveWithPush(pushed: Animal|Rock) {

    }

    private handleMove(cell: Case, position: AnimalPosition) {
        this.player.incrementMoveNumber()
        this.interactorHTML?.moveAnimalToCase(this, cell, position)
        this.currentCell = cell
    }
}

