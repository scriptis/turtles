/**!
 * Types for [CC:Tweaked](https://tweaked.cc/), for cross-compilation with
 * [TypeScriptToLua](https://typescripttolua.github.io). This is nowhere near
 * finished!
 */

/**
 * A CC:Tweaked style result tuple.
 *
 * If the first value in the tuple is `true`, the operation was successful,
 * and the second argument is `T` or `void`.
 *
 * If the first value in the tuple is `false`, the operation failed, and the
 * second argument is `T` or `void`.
 */
declare type CCResult<T = void, E = void> = LuaMultiReturn<[true, T]> | LuaMultiReturn<[false, E]>

/**
 * A CC:Tweaked wrapped peripheral table, typically generated via
 * `peripheral.wrap`.
 */
declare type CCPeripheral = {
  /**
   * `CCPeripheral` is just a table; this marker serves as a type guard.
   */
  __isPeripheral: void,
}

/**
 * The table returned from turtles inspecting blocks.
 */
declare type CCBlockData = {
  /**
   * The internal name of the block (e.g., `minecraft:dirt`).
   */
  name: string,

  /**
   * The state values of the block (e.g., `{ facing: "west", ... }`).
   */
  state: Record<string, string>,

  /**
   * The set of tags associated with the block (e.g.,
   * `{ "minecraft:stone_tool_materials": true, ... } `).
   */
  tags: Record<string, boolean>,
}

declare type CCItemData = {
  /**
   * The internal name of the item (e.g., `minecraft:dirt`).
   */
  name: string,

  /**
   * The number of items currently in the stack.
   */
  count: number,
}

declare type CCDetailedItemData = CCItemData & {
  /**
   * The human-readable name of the item (e.g., "dirt").
   */
  displayName: string,

  /**
   * The stack size of the item.
   */
  maxCount: number,

  /**
   * The set of tags associated with the item (e.g.,
   * `{ "minecraft:stone_tool_materials": true, ... } `).
   */
  tags: Record<string, boolean>,

  /**
   * The enchantments applied to the item, if any.
   */
  enchantments?: Array<{
    /**
     * The human-readable name of the enchantment.
     */
    displayName: string,

    /**
     * The level of the enchantment.
     */
    level: number,

    /**
     * The internal name of the enchantment.
     */
    name: string
  }>,

  /**
   * The NBT data associated with the item.
   */
  nbt?: string,

  /**
   * The current damage value (durability) of the item. `0` indicates no damage.
   */
  damage?: number,

  /**
   * The maximum damage value (durability) of the item. The item breaks when
   * `damage` reaches this value.
   */
  maxDamage?: number,
}

/**
 * Well-known peripherals with corresponding type definitions.
 */
declare type CCWellKnownPeripherals = {
  "modem": CCModem,
  "monitor": CCMonitor,
}

/**
 * A string accepted as a six-sided face value.
 */
declare type CCFace = "top" | "bottom" | "left" | "right" | "back";

/**
 * A face value or a network ID.
 */
declare type CCFaceOrNetworkId = CCFace | string;

/**
 * Resolve a peripheral's name to that peripheral's type definitions, if they
 * exist. Otherwise, resolve to the default peripheral.
 */
declare type CCNamedPeripheral<T extends string> =
  T extends keyof CCWellKnownPeripherals ?
    CCWellKnownPeripherals[T] :
    CCPeripheral;

/**
 * A wrapped monitor peripheral.
 */
declare type CCMonitor = CCPeripheral & Redirect;

/**
 * A wrapped modem peripheral.
 */
