import Case from "./Case";

export default class Rock {
    constructor(
        private id: string,
        public cell: Case,
    ) {}
}