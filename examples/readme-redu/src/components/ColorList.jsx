"use strict";
import React from 'react';
import { subscribe } from 'redu';
import Color from './Color';

function ColorList(props) {

    return (
        <div>
            <p>
                The selected color is {props.selectedColor}
            </p>
            <div>
                {props.colors.map(color =>
                    <Color key={color} color={color} />
                )}
            </div>
        </div>
    );
}

export default subscribe(ColorList, (storeComponentState, storeComponentProps) => {

    return {
        selectedColor: storeComponentState.selectedColor,
        colors: storeComponentProps.colors
    };
});