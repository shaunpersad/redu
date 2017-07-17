"use strict";

import React from 'react';

import {presentationalComponent} from '../../../../redu';


class Search extends React.Component {

    constructor(props) {

        super(props);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    onSearchChange(e) {

        const searchQuery = e.currentTarget.value;

        this.props.search(searchQuery); // this is the search action we defined in app.js
    }

    /**
     * Below, we use "query" prop, which is actually derived from
     * the container's "searchQuery" state.
     *
     * Scroll all the way down to see how this derivation happens.
     */
    render() {

        return (
            <div className="component-search" style={{paddingTop: 20}}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        value={this.props.query}
                        onChange={this.onSearchChange}
                        placeholder="GitHub user search"
                    />
                </div>
            </div>
        );
    }
}

/**
 * Wrap the Search component in a presentational component.
 */
export default presentationalComponent(Search, {
    /**
     * The resulting presentational component will take this function and execute it against
     * the container component's state and props. The resulting object will get merged into
     * the Search component's props, which is how we have "query" prop,
     * without it being explicitly passed in by the Page component.
     *
     * This is how we turned "searchQuery" from the container's state into "query"
     * in the Search component's props.
     *
     */
    containerStateToProps: (state, props) => {

        return {
            query: state.searchQuery
        }
    },
    /**
     * Gives us a "search" prop, which maps to the "search" action in the container component.
     */
    actionsToProps: (actions) => {

        return {
            search: actions.search
        };
    }
});