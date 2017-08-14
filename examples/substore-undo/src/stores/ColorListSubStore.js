"use strict";

import { storeOf, subscribe } from 'redu';

import ColorList from '../components/ColorList';

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

const ColorListStore = storeOf(ColorList, props).withInitialState(initialState).withActions(actions);

/**
 * We will wrap our StoreComponent in a SubscriberComponent called SubStoreComponent,
 * which will subscribe to a higher-level StoreComponent called HistoryStoreComponent,
 * which will allow us to record and manage the original StoreComponent's state history.
 *
 * The picture looks like this now: ColorListSubStore > ColorListStore > ColorList
 *
 * @type {SubscriberComponent}
 */
export default subscribe(ColorListStore, (historyStoreState, historyStoreProps, historyStoreActions) => {

    return {
        hasHistory: historyStoreActions.hasHistory,
        addToHistory: historyStoreActions.addToHistory,
        removeFromHistory: historyStoreActions.removeFromHistory
    };
});