declare type CCModem = CCPeripheral & {
  /**
   * Open a channel on a modem. A channel must be open in order to receive
   * messages. Modems can have up to 128 channels open at one time.
   * @param channel number The channel to open. This must be a number between 0
   *  and 65535.
   * @throws - If the channel is out of range, or if there are too many open
   * channels.
   */
  open(this: void, channel: number): void,

  /**
   * Check if a channel is open.
   * @param channel The channel to check.
   * @return Whether the channel is open.
   * @throws If the channel is out of range.
   */
  isOpen(this: void, channel: number): boolean,

  /**
   * Close an open channel, meaning it will no longer receive messages.
   * @param channel The channel to close.
   * @throws If the channel is out of range.
   */
  close(this: void, channel: number): void,

  /**
   * Close all open channels.
   */
  closeAll(this: void): void,

  /**
   * Sends a modem message on a certain channel. Modems listening on the channel
   * will queue a modem_message event on adjacent computers.
   *
   * The channel does not need be open to send a message.
   * @param channel The channel to send messages on.
   * @param replyChannel The channel that responses to this message should be
   * sent on. This can be the same as channel or entirely different. The channel
   * must have been opened on the sending computer in order to receive the
   * replies.
   * @param payload The object to send. This can be any primitive type (boolean,
   * number, string) as well as tables. Other types (like functions), as well as
   * metatables, will not be transmitted.
   * @throws If the channel is out of range.
   */
  transmit(this: void, channel: number, replyChannel: number, payload: any): void,

  /**
   * Determine if this is a wired or wireless modem.
   *
   * Some methods (namely those dealing with wired networks and remote
   * peripherals) are only available on wired modems.
   *
   * @returns `true` if this is a wireless modem.
   */
  isWireless(this: void): boolean,

  /**
   * List all remote peripherals on the wired network.
   *
   * If this computer is attached to the network, it will **not** be included in
   * this list.
   *
   * **This function only appears on wired modems.** Check `isWireless` returns
   * `false` before calling it.
   *
   * @returns Remote peripheral names on the network.
   */
  getNamesRemote(this: void): Array<string>,

  /**
   * Determine if a peripheral is available on this wired network.
   *
   * **This function only appears on wired modems.** Check `isWireless` returns
   * `false` before calling it.
   *
   * @param name The peripheral's name.
   * @returns `true` if a peripheral is present with the given name.
   */
  isPresentRemote(this: void, name: string): boolean,

  /**
   * Get the type of a peripheral available on this wired network.
   *
   * **This function only appears on wired modems.** Check `isWireless` returns
   * `false` before calling it.
   *
   * @param name The peripheral's name.
   * @returns The peripheral's type, or `nil` if it is not present.
   */
  getTypeRemote(this: void, name: string): string | undefined,

  /**
   * Check a peripheral is of a particular type.
   *
   * **This function only appears on wired modems.** Check `isWireless` returns
   * `false` before calling it.
   *
   * @param name The peripheral's name.
   * @param ty The type to check.
   * @returns `true` if a peripheral has a particular type, or `nil` if it is
   * not present.
   */
  hasTypeRemote(this: void, name: string, ty: string): boolean | undefined,

  /**
   * Get all available methods for the remote peripheral with the given name.
   *
   * **This function only appears on wired modems.** Check `isWireless` returns
   * `false` before calling it.
   *
   * @param name The peripheral's name.
   * @returns A list of methods provided by this peripheral, or nil if it is not
   * present.
   */
  getMethodsRemote(this: void, name: string): Array<string> | undefined,

  /**
   * Call a method on a peripheral on this wired network.
   *
   * **This function only appears on wired modems.** Check `isWireless` returns
   * `false` before calling it.
   *
   * @param name The name of the peripheral to invoke the method on.
   * @param method The name of the method.
   * @param args Additional arguments to pass to the method.
   * @returns The return value of the invoked method.
   */
  callRemote(this: void, name: string, method: string, ...args: Array<any>): LuaMultiReturn<any>,

  /**
   * Returns the network name of the current computer, if the modem is on. This
   * may be used by other computers on the network to wrap this computer as a
   * peripheral.
   *
   * **This function only appears on wired modems.** Check `isWireless` returns
   * `false` before calling it.
   *
   * @returns The current computer's name on the wired network.
   */
  getNameLocal(this: void): string | undefined,
}

/** @noSelf */
declare namespace peripheral {
  /**
   * Provides a list of all peripherals available.
   *
   * @returns A list of the names of all attached peripherals.
   */
  export function getNames(): Array<string>;

  /**
   * Determines if a peripheral is present with the given name.
   *
   * @param name The side or network name that you want to check.
   * @returns `true` if a peripheral is present with the given name.
   */
  export function isPresent(name: CCFaceOrNetworkId): boolean;

  /**
   * Get the types of a named peripheral.
   *
   * @param name The name of the peripheral to find.
   * @returns The peripheral's types, or nil if it is not present.
   */
  export function getType(name: CCFaceOrNetworkId): LuaMultiReturn<Array<boolean | undefined>>;

  /**
   * Get the types of a named peripheral.
   *
   * @param peripheral A wrapped peripheral instance.
   * @returns The peripheral's types, or nil if it is not present.
   */
  export function getType(peripheral: CCPeripheral): LuaMultiReturn<Array<string | undefined>>;

  /**
   * Check if a peripheral is of a particular type.
   *
   * @param name The name of the peripheral.
   * @param ty The type to check.
   * @returns A boolean if the peripheral has a particular type, or `nil` if it
   * is not present.
   */
  export function hasType(name: CCFaceOrNetworkId, ty: string): boolean | undefined;

  /**
   * Check if a peripheral is of a particular type.
   *
   * @param peripheral A wrapped peripheral instance.
   * @param ty The type to check.
   * @returns A boolean if the peripheral has a particular type.
   */
  export function hasType<P extends CCPeripheral, N extends keyof CCWellKnownPeripherals>(
    peripheral: CCPeripheral,
    ty: N
  ): peripheral is CCWellKnownPeripherals[N];

  /**
   * Check if a peripheral is of a particular type.
   *
   * @param peripheral A wrapped peripheral instance.
   * @param ty The type to check.
   * @returns A boolean if the peripheral has a particular type.
   */
  export function hasType(peripheral: CCPeripheral, ty: string): boolean;

  /**
   * Get all available methods for the peripheral with the given name.
   *
   * @param name The name of the peripheral to find.
   * @returns A list of methods provided by this peripheral, or `nil` if it is
   * not present.
   */
  export function getMethods(name: string): Array<string> | undefined;

  /**
   * Get the name of a peripheral wrapped with `peripheral.wrap`.
   * @param peripheral The peripheral to get the name of.
   * @returns The name of the given peripheral.
   */
  export function getName(peripheral: CCPeripheral): string;

  /**
   * Call a method on the peripheral with the given name.
   * @param name The name of the peripheral to invoke the method on.
   * @param method The name of the method.
   * @param args  Additional arguments to pass to the method.
   * @returns The return values of the peripheral method.
   */
  export function call(name: CCFaceOrNetworkId, method: string, ...args: Array<any>): LuaMultiReturn<Array<any>>;

