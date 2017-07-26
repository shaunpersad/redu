"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { storeOf } from 'redu';

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

const StoreComponent = storeOf(ColorList).withInitialState(initialState).withActions(actions);

ReactDOM.render(
    React.createElement(StoreComponent, props),
    document.getElementById('root')
);