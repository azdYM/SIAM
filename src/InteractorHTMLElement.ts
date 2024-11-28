import Animal from "./Animal";
import Case from "./Case";
import { AnimalPosition } from "./types";

export default class InteractorHTMLElement {

    private availableCases?: Map<string, () => void>

    public highlightCasesAndSetEventForAnimal(cases: Case[], animal: Animal) {
        this.handleOnAllRestrictedCell(
            (element: Element) => element.classList.remove('restrictedCell')
        )

        if (!this.availableCases) {
            this.availableCases = new Map()
        }

        cases.forEach(cell => {
            const cellElement = document.getElementById(cell.id)!
            const listener = () => cell.onEnter(animal)

            cellElement.classList.add('restrictedCell')
            cellElement.addEventListener('click', listener, {once: true})
            this.availableCases?.set(cell.id, listener)
        })
    }

    public clearHiglightCases() {
        this.handleOnAllRestrictedCell((element, listener) => {
            element.classList.remove('restrictedCell')
            if (listener) {
                element.removeEventListener('click', listener)
            }
        })
    }

    public moveAnimalToCase(animal: Animal, cell: Case, position: AnimalPosition) {
        this.handleOnAllRestrictedCell((element, listener) => {
            element.classList.remove('restrictedCell')
            if (listener) {
                element.removeEventListener('click', listener)
            }
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
        
        console.log(animalElement, "jdjjls")
    }

    private handleOnAllRestrictedCell(handle: (element: Element, listener?: () => void) => void) {
        if (!this.availableCases) {
            return document.querySelectorAll('.restrictedCell')
                .forEach(element => handle(element))
        }
        
        this.availableCases.forEach(
            (listenerCell, idCell) => handle(
                document.getElementById(idCell)!, 
                listenerCell
            )
        )
    }
}