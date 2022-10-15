import { Event } from "../Utils";

/**
 * A mouse button, as used by CC events.
 */
export const enum MouseButton {
  /**
   * The left mouse button.
   */
  LEFT_BUTTON = 1,

  /**
   * The right mouse button.
   */
  RIGHT_BUTTON = 2,

  /**
   * The middle mouse button.
   */
  MIDDLE_BUTTON = 3,
}

/**
 * A scroll direction, as used by CC events.
 */
export const enum ScrollDirection {
  /**
   * Scrolling up.
   */
  UP = -1,

  /**
   * Scrolling down.
   */
  DOWN = 1,
}

/**
 * A single cooperative thread created by `System.spawnThread()`.
 */
export type Thread = {
  /**
   * The human-readable name of the thread.
   */
  name: string,

  /**
   * A human-readable description of the thread's purpose.
   */
  description?: string;

  /**
   * The function used to create the thread.
   */
  fn: () => void;

  /**
   * The active (non-dead) coroutine executing this thread.
   */
  coroutine: LuaThread,
}

/**
 * Wrappers and intuitive bindings to CC's internal systems and events.
 */
export class System {
  /**
   * The `timer` event is fired when an alarm started with `os.setAlarm`
   * completes.
   *
   * - `number`: The ID of the alarm that finished.
   */
  public static readonly alarm = new Event<[number]>()

  /**
   * The `char` event is fired when a character is typed on the keyboard.
   *
   * The `char` event is different from a key press. Sometimes multiple key
   * presses may result in one character being typed (for instance, on some
   * European keyboards). Similarly, some keys (e.g. Ctrl) do not have any
   * corresponding character. The `key` event should be used if you want to
   * listen to key presses themselves.
   *
   * - `string`: The string representing the character that was pressed.
   */
  public static readonly char = new Event<[string]>();

  /**
   * The `computer_command` event is fired when the `/computercraft queue`
   * command is run for the current computer.
   *
   * - `Array<string>`: The arguments passed to the command.
   */
  public static readonly computerCommand = new Event<Array<string>>();

  /**
   * The `disk` event is fired when a disk is inserted into an adjacent or
   * networked disk drive.
   *
   * - `string`: The side of the disk drive that had a disk inserted.
   */
  public static readonly disk = new Event<[string]>();

  /**
   * The `disk_eject` event is fired when a disk is removed from an adjacent or
   * networked disk drive.
   *
   * - `string`: The side of the disk drive that had a disk removed.
   */
  public static readonly diskEject = new Event<[string]>();

  /**
   * The `http_check` event is fired when a URL check finishes.
   *
   * This event is normally handled inside `http.checkURL`, but it can still be
   * seen when using `http.checkURLAsync`.
   *
   * - `string`: The URL requested to be checked.
   * - `boolean`: Whether the check succeeded.
   * - `string?`: If the check failed, a reason explaining why the check failed.
   */
  public static readonly httpCheck = new Event<[string, boolean, string | undefined]>();

  /**
   * The `http_failure` event is fired when an HTTP request fails.
   *
   * This event is normally handled inside `http.get` and `http.post`, but it
   * can still be seen when using http.request.
   *
   * - `string`: The URL of the site requested.
   * - `string`: An error describing the failure.
   * - `HTTPResponse?`: A response handle if the connection succeeded, but the
   * server's response indicated failure.
   */
  public static readonly httpFailure = new Event<[string, string, HTTPResponse | undefined]>();

  /**
   * The http_success event is fired when an HTTP request returns successfully.
   *
   * This event is normally handled inside `http.get` and `http.post`, but it
   * can still be seen when using `http.request`.
   *
   * - `string`: The URL of the site requested.
   * - `HTTPResponse`: The handle for the response text.
   */
  public static readonly httpSuccess = new Event<[string, HTTPResponse]>();

