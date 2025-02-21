// src/components/StatusBar.js
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const StatusBar = () =>
{
    const { gameState } = useContext(GameContext);

    return (
        <div>
            <h3>Party Status</h3>
            <ul>
                {gameState.party.map((member, index) => (
                    <li key={index}>{member.name}: {member.health}</li>
                ))}
            </ul>
            <p>Money: ${gameState.money}</p>
            <p>Food: {gameState.supplies.food} lbs</p>
            <p>Medicine: {gameState.supplies.medicine} units</p>
            <p>Ammunition: {gameState.supplies.ammunition} boxes</p>
        </div>
    );
};

export default StatusBar;