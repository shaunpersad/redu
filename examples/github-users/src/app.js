/**
 * The entrypoint of our example app.
 *
 * Based on the initial state and the actions alone present on this page,
 * you should be able to determine what this app does.
 *
 * In short, it allows you to search for and display GitHub users.
 */

"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import _debounce from 'lodash.debounce';

import {containerComponent} from '../../../redu'; // will create a container out of the top-most component
import Page from './components/Page'; // our top-most component

/**
 * This is the full representation of the state that we would like to keep track of
 * across all components.
 *
 *
 * @type {{searchQuery: string, userToDisplay: null|{}, usersListItems: null|[]}}
 */
const initialState = {
    searchQuery: '',
    userToDisplay: null,
    usersListItems: null
};

/**
 * These are the props that we'd like our container component to have.
 * Consequently, all our actions and our presentational components
 * will also gain access to these props.
 *
 * This is a handy place to put utilities that will be used across the app.
 *
 * @type {{utils: {searchApi: {function}}}}
 */
const props = {
    utils: {
        searchApi: (query) => {
            return fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`)
                .then((resp) => resp.json());
        }
    }
};

/**
 * The actions you can perform to change the container component's state.
 *
 * They are all bound to the container component, so you have access to it's setState function,
 * props, and actions.
 *
 * @type {{displayUser: {function}, reset: {function}, search: {function}, debouncedSearch: {function}}}
 */
const actions = {

    /**
     * Select a user to display on the right hand side.
     *
     * @param {{}} userToDisplay
     */
    displayUser: function displayUser(userToDisplay) {

        this.setState({
            userToDisplay: userToDisplay
        });
    },

    /**
     * Reset the search.
     *
     */
    reset: function reset() {

        this.setState(initialState);
    },
    /**
     * Search for a GitHub user.
     *
     * Notice that this action calls another action.
     * All actions are members of the container component,
     * so you can simply call this[actionName] to access an
     * action from another.
     *
     * @param {string} searchQuery
     */
    search: function search(searchQuery) {

        this.setState({ // using the container's this.setState
            searchQuery: searchQuery
        });

        this.debouncedSearch(searchQuery); // call another action from this action.
    },

    /**
     * Only starts a search 200ms after typing.
     *
     * Notice that this action is asynchronous.
     *
     * Since you have access to the container component's this.setState,
     * you can perform an async operations and call setState before and after easily.
     *
     * @param {string} searchQuery
     */
    debouncedSearch: _debounce(function debounce(searchQuery) {

        this.setState({
            searchQuery: searchQuery,
            usersListItems: null // indicates that we're currently fetching these
        });

        /**
         * Using the container's props.utils.searchApi.
         */
        this.props.utils.searchApi(searchQuery).then((results) => {

            this.setState({
                usersListItems: results.items || []
            });
        });

    }, 200)
};

/**
 * Create the container to wrap our top-level Page component.
 *
 * @type {ContainerComponent}
 */
const App = containerComponent(Page, { actions, initialState });

ReactDOM.render(
    React.createElement(App, props), // render our App container component instead of the Page component.
    document.getElementById('root')
);