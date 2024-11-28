
import Case from "./Case";
import Game from "./Game";
import InteractorHTMLElement from "./InteractorHTMLElement";
import Player from "./Player";
import Rock from "./Rock";
import { AnimalName, AnimalPosition, ReservedArea } from "./types";

export default class Animal {
    public id: string|null = null
    public position?: AnimalPosition
    private reservedArea?: ReservedArea
    private gameSession: Game
    private interactorHTML: InteractorHTMLElement
    
    constructor(
        public name: AnimalName,
        public currentCell: Case,
        public player: Player,
    ) {
        this.position = currentCell.reservedArea === 'bottom' ? 'top' : 'bottom'
        this.reservedArea = currentCell.reservedArea
        this.gameSession = this.player.getCurrentSession()
        this.interactorHTML = new InteractorHTMLElement()
    }

    public setIdElement(id: string) {
        this.id = id
    }

    onMove() {
        if (!this.player.isCurrentTurn) {
            console.warn(`${this.player.name} ce n'est pas ton tour mec 😒`)
            return
        }
        
        const availableCases = this.gameSession.getAvailableMovesFor(
            this.currentCell, 
            this.player.getMoveNumber()
        )
        this.interactorHTML.highlightAndAddEventListener(availableCases, this)
    }

    public enterOnBoard(cell: Case, position: AnimalPosition) {
        this.player.incrementMoveNumber()
        this.interactorHTML.moveAnimalToCase(this, cell, position)
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

