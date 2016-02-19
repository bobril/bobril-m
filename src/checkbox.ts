import * as b from "bobril";
import * as paper from "./paper";
import * as ripple from "./ripple";
import * as styles from "./styles";
import * as colors from "./colors";
import * as transitions from "./transitions";
import * as icons from "bobril-m-icons";
import * as c from "./styleConsts";

export type CheckBoxLikeIcons = {
    off(data: { color: string }): b.IBobrilNode;
    on(data: { color: string }): b.IBobrilNode;
    indeterminate?(data: { color: string }): b.IBobrilNode;
};

export interface ICheckboxData {
    children?: b.IBobrilChildren;
    checked?: boolean;
    /// Third checkbox state
    indeterminate?: boolean;
    disabled?: boolean;
    action?: () => void;
    tabindex?: number;
    icons?: CheckBoxLikeIcons;
}

interface ICheckboxCtx extends b.IBobrilCtx {
    data: ICheckboxData;
    pointerDown: () => void;
    focusFromKeyboard: boolean;
    down: boolean;
    switched: boolean;
    rippleStart: number;
    rippleReq: boolean;
}

let checkBoxIcons: CheckBoxLikeIcons = {
    off: icons.toggleCheckBoxOutlineBlank,
    on: icons.toggleCheckBox,
    indeterminate: icons.toggleIndeterminateCheckBox
};

let radioButtonIcons: CheckBoxLikeIcons = {
    off: icons.toggleRadioButtonUnchecked,
    on: icons.toggleRadioButtonChecked
};

let enabledStyle = b.styleDef({
    cursor: "pointer"
}, { focus: { outline: "none" } });

let disabledStyle = b.styleDef({
    cursor: "default"
});

let rootSwitchStyle = b.styleDef([c.userSelectNone, c.positionRelative, {
    display: "inline-block",
    width: 24,
    height: 24
}]);

let labelStyle = b.styleDef({
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 500
});

let checkStyle = b.styleDef([c.positionAbsolute, {
    opacity: 0,
    transform: 'scale(0)',
    transformOrigin: '50% 50%',
    transition: transitions.easeOut('450ms', 'opacity') + ', ' + transitions.easeOut('0ms', 'transform', '450ms'),
    fill: styles.primary1Color
}]);

let boxStyle = b.styleDef([c.positionAbsolute, {
    fill: styles.checkboxOffColor,
    transition: transitions.easeOut('2s', null, '200ms')
}]);

let checkWhenSwitchedStyle = b.styleDef([c.positionAbsolute, {
    opacity: 1,
    transform: 'scale(1)',
    transformOrigin: '50% 50%',
    transition: transitions.easeOut('0ms', 'opacity') + ', ' + transitions.easeOut('800ms', 'transform'),
    fill: styles.primary1Color
}]);

let boxWhenSwitchedStyle = b.styleDef([c.positionAbsolute, {
    transition: transitions.easeOut('100ms'),
    fill: styles.primary1Color
}]);

let rippleStyle = b.styleDef([c.positionAbsolute, c.pointerEventsNone, {
    borderRadius: "50%"
}]);

let focusFromKeyStyle = b.styleDef([c.positionAbsolute, c.pointerEventsNone, {
    borderRadius: 0
}]);

let hiddenStyle = b.styleDef({
    display: "none"
});

let checkDisabled = b.styleDef([c.positionAbsolute, {
    fill: styles.disabledColor
}]);

