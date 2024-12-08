import Animal from "../Animal"
import Case from "../Case"
import InitializerHTMLElement from "./InitializerHTMLElement"
import InteractorHTMLElement from "./InteractorHTMLElement"
import { Area } from "../types"

export default class BoardSetupper {
    constructor(
        private initializerHTML: InitializerHTMLElement,
        private interactorHTML: InteractorHTMLElement
    ) {}

    public setupArea(cases: Case[], area: Area) {
        this.initializerHTML.setupAreaElement(cases, area)
    }

    public higlightCases(cases: Case[], animal: Animal) {
        this.interactorHTML.highlightCasesAndSetEventForAnimal(cases, animal)
    }

    public clearHiglightCases() {
        this.interactorHTML.clearHiglightCases()
    }    
}