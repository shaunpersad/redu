"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

import ColorListStore from './stores/ColorListStore';

ReactDOM.render(
    React.createElement(ColorListStore),
    document.getElementById('root')
);