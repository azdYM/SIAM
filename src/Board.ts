import Case from "./Case"
import Animal from "./Animal"
import Rock from "./Rock"
import { PlayerCase, PlayerByArea, AnimalPosition } from "./types"
import Game from "./Game"
import BoardSetupper from "./BoardSetupper"

export default class Board {

    static CASE_COLUMN_NUMBER = 5
    static CASE_ROW_NUMBER = 5
    static CASE_SIZE = 61
    static LEFT_SPACE = 13
    static TOP_SPACE = 99

    private cases?: Set<Case>
    private animals?: Animal[]
    private rocks?: Rock[]
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

    public getCases() {
        if (!this.cases) return []
        return Array.from(this.cases.values())
    }

    public getAnimals() {
        return this.animals
    }

    public getRocks() {
        return this.rocks
    }

    public higlightCasesForAnimalSelected(cases: Case[], animal: Animal) {
        this.boardSetupper?.higlightCases(cases, animal)
    }

    public clearLastHiglightCases() {
        this.boardSetupper?.clearHiglightCases()
    }

    private getPlayersCasesReserved(players: PlayerByArea) {  
        return this.getCases()
            .filter(cell => cell.isReserve())
            .map(cell => ({
                cell,
                player: players.get(cell.reservedArea!)!
            }))
    }
}