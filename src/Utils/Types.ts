/**
 * A function with zero or more arguments and a single return value.
 */
export type Fn<T extends Array<unknown> = [], R = void> = (...args: T) => R;

/**
 * A type guard.
 */
export type Check<T> = (v: unknown) => v is T;

/**
 * The type checked in a type guard.
 */
export type CheckOf<T> = T extends Check<infer Q> ? Q : never;

/**
 * A table of checks.
 */
export type CheckTable<T> = { [K in keyof T]: Check<T[K]> };

/**
 * A constructor of `T`.
 */
export type Constructor<T> = { new(...args: Array<unknown>): T }
