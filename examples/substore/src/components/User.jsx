"use strict";

import React from 'react';

import { subscribe } from 'redu';

import Search from './Search';
import Status from './Status';
import List from './List';
import ReposListItem from './ReposListItem';


class User extends React.Component {

    render() {

        if (!this.props.user) {
            return null;
        }

        return (
            <div className="component-user">

                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.props.user.login}</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-12">
                                <Search />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <Status />
                            </div>
                        </div>

                        <div className="row">

                            <div className="col-xs-12">
                                <List listItemComponent={ReposListItem} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default subscribe(User, (userSubStoreState, userSubStoreProps, userSubStoreActions) => {

    return {
        search: userSubStoreActions.search
    };
});