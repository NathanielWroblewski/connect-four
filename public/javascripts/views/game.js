namespace('Connect4.Views')

Connect4.Views.Game = function(config) {
  this.model = config.model
  this.el    = config.el

  this.isAnimating = false

  this.initialize = function() {
    this.render()
    this.setListeners()
  }

  this.setListeners = function() {
    this.el.addEventListener('click', this.handleClick.bind(this))
    this.model.on('change', this.drop.bind(this))
    this.model.on('over', this.gameOver.bind(this))
    this.model.on('draw', this.draw.bind(this))
    this.el.addEventListener('mouseover', this.mouseIn.bind(this))
    this.el.addEventListener('mouseout', this.mouseOut.bind(this))
  }

  this.mouseIn = function(e) {
    if (!e.target || !e.target.nodeName === 'DIV') return
    var index = parseInt(e.target.dataset.index)

    if (index >= 0) {
      var column = this.model.columnFor(index)
          node   = this.el.querySelector('[data-index="' + column + '"]')

      if (node) {
        node.className = node.className.replace('hover', '')
      }
    }
  }

  this.mouseOut = function(e) {
    if (!e.target || !e.target.nodeName === 'DIV') return
    var index = parseInt(e.target.dataset.index)

    if (index >= 0) {
      var column = this.model.columnFor(index)
          node   = this.el.querySelector('[data-index="' + column + '"]')

      if (node) {
        node.className = node.className.replace('hover', '')
      }
    }
  }

  this.handleClick = function(e) {
    var index = parseInt(e.target.dataset.index)

    if (index >= 0 && !this.isAnimating) {
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

  this.drop = function(details) {
    if (details && details.column.length > 1) {
      this.animate(details, this.render.bind(this), 0)
    } else {
      this.render()
    }
  }

  this.render = function(details) {
    this.el.innerHTML = this.template(this.model.toJSON())

    this.isAnimating = false

    return this
  }

  this.animate = function(details, callback, index) {
    var indices = details.column,
        player  = details.player

    this.isAnimating = true

    setTimeout(function() {
      this.addDropClass(indices[index], player)

      if (index == indices.length - 2) {
        setTimeout(callback, 100)
      } else {
        this.animate(details, callback, ++index)
      }
    }.bind(this), 200 - (10 * (index + 10)))
  }

  this.addDropClass = function(index, player) {
    var node = this.el.querySelector('[data-index="' + index + '"]')

    if (node) {
      node.className = 'drop ' + player
    }
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
