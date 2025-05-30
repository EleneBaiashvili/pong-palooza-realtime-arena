
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '../lib/socket';
import { GameState, Player } from '../types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Wifi, WifiOff } from 'lucide-react';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());

  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 10;

  // Socket event handlers
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
      setGameStarted(false);
    });

    socket.on('playerId', (id: string) => {
      console.log('Received player ID:', id);
      setPlayerId(id);
    });

    socket.on('waiting', () => {
      console.log('Waiting for another player');
      setWaiting(true);
      setGameStarted(false);
    });

    socket.on('gameStart', (initialState: GameState) => {
      console.log('Game started with state:', initialState);
      setGameState(initialState);
      setWaiting(false);
      setGameStarted(true);
    });

    socket.on('gameUpdate', (newState: GameState) => {
      setGameState(newState);
    });

    socket.on('gameEnd', (winner: string) => {
      console.log('Game ended, winner:', winner);
      setGameStarted(false);
      setWaiting(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('playerId');
      socket.off('waiting');
      socket.off('gameStart');
      socket.off('gameUpdate');
      socket.off('gameEnd');
    };
  }, []);

  // Keyboard controls
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!gameStarted) return;
    
    keysPressed.current.add(event.key);
    
    if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
      socket.emit('paddleMove', { direction: 'up' });
    } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
      socket.emit('paddleMove', { direction: 'down' });
    }
  }, [gameStarted]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current.delete(event.key);
    
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
        event.key === 'w' || event.key === 'W' || 
        event.key === 's' || event.key === 'S') {
      socket.emit('paddleMove', { direction: 'stop' });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Canvas rendering
  useEffect(() => {
    if (!gameState || !gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw center line
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw paddles with glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff88';
      ctx.fillStyle = '#00ff88';
      
      // Player 1 paddle (left)
      ctx.fillRect(20, gameState.player1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      // Player 2 paddle (right)
      ctx.fillRect(CANVAS_WIDTH - 30, gameState.player2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball with glow effect
      ctx.shadowColor = '#ff6b6b';
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw scores
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameState.player1.score.toString(), CANVAS_WIDTH / 4, 60);
      ctx.fillText(gameState.player2.score.toString(), (3 * CANVAS_WIDTH) / 4, 60);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameStarted]);

  const joinGame = () => {
    socket.connect();
    socket.emit('joinGame');
  };

  const leaveGame = () => {
    socket.emit('leaveGame');
    socket.disconnect();
    setGameStarted(false);
    setWaiting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            MULTIPLAYER PONG
          </h1>
          <div className="flex items-center justify-center gap-4 text-white">
            {connected ? (
              <div className="flex items-center gap-2 text-green-400">
                <Wifi className="w-5 h-5" />
                <span>Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400">
                <WifiOff className="w-5 h-5" />
                <span>Disconnected</span>
              </div>
            )}
            {playerId && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Player {playerId}</span>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm p-6">
          <div className="flex flex-col items-center gap-6">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-2 border-purple-500/50 rounded-lg shadow-2xl"
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                background: 'linear-gradient(45deg, #1a1a2e, #16213e)'
              }}
            />
            
            <div className="flex gap-4">
              {!connected ? (
                <Button 
                  onClick={joinGame}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Join Game
                </Button>
              ) : (
                <Button 
                  onClick={leaveGame}
                  variant="destructive"
                  className="font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Leave Game
                </Button>
              )}
            </div>

            {waiting && (
              <div className="text-center">
                <div className="animate-pulse text-yellow-400 text-xl font-semibold mb-2">
                  Waiting for another player...
                </div>
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}

            {gameStarted && (
              <div className="text-center text-white">
                <p className="text-lg mb-2">
                  You are Player {playerId}
                </p>
                <p className="text-sm opacity-75">
                  Use ↑↓ Arrow Keys or W/S to move your paddle
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PongGame;
