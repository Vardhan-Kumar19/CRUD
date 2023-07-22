// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Adjust 'db.json' based on your data file
const middlewares = jsonServer.defaults();
const cors = require('cors'); // Import the cors package

server.use(cors()); // Enable CORS

server.use(middlewares);
server.use(router);

server.listen(5000, () => {
  console.log('JSON Server is running on port 5000');
});

