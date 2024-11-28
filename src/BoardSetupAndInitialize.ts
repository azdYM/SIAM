import Animal from "./Animal"
import Case from "./Case"
import { 
    createAnimal,
    createCase, 
    createRock, 
} from "./factory"
import InitializerHTMLElement from "./InitializerHTMLElement"
import Player from "./Player"
import Rock from "./Rock"
import { PlayerCase } from "./types"

export default class BoardSetupAndInitialize {
    private initializerHTML: InitializerHTMLElement

    constructor(playedArea: HTMLDivElement, topReservedArea: HTMLDivElement, bottomReservedArea: HTMLDivElement) {
        this.initializerHTML = new InitializerHTMLElement(
            playedArea,
            topReservedArea,
            bottomReservedArea
        )
    }
    
    public setupGridArea() {
        const casesEntry =  this.initializerHTML.initHTMLCases('grid')
        return casesEntry.map(entry => createCase(entry.id, entry.index, entry.area))        
    }

    public setupReservedAreas() {
        const casesEntry = this.initializerHTML.initHTMLCases('reserve')
        return casesEntry.map(entry => createCase(entry.id, entry.index, entry.area, entry.reservedArea))   
    }

    public initializeAnimals(playersCases: PlayerCase[]) {
        console.log(playersCases, 'jjdkd')
        const animals = new Set<Animal>([])
        playersCases.forEach(playerCase => {
            const animal = this.createAnimalContent(playerCase.cell, playerCase.player)
            animals.add(animal)
        })

        return Array.from(animals.values())
    }

    private createAnimalContent(cell: Case, player: Player) {
        const animal = createAnimal(cell, player)
        const idAnimal = this.initializerHTML.createAnimalElement(cell, () => animal.onMove())
        animal.setIdElement(idAnimal)
        return animal
    }

    public initializeRocks(cases: Case[]) {
        const rocks = new Set<Rock>([])

        this.getThreeMiddleElements(cases).forEach((cell, key) => {
            this.initializerHTML.createRockElement(cell)
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