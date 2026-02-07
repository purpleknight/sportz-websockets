import express from 'express';
import { matchRouter } from './routes/matches.js';
import http from 'http';
import { attachWebSocketServer } from './ws/server.js';
import { securityMiddleware } from './arcjet.js';
import { commentaryRouter } from './routes/commentary.js';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0' ;

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/', (req, res) => {
   res.send('Hello from Express server!');
});

app.use((req, res, next) => {
   if(req.path.startsWith('/ws')) return next();
   return securityMiddleware()(req, res, next);
})

app.use('/matches', matchRouter);
app.use('/matches/:id/commentary', commentaryRouter);

const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}`
      : `http://${HOST}:${PORT}`;

server.listen(PORT, HOST, () => {
   console.log(`Server is running ON ${baseUrl}`);
   console.log(`WebSocket server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});
