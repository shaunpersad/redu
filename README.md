# Redu
Redux made simpler.

## Simpler than simple?
Redux is already simple.  At least, that's the idea.  The reality is that while action creators, actions, and reducers 
are simple, open-ended concepts, their implementations often are not, and often leaves us with a lot of boilerplate.

What _is_ simple, is React's component-level state management, where events trigger action functions, which in turn call 
setState, to update that component's state.  

No reducers, no string constants, just _event_ => _action function_ => _setState_.

Redu performs this exact same flow, but at an application-wide level, where a single component houses your application 
state, and any of its descendant components may derive props from its state, or perform actions to request 
application state changes.  This simplicity is accomplished in less than 60 lines of code, using most of what React 
natively offers.

## Theory
Redu is comprised of two functions: `stateManagerOf(Component)`, and `subscribe(Component)`.

Both functions take in a `React.Component`, and create and return wrapper components around them.

- `stateManagerOf(Component)` creates and returns a `StoreComponent`.
    - `StoreComponents` wrap your top-level component and manages the application-level state.
- `subscribe(Component)` creates and returns a `SubscriberComponent`.
    - `SubscriberComponents` can derive their props directly out of the `StoreComponent`'s state, props, and action functions.
    - Action function calls are how `SubscriberComponents` can request application-level state changes.

### Visually speaking...

Let's say my app looks like this:
```jsx harmony
<TopLevelComponent>
    <ChildComponent>
        <GrandChildComponent />
    </ChildComponent>
</TopLevelComponent>
```
If the GrandChildComponent wanted to utilize props or state from the TopLevelComponent, you'd have to pass them down
first to the ChildComponent, then to the GrandChildComponent. Also, if you wanted to modify the TopLevelComponent's
state from the GrandChildComponent, you'd have to pass down an action function in the same manner, so that the 
GrandChildComponent would be able to call it.

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
Where "wraps" translates to this:
```jsx harmony
<SubscriberComponent>
    <WrappedComponent />
</SubscriberComponent>
```
Redu leverages _composition_, meaning that the wrapper components that it generates will render the component 
they wrap. The advantage of this is that there is an intermediary step at each render, where we can pass in props.

While this seems more complex, keep in mind that the `StoreComponents` and `SubscriberComponents` are generated for you,
and so you don't have to think about manually creating the layers. Furthermore, not every component in your app needs to be wrapped,
only those that need to derive props or action functions out of the `StoreComponent` need to be wrapped. 

As a simplified illustration of how composition works, the last `SubscriberComponent` in the chain will render the 
`GrandChildComponent` that it wraps:
```jsx harmony
class SubscriberComponent extends React.Component {
    render() {
        return <GrandChildComponent {...propsDerivedFromStoreComponent} {...this.props} />
    }
}
```
This composition becomes useful when we realize that `StoreComponents` and `SubscriberComponents` are linked together using React's 
[context](https://facebook.github.io/react/docs/context.html#how-to-use-context) mechanism, allowing them to share common information while bypassing the need to pass down props endlessly down the chain. 

Therefore, `TopLevelComponent`, `ChildComponent` and `GrandChildComponent` all have a chance to derive props from the 
`StoreComponent`'s state, props, and action functions, since their `SubscriberComponents` are linked to it by the `context`.


## Example
Consider the following example:
### Vanilla React

### Redu
