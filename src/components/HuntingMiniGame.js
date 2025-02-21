import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const animals = [
    { name: 'Rabbit', weight: 5, speed: 3, size: 12, color: '#A9A9A9' },
    { name: 'Deer', weight: 50, speed: 1.5, size: 24, color: '#8B4513' },
    { name: 'Buffalo', weight: 200, speed: 0.5, size: 48, color: '#5C4033' },
];

const pixelPatterns = {
    Rabbit: {
        frame1: [
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0, 0],
        ],
        frame2: [
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 1],
            [0, 0, 1, 0, 1, 1],
            [0, 0, 0, 1, 0, 0],
        ],
    },
    Deer: {
        frame1: [
            [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        ],
        frame2: [
            [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        ],
    },
    Buffalo: {
        frame1: [
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Horns up
            [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Horns + head
            [0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // Head
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // Hump
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], // Hump/body
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // Body
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // Body
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // Body
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // Body
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // Body
            [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], // Legs up
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0], // Legs up
        ],
        frame2: [
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0], // Legs down
            [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0], // Legs down
        ],
    },
};

const HuntingMiniGame = ({ onEnd }) =>
{
    const canvasRef = useRef(null);
    const gunAngleRef = useRef(Math.PI / 2);
    const [gunAngle, setGunAngle] = useState(Math.PI / 2);
    const [bullets, setBullets] = useState([]);
    const [activeAnimals, setActiveAnimals] = useState([]);
    const [ammo, setAmmo] = useState(20);
    const [foodGained, setFoodGained] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [frameCount, setFrameCount] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);

    useEffect(() =>
    {
        console.log('HuntingMiniGame v2.4 mounted, onEnd type:', typeof onEnd);
        return () => console.log('HuntingMiniGame unmounting');
    }, [onEnd]);

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;

        const drawAnimal = (animal) =>
        {
            const pattern = pixelPatterns[animal.name][Math.floor(frameCount / 12) % 2 === 0 ? 'frame1' : 'frame2'];
            const pixelSize = animal.size / pattern.length;
            for (let y = 0; y < pattern.length; y++)
            {
                for (let x = 0; x < pattern[y].length; x++)
                {
                    if (pattern[y][x] === 1)
                    {
                        ctx.fillStyle = animal.color;
                        ctx.fillRect(
                            animal.x + x * pixelSize,
                            animal.y + y * pixelSize,
                            pixelSize,
                            pixelSize
                        );
                    }
                }
            }
        };

        const draw = () =>
        {
            ctx.fillStyle = '#8A7F6F';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gunX = canvas.width / 2;
            const gunY = canvas.height - 20;
            ctx.beginPath();
            ctx.moveTo(gunX, gunY);
            ctx.lineTo(
                gunX + 20 * Math.cos(gunAngle),
                gunY - 20 * Math.sin(gunAngle)
            );
            ctx.strokeStyle = '#4A2C2A';
            ctx.lineWidth = 2;
            ctx.stroke();

            bullets.forEach(bullet =>
            {
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#FF4500';
                ctx.fill();
            });

            activeAnimals.forEach(drawAnimal);

            animationFrame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrame);
    }, [gunAngle, bullets, activeAnimals, frameCount]);

    useEffect(() =>
    {
        if (timeLeft > 0 && !gameEnded)
        {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, gameEnded]);

    useEffect(() =>
    {
        if (timeLeft === 0 && !gameEnded)
        {
            setGameEnded(true);
            if (typeof onEnd === 'function')
            {
                console.log('Calling onEnd with foodGained:', foodGained);
                onEnd(foodGained);
            } else
            {
                console.error('onEnd is not a function, defaulting to log');
                console.log('Game ended, food gained:', foodGained);
            }
        }
    }, [timeLeft, gameEnded, onEnd, foodGained]);

    useEffect(() =>
    {
        const spawnAnimal = () =>
        {
            const animal = animals[Math.floor(Math.random() * animals.length)];
            const angle = Math.random() * 2 * Math.PI;
            const newAnimal = {
                ...animal,
                x: Math.random() * canvasRef.current.width,
                y: Math.random() * canvasRef.current.height,
                dx: animal.speed * Math.cos(angle),
                dy: animal.speed * Math.sin(angle),
            };
            setActiveAnimals(prev => [...prev, newAnimal]);
        };

        const interval = setInterval(spawnAnimal, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() =>
    {
        const updatePositions = () =>
        {
            setFrameCount(prev => prev + 1);

            setActiveAnimals(prev =>
                prev.map(a =>
                {
                    let newX = a.x + a.dx;
                    let newY = a.y + a.dy;
                    let newDx = a.dx;
                    let newDy = a.dy;

                    if (newX < -a.size || newX > canvasRef.current.width) newDx = -newDx;
                    if (newY < 0 || newY > canvasRef.current.height - a.size) newDy = -newDy;

                    return { ...a, x: newX, y: newY, dx: newDx, dy: newDy };
                })
            );

            setBullets(prev =>
                prev.map(bullet => ({
                    ...bullet,
                    x: bullet.x + bullet.dx,
                    y: bullet.y + bullet.dy,
                })).filter(bullet => bullet.y > 0 && bullet.x >= 0 && bullet.x <= canvasRef.current.width)
            );

            setActiveAnimals(prevAnimals =>
            {
                const remainingAnimals = [];
                prevAnimals.forEach(animal =>
                {
                    const hit = bullets.some(bullet =>
                        Math.sqrt((bullet.x - (animal.x + animal.size / 2)) ** 2 + (bullet.y - (animal.y + animal.size / 2)) ** 2) < animal.size / 2 + 3
                    );
                    if (hit)
                    {
                        setFoodGained(prev => prev + animal.weight);
                        setBullets(prev => prev.filter(b =>
                            Math.sqrt((b.x - (animal.x + animal.size / 2)) ** 2 + (b.y - (animal.y + animal.size / 2)) ** 2) >= animal.size / 2 + 3
                        ));
                    } else
                    {
                        remainingAnimals.push(animal);
                    }
                });
                return remainingAnimals;
            });
        };

        const interval = setInterval(updatePositions, 16);
        return () => clearInterval(interval);
    }, [bullets]);

    useEffect(() =>
    {
        const handleKeyDown = (e) =>
        {
            switch (e.key)
            {
                case 'ArrowLeft':
                    setGunAngle(prev =>
                    {
                        const newAngle = Math.min(Math.PI, prev + 0.1);
                        gunAngleRef.current = newAngle;
                        return newAngle;
                    });
                    break;
                case 'ArrowRight':
                    setGunAngle(prev =>
                    {
                        const newAngle = Math.max(0, prev - 0.1);
                        gunAngleRef.current = newAngle;
                        return newAngle;
                    });
                    break;
                case ' ':
                    if (ammo > 0)
                    {
                        setAmmo(ammo - 1);
                        const bulletSpeed = 5;
                        setBullets(prev => [
                            ...prev,
                            {
                                x: canvasRef.current.width / 2,
                                y: canvasRef.current.height - 20,
                                dx: bulletSpeed * Math.cos(gunAngleRef.current),
                                dy: -bulletSpeed * Math.sin(gunAngleRef.current),
                            },
                        ]);
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [ammo]);

    return (
        <div>
            <h2>Hunting (v2.4)</h2>
            <p>Time Left: {timeLeft}s | Ammo: {ammo} | Food Gained: {foodGained} lbs</p>
            <p>Use Left/Right arrows to aim (left to right), Spacebar to shoot.</p>
            <canvas ref={canvasRef} width={600} height={400} style={{ border: '2px solid #4A2C2A' }} />
        </div>
    );
};

HuntingMiniGame.propTypes = {
    onEnd: PropTypes.func,
};

HuntingMiniGame.defaultProps = {
    onEnd: () => console.log('Default onEnd called'),
};

export default HuntingMiniGame;