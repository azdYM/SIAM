import Case from "./Case"
import Animal from "./Animal"
import Rock from "./Rock"
import { ReservedArea, PlayerCase, PlayerByArea } from "./types"
import BoardSetupAndInitialize from "./BoardSetupAndInitialize"

export default class Board {

    static CASE_COLUMN_NUMBER = 5
    static CASE_ROW_NUMBER = 5
    static CASE_SIZE = 61
    static LEFT_SPACE = 13
    static TOP_SPACE = 99

    private cases?: Set<Case>
    private animals?: Animal[]
    private rocks?: Rock[]

    constructor(
        private boardSetup: BoardSetupAndInitialize
    ) {}

    public setup() {
        const cases = this.boardSetup.setupGridArea()
        const reserveCases = this.boardSetup.setupReservedAreas()
        this.cases = new Set([...cases, ...reserveCases])
    }

    public initalize(players: PlayerByArea) {
        const playersCasesReserved: PlayerCase[] = this.getPlayersCasesReserved(players)
        this.animals = this.boardSetup.initializeAnimals(playersCasesReserved)
        this.rocks = this.boardSetup.initializeRocks(this.getCases().filter(c => !c.isReserve()))
    }

    public getEntryPointsForArea(area: ReservedArea, moveNumber: number) {
        const restrictedCasesIndex = [0, 1, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 23, 24]
        const unplayableCasesSecondTurn = [2, 22]
        console.log(moveNumber, 'move number')
        return this.getGridCases().filter(cell => {
            if (moveNumber > 2) {
                return [...restrictedCasesIndex, ...unplayableCasesSecondTurn].includes(cell.index)
            }

            return restrictedCasesIndex.includes(cell.index)
        })
    }

    public getAdjacentCases(cell: Case, moveNumber: number): Case[] {
        return []
    }

    public getGridCases() {
        return this.getCases().filter(cell => !cell.isReserve())
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

    private getPlayersCasesReserved(players: PlayerByArea) {  
        return this.getCases()
            .filter(cell => cell.isReserve())
            .map(cell => ({
                cell,
                player: players.get(cell.reservedArea!)!
            }))
    }
}