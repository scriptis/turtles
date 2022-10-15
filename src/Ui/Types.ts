import { Component } from "./Component";
import { Constructor } from "../Utils";
import { BuildContext } from "./BuildContext";

/**
 * The properties of a JSX component, including intrinsics.
 */
export type JSXProps = {
  /**
   * Additional fields on the component.
   */
  [K: string]: unknown;

  /**
   * The key of this component. Keys have the same usage, runtime behavior,
   * and pitfalls of [React keys](https://reactjs.org/docs/lists-and-keys.html).
   */
  key?: string | number,

  /**
   * The children this component can accept, if any.
   */
  children?: Array<JSXChild>,
};

/**
 * Any type that can be used as a UI component.
 */
export type JSXComponent<Props extends JSXProps = JSXProps> =
  Component<Props> |
  FunctionalComponent<Props>;

/**
 * The constructor for a class-based component.
 */
export type WithComponentConstructor<C extends JSXComponent> = {
  new(props: PropsOf<C>): C;
}

/**
 * A functional component.
 */
export type FunctionalComponent<Props extends JSXProps = JSXProps> =
  (
    props: Props,
    ctx: BuildContext
  ) => JSXElement;

/**
 * For some component `C`, the props of that component.
 */
export type PropsOf<C extends JSXComponent> =
  C extends Component<infer P> ?
    P :
  C extends FunctionalComponent<infer P> ?
    P :
  never;

/**
 * Any type that can be used as a valid JSX child.
 *
 * - `undefined` is not rendered.
 * - `number`s are cast to strings, then rendered.
 * - `string`s are rendered using `BuildContext.drawString`.
 * - elements are built and diffed recursively.
 */
export type JSXChild = undefined | number | string | JSXElement;

/**
 * The valid children for some component `C`..
 */
export type ChildrenOf<C extends JSXComponent> =
  C extends JSXComponent<infer Props> ?
    Props["children"] extends undefined ?
      Array<undefined> :
      Props["children"] extends Array<infer Q> ?
        Array<Q> :
        never :
    never;

/**
 * An element constructed over a component.
 */
export type JSXElement<C extends JSXComponent = JSXComponent> = {
  /**
   * The current properties of the inner component.
   */
  props: PropsOf<C>,

  /**
   * The children of the component.
   */
  children: Array<JSXChild>,
} & C extends FunctionalComponent ? {
  /**
   * For functional components, the function itself.
   * @param props The properties of the function.
   * @param ctx The build context.
   */
  render: (props: PropsOf<C>, ctx: BuildContext) => JSXElement<C> | undefined
} : {
  /**
   * For class-based components, the constructor to that class.
   */
  constructor: { new(): C }

  /**
   * For class-based components, the instanced component.
   */
  instance: C,
};

/**
 * A set of box constraints made available through `BuildContext`, used for
 * runtime box-model layout.
 */
export type BoxExtents = {
  /**
   * The minimum width of the container. Must be greater than or equal to `0.0`,
   * and less than `width`.
   */
  minWidth: number;

  /**
   * The minimum height of the container. Must be greater than or equal to
   * `0.0`, and less than `height`.
   */
  minHeight: number;

  /**
   * The desired width of the container. Must be greater than `minWidth` and
   * less than `maxWidth`.
   */
  width: number;

  /**
   * The desired height of the container. Must be greater than `minHeight` and
   * less than `maxHeight`.
   */
  height: number;

  /**
   * The maximum width of the container. This may be infinite, and must be
   * larger than `width`.
   */
  maxWidth: number;

  /**
   * The maximum height of the container. This may be infinite, and must be
   * larger than `height`.
   */
  maxHeight: number;
};
