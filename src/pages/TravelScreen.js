import React, { useState, useContext, useEffect } from 'react';
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
    const [days, setDays] = useState(0);

    useEffect(() =>
    {
        console.log('TravelScreen mounted, party:', gameState.party);
    }, [gameState.party]);

    const advanceDay = () =>
    {
        const newDate = new Date(gameState.date);
        newDate.setDate(newDate.getDate() + 1);
        const paceMiles = { Strenuous: 20, Steady: 15, Slow: 10 };
        let adjustedPaceMiles = paceMiles[gameState.pace];
        const foodConsumption = gameState.party.filter(m => m.health !== 'Dead').length * { Filling: 3, Meager: 2, Bare: 1 }[gameState.rations];
        let newSupplies = { ...gameState.supplies, food: Math.max(0, gameState.supplies.food - foodConsumption) };

        const difficultyModifiers = {
            Easy: { sickChance: 0.02, deathChance: 0.05, starveChance: 0.1 },
            Medium: { sickChance: 0.05, deathChance: 0.1, starveChance: 0.2 },
            Hard: { sickChance: 0.1, deathChance: 0.2, starveChance: 0.4 },
        };
        const { sickChance, deathChance, starveChance } = difficultyModifiers[gameState.difficulty || 'Medium'];

        let newParty = gameState.party.map(member =>
        {
            // Prevent death immediately after medicine treatment (track last treatment)
            if (member.lastTreated && member.lastTreated === new Date(gameState.date).toDateString())
            {
                return { ...member, health: 'Good', lastTreated: null }; // Reset lastTreated after ensuring safety
            }
            if (member.health === 'Good' && Math.random() < sickChance)
            {
                console.log(`${member.name} has fallen ill!`);
                return { ...member, health: 'Sick', lastTreated: null };
            }
            if (member.health === 'Sick' && Math.random() < deathChance)
            {
                console.log(`${member.name} has died from illness!`);
                return { ...member, health: 'Dead', lastTreated: null };
            }
            if (member.health === 'Injured' && Math.random() < deathChance * 1.5)
            {
                console.log(`${member.name} has died from injuries!`);
                return { ...member, health: 'Dead', lastTreated: null };
            }
            if (newSupplies.food <= 0 && member.health !== 'Dead' && Math.random() < starveChance)
            {
                console.log(`${member.name} has starved to death!`);
                return { ...member, health: 'Dead', lastTreated: null };
            }
            return member;
        });

        // Trigger events for all sick or injured members
        const sickMembers = newParty.filter(m => m.health === 'Sick' && m.health !== 'Dead');
        const injuredMembers = newParty.filter(m => m.health === 'Injured' && m.health !== 'Dead');
        let eventQueue = [];

        if (sickMembers.length > 0)
        {
            sickMembers.forEach(member =>
            {
                eventQueue.push({
                    type: 'disease',
                    message: `${member.name} is sick!`,
                    choices: ['Rest', 'Use Medicine', 'Ignore'],
                });
            });
        }
        if (injuredMembers.length > 0)
        {
            injuredMembers.forEach(member =>
            {
                eventQueue.push({
                    type: 'injury',
                    message: `${member.name} is injured!`,
                    choices: ['Rest', 'Use Medicine', 'Ignore'],
                });
            });
        }

        const otherEvents = [
            {
                type: 'robbery',
                probability: 0.05,
                message: 'Robbers demand $50!',
                choices: ['Fight', 'Pay', 'Flee'],
            },
            {
                type: 'trade',
                probability: 0.35,
                message: generateTradeOffer(),
                choices: ['Accept', 'Decline'],
            },
            {
                type: 'rain',
                probability: 0.1,
                message: 'Heavy rain slows your progress!',
                choices: ['Rest', 'Push Through'],
            },
            {
                type: 'blizzard',
                probability: 0.1,
                message: 'A blizzard hits! It’s freezing.',
                choices: ['Use Clothing', 'Push Through'],
            },
            {
                type: 'heatwave',
                probability: 0.1,
                message: 'A heatwave strikes! Party needs more food.',
                choices: ['Ration More', 'Push Through'],
            },
        ];
        if (eventQueue.length === 0)
        {
            const otherEvent = otherEvents.find(e => Math.random() < e.probability);
            if (otherEvent) eventQueue.push(otherEvent);
        }

        if (eventQueue.length > 0)
        {
            setCurrentEvent(eventQueue[0]);
        }

        if (currentEvent?.type === 'rain') adjustedPaceMiles *= 0.5;
        if (currentEvent?.type === 'rest') adjustedPaceMiles *= 0.5;

        const newPosition = gameState.position + adjustedPaceMiles;
        const newDays = days + 1;

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
        setDays(newDays);

        if (newParty.every(m => m.health === 'Dead'))
        {
            navigate('/end');
        } else if (newPosition >= gameState.landmarks[gameState.landmarks.length - 1].distance)
        {
            navigate('/end');
        }
    };

    const generateTradeOffer = () =>
    {
        const tradeOptions = [
            `Trader offers 10 boxes of ammunition for 20 pounds of food.`,
            `Trader offers 5 units of medicine for 30 pounds of food.`,
            `Trader offers 1 set of clothing for 15 pounds of food.`,
            `Trader offers $100 for 50 pounds of food.`,
            `Trader offers 1 spare wheel for 25 pounds of food.`,
        ];
        return tradeOptions[Math.floor(Math.random() * tradeOptions.length)];
    };

    const handleHuntEnd = (foodGained) =>
    {
        console.log('handleHuntEnd called with foodGained:', foodGained);
        setGameState({
            ...gameState,
            supplies: {
                ...gameState.supplies,
                food: gameState.supplies.food + Math.min(foodGained, 200),
                ammunition: gameState.supplies.ammunition - 10,
            },
        });
        setIsHunting(false);
    };

    const handleRiverChoice = (choice) =>
    {
        if (choice === 'ferry' && gameState.money >= 5)
        {
            setGameState({ ...gameState, money: gameState.money - 5 });
            setCurrentEvent({ message: 'You ferried across, losing a day.', choices: ['OK'] });
        } else if (choice === 'ford' && Math.random() < 0.3)
        {
            setCurrentEvent({ message: 'Wagon damaged crossing the river! Repair needed.', choices: ['OK'] });
        }
        setIsRiverCrossing(false);
    };

    const handleEventChoice = (choice) =>
    {
        const paceMiles = { Strenuous: 20, Steady: 15, Slow: 10 };
        const foodConsumption = gameState.party.filter(m => m.health !== 'Dead').length * { Filling: 3, Meager: 2, Bare: 1 }[gameState.rations];
        const difficultyModifiers = {
            Easy: { sickChance: 0.02, deathChance: 0.05, starveChance: 0.1 },
            Medium: { sickChance: 0.05, deathChance: 0.1, starveChance: 0.2 },
            Hard: { sickChance: 0.1, deathChance: 0.2, starveChance: 0.4 },
        };
        const { deathChance } = difficultyModifiers[gameState.difficulty || 'Medium'];

        if (currentEvent.type === 'disease' || currentEvent.type === 'injury')
        {
            const affectedMember = gameState.party.find(m => (m.health === 'Sick' || m.health === 'Injured') && m.health !== 'Dead');
            if (!affectedMember)
            {
                setCurrentEvent(null);
                return;
            }
            if (choice === 'Rest')
            {
                const healChance = Math.random() < 0.5;
                setGameState({
                    ...gameState,
                    party: gameState.party.map(m =>
                        m === affectedMember ? { ...m, health: healChance ? 'Good' : m.health } : m
                    ),
                });
                setCurrentEvent({
                    message: `${affectedMember.name} rested and ${healChance ? 'recovered!' : 'is still ' + affectedMember.health.toLowerCase() + '.'}`,
                    choices: ['OK'],
                });
            } else if (choice === 'Use Medicine' && gameState.supplies.medicine > 0)
            {
                setGameState({
                    ...gameState,
                    party: gameState.party.map(m =>
                        m === affectedMember ? { ...m, health: 'Good', lastTreated: new Date(gameState.date).toDateString() } : m
                    ),
                    supplies: { ...gameState.supplies, medicine: gameState.supplies.medicine - 1 },
                });
                setCurrentEvent({
                    message: `${affectedMember.name} was treated with medicine and recovered!`,
                    choices: ['OK'],
                });
            } else if (choice === 'Ignore')
            {
                setCurrentEvent({
                    message: `${affectedMember.name} remains ${affectedMember.health.toLowerCase()}.`,
                    choices: ['OK'],
                });
            } else
            {
                setCurrentEvent(null);
            }
        } else if (currentEvent.type === 'robbery')
        {
            if (choice === 'Fight')
            {
                if (gameState.supplies.ammunition >= 5 && Math.random() < 0.6)
                {
                    setGameState({
                        ...gameState,
                        supplies: { ...gameState.supplies, ammunition: gameState.supplies.ammunition - 5 },
                    });
                    setCurrentEvent({ message: 'You drove off the robbers!', choices: ['OK'] });
                } else
                {
                    setGameState({
                        ...gameState,
                        money: Math.max(0, gameState.money - 50),
                        party: gameState.party.map(m =>
                            m.health === 'Good' && Math.random() < 0.3 ? { ...m, health: 'Injured', lastTreated: null } : m
                        ),
                    });
                    setCurrentEvent({
                        type: 'injury',
                        message: `${gameState.party.find(m => m.health === 'Injured' && m.health !== 'Dead')?.name || 'Someone'} is injured!`,
                        choices: ['Rest', 'Use Medicine', 'Ignore'],
                    });
                }
            } else if (choice === 'Pay' && gameState.money >= 50)
            {
                setGameState({ ...gameState, money: gameState.money - 50 });
                setCurrentEvent({ message: 'You paid the robbers $50.', choices: ['OK'] });
            } else if (choice === 'Flee')
            {
                if (Math.random() < 0.7)
                {
                    setGameState({ message: 'You escaped the robbers!', choices: ['OK'] });
                } else
                {
                    setGameState({
                        ...gameState,
                        money: Math.max(0, gameState.money - 50),
                        party: gameState.party.map(m =>
                            m.health === 'Good' && Math.random() < 0.2 ? { ...m, health: 'Injured', lastTreated: null } : m
                        ),
                    });
                    setCurrentEvent({
                        type: 'injury',
                        message: `${gameState.party.find(m => m.health === 'Injured' && m.health !== 'Dead')?.name || 'Someone'} is injured!`,
                        choices: ['Rest', 'Use Medicine', 'Ignore'],
                    });
                }
            } else
            {
                setCurrentEvent(null);
            }
        } else if (currentEvent.type === 'trade')
        {
            const tradeOffer = currentEvent.message;
            if (choice === 'Accept')
            {
                if (tradeOffer.includes('10 boxes of ammunition') && gameState.supplies.food >= 20)
                {
                    setGameState({
                        ...gameState,
                        supplies: {
                            ...gameState.supplies,
                            food: gameState.supplies.food - 20,
                            ammunition: gameState.supplies.ammunition + 10,
                        },
                    });
                    setCurrentEvent({ message: 'You traded 20 pounds of food for 10 boxes of ammunition!', choices: ['OK'] });
                } else if (tradeOffer.includes('5 units of medicine') && gameState.supplies.food >= 30)
                {
                    setGameState({
                        ...gameState,
                        supplies: {
                            ...gameState.supplies,
                            food: gameState.supplies.food - 30,
                            medicine: gameState.supplies.medicine + 5,
                        },
                    });
                    setCurrentEvent({ message: 'You traded 30 pounds of food for 5 units of medicine!', choices: ['OK'] });
                } else if (tradeOffer.includes('1 set of clothing') && gameState.supplies.food >= 15)
                {
                    setGameState({
                        ...gameState,
                        supplies: {
                            ...gameState.supplies,
                            food: gameState.supplies.food - 15,
                            clothing: gameState.supplies.clothing + 1,
                        },
                    });
                    setCurrentEvent({ message: 'You traded 15 pounds of food for 1 set of clothing!', choices: ['OK'] });
                } else if (tradeOffer.includes('$100') && gameState.supplies.food >= 50)
                {
                    setGameState({
                        ...gameState,
                        money: gameState.money + 100,
                        supplies: { ...gameState.supplies, food: gameState.supplies.food - 50 },
                    });
                    setCurrentEvent({ message: 'You traded 50 food for $100!', choices: ['OK'] });
                } else if (tradeOffer.includes('1 spare wheel') && gameState.supplies.food >= 25)
                {
                    setGameState({
                        ...gameState,
                        supplies: {
                            ...gameState.supplies,
                            food: gameState.supplies.food - 25,
                            spareParts: { ...gameState.supplies.spareParts, wheels: gameState.supplies.spareParts.wheels + 1 },
                        },
                    });
                    setCurrentEvent({ message: 'You traded 25 pounds of food for 1 spare wheel!', choices: ['OK'] });
                } else
                {
                    setCurrentEvent({ message: 'Not enough supplies to trade!', choices: ['OK'] });
                }
            } else
            {
                setCurrentEvent(null);
            }
        } else if (currentEvent.type === 'rain')
        {
            if (choice === 'Rest')
            {
                setGameState({
                    ...gameState,
                    position: gameState.position + paceMiles[gameState.pace] * 0.5,
                });
                setCurrentEvent({ message: 'You rested through the rain, moving slower.', choices: ['OK'] });
            } else if (choice === 'Push Through')
            {
                if (Math.random() < 0.3)
                {
                    setGameState({
                        ...gameState,
                        party: gameState.party.map(m =>
                            m.health === 'Good' && Math.random() < 0.2 ? { ...m, health: 'Sick', lastTreated: null } : m
                        ),
                    });
                    setCurrentEvent({
                        type: 'disease',
                        message: `${gameState.party.find(m => m.health === 'Sick' && m.health !== 'Dead')?.name || 'Someone'} is sick!`,
                        choices: ['Rest', 'Use Medicine', 'Ignore'],
                    });
                } else
                {
                    setCurrentEvent({ message: 'You pushed through the rain successfully!', choices: ['OK'] });
                }
            } else
            {
                setCurrentEvent(null);
            }
        } else if (currentEvent.type === 'blizzard')
        {
            if (choice === 'Use Clothing' && gameState.supplies.clothing > 0)
            {
                setGameState({
                    ...gameState,
                    supplies: { ...gameState.supplies, clothing: gameState.supplies.clothing - 1 },
                });
                setCurrentEvent({ message: 'You used clothing to stay warm!', choices: ['OK'] });
            } else if (choice === 'Push Through')
            {
                setGameState({
                    ...gameState,
                    party: gameState.party.map(m =>
                        m.health === 'Good' && Math.random() < 0.4 ? { ...m, health: 'Injured', lastTreated: null } : m
                    ),
                });
                setCurrentEvent({
                    type: 'injury',
                    message: `${gameState.party.find(m => m.health === 'Injured' && m.health !== 'Dead')?.name || 'Someone'} is injured!`,
                    choices: ['Rest', 'Use Medicine', 'Ignore'],
                });
            } else
            {
                setCurrentEvent(null);
            }
        } else if (currentEvent.type === 'heatwave')
        {
            if (choice === 'Ration More' && gameState.supplies.food >= foodConsumption * 2)
            {
                setGameState({
                    ...gameState,
                    supplies: { ...gameState.supplies, food: gameState.supplies.food - foodConsumption * 2 },
                });
                setCurrentEvent({ message: 'You rationed extra food to survive the heat!', choices: ['OK'] });
            } else if (choice === 'Push Through')
            {
                setGameState({
                    ...gameState,
                    party: gameState.party.map(m =>
                        m.health === 'Good' && Math.random() < 0.3 ? { ...m, health: 'Sick', lastTreated: null } : m
                    ),
                });
                setCurrentEvent({
                    type: 'disease',
                    message: `${gameState.party.find(m => m.health === 'Sick' && m.health !== 'Dead')?.name || 'Someone'} is sick!`,
                    choices: ['Rest', 'Use Medicine', 'Ignore'],
                });
            } else
            {
                setCurrentEvent(null);
            }
        } else
        {
            setCurrentEvent(null);
        }
    };

    return (
        <div>
            <StatusBar />
            <h2>Traveling the Trail</h2>
            <p>Day: {days}</p>
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