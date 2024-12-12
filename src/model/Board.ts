import Case from "./Case"
import Animal from "./Animal"
import { AnimalPosition, CaseContent, GridCasesType, ReserveCasesType, ReservedArea, VirtualGridType } from "../types"
import Game from "../controller/Game"
import BoardSetupper from "../service/BoardSetupper"
import ICaseContent from "./ICaseContent"


export default class Board {

    private playableCasesAtStart = [0, 1, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 23, 24]

    private morePlayableCasesAfterTwoTurns = [2, 22]

    private gridCases: GridCasesType = new Map()

    private reserveCases: ReserveCasesType = new Map() 

    private animales: Map<string, Animal> = new Map()

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
        this.setAnimals()
    }

    private setAnimals() {
        this.reserveCases.forEach(reserveCell => {
            const animal = reserveCell.getContent()
            if (animal instanceof Animal) {
                this.animales.set(animal.id, animal)
            }
        })
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

    public updateGrid(newCase: Case, caseContent: CaseContent) {
        const lastContentCase = caseContent!.getCurrentCell()
        lastContentCase.updateCurrentContent()

        newCase.updateCurrentContent(caseContent)
        caseContent?.updateCurrentCell(newCase)

        this.virtualGrid.set(lastContentCase.index, null)
        this.virtualGrid.set(newCase.index, caseContent!.getInitialName())
    }

    public updateGridWhenPush(animal: Animal, pushed: ICaseContent, nextPushedCase: Case) {

        const lastAnimalCaseIndex = animal.getCurrentCell().index
        const lastPushedCaseIndex = pushed.getCurrentCell().index

        // 1. Mets à jour la cellule actuelle de l'animal
        animal.updateCurrentCell(this.gridCases.get(lastPushedCaseIndex)!)
        this.gridCases.get(lastAnimalCaseIndex)?.updateCurrentContent()

        // 2. Mets à jour la cellule actuelle du contenu poussé
        nextPushedCase.updateCurrentContent(pushed);
        pushed.updateCurrentCell(nextPushedCase);

        // 3. Mets à jour les grilles virtuelles
        this.virtualGrid.set(lastAnimalCaseIndex, null);
        this.virtualGrid.set(lastPushedCaseIndex, animal.getInitialName())
        this.virtualGrid.set(nextPushedCase.index, pushed.getInitialName())
    }

    private getEntryPointsForArea(area: ReservedArea, moveNumber: number) {
        const allowedCases = this.getEnterAllowedCases(moveNumber, area)
        return allowedCases.filter(cell => this.isAvailable(cell))
    }

    public handleEnter(animal: Animal, cell: Case, position: AnimalPosition) {
        if (animal.getPosition() === position && animal.currentCell === cell) {
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
        return this.getMoveAllowedCases(moveNumber, cell)
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

    public getVirtualStateGame() {
        return this.virtualGrid
    }

    public getAnimals(): Map<string, Animal> {
        return this.animales
    }

    public findNextCaseInDirection(caseIndex: number, direction: AnimalPosition) {
        const index = {
            top: caseIndex - BoardSetupper.CASE_COLUMN_NUMBER ,
            bottom: caseIndex + BoardSetupper.CASE_COLUMN_NUMBER,
            left: caseIndex - 1,
            right: caseIndex + 1
        }

        return this.gridCases.get(index[direction])
    }
}