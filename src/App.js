import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import StartScreen from './pages/StartScreen';
import Store from './pages/Store';
import TravelScreen from './pages/TravelScreen';
import EndScreen from './pages/EndScreen';

function App()
{
  return (
    <GameProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={StartScreen} />
          <Route path="/store" component={Store} />
          <Route path="/travel" component={TravelScreen} />
          <Route path="/end" component={EndScreen} />
        </Switch>
      </Router>
    </GameProvider>
  );
}

export default App;