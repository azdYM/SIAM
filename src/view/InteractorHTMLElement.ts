import Animal from "../model/Animal";
import Board from "../model/Board";
import Case from "../model/Case";
import { ActionInHTMLElement, AnimalPosition } from "../types";
import AngleCalculator from "../service/AngleCalculator";
import ICaseContent from "../model/ICaseContent";

export default class InteractorHTMLElement {

    private availableCases?: Map<string, ActionInHTMLElement[]>
    private selectedTooltipForPosition: Map<string, ActionInHTMLElement>
    private angleCalculator: AngleCalculator

    public constructor(private board: Board) {
        this.angleCalculator = new AngleCalculator
        this.selectedTooltipForPosition = new Map
    }

    public highlightCasesAndSetEventForAnimal(cases: Case[], animal: Animal) {
        this.handleOnAllAllowedCell(
            (element: Element) => element.classList.remove('restrictedCell', 'clCliquable')
        )

        if (!this.availableCases) {
            this.availableCases = new Map()
        }

        document.querySelector('.animalSelected')?.classList.remove('animalSelected')
        document.getElementById(animal.id)?.classList.add('animalSelected')

        cases.forEach(cell => {
            const cellElement = document.getElementById(cell.id)!
            const animalPosition = animal.getPosition()
            const contextMenuListener = (e?: Event) => this.board.openAnimalPositionTooltip(animal, cell, e)
            const clickListener = () => this.board.handleEnter(animal, cell, animalPosition)
            
            cellElement.classList.add('restrictedCell', 'clCliquable')
            cellElement.addEventListener('click', clickListener, {once: true})
            cellElement.addEventListener('contextmenu', contextMenuListener)
            this.availableCases?.set(cell.id, [
                {event: 'click', handler: clickListener},
                {event: 'contextmenu', handler: contextMenuListener}
            ])
        })
    }

    public showAnimalPositionTooltip(cell: Case, animal: Animal) {
        this.hideAnimalPositionTooltip()

        const card = document.querySelector(`#${cell.id} .selectPosition`) as HTMLElement
        const btnClose = card.querySelector('.close')
        const positions = card.querySelectorAll<HTMLElement>('.btnPosition') 
        const closeTooltipListener = (e?: Event) => {
            e?.stopPropagation()
            card.classList.remove('active')
        }
        const enterInCaseListener = (e?: Event) => {
            e?.stopPropagation()
            const element = e?.currentTarget as HTMLElement
            const position = element.dataset.position as AnimalPosition
            this.board.handleEnter(animal, cell, position)
        }

        btnClose?.addEventListener('click', closeTooltipListener)
        this.selectedTooltipForPosition.set(
            `.selectPosition.active .close`, 
            {event: 'click', handler: closeTooltipListener}
        )

        positions.forEach(element => {
            element.addEventListener('click', enterInCaseListener)
            this.selectedTooltipForPosition?.set(
                `.selectPosition.active .${element.dataset.position}`,
                {event: 'click', handler: enterInCaseListener}
            )
        })

        card?.classList.add('active')
    }

    public hideAnimalPositionTooltip() {
        this.handleOnOpenTooltip((element, listener) => {
            if (element) {
                element.removeEventListener(listener.event, listener.handler)
            }
        })
        document.querySelector('.selectPosition.active')?.classList.remove('active')
    }

    public clearHiglightCases() {
        this.handleOnAllAllowedCell((element, listeners) => {
            element.classList.remove('restrictedCell', 'clCliquable')
            listeners?.forEach(listener => element.removeEventListener(listener.event, listener.handler))
        })
    }

    public async moveAnimalToCase(animal: Animal, cell: Case, position: AnimalPosition) {
        this.resetLastAction()
        if (animal.id === null) {
            console.warn(`L'animal ${animal.name} dans la case ${cell.index} n'a pas d'identifiant`)
            return 
        }

        const animalElement = document.getElementById(animal.id)!
        const currentCellElement = document.getElementById(animal.currentCell.id)
        const cellElement = document.getElementById(cell.id)
        cellElement?.classList.add('clSelection')

        const angle = this.angleCalculator.getAngleFrom(position)
        animalElement.style.transform = `rotate(${angle})`
        
        currentCellElement?.removeChild<HTMLElement>(animalElement)
        cellElement?.append(animalElement)   
    }

    public async moveAnimalWithPush(animal: Animal, pushed: ICaseContent) {
        this.resetLastAction()
        const animalElement = document.getElementById(animal.id)
        const pushedCurrentCaseElement = document.getElementById(animal.getCurrentCell().id)
        const pushedNextCaseElement = document.getElementById(pushed.getCurrentCell().id)
        const pushedElement = document.getElementById(pushed.getId())

        pushedNextCaseElement?.appendChild(pushedElement as Node)
        pushedCurrentCaseElement?.appendChild(animalElement as Node)

    }

    private resetLastAction() {
        this.clearHiglightCases()
        this.hideAnimalPositionTooltip() 
        document.querySelector('.clSelection')?.classList.remove('clSelection')    
        Array.from(this.board.getAnimals().values()).forEach(animal => {
            const animalElement = document.getElementById(animal.id)
            if (animal.player.isMyTurn) {
                animalElement?.classList.remove('anCliquable')
            } else {
                animalElement?.classList.add('anCliquable')
            }
        })
    }

    private handleOnAllAllowedCell(handle: (element: Element, listeners?: ActionInHTMLElement[]) => void) {
        if (!this.availableCases) {
            return document.querySelectorAll('.restrictedCell')
                .forEach(element => handle(element))
        }
        
        this.availableCases.forEach(
            (cellActions, cellId) => handle(document.getElementById(cellId)!, cellActions)
        )

        this.availableCases.clear()
    }

    private handleOnOpenTooltip(handle: (element: HTMLElement, listener: ActionInHTMLElement) => void) {
        if (this.selectedTooltipForPosition.size === 0)
            return 

        this.selectedTooltipForPosition?.forEach(
            (btnAction, selector) => handle(document.querySelector(selector)!, btnAction)
        )

        this.selectedTooltipForPosition.clear()
    }
}