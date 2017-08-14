# Redu

Simple application-level state management for React apps.


## What is it?

As far as state management solutions go, Redux is already simple.  At least, that's the idea.  The reality is that while 
action creators, actions, and reducers are simple, open-ended concepts, their implementations can become unwieldy, and 
often leaves us with a lot of boilerplate.

What _is_ simple, is React's built-in **component-level** state management, where events trigger action functions, which 
in turn call `setState`, to update that component's state:
```jsx harmony
class Counter extends React.Component {
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

In short, Redu brings React's component-level state management up to the application level.


## How does it work?

Redu is comprised of two functions: `createStore(Component)`, and `subscribe(Component, toProps)`.

Both functions take in a `React.Component`, and create and return wrapper components around them.

`createStore(Component)` creates and returns a `StoreComponent`. `StoreComponents` wrap your top-level component and manages 
the application-level state.

`subscribe(Component, toProps)` creates and returns a `SubscriberComponent`. `SubscriberComponents` can derive props directly out of 
the `StoreComponent's` state, props, and action functions via the `toProps` function, and pass them down to the components that they wrap.

With just these two concepts, you can keep your application state in a single store, and any descendant components
can "cut the line" to receive exactly what they need from that store.

`StoreComponents` and `SubscriberComponents` are just regular `React.Components` themselves, so you get all the familiarity, 
freedom, and tooling that "vanilla" React provides, but with the powerful benefits of application-level state management.


## What problems does Redu solve?

### Problem 1: threading props down multiple levels

Let's say my app looks like this:
```jsx harmony
<PageComponent>
    <ChildComponent>
        <GrandChildComponent />
    </ChildComponent>
</PageComponent>
```
If the `GrandChildComponent` wanted to utilize props or state from the `PageComponent`, you'd have to pass them down
first to the `ChildComponent`, then to the `GrandChildComponent`. Also, if you wanted to modify the `PageComponent`'s
state from the `GrandChildComponent`, you'd have to pass down an action function in the same manner, so that the 
`GrandChildComponent` would be able to call it.

With Redu, the application-level state is stored in the `StoreComponent` which wraps the `PageComponent`, and the 
`GrandChildComponent` gets wrapped in a `SubscriberComponent`, which can pass down anything to the `GrandChildComponent` 
that it needs from the `StoreComponent` as props:
```jsx harmony
<StoreComponent>
    <PageComponent>
        <ChildComponent>
            <SubscriberComponent>
                <GrandChildComponent />
            </SubscriberComponent>
        </ChildComponent>
    </PageComponent>
</StoreComponent>
```


### Problem 2: Scattered application state

Redu can eliminate as much component-level state as you want, and combine them into a single application-level state
object. Your descendant components can then pull out or modify whichever properties of this state that they wish. 

Condensing your application's state into a single object can be beneficial for quickly understanding what an app
does and how it does it, along with other bonuses like being able to serialize/store/deserialize your app state.
 
That said, there's nothing wrong with having component-level state. You have the freedom to choose what state should be
application-level and what should be component-level.


### Problem 3: Redux boilerplate

It's no secret that implementing a new stateful feature in Redux can be a chore. You create action creators, actions, 
and reducers, and if what you need to do is asynchronous, there are even more hoops to jump through.

With Redu, the process is almost exactly the same as creating a stateful feature in a single component, with the addition
of implementing simple functions to allow ancestor components to derive what they need out of the store as props.


## Usage

### Installation

```bash
npm install redu
```


### API

Redu is comprised of just two functions: `createStore(Component)`, and `subscribe(Component, toProps)`.

#### `createStore(Component: React.Component)`: `StoreComponent`
Creates and returns a `StoreComponent` wrapped around the supplied `Component`.

##### `StoreComponent.initialState`: `Object`
Setting this property with an object will provide the `StoreComponent` with its initial state. The `StoreComponent's` state
will be made available to `SubscriberComponents` via the `toProps` function.

##### `StoreComponent.actions`: `Object`
Setting this property with an object of functions will provide the `StoreComponent` with action functions that will
be bound to the StoreComponent instance when it is created. These actions will be made available to `SubscriberComponents`
via the `toProps` function.

##### `StoreComponent.defaultProps`: `Object`
Setting this property with an object will provide the `StoreComponent` with default props. These props can be overridden
when creating the element, eg. via `<StoreComponent key=val />`, or by `React.createElement(StoreComponent, {key: val})`.
These props will be made available to the `SubscriberComponents` via the `toProps` function, and is therefore a good place
to house application-wide utilities and configs.

##### `StoreComponent.WrappedComponent`: `React.Component`
This property will return the `Component` that was wrapped by `createStore(Component)`. It is not directly settable.

#### `subscribe(Component: React.Component, toProps: function)`: `SubscriberComponent`
Creates and returns a `SubscriberComponent` wrapped around the supplied `Component`.

##### `toProps(storeState: Object, storeProps: Object, storeActions: Object)`: `Object`
Gives you access to the `StoreComponent's` state, props, and actions. It must return an object, which will be passed into
the `SubscriberComponent` as props.

##### `SubscriberComponent.WrappedComponent`: `React.Component`
This property will return the `Component` that was wrapped by `subscribe(Component, toProps)`. It is not directly settable.


### Example

The following is a simple color-picker, where we display a list of colors, and allow a single color to be selected.

In this example, we must pass down both an application-level state property (`selectedColor`),
as well as an action function (`changeColor`), all the way from the `ColorList` top-level component to the `ColorOptions`
grand-child components:


#### The "Vanilla" React version

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


#### The Redu version

Let's "redu" it. Our goal will be to eliminate the number of props that we need to pass down from the `ColorList`  to
the `ColorOptions` components.

To accomplish this, we will move all of the shared application-level state and action functions out of the `ColorList`
component and into the `ColorListStore`. We will then subscribe the `ColorList` and the `ColorOptions` to the
`ColorListStore` in order to derive what we need from it.

