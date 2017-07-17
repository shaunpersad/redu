# Redu
Redux made simpler.

## Simpler than simple?
Redux is already simple.  At least, that's the hope.  The reality is that while action creators, actions, and reducers 
are simple, open-ended concepts, their implementations often are not.  What _is_ simple, is React's component-level state 
management, where events trigger action functions, which in turn call setState, to update that component's state.  

No reducers, no string constants, just _event_ => _action function_ => _setState_.

Redu performs this same flow, but at an application-wide level, where a single component houses your application 
state, and any of its descendant components may derive props from its state, or perform actions to request 
application state changes.  This simplicity is accomplished in less than 60 lines of code, using most of what React 
natively offers.

## Theory
Redu is comprised of two functions: `containerComponent`, and `presentationalComponent`.
Both functions take in a React.Component, and create and return wrapper components around them.

A container component wraps the top-level component and manages the application state.

A presentational component wraps a descendant component, and links it to the container component.

Both the top-level and presentational components can pull in application state properties from the container component as props.
They can also pull in action functions that can request state changes on the container component.

### "Visually" speaking...

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

With Redu, the situation looks like this:
```jsx harmony
<ContainerComponent wraps={TopLevelComponent}>
    <PresentationalComponent wraps={ChildComponent}>
        <PresentationalComponent wraps={GrandChildComponent} />
    </PresentationalComponent>
</ContainerComponent>
```
Redu leverages _composition_, meaning that the wrapper components that it generates will eventually render the component 
they wrap.
As a simplified example, the PresentationalComponent will eventually render the GrandChildComponent:
```jsx harmony
class PresentationalComponent extends React.Component {
    render() {
        return <GrandChildComponent {...this.props} {...someOtherStuff} />
    }
}
```
The advantage of this is that there is an intermediary step at each render, where we can pass in props. This becomes useful
when we realize that `ContainerComponents` and `PresentationalComponents` are linked together using React's
[context](https://facebook.github.io/react/docs/context.html#how-to-use-context) mechanism, allowing them to share common information while 
bypassing the need to pass down props endlessly down the chain. 

Therefore, `ChildComponent` and `GrandChildComponent` all have a chance to derive props
from the `ContainerComponent`'s state or action functions, since their `PresentationalComponents` are linked to it by the `context`.
`TopLevelComponent` also has this chance, though the relationship to the `ContainerComponent` is more direct.

## Example
Consider the following example:
### Vanilla React

### Redu
