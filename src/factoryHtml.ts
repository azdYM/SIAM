import Board from "./Board"
import Case from "./Case"

export function createCaseElement(id: string, index: number) {
    const child = document.createElement('div')
    const row = Math.trunc(index / Board.CASE_COLUMN_NUMBER)
    const column = index % Board.CASE_COLUMN_NUMBER

    child.setAttribute('id', id)
    child.setAttribute('data-index', String(index))
    child.style.left = `${column * Board.CASE_SIZE}px`
    child.style.top = `${row * Board.CASE_SIZE}px`

    return child
}

export function createAnimalElement(caseView: Case) {
    const caseElement = document.getElementById(caseView.id)!
    const button = document.createElement('button')
    button.setAttribute('class', 'caseContent')
    const image = document.createElement('img')
    if (caseView.side === 'top') {
        image.style.transform = 'rotate(180deg)'
    }
    image.setAttribute('src', `/public/${caseView.side}-${caseView.index+1}.png`)

    button.appendChild(image)
    
    caseElement.appendChild(button)
}

export function createRockElement(caseView: Case) {
    const caseElement = document.getElementById(caseView.id)!
    const button = document.createElement('button')
    button.setAttribute('class', 'caseContent')
    const image = document.createElement('img')
    
    image.setAttribute('src', `/public/rock-${caseView.index}.png`)

    button.appendChild(image)
    
    caseElement.appendChild(button)
}

