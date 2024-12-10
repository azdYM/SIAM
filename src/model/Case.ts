import Animal from "./Animal";
import InteractorHTMLElement from "../view/InteractorHTMLElement";
import { Area, CaseContent, ReservedArea } from "../types";

export default class Case {

    private currentContent: CaseContent|null = null
    private HTMLInteractor?: InteractorHTMLElement

    constructor(
        public id: string,
        public index: number,
        private area: Area,
        public reservedArea?: ReservedArea
    ) {}

    public setHTMLInteractor(HTMLInteractor: InteractorHTMLElement) {
        this.HTMLInteractor = HTMLInteractor
    }

    public isReserve() {
        return this.area === 'reserve'
    }

    public getContent(): CaseContent {
        return this.currentContent
    }

    public openAnimalPositionTooltip(animal: Animal) {
        this.HTMLInteractor?.showAnimalPositionTooltip(this, animal)
    }

    public updateCurrentContent(content: CaseContent) {
        this.currentContent = content
    }
}

