import * as b from "bobril";
import * as icons from "bobril-m-icons";
import * as checkbox from "./checkbox";

let radioButtonIcons: checkbox.CheckBoxLikeIcons = {
    off: icons.toggleRadioButtonUnchecked(),
    on: icons.toggleRadioButtonChecked(),
    radioButtonLike: true
};

export interface IRadioButtonData<T> {
    children?: b.IBobrilChildren;
    value: T;
    disabled?: boolean;
}

interface IRadioButtonCtx<T> extends b.IBobrilCtx {
    data: IRadioButtonData<T>;
    action: () => void;
    group: IRadioButtonGroupCtx<T>;
    idx: number;
}

export const RadioButton = b.createVirtualComponent<
    IRadioButtonData<number | string | boolean>
>({
    init(ctx: IRadioButtonCtx<any>) {
        ctx.action = () => {
            ctx.group.forceFocus = true;
            b.emitChange(ctx.group.data, ctx.data.value);
        };
    },
    render(ctx: IRadioButtonCtx<any>, me: b.IBobrilNode) {
        let data = ctx.data;
        const group: IRadioButtonGroupCtx<any> = (ctx.cfg || {})[
            radioButtonCfgName
        ];
        if (group == null)
            throw new Error("RadioButton must be wrapped in RadioButtonGroup");
        ctx.group = group;
        let list = group.list;
        let idx = -1;
        for (let i = 0; i < list.length; i++) {
            if (list[i] === ctx) {
                idx = i;
                break;
            }
        }
        if (idx === -1) {
            idx = list.length;
            list.push(ctx);
        }
        ctx.idx = idx;
        let checked = false;
        if (b.getValue(group.data.value) === data.value) {
            if (group.selIdx !== -2)
                throw new Error("Duplicate value in RadioButton");
            group.selIdx = idx;
            checked = true;
        }
        const disabled = data.disabled;
        let tabindex: number | undefined = group.data.tabindex || 0;
        if (group.firstEnabled === -1 && !disabled) {
            group.firstEnabled = idx;
            if (!checked) tabindex = undefined;
        } else {
            if (group.selIdx === -1 || !checked) tabindex = undefined;
        }
        me.children = checkbox.Checkbox({
            checked,
            tabindex,
            disabled,
            action: ctx.action,
            icons: radioButtonIcons,
            children: data.children
        });
    },
    onKeyDown(ctx: IRadioButtonCtx<any>, ev: b.IKeyDownUpEvent): boolean {
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
    }
});

export interface IRadioButtonGroupData<T> extends b.IValueData<T> {
    children?: b.IBobrilChildren;
    unselectedValue?: T;
    tabindex?: number;
    style?: b.IBobrilStyle;
}

interface IRadioButtonGroupCtx<T> extends b.IBobrilCtx {
    data: IRadioButtonGroupData<T>;
    list: IRadioButtonCtx<T>[];
    selIdx: number;
    firstEnabled: number;
    forceFocus: boolean;
}

export type RadioButtonGroupFactory<T> = b.IComponentFactory<
    IRadioButtonGroupData<T>
>;
const radioButtonCfgName = "radioButtonGroup";
export function RadioButtonGroup<T>(
    data?: IRadioButtonGroupData<T>,
    children?: b.IBobrilChildren
): b.IBobrilNode<IRadioButtonGroupData<T>> {
    if (children !== undefined) {
        if (data == null) data = <any>{};
        (<any>data).children = children;
    }
    return { data, component: RadioButtonGroupComponent };
}

const RadioButtonGroupComponent = {
    init(ctx: IRadioButtonGroupCtx<any>) {
        ctx.forceFocus = false;
    },
    render(ctx: IRadioButtonGroupCtx<any>, me: b.IBobrilNode) {
        let d = ctx.data;
        me.attrs = { role: "radiogroup" };
        me.children = d.children;
        b.style(me, d.style);
        ctx.list = [];
        b.extendCfg(ctx, radioButtonCfgName, ctx);
        ctx.selIdx = b.getValue(d.value) === d.unselectedValue ? -1 : -2;
        ctx.firstEnabled = -1;
    },
    postRender(ctx: IRadioButtonGroupCtx<any>, _me: b.IBobrilCacheNode) {
        if (ctx.selIdx === -2) {
            b.emitChange(ctx.data, ctx.data.unselectedValue!);
        }
    },
    postUpdateDom(ctx: IRadioButtonGroupCtx<any>) {
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
};
