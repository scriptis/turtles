import { JSXChild } from "./Types";
import { BuildContext } from "./BuildContext";

/**
 * A JSX fragment.
 */
export const Fragment = (props: { children: Array<JSXChild> }, _ctx: BuildContext) => props.children;
