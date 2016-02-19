import * as b from "bobril";
import * as paper from "./paper";
import * as ripple from "./ripple";
import * as styles from "./styles";
import * as colors from "./colors";
import * as transitions from "./transitions";
import * as icons from "bobril-m-icons";

export interface ICheckboxData {
    children?: b.IBobrilChildren;
    checked?: boolean;
    disabled?: boolean;
    action?: () => void;
    tabindex?: number;
}

interface ICheckboxCtx extends b.IBobrilCtx {
    data: ICheckboxData;
    pointerDown: () => void;
    focusFromKeyboard: boolean;
    down: boolean;
    hover: boolean;
    switched: boolean;
    rippleStart: number;
    rippleReq: boolean;
}

let enabledStyle = b.styleDef({
    cursor: "pointer"
}, { focus: { outline: "none" } });

let disabledStyle = b.styleDef({
    cursor: "default"
});

let rootSwitchStyle = b.styleDef({
    userSelect: "none",
    display: "inline-block",
    position: 'relative',
    width: 24,
    height: 24,
    overflow: ""
});

let labelStyle = b.styleDef({
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 500
});

let checkStyle = b.styleDef({
    position: 'absolute',
    opacity: 0,
    transform: 'scale(0)',
    transformOrigin: '50% 50%',
    transition: transitions.easeOut('450ms', 'opacity', '0ms') + ', ' + transitions.easeOut('0ms', 'transform', '450ms'),
    fill: styles.primary1Color
});

let boxStyle = b.styleDef({
    position: 'absolute',
    fill: styles.checkboxOffColor,
    transition: transitions.easeOut('2s', null, '200ms')
});

let checkWhenSwitchedStyle = b.styleDef({
    position: 'absolute',
    opacity: 1,
    transform: 'scale(1)',
    transformOrigin: '50% 50%',
    transition: transitions.easeOut('0ms', 'opacity', '0ms') + ', ' + transitions.easeOut('800ms', 'transform', '0ms'),
    fill: styles.primary1Color
});

let boxWhenSwitchedStyle = b.styleDef({
    position: 'absolute',
    transition: transitions.easeOut('100ms', null, '0ms'),
    fill: styles.primary1Color
});

let rippleStyle = b.styleDef({
    pointerEvents: "none",
    position: 'absolute',
    borderRadius: "50%"
});

let focusFromKeyStyle = b.styleDef({
    pointerEvents: "none",
    position: 'absolute',
    borderRadius: 0
});

let hiddenStyle = b.styleDef({
    display: "none"
});

let checkDisabled = b.styleDef({
    position: 'absolute',
    fill: styles.disabledColor    
});

export const Checkbox = b.createComponent<ICheckboxData>({
    init(ctx: ICheckboxCtx) {
        ctx.focusFromKeyboard = false;
        ctx.down = false;
        ctx.rippleStart = 0;
        ctx.rippleReq = false;
    },
    render(ctx: ICheckboxCtx, me: b.IBobrilNode) {
        let d = ctx.data;
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
            if (t > (focusFromKeyboard?1.5:2)) {
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
        b.style(me, d.disabled ? disabledStyle : enabledStyle);
        b.style(me, rootSwitchStyle);
        me.children = [
            b.styledDiv("", showFocus ? focusFromKeyStyle : rippleStyle, { left: 12 - rr, top: 12 - rr, width: 2 * rr, height: 2 * rr, opacity: ro, background: d.checked ? styles.primary1Color : styles.checkboxOffColor }),
            b.styledDiv(icons.toggleCheckBoxOutlineBlank({ color: "inherit" }), d.disabled? (d.checked? hiddenStyle : checkDisabled): (d.checked ? boxWhenSwitchedStyle : boxStyle)),
            b.styledDiv(icons.toggleCheckBox({ color: "inherit" }), d.disabled? (d.checked? checkDisabled : hiddenStyle): (d.checked ? checkWhenSwitchedStyle : checkStyle))
        ];
        me.attrs = { role: "checkbox", "aria-checked": d.checked ? "true" : "false", "aria-disabled": d.disabled ? "true" : "false", tabindex: d.disabled ? undefined : (d.tabindex || 0) };
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
    onMouseEnter(ctx: ICheckboxCtx) {
        ctx.hover = true;
        b.invalidate(ctx);
    },
    onMouseLeave(ctx: ICheckboxCtx) {
        ctx.hover = false;
        b.invalidate(ctx);
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
