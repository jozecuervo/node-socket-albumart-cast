# node-socket-albumart-cast
A node socket server for publishing album art history to an array of web clients. 

## Server
The server consists of a socket.io / express app

Express listens to `POST`requests on the `/thumb` endpoint with image urls for new artwork. It then fetches the artwork to a tmp folder and processes it via `gm` to `/public/img/` where it can be served. A notification is published to the socket server containing the newly processed artwork. 

Socket.io keeps a connection open to a pool of clients, continuously managing a list of both clients and images. The newest image is always mapped to the oldest client, ensuring new content is passed from one client to the next. The order of clients is determined first-come first-served, filling gaps as clients disconnect.

## Client
Client assets are served statically from the `/public/` folder. There is also an admin client for observing events and state.

## Install
```
git clone jozecuervo/node-socket-albumart-cast
cd node-socket-albumart-cast
npm install
```
## How to use
- `node server.js`
- load admin: http://localhost:3000/admin.html
- load some clients: http://localhost:3000/
- POST content to http://localhost:3000/thumb/
 - `Content-Type: application/x-www-form-urlencoded`
 - required fields: `title`, `img` 

## TODO
- review node dependencies
- push to heroku
- connect to services which can provide thumb events with image urls
