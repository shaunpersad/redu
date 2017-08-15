"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import PageStore from './stores/PageStore';

ReactDOM.render(
    React.createElement(PageStore),
    document.getElementById('root')
);