  /**
   * Get a table containing all functions available on a peripheral. These can
   * then be called instead of using `peripheral.call` every time.
   *
   * @param name The name of the peripheral to wrap.
   * @returns The table containing the peripheral's methods, or `nil` if there
   * is no peripheral present with the given name.
   */
  export function wrap(name: CCFaceOrNetworkId): CCPeripheral | undefined;

  /**
   * Find all peripherals of a specific type, and return the wrapped
   * peripherals.
   *
   * @param ty The type of peripheral to look for.
   * @param filter A filter function, which takes the peripheral's name and
   * wrapped table and returns if it should be included in the result.
   * @returns Zero or more wrapped peripherals matching the given filters.
   */
  export function find<T extends string>(
    ty: T,
    filter?: (name: string, wrapped: CCNamedPeripheral<T>) => boolean
  ): LuaMultiReturn<Array<CCNamedPeripheral<T>>>;
}

/**
 * A named turtle equipment slot.
 */
declare type TurtleEquipmentSlot = "left" | "right";

/**
 * The return value of turtle fuel functions.
 */
declare type TurtleFuelLevel = number | "unlimited";

/**
 * The turtle API object. Only available on turtles.
 */
type TurtleAPI = {
  /**
   * Move the turtle forward one block.
   *
   * @returns Whether the turtle could successfully move. On failure, a string
   * indicating why the turtle could not move.
   */
  forward(this: void): CCResult<void, string>,

  /**
   * Move the turtle backwards one block.
   *
   * @returns Whether the turtle could successfully move. On failure, a string
   * indicating why the turtle could not move.
   */
  back(this: void): CCResult<void, string>,

  /**
   * Move the turtle up one block.
   *
   * @returns Whether the turtle could successfully move. On failure, a string
   * indicating why the turtle could not move.
   */
  up(this: void): CCResult<void, string>,

  /**
   * Move the turtle down one block.
   *
   * @returns Whether the turtle could successfully move. On failure, a string
   * indicating why the turtle could not move.
   */
  down(this: void): CCResult<void, string>,

  /**
   * Rotate the turtle 90 degrees to the left.
   *
   * @returns Whether the turtle could successfully move. On failure, a string
   * indicating why the turtle could not move.
   */
  turnLeft(this: void): CCResult<void, string>,

  /**
   * Rotate the turtle 90 degrees to the right.
   *
   * @returns Whether the turtle could successfully move. On failure, a string
   * indicating why the turtle could not move.
   */
  turnRight(this: void): CCResult<void, string>,

  /**
   * Attempt to break the block in front of the turtle.
   *
   * This requires a turtle tool capable of breaking the block. Diamond pickaxes
   * (mining turtles) can break any vanilla block, but other tools (such as
   * axes) are more limited.
   *
   * @param side The specific tool to use. Should be "left" or "right".
   * @returns Whether a block was broken. On failure, the reason no block was
   * broken.
   */
  dig(this: void, side?: TurtleEquipmentSlot): CCResult<void, string>,

  /**
   * Attempt to break the block above the turtle.
   *
   * This requires a turtle tool capable of breaking the block. Diamond pickaxes
   * (mining turtles) can break any vanilla block, but other tools (such as
   * axes) are more limited.
   *
   * @param side The specific tool to use. Should be "left" or "right".
   * @returns Whether a block was broken. On failure, the reason no block was
   * broken.
   */
  digUp(this: void, side?: TurtleEquipmentSlot): CCResult<void, string>,

  /**
   * Attempt to break the block below the turtle.
   *
   * This requires a turtle tool capable of breaking the block. Diamond pickaxes
   * (mining turtles) can break any vanilla block, but other tools (such as
   * axes) are more limited.
   *
   * @param side The specific tool to use. Should be "left" or "right".
   * @returns Whether a block was broken. On failure, the reason no block was
   * broken.
   */
  digDown(this: void, side?: TurtleEquipmentSlot): CCResult<void, string>,

  /**
   * Place a block or item into the world in front of the turtle.
   *
   * "Placing" an item allows it to interact with blocks and entities in front
   * of the turtle. For instance, buckets can pick up and place down fluids, and
   * wheat can be used to breed cows. However, you cannot use `place` to perform
   * arbitrary block interactions, such as clicking buttons or flipping levers.
   *
   * @param text When placing a sign, set its contents to this text.
   * @returns Whether the block could be placed. On failure, The reason the
   * block was not placed.
   */
  place(this: void, text?: string): CCResult<void, string>,

  /**
   * Place a block or item into the world above the turtle.
   *
   * "Placing" an item allows it to interact with blocks and entities in front
   * of the turtle. For instance, buckets can pick up and place down fluids, and
   * wheat can be used to breed cows. However, you cannot use `place` to perform
   * arbitrary block interactions, such as clicking buttons or flipping levers.
   *
   * @param text When placing a sign, set its contents to this text.
   * @returns Whether the block could be placed. On failure, The reason the
   * block was not placed.
   */
  placeUp(this: void, text?: string): CCResult<void, string>,

  /**
   * Place a block or item into the world below the turtle.
   *
   * "Placing" an item allows it to interact with blocks and entities in front
   * of the turtle. For instance, buckets can pick up and place down fluids, and
   * wheat can be used to breed cows. However, you cannot use `place` to perform
   * arbitrary block interactions, such as clicking buttons or flipping levers.
   *
   * @param text When placing a sign, set its contents to this text.
   * @returns Whether the block could be placed. On failure, The reason the
   * block was not placed.
   */
  placeDown(this: void, text?: string): CCResult<void, string>,

  /**
   * Drop the currently selected stack into the inventory in front of the
   * turtle, or as an item into the world if there is no inventory.
   *
   * @param count The number of items to drop. If not given, the entire stack
   * will be dropped.
   * @returns Whether items were dropped. On failure, the reason the no items
   * were dropped.
   * @throws If dropping an invalid number of items.
   */
  drop(this: void, count?: number): CCResult<void, string>,

  /**
   * Drop the currently selected stack into the inventory above the turtle, or
   * as an item into the world if there is no inventory.
   *
   * @param count The number of items to drop. If not given, the entire stack
   * will be dropped.
   * @returns Whether items were dropped. On failure, the reason the no items
   * were dropped.
   * @throws If dropping an invalid number of items.
   */
  dropUp(this: void, count?: number): CCResult<void, string>,

  /**
   * Drop the currently selected stack into the inventory in front of the
   * turtle, or as an item into the world if there is no inventory.
   *
   * @param count The number of items to drop. If not given, the entire stack
   * will be dropped.
   * @returns Whether items were dropped. On failure, the reason the no items
   * were dropped.
   * @throws If dropping an invalid number of items.
   */
  dropDown(this: void, count?: number): CCResult<void, string>,

  /**
   * Change the currently selected slot.
   *
   * The selected slot is determines what slot actions like `drop` or
   * `getItemCount` act on.
   *
   * @param slot The slot to select.
   * @returns `true` when the slot has been selected.
   * @throws If the slot is out of range.
   */
  select(this: void, slot: number): boolean,

  /**
   * Get the number of items in the given slot.
   *
   * @param slot The slot we wish to check. Defaults to the selected slot.
   * @returns The number of items in this slot.
   * @throws If the slot is out of range.
   */
  getItemCount(this: void, slot?: number): number,

  /**
   * Get the remaining number of items which may be stored in this stack.
   *
   * For instance, if a slot contains 13 blocks of dirt, it has room for another
   * 51.
   *
   * @param slot number The slot we wish to check. Defaults to the selected
   * slot.
   * @returns The space left in this slot.
   * @throws If the slot is out of range.
   */
  getItemSpace(this: void, slot?: number): number;

  /**
   * Check if there is a solid block in front of the turtle. In this case, solid
   * refers to any non-air or liquid block.
   *
   * @returns `true` if there is a solid block in front of the turtle.
   */
  detect(this: void): boolean,

  /**
   * Check if there is a solid block above the turtle. In this case, solid
   * refers to any non-air or liquid block.
   *
   * @returns `true` if there is a solid block above of the turtle.
   */
  detectUp(this: void): boolean,

  /**
   * Check if there is a solid block below the turtle. In this case, solid
   * refers to any non-air or liquid block.
   *
   * @returns `true` if there is a solid block below of the turtle.
   */
  detectDown(this: void): boolean,

  /**
   * Check if the block in front of the turtle is equal to the item in the
   * currently selected slot.
   *
   * @returns `true` if the block and item are equal.
   */
  compare(this: void): boolean,

  /**
   * Check if the block above the turtle is equal to the item in the currently
   * selected slot.
   *
   * @returns `true` if the block and item are equal.
   */
  compareUp(this: void): boolean,

  /**
   * Check if the block below the turtle is equal to the item in the currently
   * selected slot.
   *
   * @returns `true` if the block and item are equal.
   */
  compareDown(this: void): boolean,

  /**
   * Attack the entity in front of the turtle.
   *
   * @param side The specific tool to use.
   * @returns Whether an entity was attacked. On failure, the reason nothing was
   * attacked.
   */
  attack(this: void, side?: TurtleEquipmentSlot): CCResult<void, string>,

  /**
   * Attack the entity above the turtle.
   *
   * @param side The specific tool to use.
   * @returns Whether an entity was attacked. On failure, the reason nothing was
   * attacked.
   */
  attackUp(this: void, side?: TurtleEquipmentSlot): CCResult<void, string>,

  /**
   * Attack the entity below the turtle.
   *
   * @param side The specific tool to use.
   * @returns Whether an entity was attacked. On failure, the reason nothing was
   * attacked.
   */
  attackDown(this: void, side?: TurtleEquipmentSlot): CCResult<void, string>,

  /**
   * Suck an item from the inventory in front of the turtle, or from an item
   * floating in the world.
   *
   * @param count The number of items to suck. If not given, up to a stack of
   * items will be picked up.
   * @returns Whether items were picked up. On failure, the reason the no items
   * were picked up.
   * @throws If given an invalid number of items.
   */
  suck(this: void, count?: number): CCResult<void, string>,

  /**
   * Suck an item from the inventory above the turtle, or from an item floating
   * in the world.
   *
   * @param count The number of items to suck. If not given, up to a stack of
   * items will be picked up.
   * @returns Whether items were picked up. On failure, the reason the no items
   * were picked up.
   * @throws If given an invalid number of items.
   */
  suckUp(this: void, count?: number): CCResult<void, string>,

  /**
   * Suck an item from the inventory below the turtle, or from an item floating
   * in the world.
   *
   * @param count The number of items to suck. If not given, up to a stack of
   * items will be picked up.
   * @returns Whether items were picked up. On failure, the reason the no items
   * were picked up.
   * @throws If given an invalid number of items.
   */
  suckDown(this: void, count?: number): CCResult<void, string>,

  /**
   * Get the amount of fuel this turtle currently holds.
   *
   * @returns The current amount of fuel a turtle this turtle has, or
   * "unlimited" if turtles do not consume fuel when moving.
   */
  getFuelLevel(this: void): TurtleFuelLevel,

  /**
   * Refuel this turtle.
   *
   * While most actions a turtle can perform (such as digging or placing blocks)
   * are free, moving consumes fuel from the turtle's internal buffer. If a
   * turtle has no fuel, it will not move.
   *
   * `refuel` refuels the turtle, consuming fuel items (such as coal or lava
   * buckets) from the currently selected slot and converting them into energy.
   * This finishes once the turtle is fully refuelled or all items have been
   * consumed.
   *
   * @param count The maximum number of items to consume. One can pass `0` to
   * check if an item is combustible or not.
   * @returns `true` if the turtle was refuelled. On failure, the reason the
   * turtle was not refuelled.
   * @throws If the refuel count is out of range.
   */
  refuel(this: void, count?: number): CCResult<void, string>,

  /**
   * Compare the item in the currently selected slot to the item in another
   * slot.
   *
   * @param slot The slot to compare to.
   * @returns `true` if the two items are equal.
   * @throws If the slot is out of range.
   */
  compareTo(this: void, slot: number): boolean,

  /**
   * Move an item from the selected slot to another one.
   * @param slot The slot to move this item to.
   * @param count The maximum number of items to move.
   * @returns `true` if some items were successfully moved.
   * @throws If the slot is out of range, or if the number of items is out of
   * range.
   */
  transferTo(this: void, slot: number, count?: number): boolean,

  /**
   * Get the currently selected slot.
   *
   * @returns The current slot.
   */
  getSelectedSlot(this: void): number,

  /**
   * Get the maximum amount of fuel this turtle can hold.
   *
   * By default, normal turtles have a limit of 20,000 and advanced turtles of
   * 100,000.
   *
   * @returns The maximum amount of fuel a turtle can hold, or "unlimited" if
   * turtles do not consume fuel when moving.
   */
  getFuelLimit(this: void): TurtleFuelLevel,

  /**
   * Equip (or un-equip) an item on the left side of this turtle.
   *
   * This finds the item in the currently selected slot and attempts to equip it
   * to the left side of the turtle. The previous upgrade is removed and placed
   * into the turtle's inventory. If there is no item in the slot, the previous
   * upgrade is removed, but no new one is equipped.
   *
   * @returns `true` if the item was equipped. On failure, the reason equipping
   * this item failed.
   */
  equipLeft(this: void): CCResult<void, string>,

  /**
   * Equip (or un-equip) an item on the right side of this turtle.
   *
   * This finds the item in the currently selected slot and attempts to equip it
   * to the right side of the turtle. The previous upgrade is removed and placed
   * into the turtle's inventory. If there is no item in the slot, the previous
   * upgrade is removed, but no new one is equipped.
   *
   * @returns `true` if the item was equipped. On failure, the reason equipping
   * this item failed.
   */
  equipRight(this: void): CCResult<void, string>,

  /**
   * Get information about the block in front of the turtle.
   *
   * @returns The information. On failure, a message explaining there is no
   * block.
   */
  inspect(this: void): CCResult<CCBlockData, string>,

  /**
   * Get information about the block above the turtle.
   *
   * @returns The information. On failure, a message explaining there is no
   * block.
   */
  inspectUp(this: void): CCResult<CCBlockData, string>,

  /**
   * Get information about the block in below the turtle.
   *
   * @returns The information. On failure, a message explaining there is no
   * block.
   */
  inspectDown(this: void): CCResult<CCBlockData, string>,

  /**
   * Get detailed information about the items in the given slot.
   *
   * @param slot The slot to get information about. Defaults to the selected
   * slot.
   * @param detailed Whether to include "detailed" information. When true the
   * method will contain much more information about the item at the cost of
   * taking longer to run.
   * @returns Information about the given slot, or `nil` if the slot is empty.
   * @throws If the slot is out of range.
   */
  getItemDetail(this: void, slot?: number, detailed?: false): CCItemData | undefined,

  /**
   * Get detailed information about the items in the given slot.
   *
   * @param slot The slot to get information about. Defaults to the selected
   * slot.
   * @param detailed Whether to include "detailed" information. When true the
   * method will contain much more information about the item at the cost of
   * taking longer to run.
   * @returns Information about the given slot, or `nil` if the slot is empty.
   * @throws If the slot is out of range.
   */
  getItemDetail(this: void, slot: number, detailed: true): CCDetailedItemData | undefined,

  /**
   * Craft a recipe based on the turtle's inventory.
   *
   * The turtle's inventory should set up like a crafting grid. For instance, to
   * craft sticks, slots 1 and 5 should contain planks. All other slots should
   * be empty, including those outside the crafting "grid".
   *
   * @param limit The maximum number of crafting steps to run. Defaults to 64.
   * @returns `true` if crafting succeeds. On failure, a string describing why
   * crafting failed.
   * @throws When limit is less than 1 or greater than 64.
   */
  craft(this: void, limit?: number): CCResult<void, string>,
}

