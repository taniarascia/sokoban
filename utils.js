import { EMPTY, WALL, BLOCK, SUCCESS_BLOCK, VOID, PLAYER, levelOneMap } from './constants.js'

// Helpers
export const isBlock = (cell) => [BLOCK, SUCCESS_BLOCK].includes(cell)
export const isPlayer = (cell) => [PLAYER].includes(cell)
export const isTraversible = (cell) => [EMPTY, VOID].includes(cell)
export const isWall = (cell) => [WALL].includes(cell)
export const isVoid = (cell) => [VOID, SUCCESS_BLOCK].includes(cell)

export const getX = (x, direction, spaces = 1) => {
  if (direction === 'up' || direction === 'down') {
    return x
  }
  if (direction === 'right') {
    return x + spaces
  }
  if (direction === 'left') {
    return x - spaces
  }
}

export const getY = (y, direction, spaces = 1) => {
  if (direction === 'left' || direction === 'right') {
    return y
  }
  if (direction === 'down') {
    return y + spaces
  }
  if (direction === 'up') {
    return y - spaces
  }
}

export function generateGameBoard({ level }) {
  if (level === 1) {
    return JSON.parse(JSON.stringify(levelOneMap)) // clone deep hack
  }
}

export function countBlocks(blockCount, y, x, direction, board) {
  if (isBlock(board[y][x])) {
    blockCount++
    return countBlocks(blockCount, getY(y, direction), getX(x, direction), direction, board)
  } else {
    return blockCount
  }
}
