import { Option } from "./Option";

/**
 * A dictionary with `K` keys and `V` values.
 */
export class Dict<K, V> {
  /**
   * The inner map.
   * @protected
   */
  protected inner = new Map<K, V>();

  /**
   * Clears the dictionary.
   */
  public clear(): void {
    return this.inner.clear();
  }

  /**
   * Deletes a keyed value from the dictionary.
   * @param key The key.
   */
  public delete(key: K): boolean {
    return this.inner.delete(key);
  }

  /**
   * Invokes the provided callback with each key-value pair in the dictionary.
   * @param callback The callback function.
   */
  public forEach(callback: (value: V, key: K, self: this) => void) {
    this.inner.forEach((v, k) => {
      callback(v, k, this);
    });
  }

  /**
   * Gets a keyed value from the dictionary.
   * @param key The key.
   */
  public get(key: K): Option<V> {
    return Option.wrap(this.inner.get(key));
  }

  /**
   * Gets a keyed value from the dictionary, or, if it doesn't exist, inserts
   * `defaultValue` and returns that instead.
   * @param key The key.
   * @param defaultValue The default value.
   */
  public getOrInsert(key: K, defaultValue: V): V {
    const value = this.inner.get(key);

    if (value === undefined) {
      this.inner.set(key, defaultValue);

      return defaultValue;
    }

    return value;
  }

  /**
   * Gets a keyed value from the dictionary, or, if it doesn't exist,
   * invokes `callback`, inserts the return value to the dictionary, and
   * returns that value.
   * @param key The key.
   * @param callback The callback function.
   */
  public getOrInsertWith(key: K, callback: () => V): V {
    const value = this.inner.get(key);

    if (value === undefined) {
      const rv = callback();

      this.inner.set(key, rv);

      return rv;
    }

    return value;
  }

  /**
   * Returns `true` if `key` is present in this dictionary.
   * @param key
   */
  public has(key: K): boolean {
    return this.inner.has(key);
  }

  /**
   * Returns `true` if this dictionary is empty.
   */
  public isEmpty(): boolean {
    return this.inner.size === 0;
  }

  /**
   * Sets a key-value pair in this dictionary.
   * @param key The key.
   * @param value The value.
   */
  public set(key: K, value: V): this {
    this.inner.set(key, value);

    return this;
  }

  /**
   * Returns the number of entries in this dictionary.
   */
  public size(): number {
    return this.inner.size;
  }
}