/**
 * The global turtle API. Only available on turtles.
 *
 * See https://tweaked.cc/module/turtle.html for more details.
 */
declare const turtle: TurtleAPI | undefined;

/** @noSelf */
declare namespace parallel {
  /**
   * Switches between execution of the functions, until any of them finishes. If
   * any of the functions errors, the message is propagated upwards from the
   * `parallel.waitForAny` call.
   *
   * @param fns The functions this task will run.
   */
  export function waitForAny(...fns: Array<() => void>): void;

  /**
   * Switches between execution of the functions, until all of them are
   * finished. If any of the functions errors, the message is propagated upwards
   * from the `parallel.waitForAll` call.
   *
   * @param fns The functions this task will run.
   */
  export function waitForAll(...fns: Array<() => void>): void;
}

/** @noSelf */
declare namespace colors {
  /**
   * #F0F0F0
   */
  export const white: number;

  /**
   * #F2B233
   */
  export const orange: number;

  /**
   * #E57FD8
   */
  export const magenta: number;

  /**
   * #99B2F2
   */
  export const lightBlue: number;

  /**
   * #DEDE6C
   */
  export const yellow: number;

  /**
   * #7FCC19
   */
  export const lime: number;

  /**
   * #F2B2CC
   */
  export const pink: number;

