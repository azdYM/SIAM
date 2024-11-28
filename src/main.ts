import './style.css'
import { createGame } from './factory'
import { BoardSection, PlayerDataEntry } from './types'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="mainBoard">
    <div id="topExternalArea" class="externalArea"></div>
    <div id="playArea"></div>
    <div id="bottomExternalArea" class="externalArea"></div>
  </div>
`

const board: BoardSection = {
  playArea: document.querySelector<HTMLDivElement>('#playArea'), 
  topReserveArea: document.querySelector<HTMLDivElement>('#topExternalArea'), 
  bottomReserveArea: document.querySelector<HTMLDivElement>('#bottomExternalArea')
}

const players: PlayerDataEntry[] = [
  {name: 'Player One', area: 'top'},
  {name: 'Player Two', area: 'bottom'}
]

const game = createGame(board, players)
game.start()