import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) =>
{
    const [gameState, setGameState] = useState({
        profession: '',
        money: 0,
        party: [],
        supplies: { oxen: 0, food: 0, clothing: 0, ammunition: 0, medicine: 0, spareParts: { wheels: 0, axles: 0, tongues: 0 } },
        date: new Date('1848-04-01'),
        position: 0,
        pace: 'Steady',
        rations: 'Filling',
        difficulty: 'Medium',
        landmarks: [
            { name: 'Independence', distance: 0 },
            { name: 'Kansas River', distance: 100 },
            { name: 'Fort Kearney', distance: 300 },
            { name: 'Chimney Rock', distance: 800 },
            { name: 'Fort Laramie', distance: 1000 },
            { name: 'South Pass', distance: 1200 },
            { name: 'Snake River', distance: 1500 },
            { name: 'Fort Boise', distance: 1700 },
            { name: 'The Dalles', distance: 1900 },
            { name: 'Willamette Valley', distance: 2000 },
        ],
    });

    return (
        <GameContext.Provider value={{ gameState, setGameState }}>
            {children}
        </GameContext.Provider>
    );
};