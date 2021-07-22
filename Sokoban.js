import {
  EMPTY,
  BLOCK,
  SUCCESS_BLOCK,
  VOID,
  PLAYER,
  directions,
  size,
  multiplier,
  colors,
  levelOneMap,
} from './constants.js'
import {
  isBlock,
  isWall,
  isTraversible,
  getX,
  getY,
  countBlocks,
  generateGameBoard,
} from './utils.js'

class Sokoban {
  constructor({ level }) {
    this.canvas = document.querySelector('canvas')
    this.canvas.width = size.width
    this.canvas.height = size.height

    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = colors.empty
    this.context.fillRect(0, 0, size.width, size.height)

    this.board = generateGameBoard({ level })
  }

  paintCell(context, cell, x, y) {
    if (cell === 'void' || cell === 'player') {
      const circleSize = cell === 'player' ? 20 : 10

      this.context.beginPath()
      this.context.rect(x * multiplier, y * multiplier, multiplier, multiplier)
      this.context.fillStyle = colors.empty.fill
      this.context.fill()

      this.context.beginPath()
      this.context.arc(x * multiplier + 75 / 2, y * multiplier + 75 / 2, circleSize, 0, 2 * Math.PI)
      this.context.lineWidth = 10
      this.context.strokeStyle = colors[cell].stroke
      this.context.fillStyle = colors[cell].fill
      this.context.fill()
      this.context.stroke()
    } else {
      this.context.beginPath()
      this.context.rect(x * multiplier + 5, y * multiplier + 5, multiplier - 10, multiplier - 10)
      this.context.fillStyle = colors[cell].fill
      this.context.fill()

      this.context.beginPath()
      this.context.rect(x * multiplier + 5, y * multiplier + 5, multiplier - 10, multiplier - 10)
      this.context.lineWidth = 10
      this.context.strokeStyle = colors[cell].stroke
      this.context.stroke()
    }
  }

  render(options = {}) {
    if (options.restart) {
      this.board = generateGameBoard({ level: 1 })
    }
    this.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.paintCell(this.context, cell, x, y)
      })
    })
  }

  findPlayerCoords() {
    const y = this.board.findIndex((row) => row.includes(PLAYER))
    const x = this.board[y].indexOf(PLAYER)

    return {
      x,
      y,
      above: this.board[y - 1][x],
      below: this.board[y + 1][x],
      sideLeft: this.board[y][x - 1],
      sideRight: this.board[y][x + 1],
    }
  }

  movePlayer(playerCoords, direction) {
    // Replace previous spot with initial board state (void or empty)
    this.board[playerCoords.y][playerCoords.x] =
      levelOneMap[playerCoords.y][playerCoords.x] === VOID ? VOID : EMPTY

    // Move player
    this.board[getY(playerCoords.y, direction, 1)][getX(playerCoords.x, direction, 1)] = PLAYER
  }

  movePlayerAndBoxes(playerCoords, direction) {
    const newPlayerY = getY(playerCoords.y, direction, 1)
    const newPlayerX = getX(playerCoords.x, direction, 1)
    const newBoxY = getY(playerCoords.y, direction, 2)
    const newBoxX = getX(playerCoords.x, direction, 2)

    // Don't move if the movement pushes a box into a wall
    if (isWall(this.board[newBoxY][newBoxX])) {
      return
    }

    let blocksInARow = 0
    if (isBlock(this.board[newBoxY][newBoxX])) {
      blocksInARow = countBlocks(1, newBoxY, newBoxX, direction)
      console.log(blocksInARow)
    } else {
      // Replace previous block spot with initial board state (void or empty)
      this.board[newPlayerY][newPlayerX] =
        levelOneMap[newPlayerY][newPlayerX] === VOID ? VOID : EMPTY

      // Move box
      // If on top of void, make into a success box
      this.board[newBoxY][newBoxX] = levelOneMap[newBoxY][newBoxX] === VOID ? SUCCESS_BLOCK : BLOCK

      this.movePlayer(playerCoords, direction)
    }
  }

  move(playerCoords, direction) {
    const { x, y, above, below, sideLeft, sideRight } = playerCoords

    const adjacentCell = {
      [directions.up]: above,
      [directions.down]: below,
      [directions.left]: sideLeft,
      [directions.right]: sideRight,
    }

    if (isTraversible(adjacentCell[direction])) {
      this.movePlayer(playerCoords, direction)
    }

    if (isBlock(adjacentCell[direction])) {
      this.movePlayerAndBoxes(playerCoords, direction)
    }
  }
}

export default Sokoban
