import { Event } from "../Utils";
import { JSXProps, JSXElement } from "./Types";
import { BuildContext } from "./BuildContext";

/**
 * A class-based component.
 */
export abstract class Component<Props extends JSXProps = {}> {
  /**
   * Fired when the component needs rebuild. The context handling this component
   * will listen to this event and queue the rebuild.
   */
  public readonly needsRebuild = new Event();

  /**
   * Construct a new component with the given initial properties.
   *
   * @param props The properties of this component.
   */
  public constructor(public props: Props) {}

  /**
   * Invoked immediately before the component is mounted to the component tree.
   *
   * @param ctx The context currently handling this component.
   */
  public componentWillMount(ctx: BuildContext) {
    // Do nothing.
  }

  /**
   * Invoked immediately after the component is mounted to the component tree.
   *
   * @param ctx The context currently handling this component.
   */
  public componentDidMount(ctx: BuildContext) {
    // Do nothing.
  }

  /**
   * Invoked immediately before the component is unmounted from the component
   * tree.
   *
   * @param ctx The context currently handling this component.
   */
  public componentWillUnmount(ctx: BuildContext) {
    // Do nothing.
  }

  /**
   * Invoked when the component's properties are about to change. Returns `true`
   * if the component should re-render.
   *
   * @param nextProps The properties about to be received.
   * @param ctx The context currently handling this component.
   */
  public shouldUpdate(nextProps: Props, ctx: BuildContext): boolean {
    return true;
  }

  /**
   * Invokes the provided callback, if provided, and queues this component
   * for a render update.
   *
   * @param callback The callback to be invoked, if any.
   * @protected
   */
  protected setState(callback?: () => void) {
    if (callback) {
      callback();
    }

    this.needsRebuild.fire();
  }

  /**
   * Renders this component to the provided context.
   *
   * @param ctx The context currently handling this component.
   */
  public abstract render(ctx: BuildContext): JSXElement | undefined;
}
