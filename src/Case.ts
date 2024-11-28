
import Animal from "./Animal";
import { Area, ReservedArea } from "./types";

export default class Case {
    constructor(
        public id: string,
        public index: number,
        private area: Area,
        public reservedArea?: ReservedArea
    ) {}

    public isReserve() {
        return this.area === 'reserve'
    }

    public onEnter(animal: Animal) {
        if (animal.currentCell.isReserve()) {
            animal.enterOnBoard(this, 'bottom')
        }

    }
}

