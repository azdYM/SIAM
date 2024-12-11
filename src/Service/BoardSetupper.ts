import Animal from "../model/Animal"
import Case from "../model/Case"
import InitializerHTMLElement from "../view/InitializerHTMLElement"
import InteractorHTMLElement from "../view/InteractorHTMLElement"
import { AnimalName, GridCasesType, PlayerByArea, ReserveCasesType, VirtualGridType } from "../types"
import { getThreeMiddleElements } from "../utils"
import { createAnimal, createCase, createRock } from "../service/factory"

export default class BoardSetupper {
    static CASE_SIZE = 61
    static LEFT_SPACE = 12
    static TOP_SPACE = 99
    static CASE_COLUMN_NUMBER = 5
    static CASE_ROW_NUMBER = 5

    constructor(
        private initializerHTML: InitializerHTMLElement,
        private interactorHTML: InteractorHTMLElement
    ) {}

    public setupBoard(players: PlayerByArea) {
        const virtualGrid: VirtualGridType = new Map
        const gridCases: GridCasesType = this.initializeGridCases(virtualGrid)
        const reserveCases: ReserveCasesType = this.initializeReserveCases(players)

        this.initializerHTML.setupAreaElement(Array.from(gridCases.values()), 'grid')
        this.initializerHTML.setupAreaElement(Array.from(reserveCases.values()), 'reserve')

        return {virtualGrid, gridCases, reserveCases}
    }

    public higlightCases(cases: Case[], animal: Animal) {
        this.interactorHTML.highlightCasesAndSetEventForAnimal(cases, animal)
    }

    public clearHiglightCases() {
        this.interactorHTML.clearHiglightCases()
    }    

    private initializeGridCases(virtualGrid: VirtualGridType) {
        const totalGridCases = BoardSetupper.CASE_COLUMN_NUMBER * BoardSetupper.CASE_ROW_NUMBER
        const gridCases: GridCasesType = new Map()

        for (let cellIndex = 0; cellIndex < totalGridCases; cellIndex++) {
            const idCase = `grid-${cellIndex}`
            gridCases.set(cellIndex, createCase(idCase, cellIndex, 'grid'))
            virtualGrid.set(cellIndex, null)
        }

        const middleCases = getThreeMiddleElements(Array.from(gridCases.values()))
        this.addRocksInCases(middleCases, virtualGrid)
        return gridCases
    }

    private addRocksInCases(cases: Case[], virtualGrid: VirtualGridType) {
        cases.forEach((cell, index) => {
            cell.updateCurrentContent(createRock(`rock-${index+1}`, cell))
            virtualGrid.set(cell.index, 'RO')
        })
    }

    private initializeReserveCases(players: PlayerByArea) {
        const reserveCases: ReserveCasesType = new Map()

        for (let side = 1; side <= 2; side++) {
            const player = players.get(side === 1 ? 'top' : 'bottom')!
            const name: AnimalName = player.area === 'top' ? 'Rhinocéros' : 'Eléphan'
            for (let cellIndex = 0; cellIndex < BoardSetupper.CASE_ROW_NUMBER; cellIndex++) {
                const area = side === 1 ? 'top' : 'bottom'
                const idCase = `${area}-reserved-${cellIndex}`
                const idAnimal = `${name}-${cellIndex}`
                const cell = createCase(idCase, cellIndex, 'reserve', area)
                const animal = createAnimal(idAnimal, name, cell, player)
                
                cell.updateCurrentContent(animal)
                reserveCases.set(idCase, cell)
            }
        }

        return reserveCases
    }
}