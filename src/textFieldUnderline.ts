import * as b from "bobril";
import * as styles from "./styles";
import * as transitions from "./transitions";
import * as c from "./styleConsts";

export interface ITextFieldUnderline {
    disabled?: boolean;
    error?: boolean;
    focus?: boolean;
}

const rootStyle = b.styleDef([c.positionAbsolute, {
    border: 'none',
    borderBottom: 'solid 1px',
    borderColor: () => styles.borderColor,
    bottom: 8,
    boxSizing: 'content-box',
    margin: 0,
    width: '100%'
}]);

const disabledStyle = b.styleDef({
    borderBottom: 'dotted 2px',
    borderColor: () => styles.disabledColor
});

const focusStyle = b.styleDef({
    borderBottom: 'solid 2px',
    borderColor: () => styles.primary1Color,
    transform: 'scaleX(0)',
    transition: transitions.easeOut()
});

const errorStyle = b.styleDef({
    borderColor: () => styles.errorColor,
    transform: 'scaleX(1)'
});

export const TextFieldUnderline = (data: ITextFieldUnderline) => {
    return [
        b.style({ tag: "hr" }, rootStyle, data.disabled && disabledStyle),
        b.style({ tag: "hr" }, rootStyle, focusStyle, data.focus && { transform: 'scaleX(1)' }, data.error && errorStyle)
    ];
};