  /**
   * #4C4C4C
   */
  export const gray: number;

  /**
   * #999999
   */
  export const lightGray: number;

  /**
   * #4C99B2
   */
  export const cyan: number;

  /**
   * #B266E5
   */
  export const purple: number;

  /**
   * #3366CC
   */
  export const blue: number;

  /**
   * #7F664C
   */
  export const brown: number;

  /**
   * #57A64E
   */
  export const green: number;

  /**
   * #CC4C4C
   */
  export const red: number;

  /**
   * #111111
   */
  export const black: number;
}

/**
 * A redirect object; root for screen drawing operations.
 *
 * https://tweaked.cc/module/term.html#ty:Redirect
 */
type Redirect = {
  /**
   * Write `text` at the current cursor position, moving the cursor to the end
   * of the text.
   *
   * Unlike functions like `write` and `print`, this does not wrap the text - it
   * simply copies the text to the current terminal line.
   *
   * @param text The text to write.
   */
  write(this: void, text: string): void;

  /**
   * Move all positions up (or down) by `y` pixels.
   *
   * Every pixel in the terminal will be replaced by the line `y` pixels below
   * it. If `y` is negative, it will copy pixels from above instead.
   *
   * @param y The number of lines to move up by. This may be a negative number.
   */
  scroll(this: void, y: number): void;

  /**
   * Get the position of the cursor.
   *
   * @returns The X position of the cursor, and the Y position of the cursor.
   */
  getCursorPos(this: void): LuaMultiReturn<[number, number]>

  /**
   * Set the position of the cursor. Terminal writes will begin from this
   * position.
   *
   * @param x The new x position of the cursor.
   * @param y The new y position of the cursor.
   */
  setCursorPos(this: void, x: number, y: number): void;

  /**
   * Checks if the cursor is currently blinking.
   *
   * @returns `true` if the cursor is blinking.
   */
  getCursorBlink(this: void): boolean;

  /**
   * Sets whether the cursor should be visible (and blinking) at the current
   * cursor position.
   *
   * @param blink Whether the cursor should blink.
   */
  setCursorBlink(this: void, blink: boolean): void;

  /**
   * Get the size of the terminal.
   *
   * @returns The terminal's width, and the terminal's height.
   */
  getSize(this: void): LuaMultiReturn<[number, number]>;

  /**
   * Clears the terminal, filling it with the current background color.
   */
  clear(this: void): void;

  /**
   * Clears the line the cursor is currently on, filling it with the current
   * background color.
   */
  clearLine(this: void): void;

  /**
   * Return the color that new text will be written as.
   *
   * @returns The current text color.
   */
  getTextColor(this: void): number;

  /**
   * Set the color that new text will be written as.
   *
   * @param color The new text color.
   */
  setTextColor(this: void, color: number): void;

  /**
   * Return the current background color. This is used when writing text and
   * clearing the terminal.
   *
   * @returns The current background color.
   */
  getBackgroundColor(this: void): number;

  /**
   * Set the current background color. This is used when writing text and
   * clearing the terminal.
   *
   * @param color The new background color.
   */
  setBackgroundColor(this: void, color: number): void;

  /**
   * Determine if this terminal supports color.
   *
   * Terminals which do not support color will still allow writing colored
   * text/backgrounds, but it will be displayed in greyscale.
   */
  isColor(this: void): boolean;

  /**
   * Writes text to the terminal with the specific foreground and background
   * colors.
   *
   * As with `write`, the text will be written at the current cursor location,
   * with the cursor moving to the end of the text.
   *
   * `textColor` and `backgroundColor` must both be strings the same length as
   * `text`. All characters represent a single hexadecimal digit, which is
   * converted to one of CC's colors. For instance, "a" corresponds to purple.
   *
   * @param text The text to write.
   * @param textColor The corresponding text colors.
   * @param backgroundColor The corresponding background colors.
   * @throws If the three inputs are not the same length.
   */
  blit(this: void, text: string, textColor: string, backgroundColor: string): void;

  /**
   * Set the palette for a specific color.
   *
   * ComputerCraft's palette system allows you to change how a specific color
   * should be displayed. For instance, you can make `colors.red` more red by
   * setting its palette to `#FF0000`. This does now allow you to draw more
   * colors - you are still limited to 16 on the screen at one time - but you
   * can change which colors are used.
   *
   * @param index The color whose palette should be changed.
   * @param color A 24-bit integer representing the RGB value of the color. For
   * instance, `0xFF0000` corresponds to red.
   */
  setPaletteColor(this: void, index: number, color: number): void;

  /**
   * Set the palette for a specific color.
   *
   * ComputerCraft's palette system allows you to change how a specific color
   * should be displayed. For instance, you can make `colors.red` more red by
   * setting its palette to `#FF0000`. This does now allow you to draw more
   * colors - you are still limited to 16 on the screen at one time - but you
   * can change which colors are used.
   *
   * @param index The color whose palette should be changed.
   * @param r The intensity of the red channel, between 0 and 1.
   * @param g The intensity of the green channel, between 0 and 1.
   * @param b The intensity of the blue channel, between 0 and 1.
   */
  setPaletteColor(this: void, index: number, r: number, g: number, b: number): void;

  /**
   * Get the current palette for a specific color.
   *
   * @param index The color whose palette should be fetched.
   * @returns The red, green, and blue channels for the color, in [0.0, 1.0].
   */
  getPaletteColor(this: void, index: number): LuaMultiReturn<[number, number, number]>;
}

