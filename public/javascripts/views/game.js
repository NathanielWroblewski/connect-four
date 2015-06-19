namespace('Connect4.Views')

Connect4.Views.Game = function(config) {
  this.model = config.model
  this.el    = config.el

  this.initialize = function() {
    this.setListeners()
  }

  this.setListeners = function() {
    this.el.addEventListener('click', this.handleClick.bind(this))
    this.model.on('change', this.render.bind(this))
    this.model.on('over', this.gameOver.bind(this))
    this.model.on('draw', this.draw.bind(this))
  }

  this.handleClick = function(e) {
    var index = parseInt(e.target.dataset.index)

    if (index >= 0) {
      this.model.place(index)
    }
  }

  this.template = function(board) {
    var html = ''

    for (var i = 0; i < board.length; i++) {
      html += '<div data-index=' + i + ' class="' + board[i] + '"></div>'
    }

    return html
  }

  this.render = function() {
    this.el.innerHTML = this.template(this.model.toJSON())

    return this
  }

  this.gameOver = function(details) {
    this.render()

    alert('Game Over! ' + details.winner.toUpperCase() + ' wins!')
    location.reload()
  }

  this.draw = function() {
    this.render()

    alert('Game Over! DRAW!')
    location.reload()
  }

  this.initialize()
}
