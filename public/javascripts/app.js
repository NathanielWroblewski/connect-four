!function() {
  var board = new Connect4.Models.Board({

  })

  var game = new Connect4.Views.Game({
    el:    document.querySelector('.game'),
    model: board
  })

  game.render()
}()
