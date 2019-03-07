import * as b from "bobril";
import * as c from "./styleConsts";
import { withTransparency } from "./colorUtils";

export interface IRippleData {
    children?: b.IBobrilChildren;
    pointerDown?: () => void;
    style?: b.IBobrilStyles;
    pulse?: boolean;
    disabled?: boolean;
}

interface IRippleCtx extends b.IBobrilCtx {
    data: IRippleData;
    pulseStart: number;
    width: number;
    height: number;
    ripples: number[]; // triples x, y, start time
}

const oneRippleStyle = b.styleDef([
    c.positionAbsolute,
    c.noTapHighlight,
    c.pointerEventsNone,
    c.userSelectNone,
    c.circle,
    {
        backgroundColor: "#000"
    }
]);

const pulseRippleStyle = b.styleDef([
    c.positionAbsolute,
    c.noTapHighlight,
    c.pointerEventsNone,
    c.userSelectNone,
    c.circle,
    {
        backgroundColor: withTransparency("#fff", 0.3)
    }
]);

const rippleStyle = b.styleDef([
    c.positionRelative,
    c.noTapHighlight,
    c.widthHeight100p,
    {
        boxSizing: "border-box"
    }
]);

export const Ripple = b.createComponent<IRippleData>({
    init(ctx: IRippleCtx) {
        ctx.ripples = [];
        ctx.width = 0;
        ctx.height = 0;
        ctx.pulseStart = 0;
    },
    render(ctx: IRippleCtx, me: b.IBobrilNode) {
        b.style(me, rippleStyle, ctx.data.style);
        me.children = [ctx.data.children];
        const width2 = ctx.width * 0.5;
        const height2 = ctx.height * 0.5;
        const time = b.now();
        if (ctx.data.pulse) {
            if (ctx.pulseStart === 0) {
                ctx.pulseStart = time;
            }
            let t = time - ctx.pulseStart;
            let r = Math.sqrt(Math.pow(height2, 2) + Math.pow(width2, 2));
            r = r * (0.75 + 0.05 * Math.sin(t * 0.004));
            (<b.IBobrilNode[]>me.children).push(
                b.styledDiv(null, pulseRippleStyle, {
                    left: width2 - r,
                    top: height2 - r,
                    width: 2 * r,
                    height: 2 * r
                })
            );
        } else {
            ctx.pulseStart = 0;
        }
        let ripples = ctx.ripples;
        for (let i = 0; i < ripples.length; i += 3) {
            let x = ripples[i];
            let y = ripples[i + 1];
            let t = (time - ripples[i + 2]) * 0.004;
            let maxRadius = Math.sqrt(
                Math.pow(Math.abs(y - height2) + height2, 2) +
                    Math.pow(Math.abs(x - width2) + width2, 2)
            );
            if (t > 2) {
                ripples.splice(i, 3);
                i -= 3;
                continue;
            }
            let r = Math.min(t * maxRadius, maxRadius);
            (<b.IBobrilNode[]>me.children).push(
                b.styledDiv(null, oneRippleStyle, {
                    left: x - r,
                    top: y - r,
                    width: 2 * r,
                    height: 2 * r,
                    opacity: 0.16 - 0.08 * t
                })
            );
        }
        if (ripples.length > 0 || ctx.data.pulse) b.invalidate(ctx);
    },
    postInitDom(this: any, ctx: IRippleCtx) {
        this.postUpdateDom(ctx);
    },
    postUpdateDom(ctx: IRippleCtx) {
        let e = <Element>ctx.me.element;
        ctx.width = e.clientWidth;
        ctx.height = e.clientHeight;
    },
    onPointerDown(ctx: IRippleCtx, ev: b.IBobrilPointerEvent): b.EventResult {
        if (ctx.data.disabled) return b.EventResult.HandledPreventDefault;
        const [x, y] = b.convertPointFromClientToNode(ctx.me, ev.x, ev.y);
        ctx.ripples.push(x, y, b.now());
        let cb = ctx.data.pointerDown;
        if (cb) cb();
        b.invalidate(ctx);
        return b.EventResult.HandledButRunDefault;
    }
});