export const Checkbox = b.createComponent<ICheckboxData>({
    init(ctx: ICheckboxCtx) {
        ctx.focusFromKeyboard = false;
        ctx.down = false;
        ctx.rippleStart = 0;
        ctx.rippleReq = false;
    },
    render(ctx: ICheckboxCtx, me: b.IBobrilNode) {
        let d = ctx.data;
        let ics = d.icons || checkBoxIcons;
        let disabled = d.disabled;
        let checked = d.checked;
        let indeterminate = d.indeterminate;
        if (indeterminate === true) checked = false;
        let focusFromKeyboard = ctx.focusFromKeyboard;
        let rippleReq = focusFromKeyboard || ctx.down;
        let time = b.now();
        let rr = 0;
        let ro = 0;
        if (rippleReq && !ctx.rippleReq) {
            ctx.rippleStart = time;
        }
        ctx.rippleReq = rippleReq;
        let showFocus = false;
        if (ctx.rippleStart !== 0) {
            let t = (time - ctx.rippleStart) * 0.005;
            if (t > (focusFromKeyboard ? 1.5 : 2)) {
                if (focusFromKeyboard) showFocus = true;
                if (!rippleReq) ctx.rippleStart = 0;
            } else {
                if (t < 1) {
                    ro = 0.4;
                    rr = 24 * t;
                } else {
                    if (focusFromKeyboard) {
                        rr = 24 - 12 * (t - 1);
                        ro = 0.3 + 0.1 * (2 - t);
                    } else {
                        rr = 24;
                        ro = 0.4 * (2 - t);
                    }
                }
                b.invalidate(ctx);
            }
        } else {
            if (focusFromKeyboard) showFocus = true;
        }
        if (showFocus) {
            rr = 12;
            ro = 0.2;
        }
        b.style(me, disabled ? disabledStyle : enabledStyle);
        b.style(me, rootSwitchStyle);
        me.children = [
            rr != 0 && b.withKey(b.styledDiv("", showFocus ? focusFromKeyStyle : rippleStyle, { left: 12 - rr, top: 12 - rr, width: 2 * rr, height: 2 * rr, opacity: ro, background: checked ? styles.primary1Color : styles.checkboxOffColor }), "r"),
            b.styledDiv(ics.off({ color: "inherit" }), disabled ? ((checked || indeterminate) ? hiddenStyle : checkDisabled) : (checked ? boxWhenSwitchedStyle : boxStyle)),
            indeterminate != null && b.withKey(b.styledDiv(ics.indeterminate({ color: "inherit" }), disabled ? (indeterminate ? checkDisabled : hiddenStyle) : (indeterminate ? checkWhenSwitchedStyle : checkStyle)), "i"),
            b.styledDiv(ics.on({ color: "inherit" }), disabled ? (checked ? checkDisabled : hiddenStyle) : (checked ? checkWhenSwitchedStyle : checkStyle))
        ];
        me.attrs = { role: "checkbox", "aria-checked": indeterminate ? "mixed" : checked ? "true" : "false", "aria-disabled": disabled ? "true" : "false", tabindex: disabled ? undefined : (d.tabindex || 0) };
    },
    onPointerDown(ctx: ICheckboxCtx): boolean {
        if (ctx.data.disabled) return;
        ctx.focusFromKeyboard = false;
        if (b.pointersDownCount() === 1) {
            ctx.down = true;
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
        }
        b.invalidate(ctx);
    },
    onPointerUp(ctx: ICheckboxCtx): boolean {
        ctx.down = false;
        b.releaseMouseOwner();
        if (b.pointersDownCount() === 0 && !ctx.data.disabled) {
            let a = ctx.data.action;
            if (a) a();
        }
        b.invalidate(ctx);
        return true;
    },
    onKeyDown(ctx: ICheckboxCtx, ev: b.IKeyDownUpEvent): boolean {
        if (ev.which === 32 && !ctx.data.disabled && ctx.focusFromKeyboard) {
            ctx.down = true;
            b.invalidate(ctx);
            return true;
        }
        if (ev.which === 13 && !ctx.data.disabled && ctx.focusFromKeyboard) {
            let a = ctx.data.action;
            if (a) a();
            return true;
        }
        return false;
    },
    onKeyUp(ctx: ICheckboxCtx, ev: b.IKeyDownUpEvent): boolean {
        if (ev.which === 32 && !ctx.data.disabled && ctx.focusFromKeyboard) {
            ctx.down = false;
            b.invalidate(ctx);
            let a = ctx.data.action;
            if (a) a();
            return true;
        }
        return false;
    },
    onFocus(ctx: ICheckboxCtx) {
        if (!ctx.down) {
            ctx.focusFromKeyboard = true;
            b.invalidate(ctx);
        }
    },
    onBlur(ctx: ICheckboxCtx) {
        ctx.focusFromKeyboard = false;
        b.invalidate(ctx);
    }
});

export const RadioButton = (data: ICheckboxData, children?: b.IBobrilChildren) => {
    data.icons = radioButtonIcons;
    return Checkbox(data, children);
};
