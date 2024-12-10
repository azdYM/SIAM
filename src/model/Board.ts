import Case from "./Case"
import Animal from "./Animal"
import { AnimalPosition, CaseContent, GridCasesType, ReserveCasesType, ReservedArea, VirtualGridType } from "../types"
import Game from "../controller/Game"
import BoardSetupper from "../service/BoardSetupper"


export default class Board {

    private playableCasesAtStart = [0, 1, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 23, 24]

    private morePlayableCasesAfterTwoTurns = [2, 22]

    private gridCases: GridCasesType = new Map()

    private reserveCases: ReserveCasesType = new Map() 

    /**
     * Garder l'état global du jeu en temps réel
     * 
     * E => Elephan
     * R => Rinhoceros
     * RO => Target (Rock)
     * null => Vide
     */
    private virtualGrid: VirtualGridType = new Map()

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

    public setupSections() {
        if (!this.game) throw new Error('Appelez la methode setGame')
        if (!this.boardSetupper) throw new Error('Appelez la methode setBoardSetupper')

        const section = this.boardSetupper.setupBoard(this.game.getPlayers())
        this.virtualGrid = section.virtualGrid
        this.gridCases = section.gridCases
        this.reserveCases = section.reserveCases
    }

    public openAnimalPositionTooltip(animal: Animal, cell: Case, e?: Event) {
        e?.preventDefault()
        cell.openAnimalPositionTooltip(animal)
    }

    private getEnterAllowedCases(moveNumber: number, area?: ReservedArea) {
        return this.getGridCases().filter(cell => {
            if (moveNumber >= 2) {
                return [...this.morePlayableCasesAfterTwoTurns, ...this.playableCasesAtStart].includes(cell.index)
            }

            return this.playableCasesAtStart.includes(cell.index)
        })
    }

    public updateVirtualGrid(newCaseIndex: number, caseContent: CaseContent) {
        let lastCaseIndex = caseContent!.getCurrentCell().index
        
        this.virtualGrid.set(lastCaseIndex, null)
        this.virtualGrid.set(newCaseIndex, caseContent!.getInitialName())
    }

    private getEntryPointsForArea(area: ReservedArea, moveNumber: number) {
        const allowedCases = this.getEnterAllowedCases(moveNumber, area)
        return allowedCases.filter(cell => this.isAvailable(cell))
    }

    public handleEnter(animal: Animal, cell: Case, position: AnimalPosition) {
        if (animal.getPosition() === position && animal.currentCell === cell) {
            return
        }

        if (!this.isAvailable(cell) && animal.currentCell !== cell) {
            console.warn("La case que vous voulez vous déplacez, n'est pas disponible")
            return
        }

        if (cell.isReserve()) {
            position = animal.reservedArea === 'bottom' ? 'top' : 'bottom'
        }

        this.game!.play(animal, cell, position)
    }

    public higlightCasesForAnimalSelected(cases: Case[], animal: Animal) {
        this.boardSetupper?.higlightCases(cases, animal)
    }

    public clearLastHiglightCases() {
        this.boardSetupper?.clearHiglightCases()
    }

    public getAvailableCasesForSelectedAnimal(animal: Animal, moveNumber: number) {
        const animalCell = animal.currentCell
        if (!animalCell) {
        throw new Error(`l'animal ${animal?.name} n'a pas de case`)
        }

        if (animalCell.isReserve()) {
            return this.getEntryPointsForArea(animalCell.reservedArea!, moveNumber)
        }

        const reservedCase = this.reserveCases.get(animal.reservedCellId)!
        return [...this.getAdjacentCases(animalCell, moveNumber), animalCell, reservedCase]
    }

    private getAdjacentCases(cell: Case, moveNumber: number): Case[] {
        const allowedCases = this.getMoveAllowedCases(moveNumber, cell)
        return allowedCases.filter(cell => this.isAvailable(cell))
    }

    private getMoveAllowedCases(moveNumber: number, cell: Case) {
        const orthogonalCasesIndex = [];
        const rowColumns = BoardSetupper.CASE_COLUMN_NUMBER
        const totalCases = BoardSetupper.CASE_COLUMN_NUMBER * BoardSetupper.CASE_ROW_NUMBER

        // Vérifie si l'index a une case "au-dessus"
        if (cell.index - rowColumns >= 0) {
            orthogonalCasesIndex.push(cell.index - rowColumns)
        }

        // Vérifie si l'index a une case "en dessous"
        if (cell.index + rowColumns < totalCases) {
            orthogonalCasesIndex.push(cell.index + rowColumns)
        }

        // Vérifie si l'index a une case "à gauche"
        if (cell.index % rowColumns !== 0) {
            orthogonalCasesIndex.push(cell.index - 1)
        }

        // Vérifie si l'index a une case "à droite"
        if ((cell.index + 1) % rowColumns !== 0) {
            orthogonalCasesIndex.push(cell.index + 1); // Case à droite
        }

        return orthogonalCasesIndex
            .filter(caseIndex => moveNumber >= 2 ? true : !this.morePlayableCasesAfterTwoTurns.includes(caseIndex))
            .map(caseIndex => this.gridCases.get(caseIndex)!)
    }

    public isAvailable(cell: Case) {
        if (this.virtualGrid.get(cell.index) === null) {
            return true
        }

        return false
    }

    public getGridCases() {
        return Array.from(this.gridCases.values())
    }

    public getReserveCases() {
        return Array.from(this.reserveCases.values())
    }

    public getPlayableCases(): Map<number, Case | null> {
        return this.gridCases
    }

    
}