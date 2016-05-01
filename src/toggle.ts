import * as b from "bobril";
import * as paper from "./paper";
import * as ripple from "./ripple";
import * as styles from "./styles";
import * as colors from "./colors";
import * as colorUtils from "./colorUtils";
import * as transitions from "./transitions";
import * as c from "./styleConsts";

export interface IToggleData {
    checked?: boolean;
    disabled?: boolean;
    action?: () => void;
    tabindex?: number;
}

interface IToggleCtx extends b.IBobrilCtx {
    data: IToggleData;
    focusFromKeyboard: boolean;
    down: boolean;
    rippleStart: number;
}

let enabledStyle = b.styleDef({
    cursor: "pointer"
}, { focus: { outline: "none" } });

let disabledStyle = b.styleDef({
    cursor: "default"
});

const toggleSize = 20;
const toggleTrackWidth = 20;

let rootStyle = b.styleDef([c.userSelectNone, c.positionRelative, {
    display: "inline-block",
    width: toggleTrackWidth + toggleSize,
    height: 24
}]);

let trackStyle = b.styleDef([c.positionAbsolute, c.noTapHighlight, {
    transition: transitions.easeOut(),
    left: toggleSize * 0.5 - 7,
    top: 5,
    width: toggleTrackWidth + 14,
    height: 14,
    borderRadius: 30,
    backgroundColor: () => styles.primary3Color,
}]);

let thumbStyle = b.styleDef([c.positionAbsolute, c.noTapHighlight, styles.zDepthShadows[0], {
    transition: transitions.easeOut(),
    top: 1,
    left: 0,
    width: toggleSize,
    height: toggleSize,
    lineHeight: '24px',
    borderRadius: '50%',
    backgroundColor: () => styles.accent2Color,
}]);

let rippleStyle = b.styleDef([c.positionAbsolute, c.noTapHighlight, {
    borderRadius: "50%",
    backgroundColor: "#000",
}]);

let trackToggledStyle = b.styleDefEx(trackStyle, {
    backgroundColor: () => colorUtils.withTransparency(styles.primary1Color, 0.5)
});

let thumbToggledStyle = b.styleDefEx(thumbStyle, {
    backgroundColor: () => styles.primary1Color,
    left: toggleTrackWidth,
});

let trackDisabledStyle = b.styleDefEx(trackStyle, {
    backgroundColor: () => styles.primary3Color
});

let thumbDisabledStyle = b.styleDefEx(thumbStyle, {
    backgroundColor: () => styles.borderColor,
});

export const Toggle = b.createComponent<IToggleData>({
    init(ctx: IToggleCtx) {
        ctx.focusFromKeyboard = false;
        ctx.down = false;
        ctx.rippleStart = 0;
    },
    render(ctx: IToggleCtx, me: b.IBobrilNode) {
        let d = ctx.data;
        let disabled = d.disabled;
        let checked = d.checked;
        let focusFromKeyboard = ctx.focusFromKeyboard;
        let hasRipple = ctx.rippleStart != 0;
        let t: number;
        let r: number;
        if (hasRipple) {
            t = (b.now() - ctx.rippleStart) * 0.004;
            if (t > 2) {
                hasRipple = false;
                ctx.rippleStart = 0;
            }
            r = Math.min(t * toggleSize, toggleSize);
            b.invalidate(ctx);
        }
        if (ctx.focusFromKeyboard){
            hasRipple = true;
            r = toggleSize;
            t = 1;
        }
        b.style(me, rootStyle, disabled ? disabledStyle : enabledStyle);
        me.children = [
            b.styledDiv(null, trackStyle, checked && trackToggledStyle, disabled && trackDisabledStyle),
            b.styledDiv(hasRipple && b.styledDiv(null, rippleStyle, {
                left: toggleSize * 0.5 - r,
                top: toggleSize * 0.5 - r,
                width: 2 * r,
                height: 2 * r,
                opacity: 0.16 - 0.08 * t
            }), thumbStyle, checked && thumbToggledStyle, disabled && thumbDisabledStyle)
        ];
        me.attrs = {
            role: "checkbox",
            "aria-checked": checked ? "true" : "false",
            "aria-disabled": disabled ? "true" : "false"
        };
        if (!disabled)
            me.attrs.tabindex = d.tabindex || 0;
    },
    onPointerDown(ctx: IToggleCtx): boolean {
        if (ctx.data.disabled) return;
        ctx.focusFromKeyboard = false;
        if (b.pointersDownCount() === 1) {
            ctx.down = true;
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
        }
        b.invalidate(ctx);
    },
    onPointerUp(ctx: IToggleCtx): boolean {
        ctx.down = false;
        b.releaseMouseOwner();
        if (b.pointersDownCount() === 0 && !ctx.data.disabled) {
            let a = ctx.data.action;
            ctx.rippleStart = b.now();
            if (a) a();
        }
        b.invalidate(ctx);
        return true;
    },
    onKeyDown(ctx: IToggleCtx, ev: b.IKeyDownUpEvent): boolean {
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
    onKeyUp(ctx: IToggleCtx, ev: b.IKeyDownUpEvent): boolean {
        if (ev.which === 32 && !ctx.data.disabled && ctx.focusFromKeyboard) {
            ctx.down = false;
            b.invalidate(ctx);
            let a = ctx.data.action;
            if (a) a();
            return true;
        }
        return false;
    },
    onFocus(ctx: IToggleCtx) {
        if (!ctx.down) {
            ctx.focusFromKeyboard = true;
            b.invalidate(ctx);
        }
    },
    onBlur(ctx: IToggleCtx) {
        ctx.focusFromKeyboard = false;
        b.invalidate(ctx);
    }
});
