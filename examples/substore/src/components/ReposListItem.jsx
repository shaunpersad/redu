"use strict";

import React from 'react';

import {subscribe} from 'redu';


function ReposListItem(props) {

    return (
        <div className="component-repos-list-item">

            <div className="media">

                <div className="media-body">
                    <a href={props.repo.html_url} target="_blank">
                        <h4
                            className="media-heading"
                        >
                            {props.repo.name}
                        </h4>
                    </a>
                    <p>
                        {props.repo.description}
                    </p>
                </div>

            </div>
        </div>
    );

}

/**
 * Wrap the ReposListItem component in a SubscriberComponent.
 */
export default subscribe(ReposListItem, (userSubStoreState, userSubStoreProps, userSubStoreActions) => {

    /**
     * Gives us a "displayRepo" prop, which maps to the "displayRepo" action in the StoreComponent.
     */

    return {
        displayRepo: userSubStoreActions.displayRepo
    };
});