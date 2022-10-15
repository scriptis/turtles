import { JSXComponent, ChildrenOf, JSXElement, PropsOf, FunctionalComponent, WithComponentConstructor } from "./Types";
import { Component } from "./Component";

/**
 * Ugly hack (Lua-only) that checks whether a provided component is
 * function-based component or class-based component.
 *
 * @param v The component to check.
 */
function isComponentConstructor(v: unknown): v is { new(): Component } {
  return type(v) === "table";
}

/**
 * Creates an element object from a component. Suitable for JSX.
 *
 * @param component The function or component being used to create the element.
 * @param props The props to pass to the component.
 * @param children The children to pass to the component.
 */
export function createElement<C extends JSXComponent>(
  component: C extends FunctionalComponent ?
    C :
    C extends Component ?
      // @ts-ignore
      WithComponentConstructor<C> :
      never,
  props: PropsOf<C>,
  ...children: ChildrenOf<C>
  // @ts-ignore
): JSXElement<C> {
  if (isComponentConstructor(component)) {
    const instance = new component(props);

    return {
      props,
      children,
      instance,
      constructor: component,
    };
  } else {
    return {
      props,
      children,
      render: component,
    };
  }
}
