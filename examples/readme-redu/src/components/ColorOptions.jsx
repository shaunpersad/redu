"use strict";

import React from 'react';
import { subscribe } from 'redu';

function ColorOptions(props) {
    return (
        <div>
            <span>Replace {props.selectedColor} with {props.color}?</span>
            <button onClick={e => props.changeColor(props.color)}>yes</button>
        </div>
    );
}

export default subscribe(ColorOptions, (storeComponentState, storeComponentProps, storeComponentActions) => {

    return {
        selectedColor: storeComponentState.selectedColor,
        changeColor: storeComponentActions.changeColor
    };
});