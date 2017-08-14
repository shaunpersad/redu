"use strict";
import _debounce from 'lodash.debounce';

import { createStore, subscribe } from 'redu';

import User from '../components/User';

const UserStore = createStore(User);

UserStore.defaultProps = {
    entity: 'repo'
};

UserStore.initialState = {
    searchQuery: '',
    listItems: null
};


UserStore.actions = {

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


export default subscribe(UserStore, (pageStoreState, pageStoreProps, pageStoreActions) => {

    return {
        user: pageStoreState.userToDisplay,
        utils: pageStoreProps.utils
    };
});
