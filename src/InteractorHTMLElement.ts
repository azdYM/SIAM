import Animal from "./Animal";
import Board from "./Board";
import Case from "./Case";
import { ActionsForAvailableCase, AnimalPosition } from "./types";

export default class InteractorHTMLElement {

    private availableCases?: Map<string, ActionsForAvailableCase[]>

    public constructor(private board: Board) {}

    public highlightCasesAndSetEventForAnimal(cases: Case[], animal: Animal) {
        this.handleOnAllAllowedCell(
            (element: Element) => element.classList.remove('restrictedCell')
        )

        if (!this.availableCases) {
            this.availableCases = new Map()
        }

        cases.forEach(cell => {
            const cellElement = document.getElementById(cell.id)!
            const animalPosition = animal.getPosition()
            const contextMenuListener = (e?: Event) => this.board.handleSetPosition(animal, cell, e)
            const clickListener = () => this.board.handleEnter(animal, cell, animalPosition)
            
            cellElement.classList.add('restrictedCell')
            cellElement.addEventListener('click', clickListener, {once: true})
            cellElement.addEventListener('contextmenu', contextMenuListener)
            this.availableCases?.set(cell.id, [
                {event: 'click', handler: clickListener},
                {event: 'contextmenu', handler: contextMenuListener}
            ])
        })
    }

    public showAnimalPositionModal(cell: Case) {
        document.querySelector('.selectPosition.active')?.classList.remove('active')
        const card = document.querySelector(`#${cell.id} .selectPosition`) as HTMLElement
        const btnClose = card.querySelector('.close')
        btnClose?.addEventListener('click', function(e: Event) {
            e.stopPropagation()
            card.classList.remove('active')
        })
        card?.classList.add('active')
    }

    private handleOnOpenedModal() {

    }

    public hideAnimalPositionModal(cell: Case) {
        document.querySelector('.selectPosition.active')?.classList.remove('active')
    }

    public clearHiglightCases() {
        this.handleOnAllAllowedCell((element, listeners) => {
            element.classList.remove('restrictedCell')
            listeners?.forEach(listener => element.removeEventListener(listener.event, listener.handler))
        })
    }

    public moveAnimalToCase(animal: Animal, cell: Case, position: AnimalPosition) {
        this.handleOnAllAllowedCell((element, listeners) => {
            element.classList.remove('restrictedCell')
            listeners?.forEach(listener => element.removeEventListener(listener.event, listener.handler))
            
        })
        
        if (animal.id === null) {
            console.warn(`L'animal ${animal.name} dans la case ${cell.index} n'a pas d'identifiant`)
            return 
        }

        const animalElement = document.getElementById(animal.id)!
        const currentCellElement = document.getElementById(animal.currentCell.id)
        const cellElement = document.getElementById(cell.id)

        currentCellElement?.removeChild<HTMLElement>(animalElement)
        cellElement?.append(animalElement)        
    }

    private handleOnAllAllowedCell(handle: (element: Element, listeners?: ActionsForAvailableCase[]) => void) {
        if (!this.availableCases) {
            return document.querySelectorAll('.restrictedCell')
                .forEach(element => handle(element))
        }
        
        this.availableCases.forEach(
            (cellActions, cellId) => handle(document.getElementById(cellId)!, cellActions)
        )
    }
}