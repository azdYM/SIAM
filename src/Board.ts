import Case from "./Case"
import BoardSetup from "./BoardSetupAndInitialize"
import Animal from "./Animal"
import Rock from "./Rock"

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
        private mainBoardElement: HTMLDivElement,
        private topExternalAreaElement: HTMLDivElement,
        private bottomExternalAreaElement: HTMLDivElement,
        private boardSetup: BoardSetup
    ) {}

    public setup() {
        const internalCases = this.boardSetup.setupMainBoard(this.mainBoardElement)
        const externalCases = this.boardSetup.setupExternalAreas(this.topExternalAreaElement, this.bottomExternalAreaElement)
        this.cases = new Set([...internalCases, ...externalCases])
    }

    public initalize() {
        this.animals = this.boardSetup.initializeAnimals(this.getCases().filter(c => c.isExternal()))
        this.rocks = this.boardSetup.initializeRocks(this.getCases().filter(c => !c.isExternal()))
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
}