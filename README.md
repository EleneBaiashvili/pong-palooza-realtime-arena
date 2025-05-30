
# Multiplayer Pong Game

A real-time multiplayer Pong game built with React, TypeScript, and Socket.IO. Two players can connect and play against each other with synchronized game state and physics.

## 🎮 Features

- **Real-time Multiplayer**: Two players can join and play simultaneously
- **WebSocket Communication**: Low-latency real-time updates using Socket.IO
- **Synchronized Game State**: Server-authoritative game logic ensures fair play
- **Physics-based Movement**: Realistic ball physics and collision detection
- **Score System**: First player to reach 5 points wins
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Build Tool**: Vite
- **Real-time Communication**: WebSockets via Socket.IO

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)

## 🚀 Quick Start Guide

### Step 1: Set Up the Frontend (Client)

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8080`

### Step 2: Set Up the Backend (Game Server)

1. **Create a new directory for the server**
   ```bash
   mkdir pong-server
   cd pong-server
   ```

2. **Initialize a new Node.js project**
   ```bash
   npm init -y
   ```

3. **Install server dependencies**
   ```bash
   npm install express socket.io cors
   npm install -D nodemon
   ```

4. **Copy the server code**
   - Copy the contents of `server-example.js` from this project
   - Create a new file called `server.js` in your `pong-server` directory
   - Paste the code into `server.js`

5. **Update package.json scripts**
   Edit your `package.json` in the server directory and add these scripts:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3001`

### Step 3: Play the Game

1. **Open your browser** and go to `http://localhost:8080`
2. **Open a second browser window/tab** (or use incognito mode) and go to the same URL
3. **Both players will automatically be matched** into a game
4. **Use controls**:
   - **Arrow Keys** (↑↓) or **W/S keys** to move your paddle
   - First player to reach **5 points wins**!

## 🎯 How It Works

### Game Architecture

- **Client-Server Model**: The React frontend connects to a Node.js server
- **Authoritative Server**: All game logic runs on the server to prevent cheating
- **Real-time Sync**: Game state is broadcast to all connected players instantly
- **Automatic Matchmaking**: Players are automatically paired when they join

### Game Flow

1. Player opens the game in browser
2. Client connects to server via WebSocket
3. Server assigns player ID (Player 1 or Player 2)
4. When two players are connected, game starts automatically
5. Players control their paddles, server handles physics and scoring
6. Game ends when a player reaches 5 points

## 🔧 Configuration

### Server Configuration

The server runs on port 3001 by default. To change this:

1. Open `server.js`
2. Modify the PORT variable:
   ```javascript
   const PORT = process.env.PORT || 3001;
   ```

### Client Configuration

The client connects to `localhost:3001` by default. To change this:

1. Open `src/lib/socket.ts`
2. Modify the SERVER_URL:
   ```typescript
   const SERVER_URL = 'http://your-server-url:port';
   ```

## 🐛 Troubleshooting

### Common Issues

**Connection Error**: "Socket connection error"
- Make sure the server is running on port 3001
- Check that no firewall is blocking the connection
- Verify the server URL in `src/lib/socket.ts`

**Game Not Starting**: Players can't join
- Ensure both frontend and backend are running
- Check browser console for error messages
- Try refreshing both browser windows

**Paddle Not Moving**: Controls don't work
- Make sure the browser window is focused
- Try clicking on the game area first
- Check browser console for JavaScript errors

### Development Tips

- Use browser developer tools to monitor WebSocket connections
- Check server console for connection logs
- Both players must be connected for the game to start

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── PongGame.tsx    # Main game component
│   │   └── ServerSimulator.tsx # Server status display
│   ├── lib/
│   │   └── socket.ts       # Socket.IO client configuration
│   ├── types/
│   │   └── game.ts         # TypeScript type definitions
│   └── pages/
│       └── Index.tsx       # Main page
├── server-example.js        # Server implementation example
└── README.md               # This file
```

## 🚀 Deployment

### Development
- Frontend: `npm run dev` (runs on port 8080)
- Backend: `npm run dev` (runs on port 3001)

### Production
1. Build the frontend: `npm run build`
2. Deploy server to your hosting platform
3. Update client configuration with production server URL
4. Serve the built frontend files

## 🎮 Game Rules

- **Objective**: Score 5 points before your opponent
- **Controls**: 
  - Player 1 (left): ↑↓ Arrow keys or W/S
  - Player 2 (right): ↑↓ Arrow keys or W/S
- **Scoring**: Ball must pass your opponent's paddle
- **Physics**: Ball speed increases after each paddle hit
- **Winning**: First player to 5 points wins the match

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Need Help?** If you encounter any issues, please check the troubleshooting section or create an issue in the repository.
