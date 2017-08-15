"use strict";

import { createStore } from 'redu';

import ColorListSubStore from './ColorListSubStore';

/**
 * Now we have a higher-level StoreComponent.
 *
 * The picture looks like this now: HistoryStore > ColorListSubStore > ColorListStore > ColorList
 *
 * @type {StoreComponent}
 */
const HistoryStore = createStore(ColorListSubStore);

/**
 * We want to use the ColorListStore's initiaState as the first item in our history,
 * so we need to get the ColorListStore back from the ColorListSubStore that wraps it.
 */
const ColorListStore = ColorListSubStore.WrappedComponent;

HistoryStore.initialState = {
    history: [ColorListStore.initialState] // use the ColorListStore's initialState as the first item in the history.
};

HistoryStore.actions = {
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
                history.push(ColorListStore.initialState);
            }

            return { history };

        }, () => {
            getState(this.state.history[this.state.history.length - 1]);
        });
    }
};

/**
 * We don't want changes to the history doubly-render the app.
 *
 * The picture looks like this now: DoNotRenderHistoryStoreComponent > ColorListSubStore > ColorListStore > ColorList
 *
 */
export default class DoNotRenderHistoryStore extends HistoryStore {

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
}