# Redu
Redux made simpler.

## Simpler than simple?
Redux is already simple.  At least, that's the idea.  The reality is that while action creators, actions, and reducers 
are simple, open-ended concepts, their implementations often are not, and often leaves us with a lot of boilerplate.

What _is_ simple, is React's component-level state management, where events trigger action functions, which in turn call 
setState, to update that component's state:
```jsx harmony
class Counter extends Component {
  state = { value: 0 };

  increment = () => { // action function
    this.setState(prevState => ({
      value: prevState.value + 1
    }));
  };
  
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

Redu performs this exact same flow, but at an application-wide level, where a single component houses your application 
state, and any of its descendant components may derive props from its state, or perform actions to request 
application state changes.  This simplicity is accomplished in less than 60 lines of code, using most of what React 
natively offers.

## Theory
Redu is comprised of two functions: `stateManagerOf(Component)`, and `subscribe(Component)`.

Both functions take in a `React.Component`, and create and return wrapper components around them.

- `stateManagerOf(Component)` creates and returns a `StoreComponent` wrapped around the supplied `Component`.
    - `StoreComponents` wrap your top-level component and manages the application-level state.
- `subscribe(Component)` creates and returns a `SubscriberComponent` wrapped around the supplied `Component`.
    - `SubscriberComponents` have direct access to the `StoreComponent`'s state, props, and action functions, and can pass them down to the supplied `Component` as props.

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

With Redu, the situation can be expressed similar to this:
```jsx harmony
<StoreComponent>
    <SubscriberComponent wraps="TopLevelComponent">
        <SubscriberComponent wraps="ChildComponent">
            <SubscriberComponent wraps="GrandChildComponent" />
        </SubscriberComponent>
    </SubscriberComponent>
</StoreComponent>
```
Where "wraps" renders to this:
```jsx harmony
<SubscriberComponent>
    <WrappedComponent />
</SubscriberComponent>
```
With this new setup, any component wrapped in a `SubscriberComponent` will be able to request any of the application-level state, props, or action functions
from the `StoreComponent` that it needs.

As a simplified illustration of how this composition works, the last `SubscriberComponent` in the chain will render the 
`GrandChildComponent` that it wraps, and pass down any requested application-level state, props, or action functions as props:
```jsx harmony
class SubscriberComponent extends React.Component {
    render() {
        return <GrandChildComponent {...propsDerivedFromStoreComponent} {...this.props} />
    }
}
```



## Example
Consider the following example:
### Vanilla React

### Redu
