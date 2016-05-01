import * as b from "bobril";
import * as styles from "./styles";
import * as colors from "./colors";
import * as c from "./styleConsts";
import * as transitions from "./transitions";

export interface IPaperData {
    children?: b.IBobrilChildren;
    style?: b.IBobrilStyles;
    zDepth?: number;
    circle?: boolean;
    round?: boolean;
}

interface IPaperCtx extends b.IBobrilCtx {
    data: IPaperData;
}

export let paperStyle = b.styleDef([c.noTapHighlight, {
    backgroundColor: () => styles.canvasColor,
    boxSizing: 'border-box',
    fontFamily: () => styles.fontFamily,
}]);

export let circleStyle = b.styleDef(c.circle);
export let roundStyle = b.styleDef({ borderRadius: 2 });

export const Paper = b.createComponent<IPaperData>({
    render(ctx: IPaperCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        me.children = d.children;
        b.style(me, paperStyle);
        let zDepth = d.zDepth;
        if (zDepth == null) zDepth = 1;
        if (zDepth > 0) b.style(me, styles.zDepthShadows[zDepth - 1]);
        if (d.circle) {
            b.style(me, circleStyle);
        } else if (d.round !== false) {
            b.style(me, roundStyle);
        }
        b.style(me, d.style);
    }
});
