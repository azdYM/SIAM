import Case from "./model/Case"
import ICaseContent from "./model/ICaseContent"
import Player from "./model/Player"

export type Area = ('reserve' | 'grid')

export type ReservedArea = ('top' | 'bottom')

export type PlayerByArea = Map<ReservedArea, Player>

export type AnimalName = ('Eléphan' | 'Rhinocéros')

export type AnimalPosition = ('top' | 'bottom' | 'left' | 'right')

export type PlayerDataEntry = {
    name: string,
    area: ReservedArea
}

export type BoardSection = {
    playArea: HTMLDivElement | null, 
    topReserveArea: HTMLDivElement | null, 
    bottomReserveArea: HTMLDivElement | null
}

export type CaseContent = ICaseContent | null

export type PlayerCase = {
    cell: Case,
    player: Player
}

export type ActionInHTMLElement = {
    event: ('click' | 'contextmenu'),
    handler: () => void
}

export type GridCasesType = Map<number, Case>
export type ReserveCasesType = Map<string, Case>
export type VirtualGridType = Map<number, ('E' | 'R' | 'RO' | null)>
