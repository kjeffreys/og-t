import React from 'react';

const EventDialog = ({ event, onChoice }) =>
{
    if (!event) return null;
    return (
        <div>
            <p>{event.message}</p>
            {event.choices ? (
                event.choices.map((choice, index) => (
                    <button key={index} onClick={() => onChoice(choice)}>
                        {choice}
                    </button>
                ))
            ) : (
                <button onClick={() => onChoice('OK')}>OK</button>
            )}
        </div>
    );
};

export default EventDialog;