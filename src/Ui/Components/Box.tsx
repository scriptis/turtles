import { Component } from "../Component";
import { JSXElement } from "../Types";
import { BuildContext } from "../BuildContext";
import Ui from "../Ui";

export type BoxProps = {
  backgroundColor: number,
}

export class Box extends Component<BoxProps> {
  render(ctx: BuildContext) {
    return undefined;
  }
}

const someTrash = (
  <Box backgroundColor={1}>
    <Box backgroundColor={2} />
    <Box backgroundColor={3} />
  </Box>
)

if (turtle) {
  turtle.forward();
}
