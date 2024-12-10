import Case from "./Case";
import ICaseContent from "./ICaseContent";

export default class Rock implements ICaseContent {
    constructor(
        private id: string,
        public cell: Case,
    ) {}

    getCurrentCell(): Case {
        return this.cell
    }

    getInitialName(): ("RO" | "E" | "R") {
        return "RO"
    }
    
}