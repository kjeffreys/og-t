import React from 'react';

const RiverCrossing = ({ onChoice }) =>
{
    return (
        <div>
            <h2>River Crossing</h2>
            <p>Choose how to cross the river:</p>
            <button onClick={() => onChoice('ford')}>Ford the river</button>
            <button onClick={() => onChoice('caulk')}>Caulk the wagon and float</button>
            <button onClick={() => onChoice('ferry')}>Take a ferry ($5)</button>
            <button onClick={() => onChoice('wait')}>Wait for conditions to improve</button>
        </div>
    );
};

export default RiverCrossing;