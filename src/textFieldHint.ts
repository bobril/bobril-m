import * as b from "bobril";
import * as styles from "./styles";
import * as transitions from "./transitions";
import * as c from "./styleConsts";

export interface ITextFieldHint {
    children?: b.IBobrilChildren;
    show?: boolean;
}

const rootStyle = b.styleDef([c.positionAbsolute, {
    color: styles.disabledColor,
    transition: transitions.easeOut(),
    opacity: 0,
    bottom: 12
}]);

const showStyle = b.styleDefEx(rootStyle, {
    opacity: 1
});

export const TextFieldHint = (data: ITextFieldHint) => {
    return b.styledDiv(data.children, rootStyle, data.show !== false && showStyle);
};
