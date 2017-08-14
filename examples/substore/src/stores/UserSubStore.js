"use strict";
import _debounce from 'lodash.debounce';

import { storeOf, subscribe } from 'redu';

import User from '../components/User';

const props = {
    entity: 'repo'
};

const initialState = {
    searchQuery: '',
    listItems: null
};


const actions = {

    reset() {

        this.actions.search();
    },

    search(searchQuery = '') {

        this.setState({ searchQuery });

        this.actions.debouncedSearch(searchQuery);
    },

    debouncedSearch: _debounce(function debouncedSearch(searchQuery) {

        this.setState({
            searchQuery,
            listItems: null // indicates that we're currently fetching these
        });

        this.props.utils.searchUserReposApi(this.props.user.login, searchQuery).then((results) => {

            this.setState({
                listItems: results.items || []
            });
        });

    }, 500)
};

const UserStore = storeOf(User, props).withActions(actions).withInitialState(initialState);


export default subscribe(UserStore, (pageStoreState, pageStoreProps, pageStoreActions) => {

    return {
        user: pageStoreState.userToDisplay,
        utils: pageStoreProps.utils
    };
});
