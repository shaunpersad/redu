"use strict";

import React from 'react';
import UsersListItem from './UsersListItem';

import {presentationalComponent} from 'redu';


class UsersList extends React.Component {

    usersList() {

        return this.props.users.map(user => {

            return (
                <li key={user.id} className="list-group-item">
                    <UsersListItem user={user} />
                </li>
            );
        });
    }

    render() {

        return (
            <div className="component-users-list">
                <ul className="list-group" style={{marginTop: 0}}>
                    {this.usersList()}
                </ul>
            </div>
        );
    }
}

/**
 * Wrap the UsersList component in a presentational component.
 */
export default presentationalComponent(UsersList, {
    /**
     * The resulting presentational component will take this function and execute it against
     * the container component's state and props. The resulting object will get merged into
     * the UsersList component's props, which is how we have the "users" prop,
     * without being explicitly passed in by the Page component.
     *
     * This is how we turned "usersListItems" from the container's state into "users"
     * in the UsersList component's props.
     */
    containerStateToProps: (state, props) => {

        return {
            users: state.usersListItems || []
        }
    }
});