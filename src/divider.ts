import * as b from "bobril";
import * as styles from "./styles";

export interface IDividerData {
    inset?: boolean;
}

export let dividerStyle = b.styleDef({
    backgroundColor: () => styles.borderColor,
    marginTop: -1,
    height: 1
});

export let dividerInsetStyle = b.styleDef({
    marginLeft: 72
});

export const Divider = (data?: IDividerData) => b.style({ tag: "div" }, dividerStyle, data && data.inset && dividerInsetStyle);
