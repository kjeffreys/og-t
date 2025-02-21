import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) =>
{
    const [gameState, setGameState] = useState({
        profession: '',
        money: 0,
        party: [],
        supplies: {
            oxen: 0,
            food: 0,
            clothing: 0,
            ammunition: 0,
            spareParts: { wheels: 0, axles: 0, tongues: 0 },
        },
        date: new Date(1848, 2, 1), // March 1, 1848
        weather: 'Fair',
        pace: 'Steady',
        rations: 'Filling',
        position: 0,
        landmarks: [
            { name: 'Independence', distance: 0 },
            { name: 'Kansas River Crossing', distance: 102 },
            { name: 'Fort Kearney', distance: 304 },
            { name: 'Chimney Rock', distance: 554 },
            { name: 'Fort Laramie', distance: 654 },
            { name: 'Independence Rock', distance: 854 },
            { name: 'South Pass', distance: 932 },
            { name: 'Fort Bridger', distance: 1002 },
            { name: 'Soda Springs', distance: 1142 },
            { name: 'Fort Hall', distance: 1222 },
            { name: 'Snake River Crossing', distance: 1422 },
            { name: 'Fort Boise', distance: 1562 },
            { name: 'Blue Mountains', distance: 1722 },
            { name: 'The Dalles', distance: 1822 },
            { name: 'Willamette Valley', distance: 2042 },
        ],
        events: [
            { type: 'storm', probability: 0.1, message: 'A storm hits! Supplies may be lost.' },
            { type: 'disease', probability: 0.15, message: 'A party member contracts dysentery.' },
            { type: 'bandits', probability: 0.05, message: 'Bandits attack! Lose supplies or fight.' },
        ],
    });

    return (
        <GameContext.Provider value={{ gameState, setGameState }}>
            {children}
        </GameContext.Provider>
    );
};