import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

const EndScreen = () =>
{
    const { gameState, setGameState } = useContext(GameContext);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const isWin = gameState.position >= 2000 && gameState.party.some(m => m.health !== 'Dead');

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawWinScene = () =>
        {
            // Sky (sunset gradient)
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#ff4500'); // Orange at top
            gradient.addColorStop(1, '#8b0000'); // Dark red at bottom
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground (8-bit green)
            ctx.fillStyle = '#006400';
            ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);

            // Wagon (simple 8-bit)
            ctx.fillStyle = '#8b4513'; // Brown
            ctx.fillRect(canvas.width * 0.4, canvas.height * 0.65, 60, 30); // Body
            ctx.fillStyle = '#ffffff'; // White cover
            ctx.fillRect(canvas.width * 0.4 + 10, canvas.height * 0.55, 40, 10);
            ctx.fillStyle = '#000000'; // Wheels
            ctx.beginPath();
            ctx.arc(canvas.width * 0.4 + 15, canvas.height * 0.95, 10, 0, Math.PI * 2);
            ctx.arc(canvas.width * 0.4 + 45, canvas.height * 0.95, 10, 0, Math.PI * 2);
            ctx.fill();
        };

        if (isWin) drawWinScene();
    }, [isWin]);

    const handlePlayAgain = () =>
    {
        setGameState({
            profession: '',
            money: 0,
            party: [],
            supplies: { oxen: 0, food: 0, clothing: 0, ammunition: 0, medicine: 0, spareParts: { wheels: 0, axles: 0, tongues: 0 } },
            date: new Date('1848-04-01'),
            position: 0,
            pace: 'Steady',
            rations: 'Filling',
            difficulty: 'Medium', // Reset to default
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
            events: [],
        });
        navigate('/');
    };

    return (
        <div>
            <h1>{isWin ? 'Victory!' : 'Game Over'}</h1>
            <p>
                {isWin
                    ? 'You reached Oregon with some survivors!'
                    : 'Your journey has ended. All party members have perished.'}
            </p>
            {isWin && <canvas ref={canvasRef} width={300} height={200} style={{ border: '1px solid black' }} />}
            <p>Distance Traveled: {gameState.position} miles</p>
            <p>Survivors: {gameState.party.filter(m => m.health !== 'Dead').length}</p>
            <button onClick={handlePlayAgain}>Play Again</button>
        </div>
    );
};

export default EndScreen;