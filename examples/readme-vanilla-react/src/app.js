"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import ColorList from './components/ColorList';

const props = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

ReactDOM.render(
    React.createElement(ColorList, props),
    document.getElementById('root')
);