"use strict";

import { storeOf } from 'redu';

import ColorListSubStore from './ColorListSubStore';

const initialState = {
    history: [ColorListSubStore.initialState]
};

const actions = {
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
 * The picture looks like this now: HistoryStore > ColorListSubStore > ColorListStore > ColorList
 *
 * @type {StoreComponent}
 */
const HistoryStore = storeOf(ColorListSubStore).withInitialState(initialState).withActions(actions);

/**
 * We don't want changes to the history doubly-render the app.
 *
 * The picture looks like this now: DoNotRenderHistoryStore > ColorListSubStore > ColorListStore > ColorList
 *
 */
export class DoNotRenderHistoryStore extends HistoryStore {

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
}