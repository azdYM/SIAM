import Animal from "./Animal"
import Board from "./Board"
import Case from "./Case"
import GameManager from "./GameManager"
import InteractorHTMLElement from "./InteractorHTMLElement"
import Rock from "./Rock"
import { Area, ReservedArea } from "./types"

export default class InitializerHTMLElement {

    constructor(
        private playedArea: HTMLElement, 
        private topReservedArea: HTMLDivElement, 
        private bottomReservedArea: HTMLDivElement,
        private HTMLInteractor: InteractorHTMLElement
    ) {}

    public setupAreaElement(cases: Case[], area: Area) {
        if (area === 'grid') {
            this.createGridAreaCases(cases)
        }

        this.createReserveAreaCases(cases)
    }

    private createGridAreaCases(cases: Case[]) {
        this.playedArea.style.top = `${Board.TOP_SPACE}px`
        this.playedArea.style.left = `${Board.LEFT_SPACE}px`

        cases.forEach(cell => {
            const caseElement = this.createCaseElement(cell)
            caseElement.innerHTML = this.createModalForSelectPosition(cell)
            if (cell.getContent() instanceof Rock) {
                const rockElement = this.createRockElement(cell.getContent() as Rock)
                caseElement.appendChild(rockElement)
            }
            this.playedArea.appendChild(caseElement)
        })
    }

    private createReserveAreaCases(cases: Case[]) {
        this.initReserveAreaElement(
            this.bottomReservedArea, 
            'bottom', 
            cases.filter(c => c.reservedArea === 'bottom')
        )

        this.initReserveAreaElement(
            this.topReservedArea, 
            'top', 
            cases.filter(c => c.reservedArea === 'top')
        )
    }
    
    private initReserveAreaElement(element: HTMLDivElement, reservedArea: ReservedArea, cases: Case[]) {
        element.style[reservedArea] = '30px'
        element.style.left = `${Board.LEFT_SPACE}px`

        cases.forEach(cell => {
            const caseElement = this.createCaseElement(cell)
            const animalElement = this.createAnimalElement(cell.getContent() as Animal)
            caseElement.appendChild(animalElement)
            element.appendChild(caseElement)
        })
    }

    private createCaseElement(cell: Case) {
        cell.setHTMLInteractor(this.HTMLInteractor)
        const child = document.createElement('div')
        const row = Math.trunc(cell.index / GameManager.CASE_COLUMN_NUMBER)
        const column = cell.index % GameManager.CASE_COLUMN_NUMBER
    
        child.setAttribute('id', cell.id)
        child.setAttribute('data-index', String(cell.index))
        child.style.left = `${column * Board.CASE_SIZE}px`
        child.style.top = `${row * Board.CASE_SIZE}px`
        return child
    }

    private createModalForSelectPosition(cell: Case): string {
        const x: ('left' | 'right') = cell.index % 5 >= 2 ? 'left' : 'right'
        const y: ('top' | 'bottom') = cell.index < 15 ? "top" : "bottom"
        
        return `
            <div style="${x}: -103px; ${y}: 0" class="selectPosition">
                <div class="positionContent">
                    <p>Position de l'animal</p>
                    <span class="">Haut</span>
                    <span class="">Droit</span>
                    <span class="">Bas</span>
                    <span class="">Gauche</span>
                </div>
                <button class="close">fermer</button>
            </div>
        `
    }

    private createAnimalElement(animal: Animal): Node {
        animal.setHTMLInteractor(this.HTMLInteractor)        
        const animalElement = document.createElement('button')
        const image = document.createElement('img')
    
        const handleClick = (e: Event) => {
            e.stopPropagation()
            animal.onMove()
        }

        animalElement.setAttribute('class', 'caseContent')
        animalElement.setAttribute('id', animal.id)        
        animalElement.addEventListener('click', handleClick, false)

        if (animal.reservedArea === 'top') {
            image.style.transform = 'rotate(180deg)'
        }
        image.setAttribute('src', `/public/images/${animal.reservedArea}-${animal.currentCell.index+1}.png`)
    
        animalElement.appendChild(image)
        
        return animalElement as Node
    }

    private createRockElement(rock: Rock) {
        const rockElement = document.createElement('button')
        rockElement.setAttribute('class', 'caseContent')
        const image = document.createElement('img')
        
        image.setAttribute('src', `/public/images/rock-${rock.cell.index}.png`)
    
        rockElement.appendChild(image)
        return rockElement
    }

}

