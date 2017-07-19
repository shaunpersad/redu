/**
 * Redu is comprised of two functions:
 * stateManagerOf(Component), and subscribe(Component).
 * Both functions take in a React.Component, and create and return wrapper components around them.
 *
 * stateManagerOf(Component) creates and returns a StoreComponent.
 * subscribe(Component) creates and returns a SubscriberComponent.
 *
 * StoreComponents wrap your top-level component and manages the application-level state.
 *
 * SubscriberComponents can derive props directly out of the StoreComponent's state, props, and action functions,
 * and pass them down to the components that they wrap.
 *
 * SubscriberComponents are linked to a StoreComponent via React's "context" feature:
 * https://facebook.github.io/react/docs/context.html
 */

"use strict";
import React from 'react'; // peer dependency
import PropTypes from 'prop-types'; // bundled dependency

/**
 * For use with setting up React contexts.
 */
const contextTypes = {
    storeComponent: PropTypes.object.isRequired
};

/**
 * Creates a StoreComponent that wraps the given component.
 *
 * The given component should be a top-level component.
 * Generally you're only going to want to have one usage of this,
 * to wrap your top-most component.
 *
 * All SubscriberComponent descendants of this StoreComponent will be able to derive any props they need out of
 * this StoreComponent's state, props, and actions.
 *
 * @param {SubscriberComponent|React.Component} Component
 * @returns {StoreComponent}
 */
export function stateManagerOf(Component) {

    /**
     * An object containing action functions that will be bound to the StoreComponent,
     * and made available through the "actions" property. Action functions will generally call "this.setState",
     * which will update the StoreComponent's state.
     *
     * Actions can be defined with the "withActions" method.
     *
     * @type {{}}
     * @private
     */
    let _actions = {};

    /**
     * The initial state of the StoreComponent. It should represent a complete picture of your application-level state.
     *
     * The initial state can be defined with the "withInitialState" method.
     *
     * @type {{}}
     * @private
     */
    let _initialState = {};

    class StoreComponent extends React.Component {

        constructor(props = {}) {

            super(props);

            this.state = Object.assign({}, _initialState); // set the initial state.
            this.actions = {}; // make the action functions available via the "actions" property.

            Object.keys(_actions).forEach(action => {

                this.actions[action] = _actions[action].bind(this); // bind to the StoreComponent.
            });
        }

        /**
         * Use React's "context" feature to maintain a link from the StoreComponent to SubscriberComponents.
         *
         * @returns {{storeComponent: StoreComponent}}
         */
        getChildContext() {

            return { storeComponent: this };
        }

        /**
         * Render the supplied component, and pass through any props.
         *
         * @returns {*|Element}
         */
        render() {

            return React.createElement(Component, this.props);
        }

        /**
         * Defines the StoreComponent's actions.
         *
         * @param {{}} actions
         * @returns {StoreComponent}
         */
        static withActions(actions = {}) {
            _actions = actions;
            return this;
        }

        /**
         * Defines the StoreComponent's initial state.
         *
         * @param {{}} initialState
         * @returns {StoreComponent}
         */
        static withInitialState(initialState = {}) {
            _initialState = initialState;
            return this;
        }

        /**
         * Necessary to use React's "context" feature.
         *
         * @returns {*}
         */
        static get childContextTypes() {

            return Object.assign({}, contextTypes, super.contextTypes || {});
        }
    }

    return StoreComponent;
}


/**
 * Creates a SubscriberComponent that wraps the given component.
 *
 * All SubscriberComponents have the ability to derive any props they need out of
 * this StoreComponent's state, props, and actions, by supplying a "derivePropsFromStoreComponent" function,
 * which can be set via the "withProps" method.
 *
 * @param {React.Component} Component
 * @param {function} derivePropsFromStoreComponent
 * @returns {SubscriberComponent}
 */
export function subscribe(
    Component,
    derivePropsFromStoreComponent = (storeComponentState, storeComponentProps, storeComponentActions) => {
        return {};
    }
) {

    class SubscriberComponent extends React.Component {

        /**
         * Get the StoreComponent out of the context.
         * Then, use the derivePropsFromStoreComponent function to convert its state, props, and actions
         * into the props that the wrapped component has asked for.
         */
        render() {

            const { storeComponent } = this.context;

            if (!storeComponent) {
                throw new Error('No StoreComponent found as a parent of this SubscriberComponent.');
            }

            const { state, props, actions } = storeComponent;

            return React.createElement(Component, Object.assign(
                derivePropsFromStoreComponent(state, props, actions),
                this.props
            ));
        }

        /**
         * Necessary to use React's "context" feature.
         *
         * @returns {*}
         */
        static get contextTypes() {

            return Object.assign({}, contextTypes, super.contextTypes || {});
        }
    }

    return SubscriberComponent;
}
