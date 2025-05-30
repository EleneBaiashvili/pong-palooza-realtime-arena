
# Multiplayer Pong Game - Server Setup

This document explains how to set up the Node.js server for the multiplayer Pong game.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Server Setup

1. Create a new directory for your server:
```bash
mkdir pong-server
cd pong-server
```

2. Initialize a new Node.js project:
```bash
npm init -y
```

3. Install required dependencies:
```bash
npm install express socket.io cors
npm install -D nodemon
```

4. Copy the `server-example.js` file to your server directory and rename it to `server.js`

5. Update your `package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

6. Start the server:
```bash
npm run dev
```

## Server Features

- **Real-time Communication**: Uses Socket.IO for WebSocket connections
- **Game Session Management**: Automatically pairs two players into a game
- **Authoritative Game Logic**: Server handles all physics and collision detection
- **State Synchronization**: Broadcasts game state to both players in real-time

## API Events

### Client to Server:
- `joinGame`: Request to join a game
- `paddleMove`: Send paddle movement (`{ direction: 'up' | 'down' | 'stop' }`)
- `leaveGame`: Leave current game

### Server to Client:
- `playerId`: Assigns player ID (`'1'` or `'2'`)
- `waiting`: Waiting for another player
- `gameStart`: Game started with initial state
- `gameUpdate`: Real-time game state updates
- `gameEnd`: Game ended with winner information

## Game Logic

The server implements:
- Ball physics with velocity and collision detection
- Paddle movement constraints
- Scoring system (first to 5 points wins)
- Game session management
- Player disconnection handling

## Production Deployment

For production deployment:
1. Set the `PORT` environment variable
2. Update CORS origins in the server configuration
3. Update the client's `SERVER_URL` in `src/lib/socket.ts`

## Troubleshooting

- **Connection Issues**: Ensure the server is running on port 3001
- **CORS Errors**: Check that the client origin is allowed in server CORS settings
- **Game State Sync**: Verify WebSocket connections are established properly
