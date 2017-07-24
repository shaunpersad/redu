"use strict";

import React from 'react';

import ColorOptions from './ColorOptions';

function Color(props) {

    return (
        <div>
            <span>This color is {props.color}</span>
            <ColorOptions color={props.color} />
        </div>
    );
}

export default Color;