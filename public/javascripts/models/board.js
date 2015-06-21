namespace('Connect4.Models')

Connect4.Models.Board = function(config) {
  this.height = config.height || 6
  this.width  = config.width  || 7
  this.total  = this.height * this.width
  this.cells  = []
  this.players = config.players || ['green', 'blue']
  this.empty   = 'empty'

  this.currentPlayer = this.players[0]

  this._callbacks = {
    change: [],
    over:   [],
    draw:   []
  }

  this.initialize = function() {
    this.generateBoard()
  }

  this.generateBoard = function() {
    this.cells = []

    for (var i = 0; i < this.total; i++) {
      this.cells.push(this.empty)
    }
  }

  this.place = function(index) {
    var column = this.columnFor(index)

    if (this.columnOpen(column)) {
      var bottom = this.highestIndexWithinColumn(column)
      this.cells[bottom] = this.currentPlayer

      if (this.checkForWin()) {
        this.trigger('over', { winner: this.currentPlayer })
      } else if (this.checkForDraw()) {
        this.trigger('draw')
      } else {
        this.trigger('change', {
          column: this.toTopFrom(bottom),
          player: this.currentPlayer
        })
        this.currentPlayer = this.nextPlayer()
      }
    }
  }

  this.nextPlayer = function() {
    if (this.currentPlayer === this.players[0]) {
      return this.players[1]
    } else {
      return this.players[0]
    }
  }

  this.highestIndexWithinColumn = function(column) {
    if (this.columnOpen(column)) {
      var highestIndex = 0

      for (var i = column; i < this.total; i += this.width) {
        if (this.cells[i] === this.empty && i > highestIndex) {
          highestIndex = i
        }
      }
      return highestIndex;
    }
  }

  this.columnOpen = function(column) {
    return this.cells[column] === this.empty
  }

  this.columnFor = function(index) {
    return index % this.width
  }

  this.checkForWin = function() {
    if (this.checkForHorizontalWin())    return true
    if (this.checkForVerticalWin())      return true
    if (this.checkForDiagonalLeftWin())  return true
    if (this.checkForDiagonalRightWin()) return true

    return false
  }

  this.checkForDraw = function() {
    for (var i = 0; i < this.total; i++) {
      if (this.cells[i] === this.empty) {
        return false
      }
    }
    return true
  }

  this.checkForHorizontalWin = function() {
    for (var i = 0; i < this.total; i++) {
      if (this.validWin(this.horizontalFour(i))) {
        return true
      }
    }
    return false
  }

  this.checkForVerticalWin = function() {
    var max = this.total - (this.width * 3)
    for (var i = 0; i < max; i++) {
      if (this.validWin(this.verticalFour(i))) {
        return true
      }
    }
    return false
  }

  this.checkForDiagonalLeftWin = function() {
    var max = (this.total) - (this.width * 3)

    for (var i = 3; i < max; i++) {
      if (this.validWin(this.diagonalLeftFour(i))) {
        return true
      }
      if (this.columnFor(i) === this.width - 1) i += 3
    }
  }

  this.checkForDiagonalRightWin = function() {
    var max = (this.total) - (this.width * 3)

    for (var i = 0; i < max; i++) {
      if (this.validWin(this.diagonalRightFour(i))) {
        return true
      }
      if (this.columnFor(i) === this.width - 4) i += 3
    }
    return false
  }

  this.validWin = function(four) {
    return (
      four.indexOf(this.nextPlayer()) < 0 &&
      four.indexOf(this.empty) < 0 &&
      four.length === 4
    )
  }

  this.horizontalFour = function(index) {
    if (this.columnFor(index) < this.width - 3) {
      return [
        this.cells[index],
        this.cells[index + 1],
        this.cells[index + 2],
        this.cells[index + 3],
      ]
    } else {
      return []
    }
  }

  this.verticalFour = function(index) {
    return [
      this.cells[index],
      this.cells[index + this.width],
      this.cells[index + (this.width * 2)],
      this.cells[index + (this.width * 3)],
    ]
  }

  this.diagonalLeftFour = function(index) {
    return [
      this.cells[index],
      this.cells[index + this.width - 1],
      this.cells[index + (this.width * 2) - 2],
      this.cells[index + (this.width * 3) - 3],
    ]
  }

  this.diagonalRightFour = function(index) {
    return [
      this.cells[index],
      this.cells[index + this.width + 1],
      this.cells[index + (this.width * 2) + 2],
      this.cells[index + (this.width * 3) + 3],
    ]
  }

  this.toTopFrom = function(index) {
    var column = []

    for (var i = index; i >= 0; i -= this.width) {
      column.push(i)
    }
    return column.reverse()
  }

  this.toJSON = function() {
    return this.cells
  }

  this.trigger = function(eventName, details) {
    for (var i = 0; i < this._callbacks[eventName].length; i++) {
      this._callbacks[eventName][i](details)
    }
  }

  this.on = function(eventName, callback) {
    this._callbacks[eventName] = this._callbacks[eventName].concat(callback)
  }

  this.initialize()
}
