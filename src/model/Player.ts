import Animal from "./Animal"
import Game from "../controller/Game"
import { ReservedArea } from "../types"

export default class Player {
    public isMyTurn: boolean = false
    private moveNumber: number = 0

    constructor(
        public name: string,
        public area: ReservedArea,
        private game: Game
    ) {}

    public setTurn(isPlayerTurn: boolean) {
        this.isMyTurn = isPlayerTurn
        return this
    }

    public getCurrentSession() {
        return this.game
    }

    public onPlay(animal: Animal) {
        if (!this.isMyTurn) {
            console.warn(`${this.name} ce n'est pas ton tour mec 😒`)
            return
        }

        if (this.game.isSameAnimalSelected(animal)) {
            return
        }

        this.game.updateSelectedAnimal(animal)
        const availableCases = this.game.getAvailableCases(this.moveNumber)
        this.game.board!.higlightCasesForAnimalSelected(availableCases, animal)
    }

    public incrementMoveNumber() {
        this.moveNumber++
    }

    public getMoveNumber() {
        return this.moveNumber
    }
}