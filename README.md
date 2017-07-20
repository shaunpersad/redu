# Redu
Redux made simpler.

## Simpler than simple?
Redux is already simple.  At least, that's the idea.  The reality is that while action creators, actions, and reducers 
are simple, open-ended concepts, their implementations often are not, and often leaves us with a lot of boilerplate.

What _is_ simple, is React's component-level state management, where events trigger action functions, which in turn call 
`setState`, to update that component's state:
```jsx harmony
class Counter extends Component {
  constructor(props) {
      super(props);
      this.state = { value: 0 };
      
      this.increment = () => { // action function
        this.setState(prevState => ({
          value: prevState.value + 1
        }));          
      }
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

Redu performs this exact same flow, but at an application-wide level, where a single `StoreComponent's` state acts as 
your application-level state, and any of its descendant `SubscriberComponents` may derive props rom this state, or actions 
to request application-level state changes.

## Theory
Redu is comprised of just two functions: `stateManagerOf(Component)`, and `subscribe(Component, toProps)`.

Both functions take in a `React.Component`, and create and return wrapper components around them.

- `stateManagerOf(Component)` creates and returns a `StoreComponent` wrapped around the supplied `Component`.
    - `StoreComponents` wrap your top-level component and manages the application-level state.
- `subscribe(Component, toProps)` creates and returns a `SubscriberComponent` wrapped around the supplied `Component`.
    - `SubscriberComponents` utilize the `StoreComponent`'s state, props, and action functions to create props for the 
    supplied `Component`, specified by the supplied `toProps` function.

### Visually speaking...

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

With Redu, the `GrandChildComponent` gets wrapped in a `SubscriberComponent`, which can pass down anything that it needs
from the `StoreComponent` as props:
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
As a simplified illustration of how this composition works, the `SubscriberComponent` will render the 
`GrandChildComponent` that it wraps, and pass down any requested application-level state, props, or action functions as props:
```jsx harmony
class SubscriberComponent extends React.Component {
    render() {
        const propsDerivedFromStoreComponent = toProps(storeState, storeProps, storeActions);
        return <GrandChildComponent {...propsDerivedFromStoreComponent} {...this.props} />
    }
}
```



## Example
Consider the following example, where we must pass down both an application-level state property (`selectedColor`),
as well as an action function (`changeColor`), all the way to the grand-child component:
### Vanilla React
```js
// app.js
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
// ColorList.jsx
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
// Color.jsx
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
### Redu
Let's "redu" it...
```js
// app.js
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

const App = stateManagerOf(ColorList).withInitialState(initialState).withActions(actions);

ReactDOM.render(
    React.createElement(App, props),
    document.getElementById('root')
);
```
```jsx harmony
// ColorList.jsx
import { subscribe } from 'redu';
import Color from './Color';

function ColorList(props) {

    return (
        <div>
            <p>
                The selected color is {props.selectedColor}
            </p>
            <div>
                {this.props.colors.map(color =>
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
// Color.jsx
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