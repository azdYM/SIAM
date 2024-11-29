import Animal from "./Animal"
import Board from "./Board"
import BoardSetupper from "./BoardSetupper"
import Case from "./Case"
import Game from "./Game"
import GameRules from "./GameManager"
import InitializerHTMLElement from "./InitializerHTMLElement"
import InteractorHTMLElement from "./InteractorHTMLElement"
import Player from "./Player"
import Rock from "./Rock"
import { AnimalName, Area, BoardSection, PlayerDataEntry, ReservedArea } from "./types"

export function createGame(boardElements: BoardSection, players: PlayerDataEntry[]): Game {
    const game = new Game(new GameRules())
    const playerBySide = new Map(createPlayers(players, game).map(p => [p.area, p]))
    const board = createBoard(boardElements, game)

    return game
        .setPlayers(playerBySide)
        .setBoard(board)
}

export function createBoard(boardSection: BoardSection, game: Game): Board {
    const { playArea, topReserveArea, bottomReserveArea } = boardSection
    if (!playArea || !topReserveArea || !bottomReserveArea) {
        throw new Error("Une des zones du plateau de jeu est introuvable !");
    }

    const board = new Board()
    const HTMLInteractor = new InteractorHTMLElement(board)
    const HTMLInitialzer = new InitializerHTMLElement(
        playArea, 
        topReserveArea, 
        bottomReserveArea,
        HTMLInteractor
    )

    return board   
        .setBordSetupper(new BoardSetupper(HTMLInitialzer, HTMLInteractor))
        .setGame(game)
}

export function createPlayers(players: PlayerDataEntry[], game: Game): Player[] {
    return players.map(player => new Player(player.name, player.area, game))
}

export function createCase(id: string, index: number, area: Area, reservedArea?: ReservedArea): Case {
    return new Case(id, index, area, reservedArea)
}

export function createAnimal(id: string, name: AnimalName, defaultCase: Case, player: Player): Animal {
    return new Animal(id, name, defaultCase, player)
}

export function createRock(id: string, defaultCase: Case): Rock {
    return new Rock(id, defaultCase)
}
