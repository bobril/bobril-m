import * as b from "bobril";
import * as transitions from "./transitions";
import * as c from "./styleConsts";

export interface ITextFieldLabel {
    children?: b.IBobrilChildren;
    disabled?: boolean;
    shrink?: boolean;
    htmlFor?: string;
    color?: string;
}

const rootStyle = b.styleDef([c.userSelectNone, c.positionAbsolute, {
    lineHeight: '22px',
    top: 38,
    transition: transitions.easeOut(),
    zIndex: 1, // Needed to display label above Chrome's autocomplete field background
    cursor: "text",
    transform: 'scale(1) translate3d(0, 0, 0)',
    transformOrigin: 'left top'
}]);

const disabledStyle = b.styleDefEx(rootStyle, {
    cursor: "default"
});

const shrinkStyle = b.styleDefEx(rootStyle, [c.pointerEventsNone, {
    transform: "perspective(1px) scale(0.75) translate3d(2px, -28px, 0)"
}]);

export const TextFieldLabel = (data: ITextFieldLabel) => {
    return b.style({ tag: "label", attrs: { htmlFor: data.htmlFor }, children: data.children }, rootStyle, data.disabled && disabledStyle, data.shrink && shrinkStyle, { color: data.color });
};
