import Animal from "../model/Animal";
import Case from "../model/Case";
import Game from "./Game";
import Player from "../model/Player";


export default class GameManager {

    private currentPlayer?: Player

    private gameSession?: Game

    public init(game: Game) {
        const firstPlayer = game.getPlayers().get('bottom')
        this.gameSession = game
        this.setTurn(firstPlayer)
    }
    
    public setTurn(nextPlayer?: Player) {
        this.currentPlayer?.setTurn(false)
        this.currentPlayer = nextPlayer?.setTurn(true)
    }
    
    public canEnterAnimal(animal: Animal, cell: Case) {
        if (animal.currentCell.isReserve()) {
            // this.updatePlayArea(cell.index, animal)
            return true
        }
    }

    public canMoveAnimal(animal: Animal, cell: Case) {
        // this.updatePlayArea(cell.index, animal)
        return true
    }

    public canMoveAnimalAndPushContent() {
        return false
    }

    public next() {
        if (!this.gameSession) {
            throw new Error("Aucun session en cours ! s'il s'agit d'une erreur appelé la methode setGame dans Game")
        }
        const nexPlayerArea = this.currentPlayer?.area === 'bottom' ? 'top' : 'bottom'
        return this.setTurn(
            this.gameSession.getPlayers().get(nexPlayerArea)
        )
    }

    
}