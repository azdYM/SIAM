import Animal from "./Animal"
import Board from "./Board"
import BoardSetupAndInitialize from "./BoardSetupAndInitialize"
import Case from "./Case"
import Game from "./Game"
import Player from "./Player"
import Rock from "./Rock"
import { AnimalName, AreaSide, BoardSection, PlayerDataEntry } from "./types"

export function createGame(board: BoardSection, players: PlayerDataEntry[]) {
    return new Game(createBoard(board), createPlayers(players))
}

export function createBoard(boardSection: BoardSection) {
    const { playArea, topExternalArea, bottomExternalArea } = boardSection
    if (!playArea || !topExternalArea || !bottomExternalArea) {
        throw new Error("Une des zones du plateau de jeu est introuvable !");
    }

    return new Board(
        playArea, 
        topExternalArea, 
        bottomExternalArea, 
        new BoardSetupAndInitialize
    );
}

export function createPlayers(players: PlayerDataEntry[]) {
    return players.map(player => new Player(player.name, player.area))
}

export function createCase(id: string, index: number, area: ('internal' | 'external'), side?: AreaSide) {
    return new Case(id, index, area, side)
}

export function createAnimal(defaultCase: Case) {
    const name: AnimalName = defaultCase.side === 'top' ? 'Rhinocéros' : 'Eléphan'
    return new Animal(name, defaultCase)
}

export function createRock(id: number, defaultCase: Case) {
    return new Rock(id, defaultCase)
}
