
export interface Player {
  id: string;
  y: number;
  score: number;
}

export interface Ball {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export interface GameState {
  player1: Player;
  player2: Player;
  ball: Ball;
  gameStarted: boolean;
  winner?: string;
}

export interface PaddleMove {
  playerId: string;
  direction: 'up' | 'down' | 'stop';
}

export interface GameRoom {
  id: string;
  players: Player[];
  gameState: GameState;
  gameActive: boolean;
}