  /**
   * This event is fired when any key is pressed while the terminal is focused.
   *
   * This event returns a numerical "key code" (for instance, `F1` is `290`).
   * This value may vary between versions and so it is recommended to use the
   * constants in the `keys` API rather than hard-coding numeric values.
   *
   * If the button pressed represented a printable character, then the key event
   * will be followed immediately by a `char` event. If you are consuming text
   * input, use a `char` event instead!
   *
   * - `number`: The numerical key value of the key pressed.
   * - `boolean`: Whether the key event was generated while holding the key
   * (`true`), rather than pressing it the first time (`false`).
   */
  public static readonly key = new Event<[number, boolean]>();

  /**
   * Fired whenever a key is released (or the terminal is closed while a key was
   * being pressed).
   *
   * This event returns a numerical "key code" (for instance, `F1` is `290`).
   * This value may vary between versions and so it is recommended to use the
   * constants in the `keys` API rather than hard-coding numeric values.
   *
   * - `number`: The numerical key value of the key pressed.
   */
  public static readonly keyUp = new Event<[number]>();

  /**
   * The `modem_message` event is fired when a message is received on an open
   * channel on any modem.
   *
   * - `string`: The side of the modem that received the message.
   * - `number`: The channel that the message was sent on.
   * - `number`: The reply channel set by the sender.
   * - `unknown`: The message as sent by the sender.
   * - `number`: The distance between the sender and the receiver, in blocks.
   */
  public static readonly modemMessage = new Event<[string, number, number, unknown, number]>();

  /**
   * The `monitor_resize` event is fired when an adjacent or networked monitor's
   * size is changed.
   *
   * - `string`: The side or network ID of the monitor that resized.
   */
  public static readonly monitorResize = new Event<[string]>();

  /**
   * The `monitor_touch` event is fired when an adjacent or networked Advanced
   * Monitor is right-clicked.
   *
   * - `string`: The side or network ID of the monitor that was touched.
   * - `number`: The X coordinate of the touch, in characters.
   * - `number`: The Y coordinate of the touch, in characters.
   */
  public static readonly monitorTouch = new Event<[string, number, number]>();

  /**
   * This event is fired when the terminal is clicked with a mouse. This event
   * is only fired on advanced computers (including advanced turtles and pocket
   * computers).
   *
   * - `MouseButton`: The mouse button that was clicked.
   * - `number`: The X-coordinate of the click.
   * - `number`: The Y-coordinate of the click.
   */
  public static readonly mouseClick = new Event<[MouseButton, number, number]>();

  /**
   * This event is fired every time the mouse is moved while a mouse button is
   * being held.
   *
   * - `MouseButton`: The mouse button that was clicked.
   * - `number`: The X-coordinate of the mouse.
   * - `number`: The Y-coordinate of the mouse.
   */
  public static readonly mouseDrag = new Event<[MouseButton, number, number]>();

  /**
   * This event is fired when a mouse wheel is scrolled in the terminal.
   *
   * - `ScrollDirection`: The direction of the scroll. (-1 = up, 1 = down).
   * - `number`: The X-coordinate of the mouse when scrolling.
   * - `number`: The Y-coordinate of the mouse when scrolling.
   */
  public static readonly mouseScroll = new Event<[ScrollDirection, number, number]>();

  /**
   * This event is fired when a mouse button is released or a held mouse leaves
   * the computer's terminal.
   *
   * - `MouseButton`: The mouse button that was released.
   * - `number`: The X-coordinate of the mouse.
   * - `number`: The Y-coordinate of the mouse.
   */
  public static readonly mouseUp = new Event<[MouseButton, number, number]>();

  /**
   * The `paste` event is fired when text is pasted into the computer through
   * Ctrl-V (or ⌘V on Mac).
   *
   * - `string`: The pasted text.
   */
  public static readonly paste = new Event<[string]>();

  /**
   * The `peripheral` event is fired when a peripheral is attached on a side or
   * to a modem.
   *
   * - `string`: The side the peripheral was attached to.
   */
  public static readonly peripheral = new Event<[string]>();

  /**
   * The `peripheral_detach` event is fired when a peripheral is detached from a
   * side or from a modem.
   *
   * - `string`: The side the peripheral was detached from.
   */
  public static readonly peripheralDetach = new Event<[string]>();

