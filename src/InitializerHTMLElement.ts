import Board from "./Board"
import Case from "./Case"
import { Area, HTMLCases, ReservedArea } from "./types"

export default class InitializerHTMLElement {

    constructor(
        private playedArea: HTMLElement, 
        private topReservedArea: HTMLDivElement, 
        private bottomReservedArea: HTMLDivElement
    ) {}

    public initHTMLCases(area: Area) {
        return this.createHTMLCases(area)
    }

    public createCaseElement(id: string, index: number) {
        const child = document.createElement('div')
        const row = Math.trunc(index / Board.CASE_COLUMN_NUMBER)
        const column = index % Board.CASE_COLUMN_NUMBER
    
        child.setAttribute('id', id)
        child.setAttribute('data-index', String(index))
        child.style.left = `${column * Board.CASE_SIZE}px`
        child.style.top = `${row * Board.CASE_SIZE}px`
    
        return child
    }

    public createAnimalElement(caseView: Case, onClick: () => void) {
        const caseElement = document.getElementById(caseView.id)!
        
        const animalId = `${caseView.reservedArea}-animal-${caseView.index}`
        const animalElement = document.createElement('button')
        const image = document.createElement('img')
    
        animalElement.setAttribute('class', 'caseContent')
        animalElement.setAttribute('id', animalId)        
        animalElement.addEventListener('click', onClick, false)

        if (caseView.reservedArea === 'top') {
            image.style.transform = 'rotate(180deg)'
        }
        image.setAttribute('src', `/public/images/${caseView.reservedArea}-${caseView.index+1}.png`)
    
        animalElement.appendChild(image)
        
        caseElement.appendChild(animalElement)
        return animalId
    }

    public createRockElement(caseView: Case) {
        const caseElement = document.getElementById(caseView.id)!
        const button = document.createElement('button')
        button.setAttribute('class', 'caseContent')
        const image = document.createElement('img')
        
        image.setAttribute('src', `/public/images/rock-${caseView.index}.png`)
    
        button.appendChild(image)
        
        caseElement.appendChild(button)
    }

    private createHTMLCases(area: Area) {
        const cases: HTMLCases[] = []
        if (area === 'grid') {
            this.createGridAreaCases(cases, area)
        } 

        if (area === 'reserve') {
            this.createReserveAreaCases(cases, area)
        }

        return cases
    }
    
    private createGridAreaCases(cases: HTMLCases[], area: Area) {
        const totalCase = Board.CASE_ROW_NUMBER * Board.CASE_COLUMN_NUMBER
        this.playedArea.style.top = `${Board.TOP_SPACE}px`
        this.playedArea.style.left = `${Board.LEFT_SPACE}px`

        for (let index = 0; index < totalCase; index++) {
            const id = `${area}-area-${index}`
            const child = this.createCaseElement(id, index)
    
            this.playedArea.appendChild(child)
            cases.push({id, index, area})
        } 

        return cases;
    }

    private createReserveAreaCases(cases: HTMLCases[], area: Area) {
        this.setupReservedArea(this.bottomReservedArea, area, 'bottom', cases)
        this.setupReservedArea(this.topReservedArea, area, 'top', cases)
    
        return cases
    }

    private setupReservedArea(element: HTMLDivElement, area: Area, reservedArea: ReservedArea, cases: HTMLCases[]) {
        element.style[reservedArea] = '30px'
        element.style.left = `${Board.LEFT_SPACE}px`

        for (let index = 0; index < Board.CASE_COLUMN_NUMBER; index++) {
            const id = `${reservedArea}-${area}-area-${index}`
            const child = this.createCaseElement(id, index)

            element.appendChild(child)
            cases.push({id, index, area, reservedArea})
        } 

    }
}

