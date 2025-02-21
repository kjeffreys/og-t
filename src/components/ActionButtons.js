import React from 'react';

const ActionButtons = ({ onContinue, onHunt, onChangePace, onChangeRations }) =>
{
    return (
        <div>
            <button onClick={onContinue}>Continue</button>
            <button onClick={onHunt}>Hunt</button>
            <select onChange={(e) => onChangePace(e.target.value)}>
                <option value="Slow">Slow</option>
                <option value="Steady">Steady</option>
                <option value="Strenuous">Strenuous</option>
            </select>
            <select onChange={(e) => onChangeRations(e.target.value)}>
                <option value="Filling">Filling</option>
                <option value="Meager">Meager</option>
                <option value="Bare">Bare</option>
            </select>
        </div>
    );
};

export default ActionButtons;