  /**
   * The `rednet_message` event is fired when a message is sent over Rednet.
   *
   * This event is usually handled by `rednet.receive`, but it can also be
   * pulled manually.
   *
   * `rednet_message` events are sent by `rednet.run` in the top-level coroutine
   * in response to `modem_message` events. A `rednet_message` event is always
   * preceded by a `modem_message` event. They are generated inside CraftOS
   * rather than being sent by the ComputerCraft machine.
   */
  public static readonly redNetMessage = new Event<[number, unknown, unknown]>();

  /**
   * The `redstone` event is fired whenever any redstone inputs on the computer
   * change.
   */
  public static readonly redstone = new Event();

  /**
   * Invoked when a speaker can play more audio.
   *
   * - `string`: The name of the speaker which is available to play more audio.
   */
  public static readonly speakerAudioEmpty = new Event<[string]>();

  /**
   * The `task_complete` event is fired when an asynchronous task completes.
   * This is usually handled inside the function call that queued the task;
   * however, functions such as `commands.execAsync` return immediately so the
   * user can wait for completion.
   *
   * - `number`: The ID of the task that completed.
   * - `boolean`: Whether the command succeeded.
   * - `string?`: If the command failed, an error message explaining the
   * failure.
   * - `...`: Any parameters returned from the command.
   */
  public static readonly taskComplete = new Event<[number, ...([true] | [false, string]), ...Array<unknown>]>();

  /**
   * The `term_resize` event is fired when the main terminal is resized. For
   * instance:
   *
   * - When the tab bar is shown or hidden in multi-shell.
   * - When the terminal is redirected to a monitor via the "monitor" program
   * and the monitor is resized.
   *
   * When this event fires, some parts of the terminal may have been moved or
   * deleted. Simple terminal programs (those not using `term.setCursorPos`) can
   * ignore this event, but more complex GUI programs should redraw the entire
   * screen.
   */
  public static readonly termResize = new Event();

  /**
   * The `terminate` event is fired when `Ctrl-T` is held down.
   *
   * This event is normally handled by `os.pullEvent`, and will not be returned.
   * However, `os.pullEventRaw` will return this event when fired.
   *
   * `terminate` will be sent even when a filter is provided to
   * `os.pullEventRaw`. When using `os.pullEventRaw` with a filter, make sure to
   * check that the event is not terminate.
   */
  public static readonly terminate = new Event();

  /**
   * The timer event is fired when a timer started with `os.startTimer`
   * completes.
   *
   * - `number`: The ID of the timer that finished.
   */
  public static readonly timer = new Event<[number]>()

  /**
   * The `turtle_inventory` event is fired when a turtle's inventory is changed.
   */
  public static readonly turtleInventory = new Event();

  /**
   * The `websocket_closed` event is fired when an open WebSocket connection is
   * closed.
   *
   * - `string`: The URL of the WebSocket that was closed.
   */
  public static readonly websocketClosed = new Event<[string]>();

  /**
   * The `websocket_failure` event is fired when a WebSocket connection request
   * fails.
   *
   * This event is normally handled inside `http.websocket`, but it can still be
   * seen when using `http.websocketAsync`.
   *
   * - `string`: The URL of the site requested.
   * - `string`: An error describing the failure.
   */
  public static readonly websocketFailure = new Event<[string, string]>();

  /**
   * The `websocket_message` event is fired when a message is received on an
   * open WebSocket connection.
   *
   * This event is normally handled by `http.Websocket.receive`, but it can also
   * be pulled manually.
   *
   * - `string`: The URL of the WebSocket.
   * - `string`: The contents of the message.
   * - `boolean`: Whether this is a binary message.
   */
  public static readonly websocketMessage = new Event<[string, string, boolean]>();

