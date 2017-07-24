"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { stateManagerOf, subscribe } from 'redu';

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
        }, () => {
            this.props.addToHistory(this.state);
        });
    },
    undo: function undo() {
        this.props.removeFromHistory((state) => {
            this.setState(state);
        });
    }
};

/**
 * We're going to use the "asSubStore" method to wrap this StoreComponent
 * in a SubscriberComponent, which will subscribe to a higher-level StoreComponent
 * called HistoryStoreComponent, which will allow us to track the changes to the
 * StoreComponent's state history.
 */
const StoreComponent = stateManagerOf(ColorList)
    .withInitialState(initialState)
    .withActions(actions)
    .asSubStore((historyComponentState, historyComponentProps, historyComponentActions) => {

    return {
        hasHistory: historyComponentState.history.length > 1,
        addToHistory: historyComponentActions.addToHistory,
        removeFromHistory: historyComponentActions.removeFromHistory
    };
});

/**
 * We've made our traditional StoreComponent into a SubscriberComponent,
 * subscribed to the HistoryStoreComponent,
 * which will house the StoreComponent's state history.
 *
 * @type {{history: [*]}}
 */

const historyInitialState = {
    history: [initialState]
};

const historyActions = {
    addToHistory: function addToHistory(state, callback) {

        this.setState((prevState) => {
            return {
                history: prevState.history.concat(state)
            };
        }, callback);
    },
    removeFromHistory: function removeFromHistory(getState) {

        this.setState((prevState) => {
            if (prevState.history.length) {
                return {
                    history: prevState.history.filter((state, index) => {
                        return index < prevState.history.length - 1;
                    })
                };
            }

            return historyInitialState;

        }, () => {
            getState(this.state.history[this.state.history.length - 1]);
        });
    }
};

/**
 * Yup, we're now managing the state of a state manager.
 *
 * @type {StoreComponent}
 */
const HistoryStoreComponent = stateManagerOf(StoreComponent)
    .withInitialState(historyInitialState)
    .withActions(historyActions);

ReactDOM.render(
    React.createElement(HistoryStoreComponent, props),
    document.getElementById('root')
);