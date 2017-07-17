"use strict";

import React from 'react';

import {presentationalComponent} from '../../../../redu';


class Status extends React.Component {

    status() {
        if (!this.props.searchQuery) {
            return 'Please enter a GitHub username.';
        }
        if (this.props.usersListItems === null) {
            return 'Searching...';
        }
        return `Found ${this.props.usersListItems.length} users.`;

    }

    render() {

        return (
            <div className="component-status">

                <p>
                    {this.status()}
                    <button
                        className="btn btn-default"
                        onClick={this.props.reset}
                        style={{marginLeft: 10, display: this.props.usersListItems ? 'inline-block': 'none'}}
                    >
                        reset
                    </button>
                </p>
            </div>
        );
    }
}

/**
 * Wrap the Status component in a presentational component.
 */
export default presentationalComponent(Status, {

    /**
     * The resulting presentational component will take this function and execute it against
     * the container component's state and props. The resulting object will get merged into
     * the Status component's props, which is how we have "searchQuery" and "usersListItems"
     * props, without them being explicitly passed in by the Page component.
     */
    containerStateToProps: (state, props) => {

        return {
            searchQuery: state.searchQuery,
            usersListItems: state.usersListItems
        }
    },
    /**
     * Gives us a "reset" prop, which maps to the "reset" action in the container component.
     */
    actionsToProps: (actions) => {

        return {
            reset: actions.reset
        }
    }
});