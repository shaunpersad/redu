# Redu
Simple application-level state management for React apps.

## Simpler than simple?
As far as state management solutions go, Redux is already simple.  At least, that's the idea.  The reality is that while 
action creators, actions, and reducers are simple, open-ended concepts, their implementations can become unwieldy, and 
often leaves us with a lot of boilerplate.

What _is_ simple, is React's built-in **component-level** state management, where events trigger action functions, which 
in turn call `setState`, to update that component's state:
```jsx harmony
class Counter extends Component {
  constructor(props) {
      super(props);
      this.state = { value: 0 }; // initial state
      this.increment = this.increment.bind(this);
  }
  
  increment() { // action function, which calls this.setState
    this.setState(prevState => ({
        value: prevState.value + 1 // hooray, the state is updated!
    }));       
  }
  
  render() {
    return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
      </div>
    )
  }
}
```

No reducers, no string constants, just _event_ => _action function_ => _setState_.

Redu performs this exact same flow, but at an **application level**, where a single `StoreComponent's` state acts as 
your application-level state, and any of its descendant `SubscriberComponents` may derive props from this state, which 
can include action functions to request application-level state changes.

## What problem does Redu solve?
Let's say my app looks like this:
```jsx harmony
<TopLevelComponent>
    <ChildComponent>
        <GrandChildComponent />
    </ChildComponent>
</TopLevelComponent>
```
If the `GrandChildComponent` wanted to utilize props or state from the `TopLevelComponent`, you'd have to pass them down
first to the `ChildComponent`, then to the `GrandChildComponent`. Also, if you wanted to modify the `TopLevelComponent`'s
state from the `GrandChildComponent`, you'd have to pass down an action function in the same manner, so that the 
`GrandChildComponent` would be able to call it.

With Redu, the application-level state is stored in the `StoreComponent`, and the `GrandChildComponent` gets wrapped in 
a `SubscriberComponent`, which can pass down anything to the `GrandChildComponent` that it needs from the `StoreComponent` 
as props:
```jsx harmony
<StoreComponent>
    <TopLevelComponent>
        <ChildComponent>
            <SubscriberComponent>
                <GrandChildComponent />
            </SubscriberComponent>
        </ChildComponent>
    </TopLevelComponent>
</StoreComponent>
```
As a simplified illustration of how this composition works under the hood, the `SubscriberComponent` will render the 
`GrandChildComponent` that it wraps, and pass down any requested application-level state, props, or action functions as props:
```jsx harmony
class SubscriberComponent extends React.Component {
    render() {
        const derivedProps = toProps(storeComponentState, storeComponentProps, storeComponentActions);
        return <GrandChildComponent {...derivedProps} {...this.props} />
    }
}
```

## Usage
Redu is comprised of just two functions: `stateManagerOf(Component)`, and `subscribe(Component, toProps)`.

Both functions take in a `React.Component`, and create and return wrapper components around them.

- `stateManagerOf(Component)` creates and returns a `StoreComponent` wrapped around the supplied `Component`.
    - `StoreComponents` wrap your top-level component and manages the application-level state.
    - `StoreComponents` also give you the `withInitialState(initialState)` static method, which will set it's initial state,
    and also the `withActions(actions)` static method, which will set the action functions that can modify the `StoreComponent`'s state.
- `subscribe(Component, toProps)` creates and returns a `SubscriberComponent` wrapped around the supplied `Component`.
    - `SubscriberComponents` utilize the `StoreComponent`'s state, props, and action functions to create props for the 
    supplied `Component`, specified by the supplied `toProps` function.

### Example
The following is a simple color-picker, where we display a list of colors, and allow a single color to be selected.

In this example, we must pass down both an application-level state property (`selectedColor`),
as well as an action function (`changeColor`), all the way to the grand-child component:

#### Vanilla React
```js
// app.js, the "entrypoint" of the app.
import ColorList from './components/ColorList';

const props = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

ReactDOM.render(
    React.createElement(ColorList, props),
    document.getElementById('root')
);
```
```jsx harmony
// ColorList.jsx, displays the list of colors
import Color from './Color';

class ColorList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selectedColor: props.colors[0] };
        this.changeColor = this.changeColor.bind(this);
    }

    changeColor(color) {
        this.setState({selectedColor: color});
    }

    render() {
        return (
            <div>
                <p>
                    The selected color is {this.state.selectedColor}
                </p>
                <div>
                    {this.props.colors.map(color =>
                        <Color
                            key={color}
                            color={color}
                            changeColor={this.changeColor}
                            selectedColor={this.state.selectedColor}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default ColorList;
```
```jsx harmony
// Color.jsx, each list item
import ColorOptions from './ColorOptions';

function Color(props) {

    return (
        <div>
            <span>This color is {props.color}</span>
            <ColorOptions
                color={props.color}
                changeColor={props.changeColor}
                selectedColor={props.selectedColor}
            />
        </div>
    );
}

export default Color;
```
```jsx harmony
// ColorOptions.jsx, displays the relevant options for a particular color.
function ColorOptions(props) {
    return (
        <div>
            <span>Replace {props.selectedColor} with {props.color}?</span>
            <button onClick={e => props.changeColor(props.color)}>yes</button>
        </div>
    );
}

export default ColorOptions;
```
#### Redu
Let's "redu" it. Our goal will be to eliminate the number of props that we need to pass down from the `ColorList`  to
the `ColorOptions` components.

To accomplish this, we will move all of the shared application-level state and action functions out of the `ColorList`
component and into the `StoreComponent`. We will then subscribe the `ColorList` and the `ColorOptions` to the
`StoreComponent` in order to derive what we need from it.
```js
// app.js, where we will set up and create the StoreComponent, by wrapping the ColorList.
import { stateManagerOf } from 'redu';

import ColorList from './components/ColorList';

const props = {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
};

const initialState = {
    selectedColor: props.colors[0]
};

const actions = {
    changeColor: function changeColor(color) {
        this.setState({
            selectedColor: color
        });
    }
};

const StoreComponent = stateManagerOf(ColorList).withInitialState(initialState).withActions(actions);

ReactDOM.render(
    React.createElement(StoreComponent, props),
    document.getElementById('root')
);
```
```jsx harmony
// ColorList.jsx, we are now just passing down the color to the Color component.
import { subscribe } from 'redu';
import Color from './Color';

function ColorList(props) {

    return (
        <div>
            <p>
                The selected color is {props.selectedColor}
            </p>
            <div>
                {props.colors.map(color =>
                    <Color key={color} color={color} />
                )}
            </div>
        </div>
    );
}

export default subscribe(ColorList, (storeComponentState, storeComponentProps) => {

    return {
        selectedColor: storeComponentState.selectedColor,
        colors: storeComponentProps.colors
    };
});
```
```jsx harmony
// Color.jsx, we are no longer threading through the "selectedColor" and "changeColor" props.
import ColorOptions from './ColorOptions';

function Color(props) {

    return (
        <div>
            <span>This color is {props.color}</span>
            <ColorOptions color={props.color} />
        </div>
    );
}

export default Color;
```
```jsx harmony
// ColorOptions.jsx, we can get the application-level state and action functions directly from the StateComponent now.
import { subscribe } from 'redu';

function ColorOptions(props) {
    return (
        <div>
            <span>Replace {props.selectedColor} with {props.color}?</span>
            <button onClick={e => props.changeColor(props.color)}>yes</button>
        </div>
    );
}

export default subscribe(ColorOptions, (storeComponentState, storeComponentProps, storeComponentActions) => {

    return {
        selectedColor: storeComponentState.selectedColor,
        changeColor: storeComponentActions.changeColor
    };
});
```