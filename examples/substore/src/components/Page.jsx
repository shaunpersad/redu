"use strict";

import React from 'react';

import Search from './Search';
import Status from './Status';
import List from './List';
import UsersListItem from './UsersListItem';
import UserSubStore from '../stores/UserSubStore';

function Page() {

    return (
        <div className="component-page">
            <div className="container">

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

                    <div className="col-xs-6">
                        <List listItemComponent={UsersListItem} />
                    </div>

                    <div className="col-xs-6">
                        <UserSubStore />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 *
 * The Page component is not actually using any props derived out of the StoreComponent,
 * so we do not need to wrap it. All of its child components that are SubscriberComponents
 * will still function regardless.
 */
export default Page;