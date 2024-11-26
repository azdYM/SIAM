export type AreaSide = ('top' | 'bottom')

export type AnimalName = ('Eléphan' | 'Rhinocéros')

export type AnimalPosition = ('top' | 'bottom' | 'left' | 'right')

export type PlayerDataEntry = {
    name: string,
    area: AreaSide
}

export type BoardSection= {
    playArea: HTMLDivElement | null, 
    topExternalArea: HTMLDivElement | null, 
    bottomExternalArea: HTMLDivElement | null
}