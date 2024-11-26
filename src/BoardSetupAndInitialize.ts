import Animal from "./Animal"
import Board from "./Board"
import Case from "./Case"
import { 
    createAnimal,
    createCase, 
    createRock, 
} from "./factory"
import { createAnimalElement, createCaseElement, createRockElement } from "./factoryHtml"
import Rock from "./Rock"
import { AreaSide } from "./types"

export default class BoardSetupAndInitialize {
    public setupMainBoard(mainBoard: HTMLElement) {
        const totalCase = Board.CASE_ROW_NUMBER * Board.CASE_COLUMN_NUMBER
        mainBoard.style.top = `${Board.TOP_SPACE}px`
        mainBoard.style.left = `${Board.LEFT_SPACE}px`
        const cases = []
    
        for (let index = 0; index < totalCase; index++) {
            const id = `play-area-${index}`
            const child = createCaseElement(id, index)
    
            mainBoard.appendChild(child)
            cases[index] = createCase(id, index, 'internal')
        } 

        return cases
    }

    public setupExternalAreas(topExternalArea: HTMLDivElement, bottomExternalArea: HTMLDivElement) {
        const topCases = this.setupExternalArea(topExternalArea, 'top')
        const bottomCases = this.setupExternalArea(bottomExternalArea, 'bottom')

        return [...topCases, ...bottomCases]
    }

    private setupExternalArea(element: HTMLDivElement, side: AreaSide) {
        element.style[side] = '30px'
        element.style.left = `${Board.LEFT_SPACE}px`
        const cases = []

        for (let index = 0; index < Board.CASE_COLUMN_NUMBER; index++) {
            const id = `out-${side}-play-area-${index}`
            const child = createCaseElement(id, index)

            element.appendChild(child)
            cases[index] = createCase(id, index, 'external', side)
        } 

        return cases
    }

    public initializeAnimals(cases: Case[]) {
        const animals = new Set<Animal>([])

        cases.forEach(caseView => {
            const animal = this.createCaseContentForAnimal(caseView)
            animals.add(animal)
        })

        return Array.from(animals.values())
    }

    private createCaseContentForAnimal(cell: Case) {
        createAnimalElement(cell)
        return createAnimal(cell)
    }

    public initializeRocks(cases: Case[]) {
        const rocks = new Set<Rock>([])

        this.getThreeMiddleElements(cases).forEach((cell, key) => {
            createRockElement(cell)
            rocks.add(createRock(key, cell))
        })

        return Array.from(rocks.values())
    }

    private getThreeMiddleElements(arr: Case[]) {
        const length = arr.length;
    
        if (length < 3) {
            return arr;
        }
    
        const middleIndex = Math.floor(length / 2);
        return arr.slice(middleIndex - 1, middleIndex + 2);
    }
}