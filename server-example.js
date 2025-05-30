
// Example Node.js + Socket.IO server for the Pong game
// This would typically be in a separate repository/project

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 5;
const BALL_SPEED = 3;

// Game state
let games = new Map();
let waitingPlayers = [];

class Game {
  constructor(player1, player2) {
    this.id = Math.random().toString(36).substring(7);
    this.players = [player1, player2];
    this.gameState = {
      player1: { id: player1.id, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 },
      player2: { id: player2.id, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 },
      ball: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        velocityX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        velocityY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
      },
      gameStarted: true
    };
    this.gameLoop();
  }

  gameLoop() {
    this.updateBall();
    this.checkCollisions();
    this.checkScore();
    
    // Emit game state to both players
    this.players.forEach(player => {
      player.emit('gameUpdate', this.gameState);
    });

    if (this.gameState.player1.score < 5 && this.gameState.player2.score < 5) {
      setTimeout(() => this.gameLoop(), 16); // ~60 FPS
    } else {
      this.endGame();
    }
  }

  updateBall() {
    this.gameState.ball.x += this.gameState.ball.velocityX;
    this.gameState.ball.y += this.gameState.ball.velocityY;

    // Ball collision with top/bottom walls
    if (this.gameState.ball.y <= 5 || this.gameState.ball.y >= CANVAS_HEIGHT - 5) {
      this.gameState.ball.velocityY = -this.gameState.ball.velocityY;
    }
  }

  checkCollisions() {
    const ball = this.gameState.ball;
    const player1 = this.gameState.player1;
    const player2 = this.gameState.player2;

    // Left paddle collision
    if (ball.x <= 35 && ball.y >= player1.y && ball.y <= player1.y + PADDLE_HEIGHT) {
      ball.velocityX = Math.abs(ball.velocityX);
    }

    // Right paddle collision
    if (ball.x >= CANVAS_WIDTH - 35 && ball.y >= player2.y && ball.y <= player2.y + PADDLE_HEIGHT) {
      ball.velocityX = -Math.abs(ball.velocityX);
    }
  }

  checkScore() {
    if (this.gameState.ball.x < 0) {
      this.gameState.player2.score++;
      this.resetBall();
    } else if (this.gameState.ball.x > CANVAS_WIDTH) {
      this.gameState.player1.score++;
      this.resetBall();
    }
  }

  resetBall() {
    this.gameState.ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      velocityX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      velocityY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
    };
  }

  endGame() {
    const winner = this.gameState.player1.score > this.gameState.player2.score ? 'player1' : 'player2';
    this.players.forEach(player => {
      player.emit('gameEnd', winner);
    });
    games.delete(this.id);
  }

  movePaddle(playerId, direction) {
    const isPlayer1 = this.gameState.player1.id === playerId;
    const player = isPlayer1 ? this.gameState.player1 : this.gameState.player2;

    if (direction === 'up' && player.y > 0) {
      player.y = Math.max(0, player.y - PADDLE_SPEED);
    } else if (direction === 'down' && player.y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
      player.y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, player.y + PADDLE_SPEED);
    }
  }
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('joinGame', () => {
    waitingPlayers.push(socket);
    socket.emit('playerId', waitingPlayers.length.toString());

    if (waitingPlayers.length >= 2) {
      const player1 = waitingPlayers.shift();
      const player2 = waitingPlayers.shift();
      
      const game = new Game(player1, player2);
      games.set(game.id, game);

      player1.gameId = game.id;
      player2.gameId = game.id;

      player1.emit('gameStart', game.gameState);
      player2.emit('gameStart', game.gameState);
    } else {
      socket.emit('waiting');
    }
  });

  socket.on('paddleMove', (data) => {
    const gameId = socket.gameId;
    const game = games.get(gameId);
    if (game) {
      game.movePaddle(socket.id, data.direction);
    }
  });

  socket.on('leaveGame', () => {
    handleDisconnect(socket);
  });

  socket.on('disconnect', () => {
    handleDisconnect(socket);
  });

  function handleDisconnect(socket) {
    const index = waitingPlayers.indexOf(socket);
    if (index > -1) {
      waitingPlayers.splice(index, 1);
    }

    if (socket.gameId) {
      const game = games.get(socket.gameId);
      if (game) {
        game.players.forEach(player => {
          if (player !== socket) {
            player.emit('gameEnd', 'opponent_disconnected');
          }
        });
        games.delete(socket.gameId);
      }
    }
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
