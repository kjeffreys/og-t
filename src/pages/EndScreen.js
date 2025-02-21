import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const EndScreen = () =>
{
    const { gameState } = useContext(GameContext);
    const survivors = gameState.party.filter(member => member.health !== 'Dead').length;

    return (
        <div>
            <h1>Game Over</h1>
            {survivors > 0 ? (
                <p>Congratulations! You reached Oregon with {survivors} survivors.</p>
            ) : (
                <p>Unfortunately, all your party members have died.</p>
            )}
            <h3>Final Stats</h3>
            <p>Money Left: ${gameState.money}</p>
            <p>Food Left: {gameState.supplies.food} lbs</p>
        </div>
    );
};

export default EndScreen;