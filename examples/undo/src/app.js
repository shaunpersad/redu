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
    setStateAndHistory(state = {}) {

        this.props.addToHistory(state, (state) => {
            this.setState(state);
        });
    },
    changeColor(color) {

        this.actions.setStateAndHistory({
            selectedColor: color
        });
    },
    undo() {
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
 * The picture looks like this now: SubStoreComponent > StoreComponent > ColorList
 *
 * @type {SubscriberComponent}
 */
const SubStoreComponent = subscribe(StoreComponent, (historyComponentState, historyComponentProps, historyComponentActions) => {

    return {
        hasHistory: historyComponentActions.hasHistory,
        addToHistory: historyComponentActions.addToHistory,
        removeFromHistory: historyComponentActions.removeFromHistory
    };
});

/**
 * We're now going to make our HistoryStoreComponent.
 */

const historyInitialState = {
    history: [initialState]
};

const historyActions = {
    hasHistory() {
        return this.state.history.length > 1;
    },
    addToHistory(state, getState) {

        this.setState((prevState) => {
            return {
                history: prevState.history.concat(state)
            };
        }, () => {
            getState(this.state.history[this.state.history.length - 1]);
        });
    },
    removeFromHistory(getState) {

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
 * Now we have a higher-level StoreComponent.
 *
 * The picture looks like this now: HistoryStoreComponent > SubStoreComponent > StoreComponent > ColorList
 *
 * @type {StoreComponent}
 */
const HistoryStoreComponent = storeOf(SubStoreComponent)
    .withInitialState(historyInitialState)
    .withActions(historyActions);

/**
 * We don't want changes to the history doubly-render the app.
 *
 * The picture looks like this now: DoNotRenderHistoryStoreComponent > SubStoreComponent > StoreComponent > ColorList
 *
 */
class DoNotRenderHistoryStoreComponent extends HistoryStoreComponent {

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
}

ReactDOM.render(
    React.createElement(DoNotRenderHistoryStoreComponent, props),
    document.getElementById('root')
);