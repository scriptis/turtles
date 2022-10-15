/**
 * Any type that implements a disconnect method.
 */
export interface ConnectionLike {
  /**
   * Disconnects the connection.
   */
  disconnect(): void
}

/**
 * A connection representing a sort of pipe that can be destroyed by invoking
 * `disconnect`.
 */
export class Connection implements ConnectionLike {
  /**
   * Whether this connection is already disconnected.
   * @private
   */
  private isDisconnected = false;

  /**
   * Creates a new connection that invokes the given callback when disconnected.
   * @param performDisconnection The callback.
   */
  protected constructor(private performDisconnection: () => void) {}

  /**
   * Disconnects this connection. Throws if the connection has already
   * been disconnected.
   */
  public disconnect() {
    if (this.isDisconnected) {
      error("Connection is already disconnected");
    }

    this.isDisconnected = true;

    this.performDisconnection();
  }

  /**
   * Creates a new connection that invokes the given callback when disconnected.
   * @param callback The callback.
   */
  public static wrap(callback: () => void) {
    return new this(callback);
  }
}
