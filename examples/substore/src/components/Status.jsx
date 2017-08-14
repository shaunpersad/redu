"use strict";

import React from 'react';

import {subscribe} from 'redu';


class Status extends React.Component {

    makeStatus() {

        if (this.props.listItems && this.props.listItems.length) {

            let suffix = 's';
            if (this.props.listItems.length === 1) {
                suffix = '';
            }

            return `Found ${this.props.listItems.length} ${this.props.entity}${suffix}.`;
        }

        if (!this.props.searchQuery) {
            return `Please enter a GitHub ${this.props.entity}.`;
        }

        if (this.props.listItems === null) {
            return 'Searching...';
        }
    }

    render() {

        return (
            <div className="component-status">

                <p>
                    {this.makeStatus()}
                    <button
                        className="btn btn-default"
                        onClick={this.props.reset /* an action derived from the StoreComponent */ }
                        style={{marginLeft: 10, display: this.props.listItems ? 'inline-block': 'none'}}
                    >
                        reset
                    </button>
                </p>
            </div>
        );
    }
}


export default subscribe(Status, (storeState, storeProps, storeActions) => {

    return {
        searchQuery: storeState.searchQuery,
        listItems: storeState.listItems,
        entity: storeProps.entity,
        reset: storeActions.reset
    };
});