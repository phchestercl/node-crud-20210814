require('dotenv').config();
const Server = require('./models/server');
/**servidor básico */
const server= new Server()

server.listen();
