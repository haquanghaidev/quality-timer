const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

let startTime = Date.now();

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send time to the client every second
  const sendTime = () => {
    const currentTime = Date.now() - startTime;
    ws.send(JSON.stringify({ time: currentTime }));
  };

  const interval = setInterval(sendTime, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
