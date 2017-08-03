"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { storeOf, subscribe } from 'redu';

import ColorList from './components/ColorList';

const props = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

const initialState = {
    selectedColor: props.colors[0]
};

const actions = {
    setStateAndHistory: function setStateAndHistory(state = {}) {

        this.setState(state, () => {
            this.props.addToHistory(this.state);
        });
    },
    changeColor: function changeColor(color) {

        this.actions.setStateAndHistory({
            selectedColor: color
        });
    },
    undo: function undo() {
        this.props.removeFromHistory((state) => {
            this.setState(state);
        });
    }
};

const StoreComponent = storeOf(ColorList).withInitialState(initialState).withActions(actions);

/**
 * We will wrap our StoreComponent in a SubscriberComponent called SubStoreComponent,
 * which will subscribe to a higher-level StoreComponent called HistoryStoreComponent,
 * which will allow us to record and manage the original StoreComponent's state history.
 *
 * @type {SubscriberComponent}
 */
const SubStoreComponent = subscribe(StoreComponent, (historyComponentState, historyComponentProps, historyComponentActions) => {

    return {
        hasHistory: historyComponentState.history.length > 1,
        addToHistory: historyComponentActions.addToHistory,
        removeFromHistory: historyComponentActions.removeFromHistory
    };
});

/**
 * We're now going to make our HistoryStoreComponent.
 *
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

            let history = prevState.history.filter((state, index) => {
                return index < prevState.history.length - 1;
            });

            if (!history.length) {
                history.push(initialState);
            }

            return { history };

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
const HistoryStoreComponent = storeOf(SubStoreComponent)
    .withInitialState(historyInitialState)
    .withActions(historyActions);

ReactDOM.render(
    React.createElement(HistoryStoreComponent, props),
    document.getElementById('root')
);