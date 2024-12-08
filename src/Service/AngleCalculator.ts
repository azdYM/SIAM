import { AnimalPosition } from "../types";

export default class AngleCalculator {

    private angleMap: Record<AnimalPosition,  string> = {
        top: "0deg",
        right: "90deg",
        bottom: "180deg",
        left: "-90deg",
    }

    public getAngleFrom(nexPosition: AnimalPosition): string | null {
        return this.angleMap[nexPosition] ?? null
    }
}
