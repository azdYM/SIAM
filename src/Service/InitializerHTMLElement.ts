import Animal from "../Animal"
import Board from "../Board"
import Case from "../Case"
import GameManager from "../GameManager"
import InteractorHTMLElement from "./InteractorHTMLElement"
import Rock from "../Rock"
import { Area, ReservedArea } from "../types"

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
            caseElement.appendChild(this.createTooltipForSelectPosition(cell))

            if (cell.getContent() instanceof Rock) {
                const rockElement = this.createRockElement(cell.getContent() as Rock)
                caseElement.appendChild(rockElement)
            }

            this.playedArea.appendChild(caseElement)
        })
    }

    private createTooltipForSelectPosition(cell: Case): HTMLElement {
        const x: ('left' | 'right') = cell.index % 5 >= 2 ? 'left' : 'right'
        const y: ('top' | 'bottom') = cell.index < 15 ? "top" : "bottom"
        const tooltip = document.createElement('div')
        const viewer = document.createElement('span')
        tooltip.classList.add("selectPosition")
        viewer.classList.add('viewer')

        tooltip.style[x] = '-110px'
        tooltip.style[y] = '0'
        viewer.style[x] = '92px'
        viewer.style[y] = '15%'
        tooltip.innerHTML = this.getTooltipContent()
        tooltip.appendChild(viewer)
        return tooltip
    }

    private getTooltipContent() {
        return `
            <div class="positionContent">
                <p>Position de l'animal</p>
                <div class="btnsPosition">
                    <button data-position="top" class="btnPosition top">Haut</button>
                    <button data-position="right" class="btnPosition right">Droit</button>
                    <button data-position="bottom" class="btnPosition bottom">Bas</button>
                    <button data-position="left" class="btnPosition left">Gauche</button>
                </div>
            </div>
            <button class="close">fermer</button>
        `
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
            animalElement.style.transform = 'rotate(180deg)'
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

