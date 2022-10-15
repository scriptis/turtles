/**
 * A type that represents either a success or an error.
 */
export class Result<T, E> {
  /**
   * Constructs a new result storing either a success or an error value.
   * @param success The success value.
   * @param errValue The error value.
   * @protected
   */
  private constructor(
    private readonly success?: T,
    private readonly errValue?: E
  ) {}

  /**
   * Constructs a new successful result.
   * @param value The inner value.
   */
  public static ok<T, E>(value: T) {
    return new this<T, E>(value, undefined);
  }

  /**
   * Constructs a new unsuccessful result.
   * @param err The inner value.
   */
  public static err<T, E>(err: E) {
    return new this<T, E>(undefined, err);
  }

  public isOk() {
    return this.success !== undefined;
  }

  public isErr() {
    return this.errValue !== undefined;
  }

  /**
   * Unwraps the inner value, returning it, or throwing the provided error
   * if the result was an error.
   * @param msg An error message to display.
   */
  public expect(msg: string): T {
    if (this.success === undefined) {
      error(msg);
    }

    return this.success;
  }

  /**
   * Unwraps the inner error, returning it, or throwing the provided error
   * if the result was a success.
   * @param msg An error message to display if this result was not successful.
   */
  public expectErr(msg: string): E {
    if (this.errValue === undefined) {
      error(msg);
    }

    return this.errValue;
  }

  /**
   * Flattens a result within a result into a single result.
   */
  public flatten(this: Result<Result<T, E>, E>): Result<T, E> {
    return this.unwrapOrElse((e) => Result.err(e));
  }

  /**
   * Unwraps the inner value, returning it, or producing an error if the result
   * was not successful.
   */
  public unwrap(): T {
    if (this.success === undefined) {
      error("Attempted to unwrap unsuccessful result");
    }

    return this.success;
  }

  /**
   * Unwraps the inner error, returning it, or producing an error if the result
   * was successful.
   */
  public unwrapErr(): E {
    if (this.errValue === undefined) {
      error("Attempted to unwrap successful result");
    }

    return this.errValue;
  }

  /**
   * Unwraps the inner value, returning it, or a default value.
   * @param defaultValue The default value.
   */
  public unwrapOr(defaultValue: T) {
    if (this.success === undefined) {
      return defaultValue;
    }

    return this.success;
  }

  /**
   * Unwraps the inner value, returning it if it exists. Otherwise, invokes
   * the provided function, returning its result.
   * @param fn The function.
   */
  public unwrapOrElse(fn: (err: E) => T) {
    if (this.success === undefined) {
      return fn(this.errValue as E);
    }

    return this.success;
  }

  /**
   * Maps this result to a result of a different success type using the provided
   * callback.
   * @param fn The callback.
   */
  public map<R>(fn: (value: T) => R) {
    const { success, errValue } = this;

    return new Result<R, E>(success ? fn(success) : undefined, errValue);
  }

  /**
   * Maps this result to a result of a different error type using the provided
   * callback.
   * @param fn The callback.
   */
  public mapErr<R>(fn: (value: E) => R) {
    const { success, errValue } = this;

    return new Result<T, R>(success, errValue ? fn(errValue) : undefined);
  }

  /**
   * Invokes `fn` with the contents of this result, if those contents exist.
   * Otherwise, does nothing.
   *
   * @param fn The function.
   */
  public then(fn: (value: T) => void): this {
    if (this.success !== undefined) {
      fn(this.success);
    }

    return this;
  }

  /**
   * Invokes `fn` with the error of this result, if it exists. Otherwise, does
   * nothing.
   * @param fn The function.
   */
  public else(fn: (value: E) => void): this {
    if (this.errValue !== undefined) {
      fn(this.errValue);
    }

    return this;
  }
}
