
import Case from "./Case";
import InteractorHTMLElement from "./InteractorHTMLElement";
import Player from "./Player";
import Rock from "./Rock";
import { AnimalName, AnimalPosition, ReservedArea } from "./types";

export default class Animal {
    public id: string|null = null
    public position?: AnimalPosition
    private reservedArea?: ReservedArea
    
    constructor(
        public name: AnimalName,
        public currentCell: Case,
        public player: Player,
        private interactorHTML: InteractorHTMLElement
    ) {
        this.position = currentCell.reservedArea === 'bottom' ? 'top' : 'bottom'
        this.reservedArea = currentCell.reservedArea
    }

    public setIdElement(id: string) {
        this.id = id
    }

    public enterOnBoard(cell: Case, position: AnimalPosition) {
        this.player.incrementMoveNumber()
        this.player.getCurrentSession().setTurn(this.player)
        this.interactorHTML.moveAnimalToCase(this, cell, position),

        console.log(this.player.getMoveNumber())
    }

    public moveToEmptyCase(cell: Case, position: AnimalPosition) {

    }

    public rotateAnimal(position: AnimalPosition) {

    }

    public removeFromBoard(cell: Case) {

    }

    public moveWithPush(pushed: Animal|Rock) {

    }
}

