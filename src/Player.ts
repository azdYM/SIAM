import Animal from "./Animal"
import Game from "./Game"
import { ReservedArea } from "./types"

export default class Player {

    public isCurrentTurn: boolean = false
    private moveNumber: number = 0

    constructor(
        public name: string,
        public area: ReservedArea,
        private game: Game
    ) {}

    public setTurn(isPlayerTurn: boolean) {
        this.isCurrentTurn = isPlayerTurn
    }

    public getCurrentSession() {
        return this.game
    }

    public onPlay(animal: Animal) {
        animal.onMove()
    }

    public incrementMoveNumber() {
        this.moveNumber++
    }

    public getMoveNumber() {
        return this.moveNumber
    }
}