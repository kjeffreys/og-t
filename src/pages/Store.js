import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

const itemPrices = {
    oxen: 20, // per pair
    food: 0.2, // per lb
    clothing: 10, // per set
    ammunition: 2, // per box
    spareParts: { wheels: 10, axles: 10, tongues: 10 },
};

const Store = () =>
{
    const { gameState, setGameState } = useContext(GameContext);
    const [cart, setCart] = useState({
        oxen: 0,
        food: 0,
        clothing: 0,
        ammunition: 0,
        spareParts: { wheels: 0, axles: 0, tongues: 0 },
    });
    const navigate = useNavigate();

    const calculateTotal = () =>
    {
        return (
            cart.oxen * itemPrices.oxen +
            cart.food * itemPrices.food +
            cart.clothing * itemPrices.clothing +
            cart.ammunition * itemPrices.ammunition +
            cart.spareParts.wheels * itemPrices.spareParts.wheels +
            cart.spareParts.axles * itemPrices.spareParts.axles +
            cart.spareParts.tongues * itemPrices.spareParts.tongues
        );
    };

    const handlePurchase = () =>
    {
        const total = calculateTotal();
        if (total > gameState.money)
        {
            alert('Not enough money!');
            return;
        }
        setGameState({
            ...gameState,
            money: gameState.money - total,
            supplies: cart,
        });
        navigate('/travel');
    };

    return (
        <div>
            <h1>Matt's General Store</h1>
            <p>Money: ${gameState.money}</p>
            <h2>Buy Supplies</h2>
            <label>
                Oxen (pairs):{' '}
                <input
                    type="number"
                    value={cart.oxen}
                    onChange={(e) => setCart({ ...cart, oxen: parseInt(e.target.value) || 0 })}
                />
            </label>
            <label>
                Food (lbs):{' '}
                <input
                    type="number"
                    value={cart.food}
                    onChange={(e) => setCart({ ...cart, food: parseInt(e.target.value) || 0 })}
                />
            </label>
            <label>
                Clothing (sets):{' '}
                <input
                    type="number"
                    value={cart.clothing}
                    onChange={(e) => setCart({ ...cart, clothing: parseInt(e.target.value) || 0 })}
                />
            </label>
            <label>
                Ammunition (boxes):{' '}
                <input
                    type="number"
                    value={cart.ammunition}
                    onChange={(e) => setCart({ ...cart, ammunition: parseInt(e.target.value) || 0 })}
                />
            </label>
            <label>
                Wheels:{' '}
                <input
                    type="number"
                    value={cart.spareParts.wheels}
                    onChange={(e) =>
                        setCart({
                            ...cart,
                            spareParts: { ...cart.spareParts, wheels: parseInt(e.target.value) || 0 },
                        })
                    }
                />
            </label>
            <label>
                Axles:{' '}
                <input
                    type="number"
                    value={cart.spareParts.axles}
                    onChange={(e) =>
                        setCart({
                            ...cart,
                            spareParts: { ...cart.spareParts, axles: parseInt(e.target.value) || 0 },
                        })
                    }
                />
            </label>
            <label>
                Tongues:{' '}
                <input
                    type="number"
                    value={cart.spareParts.tongues}
                    onChange={(e) =>
                        setCart({
                            ...cart,
                            spareParts: { ...cart.spareParts, tongues: parseInt(e.target.value) || 0 },
                        })
                    }
                />
            </label>
            <p>Total: ${calculateTotal().toFixed(2)}</p>
            <button onClick={handlePurchase}>Depart</button>
        </div>
    );
};

export default Store;