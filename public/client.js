$(function () {
  // Initialize variables
  var $thumb = $('.thumb')
  var $title = $('.title')
  var $guid = $('.guid')
  var guid = ''
  var socket = io()

  function updateThumb (clients, images) {
    var img
    // console.log('updateThumb', clients, images)
    $thumb.attr('src', '')
    if (images.length) {
      clients.forEach(function (val, index) {
        if (val === guid && images.length) {
          img = images[images.length - 1 - index]
          $thumb.attr('src', img.converted)
          $title.text(img.title)
        }
      })
    }
  }

  // Socket events
  // Whenever the server emits 'login', log the login message
  socket.on('loginplease', function (data) {
    guid = data.guid
    $guid.text(guid)
    socket.emit('clientlogin', data)
  })

  socket.on('new thumb', function (data) {
    console.log('new thumb', data)
    updateThumb(data.clients, data.images)
  })

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    console.log('user joined', data)
    updateThumb(data.clients, data.images)
  })

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    console.log('user left', data)
    updateThumb(data.clients, data.images)
  })
})
