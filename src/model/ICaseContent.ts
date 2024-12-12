import Case from "./Case"

export default interface ICaseContent {
    getCurrentCell(): Case
    updateCurrentCell(cell: Case): void
    getInitialName(): ('RO' | 'E' | 'R')
    getId(): string
}