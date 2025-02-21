import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import StartScreen from './pages/StartScreen';
import Store from './pages/Store';
import TravelScreen from './pages/TravelScreen';
import EndScreen from './pages/EndScreen';
import './App.css';

function App()
{
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/store" element={<Store />} />
          <Route path="/travel" element={<TravelScreen />} />
          <Route path="/end" element={<EndScreen />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;