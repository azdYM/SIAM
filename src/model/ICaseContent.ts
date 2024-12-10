import Case from "./Case"

export default interface ICaseContent {
    getCurrentCell(): Case
    getInitialName(): ('RO' | 'E' | 'R')
    getId(): string
}