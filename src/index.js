import express from 'express';
import { matchRouter } from './routes/matches.js';
import http from 'http';
import { attachWebSocketServer } from './ws/server.js';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0' ;

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/', (req, res) => {
   res.send('Hello from Express server!')
});

app.use('/matches', matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}`
      : `http://${HOST}: ${PORT}`;


server.listen(PORT, HOST, () => {
   console.log(`Server is running ON ${baseUrl}`);
   console.log(`WebSocket server is running on
      ${baseUrl.replace('http', 'ws')}/ws`);
});
