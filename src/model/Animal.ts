
import Case from "./Case";
import ICaseContent from "./ICaseContent";
import InteractorHTMLElement from "../view/InteractorHTMLElement";
import Player from "./Player";
import { AnimalName, AnimalPosition, ReservedArea } from "../types";

export default class Animal implements ICaseContent {
    public reservedArea: ReservedArea
    public reservedCellId: string
    private position?: AnimalPosition
    private HTMLInteractor?: InteractorHTMLElement
    
    constructor(
        public id: string,
        public name: AnimalName,
        public currentCell: Case,
        public player: Player,
    ) {
        this.position = currentCell.reservedArea === 'bottom' ? 'top' : 'bottom'
        this.reservedArea = currentCell.reservedArea!
        this.reservedCellId = currentCell.id
    }

    getId() {
        return this.id
    }

    public getCurrentCell(): Case {
        return this.currentCell
    }

    public updateCurrentCell(cell: Case): void {
        this.currentCell = cell
    }

    public getInitialName(): ("RO" | "E" | "R") {
        if (this.name === 'Eléphan') return "E"
        return "R"
    }

    public canMove() {
        return this.player.isMyTurn
    }

    public onMove() {
        this.player.onPlay(this)
    }

    public setHTMLInteractor(HTMLInteractor: InteractorHTMLElement) {
        this.HTMLInteractor = HTMLInteractor
    }

    public getPosition() {
        if (!this.position) {
            this.position = this.reservedArea === 'bottom' ? 'top' : 'bottom'
        }

        return this.position
    }

    public async enterOnBoard(cell: Case, position: AnimalPosition) {
        if (!this.HTMLInteractor) {
            throw new Error("Le HTMLInteractor n'est activé veuillez l'avtivez en appellant setHTMLInteractor")
        }
        
        await this.HTMLInteractor.moveAnimalToCase(this, cell, position)
        this.handleMove(position, cell)
    }

    public async move(cell: Case, position: AnimalPosition) {
        if (!this.HTMLInteractor) {
            throw new Error("Le HTMLInteractor n'est activé veuillez l'avtivez en appellant setHTMLInteractor")
        }
        
        await this.HTMLInteractor.moveAnimalToCase(this, cell, position)
        this.handleMove(position, cell)
    }

    public async moveWithPush(pushed: ICaseContent) {
        if (!this.HTMLInteractor) {
            throw new Error("Le HTMLInteractor n'est activé veuillez l'avtivez en appellant setHTMLInteractor")
        }
        
        await this.HTMLInteractor.moveAnimalWithPush(this, pushed)
        this.handleMove(this.position!)
    }

    private handleMove(position: AnimalPosition, cell?: Case) {
        this.player.incrementMoveNumber()
        this.position = position

        if (cell)
            this.currentCell = cell
    }
}

