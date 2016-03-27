import * as b from "bobril";
import * as paper from "./paper";
import * as ripple from "./ripple";
import * as styles from "./styles";
import * as colors from "./colors";
import * as transitions from "./transitions";
import * as icons from "bobril-m-icons";
import * as c from "./styleConsts";

const rowsHeight = 24;

var textAreaStyle = b.styleDef({
    width: '100%',
    resize: 'none',
    font: 'inherit',
    padding: 0
});

var textAreaShadowStyle = b.styleDef({
    width: '100%',
    resize: 'none',
    // Overflow also needed to here to remove the extra row
    // added to textareas in Firefox.
    overflow: 'hidden',
    // Visibility needed to hide the extra text area on ipads
    visibility: 'hidden',
    font: 'inherit',
    padding: 0,
    position: 'absolute'
});

export interface IEnhancedTextAreaData extends b.IValueData<string> {
    disabled?: boolean;
    onHeightChange?: (height: number) => void;
    rows?: number;
    rowsMax?: number;
    tabindex?: number;
    style?: b.IBobrilStyles;
}

interface IEnhancedTextAreaCtx extends b.IBobrilCtx {
    data: IEnhancedTextAreaData;
    height: number;
}

function syncShadow(ctx: IEnhancedTextAreaCtx, newValue?: string) {
    const shadowEl = <HTMLTextAreaElement>(<b.IBobrilCacheNode[]>ctx.me.children)[0].element;

    if (newValue !== undefined) {
        shadowEl.value = newValue;
    }

    let newHeight = shadowEl.scrollHeight;

    if (ctx.data.rowsMax >= ctx.data.rows || 1) {
        newHeight = Math.min(ctx.data.rowsMax * rowsHeight, newHeight);
    }

    newHeight = Math.max(newHeight, rowsHeight);

    if (ctx.height !== newHeight) {
        ctx.height = newHeight;
        b.invalidate(ctx);
        if (ctx.data.onHeightChange) {
            ctx.data.onHeightChange(newHeight);
        }
    }
}

const realTextAreaComponent: b.IBobrilComponent = {
    onChange(ctx: b.IBobrilCtx, value: string) {
        const ctxOfEnhanced = <IEnhancedTextAreaCtx>ctx.me.parent.ctx;
        syncShadow(ctxOfEnhanced, value);
        b.emitChange(ctxOfEnhanced.data, value);
    }
};

export const EnhancedTextarea = b.createComponent<IEnhancedTextAreaData>({
    init(ctx: IEnhancedTextAreaCtx, me: b.IBobrilNode) {
        ctx.height = rowsHeight * (ctx.data.rows || 1);
    },
    postInitDom(ctx: IEnhancedTextAreaCtx, me: b.IBobrilCacheNode) {
        this.postUpdateDom(ctx, me);
    },
    postUpdateDom(ctx: IEnhancedTextAreaCtx, me: b.IBobrilCacheNode) {
        syncShadow(ctx, b.getValue(ctx.data.value));
    },
    render(ctx: IEnhancedTextAreaCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        b.style(me, d.style);
        const rowStr = "" + (d.rows || 1);
        me.children = [
            b.style({ tag: "textarea", attrs: { readOnly: true, tabIndex: "-1", rows: rowStr } }, textAreaShadowStyle),
            b.style({
                tag: "textarea",
                attrs: { readOnly: d.disabled, tabindex: d.tabindex || 0, value: b.getValue(d.value), rows: rowStr },
                component: realTextAreaComponent
            }, textAreaStyle, { height: ctx.height })
        ];
    }
});
