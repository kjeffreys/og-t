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
            [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
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
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
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
    const [touchStartX, setTouchStartX] = useState(null);

    useEffect(() =>
    {
        console.log('HuntingMiniGame v2.6 mounted, onEnd type:', typeof onEnd);
        return () => console.log('HuntingMiniGame unmounting');
    }, [onEnd]);

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        if (!canvas) return;

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
            if (!ctx) return;

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
        const canvas = canvasRef.current;
        if (!canvas) return;

        const spawnAnimal = () =>
        {
            const animal = animals[Math.floor(Math.random() * animals.length)];
            const angle = Math.random() * 2 * Math.PI;
            const newAnimal = {
                ...animal,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
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
        const canvas = canvasRef.current;
        if (!canvas) return;

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

                    if (newX < -a.size || newX > canvas.width) newDx = -newDx;
                    if (newY < 0 || newY > canvas.height - a.size) newDy = -newDy;

                    return { ...a, x: newX, y: newY, dx: newDx, dy: newDy };
                })
            );

            setBullets(prev =>
                prev.map(bullet => ({
                    ...bullet,
                    x: bullet.x + bullet.dx,
                    y: bullet.y + bullet.dy,
                })).filter(bullet => bullet.y > 0 && bullet.x >= 0 && bullet.x <= canvas.width)
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

    // Keyboard controls
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
                        const canvas = canvasRef.current;
                        if (!canvas) return;
                        const bulletSpeed = 5;
                        setBullets(prev => [
                            ...prev,
                            {
                                x: canvas.width / 2,
                                y: canvas.height - 20,
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

    // Touch controls
    useEffect(() =>
    {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleTouchStart = (e) =>
        {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;

            if (touchX < canvas.width / 2)
            {
                // Left half: Start aiming
                setTouchStartX(touchX);
            } else
            {
                // Right half: Shoot
                if (ammo > 0)
                {
                    setAmmo(ammo - 1);
                    const bulletSpeed = 5;
                    setBullets(prev => [
                        ...prev,
                        {
                            x: canvas.width / 2,
                            y: canvas.height - 20,
                            dx: bulletSpeed * Math.cos(gunAngleRef.current),
                            dy: -bulletSpeed * Math.sin(gunAngleRef.current),
                        },
                    ]);
                }
            }
        };

        const handleTouchMove = (e) =>
        {
            e.preventDefault();
            if (touchStartX === null) return;

            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const deltaX = touchX - touchStartX;

            // Reduced sensitivity from 0.005 to 0.002 for smoother aiming
            setGunAngle(prev =>
            {
                const newAngle = Math.max(0, Math.min(Math.PI, prev - deltaX * 0.002));
                gunAngleRef.current = newAngle;
                return newAngle;
            });
        };

        const handleTouchEnd = (e) =>
        {
            e.preventDefault();
            setTouchStartX(null);
        };

        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);

        return () =>
        {
            if (canvas)
            {
                canvas.removeEventListener('touchstart', handleTouchStart);
                canvas.removeEventListener('touchmove', handleTouchMove);
                canvas.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [ammo, touchStartX]);

    return (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Hunting (v2.6)</h2>
            <p>Time Left: {timeLeft}s | Ammo: {ammo} | Food Gained: {foodGained} lbs</p>
            <p>Desktop: Left/Right arrows to aim, Space to shoot. Mobile: Swipe left half to aim, tap right half to shoot.</p>
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', border: '2px solid #4A2C2A', touchAction: 'none' }}
            />
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