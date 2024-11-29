import Animal from "./Animal";
import Case from "./Case";
import { createAnimal, createCase, createRock } from "./factory";
import Game from "./Game";
import { AnimalName, Area, ReservedArea } from "./types";
import { getThreeMiddleElements } from "./utils";


export default class GameManager {
    static CASE_COLUMN_NUMBER = 5
    static CASE_ROW_NUMBER = 5

    private playableCasesAtStart = [0, 1, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 23, 24]
    private playableCasesAfterTwoTurns = [2, 22, ...this.playableCasesAtStart]
    private gridCases: Map<number, Case> = new Map()
    private reserveCases: Map<{index: number, area: ReservedArea}, Case> = new Map() 
    /**
     * Garder l'état global du jeu en temps réel
     * 
     * E => Elephan
     * R => Rinhoceros
     * T => Target (Rock)
     * null => Vide
     */
    private playArea: Map<number, ('E' | 'R' | 'T' | null)> = new Map()
    private game?: Game

    public initGame(game: Game) {
        this.game = game
        this.initializeGridCases()
        this.initializeReserveCases()
    }

    public getGridCases() {
        return Array.from(this.gridCases.values())
    }

    public getReserveCases() {
        return Array.from(this.reserveCases.values())
    }

    public getAvailableCasesForSelectedAnimal(animal: Animal, moveNumber: number) {
        const animalCell = animal.currentCell
        if (!animalCell) {
        throw new Error(`l'animal ${animal?.name} n'a pas de case`)
        }

        if (animalCell.isReserve()) {
            return this.getEntryPointsForArea(animalCell.reservedArea!, moveNumber)
        }
        
        return this.getAdjacentCases(animalCell, moveNumber)
    }

    public canEnterAnimal(animal: Animal, cell: Case) {
        if (animal.currentCell.isReserve()) {
            this.playArea.set(cell.index, animal.name === 'Eléphan' ? 'E' : 'R')
            return true
        }
    }

    public canMoveAnimal(animal: Animal, cell: Case) {
        return true
    }

    public canMoveAnimalAndPushContent() {
        return false
    }

    private getEntryPointsForArea(area: ReservedArea, moveNumber: number) {
        const allowedCases = this.getStartAllowedCases(moveNumber, area)
        return allowedCases.filter(cell => this.isAvailable(cell))
    }

    private getStartAllowedCases(moveNumber: number, area?: ReservedArea) {
        return this.getGridCases().filter(cell => {
            if (moveNumber >= 2) {
                return this.playableCasesAfterTwoTurns.includes(cell.index)
            }

            return this.playableCasesAtStart.includes(cell.index)
        })
    }

    private getAdjacentCases(cell: Case, moveNumber: number): Case[] {
        const allowedCases = this.getMoveAllowedCases(moveNumber, cell)
        return allowedCases.filter(cell => this.isAvailable(cell))
    }

    private getMoveAllowedCases(moveNumber: number, playableCase: Case) {
        return this.getGridCases().filter(cell => {
            if (moveNumber >= 2) {
                return this.playableCasesAfterTwoTurns.includes(cell.index)
            }

            return this.playableCasesAtStart.includes(cell.index)
        })
    }

    
    public getPlayableCases(): Map<number, Case | null> {
        return this.gridCases
    }


    private isAvailable(cell: Case) {
        return true
    }

    private initializeGridCases() {
        const totalGridCases = GameManager.CASE_COLUMN_NUMBER * GameManager.CASE_ROW_NUMBER
        for (let cellIndex = 0; cellIndex < totalGridCases; cellIndex++) {
            const idCase = `grid-${cellIndex}`
            this.gridCases.set(cellIndex, createCase(idCase, cellIndex, 'grid'))
            this.playArea.set(cellIndex, null)
        }

        const middleCases = getThreeMiddleElements(this.getGridCases())
        this.addRocksInCases(middleCases)
    }

    private addRocksInCases(cases: Case[]) {
        cases.forEach((cell, index) => {
            cell.updateCurrentContent(createRock(`rock-${index+1}`, cell))
            this.playArea.set(cell.index, 'T')
        })
    }

    private initializeReserveCases() {
        for (let side = 1; side <= 2; side++) {
            const player = this.game?.getPlayers().get(side === 1 ? 'top' : 'bottom')!
            const name: AnimalName = player.area === 'top' ? 'Rhinocéros' : 'Eléphan'
            for (let cellIndex = 0; cellIndex < GameManager.CASE_ROW_NUMBER; cellIndex++) {
                const area = side === 1 ? 'top' : 'bottom'
                const idCase = `${area}-reserved-${cellIndex}`
                const idAnimal = `${name}-${cellIndex}`
                const cell = createCase(idCase, cellIndex, 'reserve', area)
                const animal = createAnimal(idAnimal, name, cell, player)
                
                cell.updateCurrentContent(animal)
                this.reserveCases.set({index: cellIndex, area}, cell)
            }
        }
    }
}