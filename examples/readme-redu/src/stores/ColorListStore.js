"use strict";

import { storeOf } from 'redu';

import ColorList from '../components/ColorList';

const props = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

const initialState = {
    selectedColor: props.colors[0]
};

const actions = {
    changeColor(color) {
        this.setState({
            selectedColor: color
        });
    }
};

export default storeOf(ColorList, props).withInitialState(initialState).withActions(actions);