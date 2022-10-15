import { Dict, Event, Option } from "../Utils";
import { System } from "./System";

/**
 * A wrapped peripheral instance.
 */
export type PeripheralEntry<T extends string = string> = {
  /**
   * The side or network ID of the peripheral.
   */
  name: string,

  /**
   * The type of the peripheral.
   */
  ty: T,

  /**
   * `true` if the peripheral is still available.
   */
  mounted: boolean,

  /**
   * Invoked when the peripheral is detached from the system.
   */
  unmounted: Event;

  /**
   * The inner peripheral table.
   */
  wrapped: CCNamedPeripheral<T>,
}

/**
 * Automatically-generated bindings to CC peripherals.
 */
export class Peripheral {
  /**
   * All peripherals currently available to the system.
   * @protected
   */
  protected static mounted = new Dict<string, PeripheralEntry>();

  /**
   * Invoked when a peripheral becomes available to the computer.
   */
  public static readonly peripheralMounted = new Event<[PeripheralEntry]>();

  /**
   * Invoked when a peripheral is no longer available to the computer.
   */
  public static readonly peripheralDetached = new Event<[PeripheralEntry]>();

  /**
   * Attaches a named peripheral to the peripheral service. This is
   * automatically invoked.
   *
   * @param name The side or network ID of the attached peripheral.
   * @internal
   */
  public static attach(name: string) {
    const wrapped = peripheral.wrap(name);

    if (!wrapped) {
      return;
    }

    const [ty] = peripheral.getType(wrapped);

    if (!ty) {
      return;
    }

    const entry = {
      name,
      ty,
      wrapped,
      mounted: true,
      unmounted: new Event(),
    };

    this.mounted.set(name, entry);

    Peripheral.peripheralMounted.fire(entry);
  }

  /**
   * Returns all currently mounted peripherals of type `ty` that pass a provided
   * filter.
   *
   * @param ty The type of peripheral to search for. If not provided, every
   * peripheral.
   * @param filter An optional filter function.
   */
  public static all<T extends string>(
    ty?: T,
    filter?: (peripheral: PeripheralEntry) => boolean
  ): Array<PeripheralEntry<T>> {
    const rv = new Array<PeripheralEntry<T>>();

    this.mounted.forEach((entry) => {
      if (filter !== undefined && !filter(entry)) {
        return;
      }

      if (ty !== undefined && entry.ty !== ty) {
        return;
      }

      rv.push(entry as PeripheralEntry<T>);
    });

    return rv;
  }

  /**
   * Returns a single mounted peripheral matching `ty` and `filter`.
   *
   * @param ty The peripheral type.
   * @param filter An optional filtering function.
   */
  public static one<T extends string>(
    ty: T,
    filter?: (peripheral: PeripheralEntry) => boolean
  ): Option<PeripheralEntry<T>> {
    return Option.wrap(this.all(ty, filter)[0]);
  }

  /**
   * Detaches a named peripheral from the peripheral service. This is
   * automatically invoked.
   *
   * @param name The side or network ID of the detaching peripheral.
   * @internal
   */
  public static detach(name: string) {
    this.mounted.get(name).then((value) => {
      value.mounted = false;
      value.unmounted.fire();
      this.mounted.delete(name);
      Peripheral.peripheralDetached.fire(value);
    });
  }
}

System.peripheral.on((name: string) => Peripheral.attach(name));

System.peripheralDetach.on((name: string) => Peripheral.detach(name));