/**
 * The local terminal.
 */
declare const term: Redirect;

type HTTPResponse = {}

type HTTPWebsocket = {}

/**
 * Every multi-return event that can be generated by `os.pullEvent`.
 */
type CCSystemEvent =
  ["alarm", number] |
  ["char", string] |
  ["computer_command", ...Array<string>] |
  ["disk", string] |
  ["disk_eject", string] |
  ["http_check", string, boolean, string] |
  ["http_failure", string, string, HTTPResponse | undefined] |
  ["http_success", string, HTTPResponse] |
  ["key", number, boolean] |
  ["key_up", number] |
  ["modem_message", string, number, number, unknown, number] |
  ["monitor_resize", string] |
  ["monitor_touch", string, number, number] |
  ["mouse_click", number, number, number] |
  ["mouse_drag", number, number, number] |
  ["mouse_scroll", number, number, number] |
  ["mouse_up", number, number, number] |
  ["paste", string] |
  ["peripheral", string] |
  ["peripheral_detach", string] |
  ["rednet_message", number, unknown, unknown] |
  ["redstone"] |
  ["speaker_audio_empty", string] |
  ["task_complete", number, ...([true] | [false, string]), ...Array<unknown>] |
  ["term_resize"] |
  ["timer", number] |
  ["turtle_inventory"] |
  ["websocket_closed", string] |
  ["websocket_failure", string, string] |
  ["websocket_message", string, string, boolean] |
  ["websocket_success", string, HTTPWebsocket];

