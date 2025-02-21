import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import StatusBar from '../components/StatusBar';
import ActionButtons from '../components/ActionButtons';
import EventDialog from '../components/EventDialog';
import HuntingMiniGame from '../components/HuntingMiniGame';
import RiverCrossing from '../components/RiverCrossing';

const TravelScreen = () =>
{
    const { gameState, setGameState } = useContext(GameContext);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isHunting, setIsHunting] = useState(false);
    const [isRiverCrossing, setIsRiverCrossing] = useState(false);
    const navigate = useNavigate();

    const advanceDay = () =>
    {
        const newDate = new Date(gameState.date);
        newDate.setDate(newDate.getDate() + 1);
        const paceMiles = { Strenuous: 20, Steady: 15, Slow: 10 };
        const newPosition = gameState.position + paceMiles[gameState.pace];
        const foodConsumption = gameState.party.length * { Filling: 3, Meager: 2, Bare: 1 }[gameState.rations];
        let newSupplies = { ...gameState.supplies, food: Math.max(0, gameState.supplies.food - foodConsumption) };

        // Check health
        let newParty = gameState.party.map(member =>
        {
            if (newSupplies.food <= 0 && Math.random() < 0.2) return { ...member, health: 'Dead' };
            return member;
        });

        // Random event
        const event = gameState.events.find(e => Math.random() < e.probability);
        if (event) setCurrentEvent(event);

        // Check for river crossing (simplified)
        if (gameState.landmarks.some(l => l.distance === newPosition && l.name.includes('River')))
        {
            setIsRiverCrossing(true);
        }

        setGameState({
            ...gameState,
            date: newDate,
            position: newPosition,
            supplies: newSupplies,
            party: newParty,
        });

        // Check game end
        if (newParty.every(m => m.health === 'Dead'))
        {
            navigate('/end');
        } else if (newPosition >= gameState.landmarks[gameState.landmarks.length - 1].distance)
        {
            navigate('/end');
        }
    };

    const handleHuntEnd = (foodGained) =>
    {
        setGameState({
            ...gameState,
            supplies: {
                ...gameState.supplies,
                food: gameState.supplies.food + Math.min(foodGained, 200), // Max 200 lbs
                ammunition: gameState.supplies.ammunition - 10, // Cost of hunting
            },
        });
        setIsHunting(false);
    };

    const handleRiverChoice = (choice) =>
    {
        // Simplified logic
        if (choice === 'ferry' && gameState.money >= 5)
        {
            setGameState({ ...gameState, money: gameState.money - 5 });
        } else if (choice === 'ford' && Math.random() < 0.3)
        {
            setCurrentEvent({ message: 'Wagon damaged crossing the river!', choices: ['OK'] });
        }
        setIsRiverCrossing(false);
    };

    const handleEventChoice = (choice) =>
    {
        // Simplified event handling
        if (currentEvent.type === 'disease')
        {
            setGameState({
                ...gameState,
                party: gameState.party.map((m, i) => (i === 0 ? { ...m, health: 'Sick' } : m)),
            });
        }
        setCurrentEvent(null);
    };

    return (
        <div>
            <StatusBar />
            <h2>Traveling the Trail</h2>
            <p>Distance Traveled: {gameState.position} miles</p>
            <p>Next Landmark: {gameState.landmarks.find(l => l.distance > gameState.position)?.name}</p>
            {isHunting ? (
                <HuntingMiniGame onEnd={handleHuntEnd} />
            ) : isRiverCrossing ? (
                <RiverCrossing onChoice={handleRiverChoice} />
            ) : (
                <ActionButtons
                    onContinue={advanceDay}
                    onHunt={() => setIsHunting(true)}
                    onChangePace={(pace) => setGameState({ ...gameState, pace })}
                    onChangeRations={(rations) => setGameState({ ...gameState, rations })}
                />
            )}
            <EventDialog event={currentEvent} onChoice={handleEventChoice} />
        </div>
    );
};

export default TravelScreen;