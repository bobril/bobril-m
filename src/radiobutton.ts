import * as b from "bobril";
import * as icons from "bobril-m-icons";
import * as checkbox from './checkbox';

let radioButtonIcons: checkbox.CheckBoxLikeIcons = {
    off: icons.toggleRadioButtonUnchecked,
    on: icons.toggleRadioButtonChecked,
    radioButtonLike: true
};

export interface IRadioButtonData {
    children?: b.IBobrilChildren;
    value?: number | string;
    disabled?: boolean;
}

interface IRadioButtonCtx extends b.IBobrilCtx {
    data: IRadioButtonData;
    action: () => void;
    group: IRadioButtonGroupCtx;
    idx: number;
}

export const RadioButton = b.createVirtualComponent<IRadioButtonData>({
    init(ctx: IRadioButtonCtx) {
        ctx.action = () => {
            ctx.group.forceFocus = true;
            ctx.group.data.onChange(ctx.data.value);
        }
    },
    render(ctx: IRadioButtonCtx, me: b.IBobrilNode) {
        let data = ctx.data;
        const group: IRadioButtonGroupCtx = (ctx.cfg || {})[radioButtonCfgName];
        if (group == null) throw new Error("RadioButton must be wrapped in RadioButtonGroup");
        ctx.group = group;
        let list = group.list;
        let idx = -1;
        for (let i = 0; i < list.length; i++) {
            if (list[i] === ctx) { idx = i; break; }
        }
        if (idx === -1) {
            idx = list.length;
            list.push(ctx);
        }
        ctx.idx = idx;
        let checked = false;
        if (group.data.value === data.value) {
            if (group.selIdx !== -2) throw new Error("Duplicate value in RadioButton");
            group.selIdx = idx;
            checked = true;
        }
        const disabled = data.disabled;
        let tabindex = group.data.tabindex || 0;
        if (group.firstEnabled === -1 && !disabled) {
            group.firstEnabled = idx;
            if (!checked) tabindex = null;
        } else {
            if (group.selIdx === -1 || !checked) tabindex = null;
        }
        me.children = checkbox.Checkbox({
            checked,
            tabindex: tabindex,
            disabled,
            action: ctx.action,
            icons: radioButtonIcons,
            children: data.children
        });
    },
    onKeyDown(ctx: IRadioButtonCtx, ev: b.IKeyDownUpEvent): boolean {
        if (ev.which === 37 || ev.which === 38) {
            let i = ctx.idx;
            while (i-- > 0) {
                const ii = ctx.group.list[i];
                if (!ii.data.disabled) {
                    ii.action();
                    return true;
                }
            }
        }
        if (ev.which === 39 || ev.which === 40) {
            let i = ctx.idx;
            while (++i < ctx.group.list.length) {
                const ii = ctx.group.list[i];
                if (!ii.data.disabled) {
                    ii.action();
                    return true;
                }
            }
        }
        return false;
    },

});

export interface IRadioButtonGroupData {
    children?: b.IBobrilChildren;
    value?: number | string;
    unselectedValue?: number | string;
    onChange?: (value: number | string) => void;
    tabindex?: number;
    style?: b.IBobrilStyle;
}

interface IRadioButtonGroupCtx extends b.IBobrilCtx {
    data: IRadioButtonGroupData;
    list: IRadioButtonCtx[];
    selIdx: number;
    firstEnabled: number;
    forceFocus: boolean;
}

const radioButtonCfgName = "radioButtonGroup";
export const RadioButtonGroup = b.createComponent<IRadioButtonGroupData>({
    init(ctx: IRadioButtonGroupCtx) {
        ctx.forceFocus = false;
    },
    render(ctx: IRadioButtonGroupCtx, me: b.IBobrilNode) {
        me.attrs = { role: "radiogroup" };
        me.children = ctx.data.children;
        b.style(me, ctx.data.style);
        ctx.list = [];
        let cfg = ctx.cfg || {};
        cfg[radioButtonCfgName] = ctx;
        ctx.cfg = cfg;
        ctx.selIdx = (ctx.data.value === ctx.data.unselectedValue) ? -1 : -2;
        ctx.firstEnabled = -1;
    },
    postRender(ctx: IRadioButtonGroupCtx, me: b.IBobrilCacheNode) {
        if (ctx.selIdx === -2) {
            ctx.data.onChange(ctx.data.unselectedValue);
        }
    },
    postUpdateDom(ctx: IRadioButtonGroupCtx) {
        let shouldBeFocused = ctx.selIdx;
        if (shouldBeFocused === -1) {
            shouldBeFocused = ctx.firstEnabled;
        }
        if (shouldBeFocused < 0) return;
        let f = b.focused();
        if (f) f = f.parent;
        if (f) {
            const c = f.ctx;
            const list = ctx.list;
            for (let i = 0; i < list.length; i++) {
                if (list[i] === c) {
                    if (i != shouldBeFocused) {
                        b.focus(list[shouldBeFocused].me);
                    }
                    ctx.forceFocus = false;
                    return;
                }
            }
        }
        if (ctx.forceFocus) {
            b.focus(ctx.list[shouldBeFocused].me);
        }
        ctx.forceFocus = false;
    }
});
