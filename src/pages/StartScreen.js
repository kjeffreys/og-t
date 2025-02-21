import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

const professions = {
    Banker: 1600,
    Doctor: 1200,
    Merchant: 1000,
    Blacksmith: 800,
    Carpenter: 800,
    Teacher: 600,
    Farmer: 400,
};

const StartScreen = () =>
{
    const { gameState, setGameState } = useContext(GameContext);
    const [profession, setProfession] = useState('');
    const [party, setParty] = useState(['', '', '', '', '']);
    const [difficulty, setDifficulty] = useState('Medium'); // Default to Medium
    const navigate = useNavigate();

    const handleProfessionChange = (e) =>
    {
        const selected = e.target.value;
        setProfession(selected);
        setGameState({ ...gameState, profession: selected, money: professions[selected] });
    };

    const handlePartyChange = (index, value) =>
    {
        const newParty = [...party];
        newParty[index] = value;
        setParty(newParty);
    };

    const handleDifficultyChange = (e) =>
    {
        setDifficulty(e.target.value);
    };

    const handleStart = () =>
    {
        setGameState({
            ...gameState,
            party: party.map(name => ({ name, health: 'Good', lastTreated: null })),
            difficulty,
        });
        navigate('/store');
    };

    return (
        <div>
            <h1>The Oregon Trail</h1>
            <label>
                Choose your profession:
                <select value={profession} onChange={handleProfessionChange}>
                    <option value="">Select</option>
                    {Object.entries(professions).map(([prof, money]) => (
                        <option key={prof} value={prof}>
                            {prof} - ${money}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Choose difficulty:
                <select value={difficulty} onChange={handleDifficultyChange}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </label>
            <h2>Name your party members:</h2>
            {party.map((name, index) => (
                <input
                    key={index}
                    type="text"
                    value={name}
                    onChange={(e) => handlePartyChange(index, e.target.value)}
                    placeholder={`Member ${index + 1}`}
                />
            ))}
            <button
                onClick={handleStart}
                disabled={!profession || party.some(name => !name)}
            >
                Start Journey
            </button>
        </div>
    );
};

export default StartScreen;