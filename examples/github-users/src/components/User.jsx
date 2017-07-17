"use strict";

import React from 'react';

import {presentationalComponent} from '../../../../redu';

/**
 * Another "functional" component style.
 */
function User(props) {

    if (!props.user) {
        return null;
    }

    return (
        <div className="component-user">

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{props.user.login}</h3>
                </div>
                <div className="panel-body">
                    <img style={{width: '100%'}} src={props.user.avatar_url} />
                    <p style={{paddingTop: 15}}>
                        <a
                            className="btn btn-default"
                            href={props.user.html_url}
                            target="_blank"
                        >
                            profile on GitHub
                        </a>
                    </p>
                </div>
            </div>

        </div>
    );

}

/**
 * Wrap the User component in a presentational component.
 */
export default presentationalComponent(User, {
    /**
     * The resulting presentational component will take this function and execute it against
     * the container component's state and props. The resulting object will get merged into
     * the User component's props, which is how we have the "user" prop,
     * without being explicitly passed in by the Page component.
     *
     * This is how we turned "userToDisplay" from the container's state into "user"
     * in the User component's props.
     *
     */
    containerStateToProps: (state, props) => {

        return {
            user: state.userToDisplay
        };
    }
});