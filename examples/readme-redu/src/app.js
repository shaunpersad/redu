"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { stateManagerOf } from 'redu';

import ColorList from './components/ColorList';

const props = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

const initialState = {
    selectedColor: props.colors[0]
};

const actions = {
    changeColor: function changeColor(color) {
        this.setState({
            selectedColor: color
        });
    }
};

const App = stateManagerOf(ColorList).withInitialState(initialState).withActions(actions);

ReactDOM.render(
    React.createElement(App, props),
    document.getElementById('root')
);