import Case from "./Case";
import { AnimalName, AnimalPosition, AreaSide } from "./types";

export default class Animal {
    public position?: AnimalPosition
    private side?: AreaSide

    constructor(
        public name: AnimalName,
        public currentCell: Case,
    ) {
        this.position = currentCell.side
        this.side = currentCell.side
    }


}