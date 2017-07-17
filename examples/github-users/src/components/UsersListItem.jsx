"use strict";

import React from 'react';

import {presentationalComponent} from 'redu';

/**
 * This component illustrates that not all state needs to be tracked by the container component.
 * Some state is best tracked by the component's themselves.
 *
 * It also illustrates that passing down props the regular way
 * (i.e. explicitly, from the parent) is unhindered.
 */
class UsersListItem extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            clicked: false // not all state needs to go into the container component.
        };

        this.onClickOnUser = this.onClickOnUser.bind(this);
    }

    onClickOnUser(e) {

        e.preventDefault();

        this.setState({
            clicked: true
        }, () => {

            this.props.displayUser(this.props.user);
        });
    }

    /**
     * In this case, the "user" prop is being explicitly passed down
     * from this parent's component (UsersList)
     */
    render() {

        return (
            <div className="component-users-list-item">

                <div className="media">

                    <a href="#" onClick={this.onClickOnUser}>

                        <div className="media-left">
                            <img
                                style={{width: 50}}
                                className="media-object"
                                src={this.props.user.avatar_url}
                            />
                        </div>
                        <div className="media-body">
                            <h4
                                className="media-heading"
                                style={{color: this.state.clicked ? 'purple': 'inherit'}}
                            >
                                {this.props.user.login}
                            </h4>
                        </div>

                    </a>
                </div>
            </div>
        );
    }
}

/**
 * Wrap the UsersListItem component in a presentational component.
 */
export default presentationalComponent(UsersListItem, {
    /**
     * Gives us a "displayUser" prop, which maps to the "displayUser" action in the container component.
     */
    actionsToProps: (actions) => {

        return {
            displayUser: actions.displayUser
        };
    }
});