/** @noSelf */
declare namespace os {
  /**
   * Pause execution of the current thread and waits for any events matching
   * `filter`.
   *
   * This function yields the current process and waits for it to be resumed
   * with a vararg list where the first element matches `filter`. If no `filter`
   * is supplied, this will match all events.
   *
   * Unlike `os.pullEventRaw`, it will stop the application upon a "terminate"
   * event, printing the error "terminated".
   *
   * @param filter Event to filter for.
   * @returns The name of the event, followed by its parameters.
   */
  export function pullEvent(filter?: void): LuaMultiReturn<CCSystemEvent>;

  /**
   * Pause execution of the current thread and waits for any events matching
   * `filter`.
   *
   * This function yields the current process and waits for it to be resumed
   * with a vararg list where the first element matches `filter`. If no `filter`
   * is supplied, this will match all events.
   *
   * Unlike `os.pullEventRaw`, it will stop the application upon a "terminate"
   * event, printing the error "terminated".
   *
   * @param filter Event to filter for.
   * @returns The name of the event, followed by its parameters.
   */
  export function pullEvent<K extends string>(filter: K): LuaMultiReturn<CCSystemEvent & [K]>;

  /**
   * Pause execution of the current thread and waits for events, including the
   * `terminate` event.
   *
   * This behaves almost the same as `os.pullEvent`, except it allows you to
   * handle the `terminate` event yourself - the program will not stop execution
   * when `Ctrl+T` is pressed.
   *
   * **`terminate` will be emitted regardless of whether a filter is set.**
   *
   * @param filter Event to filter for.
   * @returns The name of the event, followed by its parameters.
   */
  export function pullEventRaw(filter?: void): LuaMultiReturn<CCSystemEvent | ["terminate"]>;

  /**
   * Pause execution of the current thread and waits for events, including the
   * `terminate` event.
   *
   * This behaves almost the same as `os.pullEvent`, except it allows you to
   * handle the `terminate` event yourself - the program will not stop execution
   * when `Ctrl+T` is pressed.
   *
   * **`terminate` will be emitted regardless of whether a filter is set.**
   *
   * @param filter Event to filter for.
   * @returns The name of the event, followed by its parameters.
   */
  export function pullEvent<K extends string>(filter: K): LuaMultiReturn<(CCSystemEvent & [K]) | ["terminate"]>;

  /**
   * Pauses execution for the specified number of seconds, alias of `_G.sleep`.
   *
   * @param time The number of seconds to sleep for, rounded up to the nearest
   * multiple of 0.05.
   */
  export function sleep(time: number): void;

  /**
   * Get the current CraftOS version (for example, `CraftOS 1.8`).
   *
   * This is defined by `bios.lua`. For the current version of CC:Tweaked, this
   * should return `CraftOS 1.8`.
   *
   * @returns The current CraftOS version.
   */
  export function version(): string;

