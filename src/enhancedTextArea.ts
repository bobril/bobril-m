import * as b from "bobril";
import * as colors from "./colors";
import * as c from "./styleConsts";

const rowsHeight = 24;

var textAreaStyle = b.styleDef({
    width: '100%',
    resize: 'none',
    font: 'inherit',
    color: 'inherit',
    backgroundColor: colors.transparent,
    padding: 0,
    border: 0
}, {
        focus: {
            outline: 0
        }
    });

var textAreaShadowStyle = b.styleDef([c.positionAbsolute, {
    width: '100%',
    resize: 'none',
    // Overflow also needed to here to remove the extra row
    // added to textareas in Firefox.
    overflow: 'hidden',
    // Visibility needed to hide the extra text area on ipads
    visibility: 'hidden',
    font: 'inherit',
    padding: 0,
    border: 0
}]);

export interface IEnhancedTextAreaData extends b.IValueData<string> {
    disabled?: boolean;
    onHeightChange?: (height: number) => void;
    rows?: number;
    rowsMax?: number;
    tabindex?: number;
    style?: b.IBobrilStyles;
    id?: string;
}

interface IEnhancedTextAreaCtx extends b.IBobrilCtx {
    data: IEnhancedTextAreaData;
    height: number;
}

function syncShadow(ctx: IEnhancedTextAreaCtx, newValue?: string) {
    const shadowEl = <HTMLTextAreaElement>(<b.IBobrilCacheNode[]>ctx.me.children)[0].element;
    const d = ctx.data;
    if (newValue !== undefined) {
        shadowEl.value = newValue;
    }

    let newHeight = shadowEl.scrollHeight;
    if (d.rowsMax != null && d.rowsMax >= (ctx.data.rows || 1)) {
        newHeight = Math.min(d.rowsMax * rowsHeight, newHeight);
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
        const ctxOfEnhanced = <IEnhancedTextAreaCtx>ctx.me.parent!.ctx;
        syncShadow(ctxOfEnhanced, value);
        b.emitChange(ctxOfEnhanced.data, value);
    }
};

export const EnhancedTextarea = b.createComponent<IEnhancedTextAreaData>({
    init(ctx: IEnhancedTextAreaCtx, _me: b.IBobrilNode) {
        ctx.height = rowsHeight * (ctx.data.rows || 1);
    },
    postInitDom(this: any, ctx: IEnhancedTextAreaCtx, me: b.IBobrilCacheNode) {
        this.postUpdateDom(ctx, me);
    },
    postUpdateDom(ctx: IEnhancedTextAreaCtx, _me: b.IBobrilCacheNode) {
        syncShadow(ctx, b.getValue(ctx.data.value));
    },
    render(ctx: IEnhancedTextAreaCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        b.style(me, d.style);
        const rowStr = "" + (d.rows || 1);
        me.children = [
            b.style({ tag: "textarea", attrs: { readOnly: true, tabindex: -1, rows: rowStr } }, textAreaShadowStyle),
            b.style({
                tag: "textarea",
                attrs: { disabled: d.disabled, tabindex: d.disabled ? -1 : (d.tabindex || 0), value: b.getValue(d.value), rows: rowStr, id: d.id },
                component: realTextAreaComponent
            }, textAreaStyle, { height: ctx.height })
        ];
    }
});
