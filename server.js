var express = require('express');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var retro = require('./retro');
var guid = require('./guid');
var download = require('./download');
var port = process.env.PORT || 3000;
var clients = [];
var images = [];
// Setup basic express server
var app = express();
var server = app.listen(port, () => {
  console.log('listening on *:3000');
});
var io = socketio(server);
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(express.static(__dirname + '/public'), function(req, res, next) {
  // console.log(req.originalUrl); // '/admin/new'
  // console.log(req.baseUrl); // '/admin'
  // console.log(req.path); // '/new'
  next();
});

app.post('/thumb', (req, res) => {
  var thumb = guid();
  console.log('track!', req.body.title);
  if (!req.body.title && req.body.img) {
    res.send('{msg: \'Error!\'}');
    return;
  }
  images.push({
    guid: thumb,
    title: req.body.title,
    source: req.body.img,
  });
  download(req.body.img, `input/${thumb}.png`, () => {
    // console.log('downloaded to input/' + thumb + '.png');
    images.forEach((item, index) => {
      if (item.guid === thumb) {
        images[index].downloaded = `input/${thumb}.png`;
      }
    });
    retro(`/input/${thumb}.png`, '/public/img/', (path) => {
      // console.info('converted', path);
      images.forEach((item, index) => {
        if (item.guid === thumb) {
          images[index].converted = `img/${thumb}.gif`;
        }
      });
      io.sockets.emit('new thumb', {
        title: req.body.title,
        img: path,
        images,
        clients,
      });
    });
  });

  // save image to tmp folder
  // process image to another folder
  // tell the socket server to broadcast a message

  res.send('{msg: \'Thanks!\'}');
});


io.on('connection', (socket) => {
  socket.guid = guid();
  socket.emit('loginplease', {
    guid: socket.guid,
    clients,
    images,
  });

  socket.on('clientlogin', (data) => {
    clients.push(socket.guid);
    socket.broadcast.emit('user joined', {
      clients,
      images,
    });
    socket.emit('user joined', {
      guid: socket.guid,
      clients,
      images,
    });
  });

  socket.on('adminlogin', () => {
    console.log('on adminlogin');
  });

  socket.on('new thumb', () => {
    socket.broadcast.emit('new thumb', {
      clients,
      images,
    });
  });

  socket.on('disconnect', () => {
    clients.forEach(function(item, index) {
      if (item === socket.guid) {
        clients.splice(index, 1);
      }
    });
    socket.broadcast.emit('user left', {
      guid: socket.guid,
      clients,
      images,
    });
  });
});