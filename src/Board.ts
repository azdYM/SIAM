import Case from "./Case"
import Animal from "./Animal"
import { AnimalPosition } from "./types"
import Game from "./Game"
import BoardSetupper from "./BoardSetupper"

export default class Board {
    static CASE_SIZE = 61
    static LEFT_SPACE = 13
    static TOP_SPACE = 99

    private game?: Game
    private boardSetupper?: BoardSetupper

    public setGame(game: Game): this {
        this.game = game
        return this
    }

    public setBordSetupper(setupper: BoardSetupper): this {
        this.boardSetupper = setupper
        return this
    }

    public setupSections(gridCases: Case[], reserveCases: Case[]) {
        if (!this.game) throw new Error('Appelez la methode setGame')
        if (!this.boardSetupper) throw new Error('Appelez la methode setBoardSetupper')
        this.boardSetupper.setupArea(gridCases, 'grid')
        this.boardSetupper.setupArea(reserveCases, 'reserve')
    }

    public handleEnter(animal: Animal, cell: Case, position: AnimalPosition) {
        this.game!.move(animal, cell, position)
    }

    public higlightCasesForAnimalSelected(cases: Case[], animal: Animal) {
        this.boardSetupper?.higlightCases(cases, animal)
    }

    public clearLastHiglightCases() {
        this.boardSetupper?.clearHiglightCases()
    }
}