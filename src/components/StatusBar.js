import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const StatusBar = () =>
{
    const { gameState } = useContext(GameContext);
    return (
        <div>
            <p>Date: {gameState.date.toLocaleDateString()}</p>
            <p>Weather: {gameState.weather}</p>
            <p>Health: {gameState.party.map(m => `${m.name}: ${m.health}`).join(', ')}</p>
            <p>Supplies: Food: {gameState.supplies.food} lbs, Ammo: {gameState.supplies.ammunition}</p>
            <p>Pace: {gameState.pace}, Rations: {gameState.rations}</p>
        </div>
    );
};

export default StatusBar;