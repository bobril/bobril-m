import * as b from "bobril";
import * as paper from "./paper";
import * as styles from "./styles";
import * as colors from "./colors";
import * as c from "./styleConsts";

export interface ISliderData extends b.IValueData<number> {
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    tabindex?: number;
    style?: b.IBobrilStyles;
}

interface ISliderCtx extends b.IBobrilCtx {
    data: ISliderData;
    focus: boolean;
    down: boolean;
    hover: boolean;
    gap: number;
    width: number;
    pos: number;
    revertValue: number;
    radius: number;
    radiush: number;
    pointerId: number;
}

const rootStyle = b.styleDef([c.userSelectNone, {
    width: "100%",
    height: 48
}], { focus: { outline: "none" } });

const strokeDisabledStyle = b.styleDef({
    fill: "transparent",
    stroke: () => styles.disabledColor,
    strokeWidth: 2
});

const strokeSliderStyle = b.styleDef({
    fill: "transparent",
    stroke: () => styles.sliderColor,
    strokeWidth: 2
});

const strokeEnabledStyle = b.styleDef({
    fill: "transparent",
    stroke: () => styles.primary1Color,
    strokeWidth: 2
});

const fillDisabledStyle = b.styleDef({
    fill: () => styles.disabledColor
});

const fillSliderStyle = b.styleDef({
    fill: () => styles.sliderColor
});

const fillEnabledStyle = b.styleDef({
    fill: () => styles.primary1Color
});

const downRadius = 7;
const enabledRadius = 5;
const disabledRadius = 3;
const gapFromRadius = 3;

function setByPos(ctx: ISliderCtx, x: number) {
    let d = ctx.data;
    let left = b.nodePagePos(ctx.me)[0] + ctx.gap;
    let right = left + ctx.width - ctx.gap * 2;
    let pos = x;
    if (pos > right) pos = right;
    if (pos < left) pos = left;
    if (right <= left) right = left + 1;
    pos = (pos - left) / (right - left);
    let min = d.min || 0;
    let max = d.max;
    if (max == null) max = 1;
    if (min >= max) {
        max = min;
    }
    let step = d.step;
    pos = pos * (max - min);
    if (step != null)
        pos = Math.round(pos / step) * step;
    pos += min;
    b.emitChange(d, pos);
};