  /**
   * Run the program at the given path with the specified environment and
   * arguments.
   *
   * This function does not resolve program names like the shell does. This
   * means that, for example, `os.run("edit")` will not work. As well as this,
   * it does not provide access to the `shell` API in the environment. For this
   * behaviour, use `shell.run` instead.
   *
   * If the program cannot be found, or failed to run, it will print the error
   * and return `false`. If you want to handle this more gracefully, use an
   * alternative such as `loadfile`.
   *
   * @param env The environment to run the program with.
   * @param path The exact path of the program to run.
   * @param args The arguments to pass to the program.
   */
  export function run(env: object, path: string, ...args: Array<unknown>): boolean;

  /**
   * Adds an event to the event queue. This event can later be pulled with
   * `os.pullEvent`.
   *
   * @param name The name of the event to queue.
   * @param params The parameters of the event.
   */
  export function queueEvent(name: string, ...params: Array<unknown>): void;

  /**
   * Starts a timer that will run for the specified number of seconds. Once the
   * timer fires, a `timer` event will be added to the queue with the ID
   * returned from this function as the first parameter.
   *
   * As with `sleep`, `timer` will automatically be rounded up to the nearest
   * multiple of 0.05 seconds, as it waits for a fixed amount of world ticks.
   *
   * @param timer The number of seconds until the timer fires.
   * @returns The ID of the new timer. This can be used to filter the `timer`
   * event, or cancel the timer.
   */
  export function startTimer(timer: number): number;

  /**
   * Cancels a timer previously started with startTimer. This will stop the
   * timer from firing.
   *
   * @param token The ID of the timer to cancel.
   */
  export function cancelTimer(token: number): void;

  /**
   * Sets an alarm that will fire at the specified in-game time. When it fires,
   * an alarm event will be added to the event queue with the ID returned from
   * this function as the first parameter.
   *
   * @param time The time at which to fire the alarm, in the range [0.0, 24.0).
   * @returns The ID of the new alarm. This can be used to filter the `alarm`
   * event, or cancel the alarm.
   * @throws If the time is out of range.
   */
  export function setAlarm(time: number): number;

  /**
   * Cancels an alarm previously started with setAlarm. This will stop the alarm
   * from firing.
   *
   * @param token The ID of the alarm to cancel.
   */
  export function cancelAlarm(token: number): void;

  /**
   * Shuts down the computer immediately.
   */
  export function shutdown(): void;

  /**
   * Reboots the computer immediately.
   */
  export function reboot(): void;

  /**
   * Returns the ID of the computer.
   *
   * @returns The ID of the computer.
   */
  export function getComputerID(): number;

  /**
   * Returns the label of the computer, or `nil` if none is set.
   *
   * @returns The label of the computer.
   */
  export function getComputerLabel(): string;

  /**
   * Set the label of this computer.
   *
   * @param label The new label. May be `nil` in order to clear it.
   */
  export function setComputerLabel(label?: string): void;

  /**
   * Returns the number of seconds that the computer has been running.
   *
   * @returns The computer's uptime.
   */
  export function clock(): number;

  /**
   * Returns the current time depending on the string passed in. This will
   * always be in the range [0.0, 24.0).
   *
   * - If called with `ingame`, the current world time will be returned. This is
   * the default if nothing is passed.
   * - If called with `utc`, returns the hour of the day in UTC time.
   * - If called with `local`, returns the hour of the day in the timezone the
   * server is located in.
   *
   * @param locale The locale of the time. Defaults to the `ingame` locale if
   * not specified.
   * @returns The hour of the selected locale.
   * @throws If an invalid locale is passed.
   */
  // TODO(scriptis): this also supports `os.date` objects
  export function time(locale?: string): number;

  /**
   * Returns the day depending on the locale specified.
   *
   * - If called with `ingame`, returns the number of days since the world was
   * created. This is the default.
   * - If called with `utc`, returns the number of days since 1 January 1970 in
   * the UTC timezone.
   * - If called with `local`, returns the number of days since 1 January 1970
   * in the server's local timezone.
   *
   * @param locale The locale of the time. Defaults to the `ingame` locale if
   * not specified.
   * @returns The day depending on the selected locale.
   * @throws If an invalid locale is passed.
   */
  // TODO(scriptis): this also supports `os.date` objects
  export function day(locale?: string): number;

  /**
   * Returns the number of milliseconds since an epoch depending on the locale.
   *
   *
   * - If called with `ingame`, returns the number of milliseconds since the
   * world was created. This is the default.
   * - If called with `utc`, returns the number of milliseconds since 1 January
   * 1970 in the UTC timezone.
   * - If called with `local`, returns the number of milliseconds since 1
   * January 1970 in the server's local timezone.
   *
   * @param args The locale to get the milliseconds for. Defaults to `ingame`
   * if not set.
   * @returns The milliseconds since the epoch depending on the selected locale.
   * @throws If an invalid locale is passed.
   */
  export function epoch(args: string): number;

  /**
   * Returns a date string using a specified format string and optional time to
   * format.
   *
   * The format string takes the same formats as C's `strftime` function
   * (http://www.cplusplus.com/reference/ctime/strftime/). In extension, it can
   * be prefixed with an exclamation mark (!) to use UTC time instead of the
   * server's local timezone.
   *
   * @param format The format of the string to return. This defaults to `%c`,
   * which expands to a string similar to "Sat Dec 24 16:58:00 2011".
   * @param time The time to convert to a string. This defaults to the current
   * time.
   * @returns The resulting format string.
   */
  // TODO(scriptis): docs mention a table extension here as well
  export function date(format?: string, time?: number): string;
}
