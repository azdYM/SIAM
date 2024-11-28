import Animal from "./Animal"
import Board from "./Board"
import BoardSetupAndInitialize from "./BoardSetupAndInitialize"
import Case from "./Case"
import Game from "./Game"
import GameRules from "./GameRules"
import Player from "./Player"
import Rock from "./Rock"
import { AnimalName, Area, BoardSection, PlayerDataEntry, ReservedArea } from "./types"

export function createGame(board: BoardSection, players: PlayerDataEntry[]) {
    const game = new Game(createBoard(board), new GameRules)
    const playerBySide = new Map(createPlayers(players, game).map(p => [p.area, p]))
    game.setPlayers(playerBySide)
    
    return game
}

export function createBoard(boardSection: BoardSection) {
    const { playArea, topReserveArea, bottomReserveArea } = boardSection
    if (!playArea || !topReserveArea || !bottomReserveArea) {
        throw new Error("Une des zones du plateau de jeu est introuvable !");
    }

    const boardSetup = new BoardSetupAndInitialize(playArea, topReserveArea, bottomReserveArea)
    return new Board(boardSetup);
}

export function createPlayers(players: PlayerDataEntry[], game: Game) {
    return players.map(player => new Player(player.name, player.area, game))
}

export function createCase(id: string, index: number, area: Area, reservedArea?: ReservedArea) {
    return new Case(id, index, area, reservedArea)
}

export function createAnimal(defaultCase: Case, player: Player) {
    const name: AnimalName = defaultCase.reservedArea === 'top' ? 'Rhinocéros' : 'Eléphan'
    return new Animal(name, defaultCase, player)
}

export function createRock(id: number, defaultCase: Case) {
    return new Rock(id, defaultCase)
}