export const Slider = b.createComponent<ISliderData>({
    init(ctx: ISliderCtx) {
        ctx.focus = false;
        ctx.down = false;
        ctx.hover = false;
        ctx.width = 0;
        ctx.pos = 0;
        ctx.radius = enabledRadius;
        ctx.radiush = 0;
    },
    render(ctx: ISliderCtx, me: b.IBobrilNode) {
        let d = ctx.data;
        let width = ctx.width;
        let value = b.getValue(d.value);
        let min = d.min || 0;
        let max = d.max;
        if (max == null) max = 1;
        if (min >= max) {
            max = min + 1;
            if (value != min) {
                value = min;
                b.emitChange(d, value);
            }
        }
        let step = d.step;
        value -= min;
        if (step != null)
            value = Math.round(value / step) * step;
        value = value / (max - min);
        if (value > 1) value = 1;
        let gap = 12;
        if (gap * 2 > width) gap = Math.floor(width * 0.5);
        let pos = Math.round(gap + (width - 2 * gap) * value);
        ctx.gap = gap;
        ctx.pos = pos;
        let ch: b.IBobrilNode[] = [];
        let high = ctx.hover || ctx.focus;
        let radius = ctx.down ? downRadius : enabledRadius;
        let radiush = (high && !ctx.down) ? 12 : 0;
        if (d.disabled) {
            radius = disabledRadius;
            ctx.radius = radius;
            radiush = 0;
            ctx.radiush = 0;
            high = false;
        }
        if (ctx.radius != radius) {
            let delta = radius - ctx.radius;
            if (Math.abs(delta) > 0.1) {
                delta = delta * 0.1;
                b.invalidate(ctx);
            }
            ctx.radius += delta;
        }
        radius = ctx.radius;
        if (ctx.radiush != radiush) {
            let delta = radiush - ctx.radiush;
            if (Math.abs(delta) > 0.2) {
                delta = delta * 0.2;
                b.invalidate(ctx);
            }
            ctx.radiush += delta;
        }
        radiush = ctx.radiush;
        let radius1 = Math.round(radius + (value <= 0 ? 1 : 0));
        if (d.disabled) {
            radius1 = radius + gapFromRadius;
        }
        if (gap < pos - radius1) {
            ch.push(b.style({ tag: "path", attrs: { d: `M${gap} 24H${pos - radius1}` } }, d.disabled ? strokeDisabledStyle : strokeEnabledStyle));
        }
        if (pos + radius1 < width - gap) {
            ch.push(b.style({ tag: "path", attrs: { d: `M${pos + radius1} 24H${width - gap}` } }, high ? strokeSliderStyle : strokeDisabledStyle));
        }
        if (radiush > 0) {
            ch.push(b.style({ tag: "path", attrs: { opacity: 0.3, d: b.svgCircle(pos, 24, radiush) } }, value <= 0 ? fillDisabledStyle : fillEnabledStyle));
        }
        ch.push(b.style({ tag: "path", attrs: { d: b.svgCircle(pos, 24, radius) } }, value <= 0 ? (high ? strokeSliderStyle : strokeDisabledStyle) : d.disabled ? fillDisabledStyle : fillEnabledStyle));
        me.children = {
            tag: "svg",
            attrs: {
                width: width + "px",
                height: "48px",
                viewPort: "0 0 " + width + " 48"
            },
            children: ch
        };
        me.attrs = {
            role: "slider",
            "aria-valuemin": min.toString(),
            "aria-valuemax": max.toString(),
            "aria-valuenow": value.toString(),
            "aria-disabled": d.disabled ? "true" : "false",
            tabindex: d.disabled ? undefined : (d.tabindex || 0)
        };
        b.style(me, rootStyle, ctx.data.style);
    },
    onKeyDown(ctx: ISliderCtx, event: b.IKeyDownUpEvent): boolean {
        if (event.alt || event.ctrl) return false;
        let delta = 0;
        if (event.which === 37) {
            delta = -1;
        } else if (event.which === 39) {
            delta = 1;
        } else return false;
        if (event.shift) delta *= 10;
        let d = ctx.data;
        let value = b.getValue(d.value);
        let min = d.min || 0;
        let max = d.max;
        if (max == null) max = 1;
        if (min >= max) {
            max = min;
        }
        let step = d.step;
        if (step == null) step = (max - min) * 0.01;
        value += delta * step;
        if (value > max) value = max;
        if (value < min) value = min;
        b.emitChange(d, value);
        return true;
    },
    onPointerDown(ctx: ISliderCtx, event: b.IBobrilPointerEvent): boolean {
        let d = ctx.data;
        if (d.disabled) return false;
        let np = b.nodePagePos(ctx.me);
        if (!ctx.down && Math.pow(event.x - np[0] - ctx.pos, 2) + Math.pow(event.y - np[1] - 24, 2) < 24 * 24) {
            ctx.down = true;
            ctx.revertValue = b.getValue(d.value);
            ctx.pointerId = event.id;
            b.invalidate(ctx);
            b.registerMouseOwner(ctx);
            b.focus(ctx.me);
            return true;
        }
        return false;
    },
    onPointerMove(ctx: ISliderCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.data.disabled) return false;
        if (ctx.down && ctx.pointerId == event.id) {
            setByPos(ctx, event.x);
            return true;
        }
        return false;
    },
    onPointerUp(ctx: ISliderCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.down && ctx.pointerId == event.id) {
            ctx.down = false;
            b.releaseMouseOwner();
            b.invalidate(ctx);
            return true;
        }
        return false;
    },
    onPointerCancel(ctx: ISliderCtx, event: b.IBobrilPointerEvent): boolean {
        if (ctx.down && ctx.pointerId == event.id) {
            ctx.down = false;
            b.invalidate(ctx);
            if (ctx.data.value != ctx.revertValue) {
                b.emitChange(ctx.data, ctx.revertValue);
            }
            b.releaseMouseOwner();
        }
        return false;
    },
    onClick(ctx: ISliderCtx, event: b.IBobrilMouseEvent): boolean {
        if (ctx.data.disabled) return false;
        setByPos(ctx, event.x);
        b.focus(ctx.me);
        return true;
    },
    onMouseEnter(ctx: ISliderCtx) {
        ctx.hover = true;
        b.invalidate(ctx);
    },
    onMouseLeave(ctx: ISliderCtx) {
        ctx.hover = false;
        b.invalidate(ctx);
    },
    onFocus(ctx: ISliderCtx) {
        ctx.focus = true;
        b.invalidate(ctx);
    },
    onBlur(ctx: ISliderCtx) {
        ctx.focus = false;
        b.invalidate(ctx);
    },
    postInitDom(ctx: ISliderCtx, me: b.IBobrilCacheNode) {
        this.postUpdateDom(ctx, me);
    },
    postUpdateDom(ctx: ISliderCtx, me: b.IBobrilCacheNode) {
        let w = Math.floor((<Element>me.element).getBoundingClientRect().width);
        if (ctx.width != w) {
            ctx.width = w;
            b.invalidate(ctx);
        }
    }
});
