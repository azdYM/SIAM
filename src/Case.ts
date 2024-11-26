import { AreaSide } from "./types";

export default class Case {
    constructor(
        public id: string,
        public index: number,
        private area: ('internal' | 'external'),
        public side?: AreaSide
    ) {}

    public isExternal() {
        return this.area === 'external'
    }
}