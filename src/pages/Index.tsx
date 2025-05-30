
import React from 'react';
import PongGame from '../components/PongGame';
import ServerSimulator from '../components/ServerSimulator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <PongGame />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ServerSimulator />
              
              <div className="mt-6 p-6 bg-slate-800/50 border border-slate-600 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Game Instructions</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div>
                    <strong className="text-cyan-400">Controls:</strong>
                    <ul className="mt-1 space-y-1 ml-4">
                      <li>• ↑↓ Arrow Keys or W/S to move paddle</li>
                      <li>• First to 5 points wins!</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-purple-400">Features:</strong>
                    <ul className="mt-1 space-y-1 ml-4">
                      <li>• Real-time multiplayer</li>
                      <li>• WebSocket communication</li>
                      <li>• Synchronized game state</li>
                      <li>• Physics-based ball movement</li>
                    </ul>
                  </div>
                  <div className="text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded">
                    Note: This demo requires a Socket.IO server running on localhost:3001
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
