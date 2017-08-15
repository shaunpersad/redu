"use strict";

import { createStore, createSubscriber } from 'redu';

import ColorList from '../components/ColorList';

const ColorListStore = createStore(ColorList);

ColorListStore.defaultProps = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

ColorListStore.initialState = {
    selectedColor: ColorListStore.defaultProps.colors[0]
};

ColorListStore.actions = {
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

/**
 * We will wrap our StoreComponent in a SubscriberComponent to create a "SubStoreComponent",
 * which will subscribe to a higher-level StoreComponent called HistoryStore,
 * which will allow us to record and manage the original StoreComponent's state history.
 *
 * The picture looks like this now: ColorListSubStore > ColorListStore > ColorList
 *
 * @type {SubscriberComponent}
 */
export default createSubscriber(ColorListStore, (historyStoreState, historyStoreProps, historyStoreActions) => {

    return {
        hasHistory: historyStoreActions.hasHistory,
        addToHistory: historyStoreActions.addToHistory,
        removeFromHistory: historyStoreActions.removeFromHistory
    };
});