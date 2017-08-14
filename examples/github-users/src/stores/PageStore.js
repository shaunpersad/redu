/**
 * The Store of our example app, which allows you to search for and display GitHub users.
 *
 * Based on the initial state and the actions alone present on this page,
 * you should be able to determine what this app does.
 */

"use strict";

import 'whatwg-fetch';
import _debounce from 'lodash.debounce';

import Page from '../components/Page'; // our top-most component.
import { storeOf } from 'redu'; // will create a StoreComponent wrapping the top-most component.

/**
 * This is the full representation of the application-level state that we would like to keep track of
 * across all components.
 *
 * @type {{searchQuery: string, userToDisplay: null|{}, usersListItems: null|[]}}
 */
const initialState = {
    searchQuery: '',
    userToDisplay: null,
    usersListItems: null
};

/**
 * These are the props that we'd like our StoreComponent to have.
 * Consequently, all our actions and our SubscriberComponents
 * will also gain access to these props.
 *
 * This is a handy place to put utilities that will be used across the application.
 *
 * @type {{utils: {searchApi: {function}}}}
 */
const props = {
    utils: {
        searchApi(query) {
            return fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`)
                .then((resp) => resp.json());
        }
    }
};

/**
 * The actions you can perform to change the StoreComponent's state.
 *
 * They are all bound to the StoreComponent, so you have access to it's setState function,
 * props, and other action functions.
 *
 * @type {{displayUser: {function}, reset: {function}, search: {function}, debouncedSearch: {function}}}
 */
const actions = {

    /**
     * Select a user to display on the right hand side.
     *
     * @param {{}} userToDisplay
     */
    displayUser(userToDisplay) {

        this.setState({ userToDisplay });
    },

    /**
     * Reset the search.
     *
     */
    reset() {

        this.setState(initialState);
    },
    /**
     * Search for a GitHub user.
     *
     * Notice that this action calls another action.
     * All actions are available in the "actions" property of the StoreComponent,
     * so you can simply call this.actions[actionName] to access one
     * action from another.
     *
     * @param {string} searchQuery
     */
    search(searchQuery) {

        this.setState({ searchQuery }); // using the StoreComponent's this.setState

        this.actions.debouncedSearch(searchQuery); // call another action from this action.
    },

    /**
     * Only starts a search 500ms after typing.
     *
     * Notice that this action is asynchronous.
     *
     * Since you have access to the StoreComponent's this.setState,
     * you can perform an async operations and call setState before and after easily.
     *
     * @param {string} searchQuery
     */
    debouncedSearch: _debounce(function debouncedSearch(searchQuery) {

        this.setState({
            searchQuery,
            usersListItems: null // indicates that we're currently fetching these
        });

        /**
         * Using the StoreComponent's props.utils.searchApi.
         */
        this.props.utils.searchApi(searchQuery).then((results) => {

            this.setState({
                usersListItems: results.items || []
            });
        });

    }, 500)
};

/**
 * Create the StoreComponent to wrap our top-level Page component,
 * and pass in our actions and initialState.
 *
 * @type {StoreComponent}
 */
export default storeOf(Page, props).withActions(actions).withInitialState(initialState);
