import { Area, CaseContent, ReservedArea } from "./types";

export default class Case {

    private currentContent: CaseContent = null

    constructor(
        public id: string,
        public index: number,
        private area: Area,
        public reservedArea?: ReservedArea
    ) {}

    public isReserve() {
        return this.area === 'reserve'
    }

    public getContent(): CaseContent {
        return this.currentContent
    }

    public updateCurrentContent(content: CaseContent) {
        this.currentContent = content
    }
}

