import React, { useRef, useEffect, useState } from 'react';

const animals = [
    { name: 'Rabbit', weight: 5, speed: 2 },
    { name: 'Deer', weight: 50, speed: 1 },
    { name: 'Buffalo', weight: 200, speed: 0.5 },
];

const HuntingMiniGame = ({ onEnd }) =>
{
    const canvasRef = useRef(null);
    const [crosshair, setCrosshair] = useState({ x: 300, y: 200 });
    const [activeAnimals, setActiveAnimals] = useState([]);
    const [ammo, setAmmo] = useState(20);
    const [foodGained, setFoodGained] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;

        const draw = () =>
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw crosshair
            ctx.beginPath();
            ctx.moveTo(crosshair.x - 10, crosshair.y);
            ctx.lineTo(crosshair.x + 10, crosshair.y);
            ctx.moveTo(crosshair.x, crosshair.y - 10);
            ctx.lineTo(crosshair.x, crosshair.y + 10);
            ctx.strokeStyle = 'red';
            ctx.stroke();

            // Draw animals
            activeAnimals.forEach(animal =>
            {
                ctx.fillStyle = 'brown';
                ctx.fillRect(animal.x, animal.y, 20, 20);
            });

            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrame);
    }, [crosshair, activeAnimals]);

    useEffect(() =>
    {
        if (timeLeft > 0)
        {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else
        {
            onEnd(foodGained);
        }
    }, [timeLeft, foodGained, onEnd]);

    useEffect(() =>
    {
        const spawnAnimal = () =>
        {
            const animal = animals[Math.floor(Math.random() * animals.length)];
            const newAnimal = {
                ...animal,
                x: Math.random() * 580,
                y: Math.random() * 380,
                dx: (Math.random() - 0.5) * animal.speed,
                dy: (Math.random() - 0.5) * animal.speed,
            };
            setActiveAnimals(prev => [...prev, newAnimal]);
        };

        const interval = setInterval(spawnAnimal, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() =>
    {
        const moveAnimals = () =>
        {
            setActiveAnimals(prev =>
                prev.map(a => ({
                    ...a,
                    x: a.x + a.dx,
                    y: a.y + a.dy,
                })).filter(a => a.x >= 0 && a.x <= 580 && a.y >= 0 && a.y <= 380)
            );
        };

        const interval = setInterval(moveAnimals, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() =>
    {
        const handleKeyDown = (e) =>
        {
            switch (e.key)
            {
                case 'ArrowUp':
                    setCrosshair(prev => ({ ...prev, y: Math.max(0, prev.y - 10) }));
                    break;
                case 'ArrowDown':
                    setCrosshair(prev => ({ ...prev, y: Math.min(400, prev.y + 10) }));
                    break;
                case 'ArrowLeft':
                    setCrosshair(prev => ({ ...prev, x: Math.max(0, prev.x - 10) }));
                    break;
                case 'ArrowRight':
                    setCrosshair(prev => ({ ...prev, x: Math.min(600, prev.x + 10) }));
                    break;
                case ' ':
                    if (ammo > 0)
                    {
                        setAmmo(ammo - 1);
                        const hitAnimal = activeAnimals.find(a =>
                            Math.abs(a.x + 10 - crosshair.x) < 15 && Math.abs(a.y + 10 - crosshair.y) < 15
                        );
                        if (hitAnimal)
                        {
                            setFoodGained(prev => prev + hitAnimal.weight);
                            setActiveAnimals(prev => prev.filter(a => a !== hitAnimal));
                        }
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [ammo, activeAnimals, crosshair]);

    return (
        <div>
            <h2>Hunting</h2>
            <p>Time Left: {timeLeft}s | Ammo: {ammo} | Food Gained: {foodGained} lbs</p>
            <p>Use arrow keys to move crosshair, spacebar to shoot.</p>
            <canvas ref={canvasRef} width={600} height={400} style={{ border: '1px solid black' }} />
        </div>
    );
};

export default HuntingMiniGame;