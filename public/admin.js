$(function () {
  var $clientlist = $('.clientlist')
  var socket = io()

  function updateClientList (clients) {
    $clientlist.html('')
    clients.forEach(function (val, index) {
      $clientlist.append('<li>' + val + '</li>')
    })
  }

  // Whenever the server emits 'login', log the login message
  socket.on('loginplease', function (data) {
    console.log('loginplease', data)
    updateClientList(data.clients, data.content)
    socket.emit('adminlogin', data)
  })

  // Whenever the server emits 'new message', update the chat body
  socket.on('data received', function (data) {
    console.info('data received', data)
  })

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    // log(data.username + ' joined');
    console.log('user joined', data)
    updateClientList(data.clients)
    // updateThumb(data.clients,data.content)
  })

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    // log(data.username + ' left');
    console.log('user left', data)
    updateClientList(data.clients)
    // updateThumb(data.clients,data.content)
  })
})
