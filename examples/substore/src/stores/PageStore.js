"use strict";

import 'whatwg-fetch';
import _debounce from 'lodash.debounce';

import Page from '../components/Page';
import { storeOf } from 'redu';


const initialState = {
    searchQuery: '',
    userToDisplay: null,
    listItems: null
};


const props = {
    utils: {
        searchUsersApi(query) {
            return fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`)
                .then((resp) => resp.json());
        },
        searchUserReposApi(userName, query) {
            return fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${userName}`)
                .then((resp) => resp.json());
        }
    },
    entity: 'user'
};


const actions = {

    displayUser(userToDisplay) {

        this.setState({ userToDisplay });
    },

    reset() {

        this.setState(initialState);
    },

    search(searchQuery) {

        this.setState({ searchQuery });

        this.actions.debouncedSearch(searchQuery);
    },

    debouncedSearch: _debounce(function debouncedSearch(searchQuery) {

        this.setState({
            searchQuery,
            listItems: null // indicates that we're currently fetching these
        });

        this.props.utils.searchUsersApi(searchQuery).then((results) => {

            this.setState({
                listItems: results.items || []
            });
        });

    }, 500)
};

export default storeOf(Page, props).withActions(actions).withInitialState(initialState);
