import { Connection, Dict } from "../Utils";
import { BoxExtents, JSXComponent, JSXElement } from "./Types";

/**
 * The alignment of a block of text.
 */
export const enum TextAlign {
  /**
   * The text should be left-aligned to the current extents.
   */
  LEFT,

  /**
   * The text should be center-aligned with the current extents.
   */
  CENTER,

  /**
   * The text should be right-aligned with the current extents.
   */
  RIGHT,
}

/**
 * The wrapping mode of a block of text.
 */
export const enum TextWrap {
  /**
   * The text should break and wrap on word boundaries (whitespace) as needed.
   */
  WORD_BREAK,

  /**
   * The text should break and wrap on word boundaries (whitespace) as needed,
   * but hypenate on large words.
   */
  HYPHENATE,

  /**
   * The text shouldn't wrap at all, and abruptly cut off.
   */
  NO_WRAP,

  /**
   * The text shouldn't wrap at all, and terminate with an ellipsis (...).
   */
  ELLIPSIS = 3,
}

/**
 * A CC-style base-16 color. This is used for `term.blit`.
 */
const BASE_16 = "0123456789abcdef";

/**
 * A single layer in the build context stack.
 */
export type BuildContextLayer = {
  /**
   * The background color currently being painted.
   */
  backgroundColor: number;

  /**
   * The foreground (text) color currently being painted.
   */
  foregroundColor: number;

  /**
   * The left edge of the current layer.
   */
  left: number,

  /**
   * The top edge of the current layer.
   */
  top: number;

  /**
   * The right edge of the current layer.
   */
  right: number;

  /**
   * The bottom edge of the current layer.
   */
  bottom: number;

  /**
   * The alignment of any text being drawn in the current layer.
   */
  textAlign: TextAlign,

  /**
   * The wrapping mode of any text being drawn in the current layer.
   */
  textWrap: TextWrap,
}

/**
 * The default styles used for rendering.
 */
const DEFAULT_LAYER: BuildContextLayer = {
  backgroundColor: colors.black,
  foregroundColor: colors.white,
  left: 1,
  top: 1,
  right: 1,
  bottom: 1,
  textAlign: TextAlign.LEFT,
  textWrap: TextWrap.WORD_BREAK,
}

/**
 * The style of a block of text being written to a screen.
 */
export type TextStyle = {
  /**
   * The alignment of the text.
   */
  alignment: TextAlign,

  /**
   * The wrapping mode of the text.
   */
  wrapMode: TextWrap,
}

/**
 * The frame currently drawn on screen.
 */
enum PresentedFrame {
  /**
   * FrameA.
   */
  A,

  /**
   * FrameB.
   */
  B,
}

export class BuildContext {
  /**
   * All currently mounted elements in the tree, referenced by their individual
   * component instances.
   * @protected
   */
  protected mountedElements = new Dict<JSXComponent, JSXElement>();

  /**
   * All currently active bindings to mounted elements in the tree, listening
   * for state updates.
   * @protected
   */
  protected stateObservers = new Dict<JSXElement, Connection>();

  /**
   * The topological depths of elements in the tree.
   * @protected
   */
  protected computedDepths = new Dict<JSXElement, number>();

  /**
   * A stack of drawing configurations. The topmost element specifies the
   * current draw style.
   *
   * @protected
   */
  protected layers = new Array<BuildContextLayer>();

  /**
   * The default layer of this context.
   * @protected
   */
  protected readonly defaultLayer: BuildContextLayer = {
    ...DEFAULT_LAYER,
  }

  /**
   * Constructs a new `BuildContext` over a given root element, automatically
   * diffing and re-rendering the tree as state changes occur.
   *
   * @param target The redirect to render components to.
   * @param root The root element.
   * @protected
   */
  protected constructor(
    protected readonly target: Redirect,
    protected readonly root: JSXElement,
  ) {}

  /**
   * The top layer of the build context.
   */
  public get layer(): Readonly<BuildContextLayer> {
    return this.layers[this.layers.length] || this.defaultLayer;
  }

  /**
   * A map of cell indices to their expected current styles, in blit notation.
   *
   * Each string is three characters long.
   *
   * The first character is the cell's content, the second character is the
   * cell's background color, and the third character is the cell's foreground
   * color.
   *
   * @protected
   */
  protected currentBuffer = new Dict<number, string>();

  /**
   * A map of cell indices to their expected styles, in blit notation.
   *
   * See `currentBuffer` for more details.
   *
   * @protected
   */
  protected drawBuffer = new Dict<number, string>();

  /**
   * Updates and re-renders a single element in the tree.
   *
   * @param element The element.
   * @protected
   */
  protected update(element: JSXElement) {}

  /**
   * Draws a single cell to the output buffer.
   *
   * @param x The X coordinate of the cell.
   * @param y The Y coordinate of the cell.
   * @param content The character to write to the cell.
   */
  public drawCell(x: number, y: number, content: string) {}

  /**
   * Returns the absolute size, in console cells, of the screen being rendered
   * to.
   *
   * @returns The [width, height] of the screen being rendered to.
   */
  public screenSize(): [number, number] {
    const [w, h] = this.target.getSize();

    return [w, h];
  }

  /**
   * Moves the drawing cursor to the given position.
   *
   * @param x0 The X coordinate to move to.
   * @param y0 The Y coordinate to move to.
   */
  public moveTo(x0: number, y0: number) {}

  /**
   * Draws a box to the screen.
   *
   * @param width The width of the box.
   * @param height The height of the box.
   */
  public drawBox(width: number, height: number) {}

  /**
   * Draws some text to the screen.
   *
   * @param text
   */
  public drawText(text: string) {}

  /**
   * Pushes a new (partial) layer to the draw stack.
   *
   * @param layer The details of the layer.
   */
  public pushLayer(layer: Partial<BuildContextLayer>) {
    this.layers.push({ ...this.layer, ...layer });
  }

  /**
   * Pops a layer from the draw stack.
   */
  public popLayer() {
    this.layers.pop();
  }
}