  /**
   * The `websocket_success` event is fired when a WebSocket connection request
   * returns successfully.
   *
   * This event is normally handled inside `http.websocket`, but it can still be
   * seen when using `http.websocketAsync`.
   *
   * - `string`: The URL of the site.
   * - `HTTPWebsocket`: The handle for the WebSocket.
   */
  public static readonly websocketSuccess = new Event<[string, HTTPWebsocket]>();

  /**
   * Nonstandard events are routed through `unknown`.
   */
  public static readonly unknown = new Event<Array<unknown>>();

  /**
   * The set of all running threads.
   */
  public static readonly threads = new Set<Thread>();

  /**
   * Spawns the provided callback in a new thread. The callback _must_
   * self-terminate when `System.terminate` is invoked.
   *
   * @param params The spawned thread parameters.
   */
  public static spawnThread(params: {
    /**
     * A human-readable name for the thread.
     */
    name: string,

    /**
     * A human-readable description for the thread.
     */
    description?: string,

    /**
     * The function running inside the thread.
     */
    fn: () => void
  }) {
    const { name, description, fn } = params;

    coroutine.resume(coroutine.create(() => {
      const thread: Thread = {
        name,
        description,
        fn,
        coroutine: coroutine.running()!,
      }

      this.threads.add(thread);

      pcall(() => fn());

      this.threads.delete(thread);
    }));
  }
}

System.spawnThread({
  name: "Input Manager",
  description: "Consumes and provides user and peripheral input.",
  fn: () => {
    let shouldPoll = true;

    while (shouldPoll) {
      const event = os.pullEventRaw();

      switch (event[0]) {
        case "terminate":
          System.terminate.fire();
          shouldPoll = false;
          break;

        case "alarm":
          System.alarm.fire(event[1]);
          break;

        case "char":
          System.char.fire(event[1]);
          break;

        case "computer_command":
          System.computerCommand.fire(...event.splice(1));
          break;

        case "disk":
          System.disk.fire(event[1]);
          break;

        case "disk_eject":
          System.diskEject.fire(event[1]);
          break;

        case "http_check":
          System.httpCheck.fire(event[1], event[2], event[3]);
          break;

        case "http_failure":
          System.httpFailure.fire(event[1], event[2], event[3]);
          break;

        case "http_success":
          System.httpSuccess.fire(event[1], event[2]);
          break;

        case "key":
          System.key.fire(event[1], event[2]);
          break;

        case "key_up":
          System.keyUp.fire(event[1]);
          break;

        case "modem_message":
          System.modemMessage.fire(event[1], event[2], event[3], event[4], event[5]);
          break;

        case "monitor_resize":
          System.monitorResize.fire(event[1]);
          break;

        case "mouse_click":
          System.mouseClick.fire(event[1], event[2], event[3]);
          break;

        case "mouse_drag":
          System.mouseDrag.fire(event[1], event[2], event[3]);
          break;

        case "mouse_scroll":
          System.mouseScroll.fire(event[1], event[2], event[3]);
          break;

        case "paste":
          System.paste.fire(event[1]);
          break;

        case "peripheral":
          System.peripheral.fire(event[1]);
          break;

        case "peripheral_detach":
          System.peripheralDetach.fire(event[1]);
          break;

        case "rednet_message":
          System.redNetMessage.fire(event[1], event[2], event[3]);
          break;

        case "redstone":
          System.redstone.fire();
          break;

        case "mouse_up":
          System.mouseUp.fire(event[1], event[2], event[3]);
          break;

        case "task_complete":
          const [ _, taskId, success ] = event;

          if (success) {
            System.taskComplete.fire(taskId, success, ...event.splice(3));
          } else {
            System.taskComplete.fire(taskId, success, event[3], ...event.splice(4));
          }
          break;

        case "term_resize":
          System.termResize.fire();
          break;

        case "turtle_inventory":
          System.turtleInventory.fire();
          break;

        case "websocket_closed":
          System.websocketClosed.fire(event[1]);
          break;

        case "websocket_message":
          System.websocketMessage.fire(event[1], event[2], event[3]);
          break;

        case "websocket_failure":
          System.websocketFailure.fire(event[1], event[2]);
          break;
      }
    }
  }
});
