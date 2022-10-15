/**
 * An optional value with a myriad of helper functions, inspired by the
 * [Rust option type](https://doc.rust-lang.org/stable/std/option/enum.Option.html).
 */
export class Option<T> {
  /**
   * Constructs a new `Option` with an inner value `T`.
   * @param inner The inner value.
   * @protected
   */
  protected constructor(protected inner?: T) {}

  /**
   * Creates a new option with no inner value.
   */
  public static none<T>() {
    return new this<T>();
  }

  /**
   * Creates a new option with the provided inner value.
   * @param value The value.
   */
  public static some<T>(value: T) {
    return new this(value);
  }

  /**
   * Creates a new option from a nullable value.
   * @param value The value.
   */
  public static wrap<T>(value: T | undefined) {
    return new this<T>(value);
  }

  /**
   * Returns `true` if this option contains a value.
   */
  public isSome(): boolean {
    return this.inner !== undefined;
  }

  /**
   * Returns `true` if this option does not contain a value.
   */
  public isNone(): boolean {
    return this.inner === undefined;
  }

  /**
   * Unwraps the inner value, returning it, or throwing the provided error
   * if the option was empty.
   * @param msg An error message to display if this option is `None`.
   */
  public expect(msg: string): T {
    if (this.inner === undefined) {
      error(msg);
    }

    return this.inner;
  }

  /**
   * Reduces an option of an option to a single option.
   */
  public flatten<I>(this: Option<Option<I>>): Option<I> {
    return this.unwrapOrElse(() => Option.none());
  }

  /**
   * Unwraps the inner value, returning it, or producing an error if the option
   * was empty.
   */
  public unwrap(): T {
    if (this.inner === undefined) {
      error("Attempted to unwrap option with no value");
    }

    return this.inner;
  }

  /**
   * Unwraps the inner value, returning it, or a default value.
   * @param defaultValue The default value.
   */
  public unwrapOr(defaultValue: T) {
    if (this.inner === undefined) {
      return defaultValue;
    }

    return this.inner;
  }

  /**
   * Unwraps the inner value, returning it if it exists. Otherwise, invokes
   * the provided function, returning its result.
   * @param fn The function.
   */
  public unwrapOrElse(fn: () => T) {
    if (this.inner === undefined) {
      return fn();
    }

    return this.inner;
  }

  /**
   * Maps this option to an option of a different type using the provided
   * callback.
   * @param fn The callback.
   */
  public map<R>(fn: (value: T) => R) {
    return new Option<R>(this.inner ? fn(this.inner) : undefined);
  }

  /**
   * Invokes `fn` with the contents of this option, if those contents exist.
   * Otherwise, does nothing.
   * @param fn The function.
   */
  public then(fn: (value: T) => void): this {
    if (this.inner !== undefined) {
      fn(this.inner);
    }

    return this;
  }

  /**
   * Invokes `fn` if this option is empty. Otherwise, does nothing.
   * @param fn
   */
  public else(fn: () => void): this {
    if (this.inner === undefined) {
      fn();
    }

    return this;
  }
}
