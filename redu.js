/**
 * Redu is comprised of two functions:
 * containerComponent, and presentationalComponent.
 * Both functions take in a React.Component, and create and return wrapper components around them.
 *
 * Container components wrap top-level components and manage state.
 *
 * Presentational components pull in state properties from their container component as props.
 * They can also pull in action functions that can request state changes on the container component.
 *
 * Presentational components are linked to container components via React's "context" feature:
 * https://facebook.github.io/react/docs/context.html
 */

"use strict";
import React from 'react'; // peer dependency
import PropTypes from 'prop-types'; // bundled dependency

/**
 * For use with setting up React contexts.
 */
const contextTypes = {
    actions: PropTypes.object.isRequired,
    containerComponent: PropTypes.object.isRequired
};

/**
 * Takes in the container's state and props,
 * and returns an object that will be merged into the props for the wrapped component.
 *
 * @typedef {function} containerStateToProps
 * @param {{}} [state] - the container's state
 * @param {{}} [props] - the container's props
 * @returns {{}}
 */

/**
 * Takes in the container's actions,
 * and returns an object that will be merged into the props for the wrapped component.
 *
 * @typedef {function} actionsToProps
 * @param {{}} [actions] - the container's actions
 * @returns {{}}
 */

/**
 * Options that can be passed in when creating presentational components.
 *
 * @typedef {object} presentationalOptions
 * @property {containerStateToProps} [containerStateToProps] - Converts the container's state to the presenter's props.
 * @property {actionsToProps} [actionsToProps] - Converts the container's actions to the presenter's props.
 */

/**
 * @type {presentationalOptions}
 */
const presentationalDefaults = {
    containerStateToProps: (state, props) => {return {}},
    actionsToProps: (actions) => {return {}}
};

/**
 * Options that can be passed in when creating container components.
 *
 * @typedef {object} containerOptions
 * @property {{}} [actions] - An object containing functions that will be bound to the container (and become members of it as well) to allow for state changes.
 * @property {{}} [initialState] - The initial state of the container.
 * @property {function} [containerStateToProps] - Converts the container's state to the wrapped component's props.
 * @property {function} [actionsToProps] - Converts the container's actions to the wrapped components's props.
 */

/**
 * @type {containerOptions}
 */
const containerDefaults = Object.assign({
    actions: {},
    initialState: {}
}, presentationalDefaults);

/**
 * Creates a container component that wraps the given component.
 *
 * The given component should be a top-level component.
 * Generally you're only going to want to have one usage of this,
 * to wrap your top-most component.
 *
 * The wrapped component, along with all presentational descendants of the container
 * will be able to create props out of this container's state as well as its actions.
 *
 * @param {React.Component} Component
 * @param {containerOptions} [options]
 * @returns {ContainerComponent}
 */
export function containerComponent(Component, options = containerDefaults) {

    const {
        actions,
        initialState,
        containerStateToProps,
        actionsToProps
    } = Object.assign({}, containerDefaults, options);

    const _actions = {};

    class ContainerComponent extends React.Component {

        constructor(props = {}) {

            super(props);

            this.state = Object.assign({}, initialState);

            Object.keys(actions).forEach(action => {

                if (action === 'render' || action === 'constructor' || action === 'getChildContext') {
                    throw new Error(`Please rename the "${action}" action, as it is a reserved word.`);
                }

                _actions[action] = actions[action].bind(this); // bind to the container.
                this[action] = _actions[action]; // become members of the container.
            });
        }

        /**
         * Pass down any state properties and actions from the container
         * that the wrapped component has asked for as props.
         */
        render() {

            return React.createElement(Component, Object.assign(
                containerStateToProps(this.state, this.props),
                actionsToProps(_actions),
                this.props
            ));
        }

        /**
         * Use React's "context" feature to maintain a link to the container and its actions.
         *
         * @returns {{actions: {}, containerComponent: ContainerComponent}}
         */
        getChildContext() {

            return { actions: _actions, containerComponent: this };
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

    return ContainerComponent;
}

/**
 *
 * @param {React.Component} Component
 * @param{presentationalOptions} [options]
 * @returns {PresentationalComponent}
 */
export function presentationalComponent(Component, options = presentationalDefaults) {

    const {
        containerStateToProps,
        actionsToProps
    } = Object.assign({}, presentationalDefaults, options);

    class PresentationalComponent extends React.Component {

        /**
         * Get the container component and its actions out of the context.
         * Then, pass down any state properties and actions from the container
         * that the wrapped component has asked for as props.
         */
        render() {

            const { containerComponent, actions } = this.context;
            const { state, props } = containerComponent;

            return React.createElement(Component, Object.assign(
                containerStateToProps(state, props),
                actionsToProps(actions),
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

    return PresentationalComponent;
}
