"use strict";
import React from 'react';
import { subscribe } from 'redu';
import Color from './Color';

function ColorList(props) {

    console.log('rendering');

    return (
        <div>
            <p>
                The selected color is {props.selectedColor}.
                {props.showUndoButton ? (<button onClick={e => props.undo()}>undo</button>) : null}
            </p>
            <div>
                {props.colors.map(color =>
                    <Color key={color} color={color} />
                )}
            </div>
        </div>
    );
}

export default subscribe(ColorList, (storeComponentState, storeComponentProps, storeComponentActions) => {

    return {
        selectedColor: storeComponentState.selectedColor,
        colors: storeComponentProps.colors,
        showUndoButton: storeComponentProps.hasHistory(),
        undo: storeComponentActions.undo
    };
});