import { AreaSide } from "./types"

export default class Player {
    public outAreaContent?: HTMLCollection

    constructor(
        public name: string,
        public side: AreaSide,
    ) {}
}