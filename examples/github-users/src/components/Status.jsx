"use strict";

import React from 'react';

import {subscribe} from 'redu';


class Status extends React.Component {

    /**
     * This method utilizes props derived from the StoreComponent's state (searchQuery and usersListItems).
     */
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
                        onClick={this.props.reset /* an action derived from the StoreComponent */ }
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
 * Wrap the Status component in a SubscriberComponent.
 */
export default subscribe(Status).withProps((storeComponentState, storeComponentProps, storeComponentActions) => {

    /**
     * The resulting SubscriberComponent will take this function and execute it against
     * the StoreComponent's state, props, and actions. The resulting object will get merged into
     * the Status component's props, which is how we have "searchQuery" and "usersListItems"
     * props, without them being explicitly passed in by the Page component.
     */

    return {
        searchQuery: storeComponentState.searchQuery,
        usersListItems: storeComponentState.usersListItems,
        reset: storeComponentActions.reset
    };
});