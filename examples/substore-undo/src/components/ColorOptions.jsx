"use strict";

import React from 'react';
import { createSubscriber } from 'redu';

function ColorOptions(props) {
    return (
        <div>
            <span>Replace {props.selectedColor} with {props.color}?</span>
            <button onClick={e => props.changeColor(props.color)}>yes</button>
        </div>
    );
}

export default createSubscriber(ColorOptions, (colorListSubStoreState, colorListSubStoreProps, colorListSubStoreActions) => {

    return {
        selectedColor: colorListSubStoreState.selectedColor,
        changeColor: colorListSubStoreActions.changeColor
    };
});