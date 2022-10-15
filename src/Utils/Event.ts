import { Connection } from "./Connection";
import { Fn } from "./Types";

/**
 * A brutally simple event type.
 */
export class Event<T extends Array<unknown> = []> {
  /**
   * The handlers bound to this event.
   * @protected
   */
  protected handlers = new Set<Fn<T>>();

  /**
   * Binds a callback to this event.
   * @param callback The callback to bind.
   * @return A connection to disconnect the callback.
   */
  public on(callback: Fn<T>): Connection {
    this.handlers.add(callback);

    return Connection.wrap(() => this.off(callback));
  }

  /**
   * Removes a callback from this event.
   * @param callback The callback.
   */
  public off(callback: Fn<T>) {
    this.handlers.delete(callback);
  }

  /**
   * Fires the event with the given values.
   * @param args The values.
   */
  public fire(...args: T) {
    this.handlers.forEach((fn) => fn(...args));
  }
}
