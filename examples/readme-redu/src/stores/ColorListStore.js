"use strict";

import { createStore } from 'redu';

import ColorList from '../components/ColorList';

const ColorListStore = createStore(ColorList);

ColorListStore.defaultProps = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

ColorListStore.initialState = {
    selectedColor: ColorListStore.defaultProps.colors[0]
};

ColorListStore.actions = {
    changeColor(color) {
        this.setState({
            selectedColor: color
        });
    }
};

export default ColorListStore;