import React, { useRef, useEffect, useState } from 'react';

const animals = [
  { name: 'Rabbit', weight: 5, speed: 3, size: 12, color: '#A9A9A9' }, // Muted gray
  { name: 'Deer', weight: 50, speed: 1.5, size: 24, color: '#8B4513' }, // Saddle brown
  { name: 'Buffalo', weight: 200, speed: 0.5, size: 48, color: '#5C4033' }, // Dark brown
];

// Pixel art patterns (unchanged)
const pixelPatterns = {
  Rabbit: [
    [0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0],
  ],
  Deer: [
    [1, 0, 0, 0, 1, 0, 0],
    [1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0],
  ],
  Buffalo: [
    [1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 0],
  ],
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

  useEffect(() =>
  {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const drawAnimal = (animal) =>
    {
      const pattern = pixelPatterns[animal.name];
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
      ctx.fillStyle = '#8A7F6F'; // Dusty tan background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gun
      const gunX = canvas.width / 2;
      const gunY = canvas.height - 20;
      ctx.beginPath();
      ctx.moveTo(gunX, gunY);
      ctx.lineTo(
        gunX + 20 * Math.cos(gunAngle),
        gunY - 20 * Math.sin(gunAngle)
      );
      ctx.strokeStyle = '#4A2C2A'; // Dark reddish-brown
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw bullets
      bullets.forEach(bullet =>
      {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4500'; // Orange-red
        ctx.fill();
      });

      // Draw animals
      activeAnimals.forEach(drawAnimal);

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [gunAngle, bullets, activeAnimals]);

  // Timer
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

  // Spawn animals
  useEffect(() =>
  {
    const spawnAnimal = () =>
    {
      const animal = animals[Math.floor(Math.random() * animals.length)];
      const newAnimal = {
        ...animal,
        x: Math.random() < 0.5 ? -animal.size : canvasRef.current.width + animal.size,
        y: Math.random() * (canvasRef.current.height - 100) + 50,
        dx: (Math.random() < 0.5 ? 1 : -1) * animal.speed,
      };
      setActiveAnimals(prev => [...prev, newAnimal]);
    };

    const interval = setInterval(spawnAnimal, 2000);
    return () => clearInterval(interval);
  }, []);

  // Move animals and bullets
  useEffect(() =>
  {
    const updatePositions = () =>
    {
      setActiveAnimals(prev =>
        prev.map(a => ({
          ...a,
          x: a.x + a.dx,
        })).filter(a => a.x + a.size >= 0 && a.x <= canvasRef.current.width)
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

  // Handle keyboard input
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
      <h2>Hunting</h2>
      <p>Time Left: {timeLeft}s | Ammo: {ammo} | Food Gained: {foodGained} lbs</p>
      <p>Use Left/Right arrows to aim (left to right), Spacebar to shoot.</p>
      <canvas ref={canvasRef} width={600} height={400} style={{ border: '2px solid #4A2C2A' }} />
    </div>
  );
};

export default HuntingMiniGame;