"use strict";

import React from 'react';

import {subscribe} from 'redu';


class List extends React.Component {

    makeList() {

        return this.props.listItems.map(listItem => {

            const props = {
                [this.props.entity]: listItem
            };
            return (
                <li key={listItem.id} className="list-group-item">
                    <this.props.listItemComponent {...props} />
                </li>
            );
        });
    }

    render() {

        return (
            <div className="component-list">
                <ul className="list-group" style={{marginTop: 0}}>
                    {this.makeList()}
                </ul>
            </div>
        );
    }
}

export default subscribe(List, (storeState, storeProps, storeActions) => {

    return {
        listItems: storeState.listItems || [],
        entity: storeProps.entity
    }
});