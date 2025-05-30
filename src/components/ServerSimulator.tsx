
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Play, Square } from 'lucide-react';

interface ServerStatus {
  running: boolean;
  playersConnected: number;
  gamesActive: number;
}

const ServerSimulator: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    running: false,
    playersConnected: 0,
    gamesActive: 0
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const startServer = () => {
    setServerStatus(prev => ({ ...prev, running: true }));
    addLog('Server started on port 3001');
    addLog('Waiting for WebSocket connections...');
  };

  const stopServer = () => {
    setServerStatus({ running: false, playersConnected: 0, gamesActive: 0 });
    addLog('Server stopped');
    setLogs([]);
  };

  // Simulate server activity
  useEffect(() => {
    if (!serverStatus.running) return;

    const interval = setInterval(() => {
      // Simulate random player connections/disconnections
      if (Math.random() < 0.1) {
        const change = Math.random() < 0.6 ? 1 : -1;
        setServerStatus(prev => ({
          ...prev,
          playersConnected: Math.max(0, Math.min(10, prev.playersConnected + change))
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [serverStatus.running]);

  return (
    <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm p-6 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <Server className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Server Status</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Status:</span>
          <span className={`font-semibold ${serverStatus.running ? 'text-green-400' : 'text-red-400'}`}>
            {serverStatus.running ? 'Running' : 'Stopped'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Players:</span>
          <span className="text-blue-400 font-semibold">{serverStatus.playersConnected}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Active Games:</span>
          <span className="text-purple-400 font-semibold">{Math.floor(serverStatus.playersConnected / 2)}</span>
        </div>

        <div className="flex gap-2">
          {!serverStatus.running ? (
            <Button 
              onClick={startServer}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Server
            </Button>
          ) : (
            <Button 
              onClick={stopServer}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Server
            </Button>
          )}
        </div>

        {logs.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Server Logs:</h4>
            <div className="bg-black/50 rounded p-3 max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-xs text-green-400 font-mono">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServerSimulator;
