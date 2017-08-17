import * as b from 'bobril';
import { List } from './list';

export interface IMenuItemControllerChild extends b.IBobrilCtx {
    focused: boolean;
    owner: IMenuController;
    _disabled: boolean;
}

export interface IMenuController {
    childRender(ctx: IMenuItemControllerChild, disabled: boolean): void;
    close(): void;
    focus(): void;
}

export interface IMenuData {
    children?: b.IBobrilChildren;
    desktop?: boolean;
    initiallyKeyboardFocused?: boolean;
    maxHeight?: number;
    onClose?: () => void;
    style?: b.IBobrilStyleDef;
}

interface IMenuCtx extends b.IBobrilCtx {
    data: IMenuData;
    isKeyboardFocused: boolean;
    keyWidth: number;
    controller: MenuController;
}

class MenuController implements IMenuController {
    self: b.IBobrilCacheNode;
    parent: b.IBobrilCacheNode | undefined;
    selectable: IMenuItemControllerChild[];
    selected: IMenuItemControllerChild | undefined;
    selectedIndex: number;
    onClose?: () => void;

    constructor() {
        this.parent = undefined;
        this.selectable = [];
        this._clear();
    }

    close() {
        let close = this.onClose;
        if (close)
            close();
        else
            focus();
    }

    focus() {
        b.focus(this.self.ctx!.refs!["list"]!);
    }

    childRender(ctx: IMenuItemControllerChild, disabled: boolean): void {
        ctx._disabled = disabled;
        this.parent = ctx.me.parent;
        if (disabled) ctx.focused = false;
    }

    private _clear() {
        this.selectable.length = 0;
        this.selected = undefined;
        this.selectedIndex = -1;
    }

    private _update(focused: boolean) {
        const selectable = this.selectable;
        if (selectable.length > 0) {
            if (this.selectedIndex < 0) {
                this.selectedIndex = 0;
            }
            if (this.selectedIndex >= selectable.length) {
                this.selectedIndex = selectable.length - 1;
            }
            let found = false;
            if (this.selected != undefined) for (let i = 0; i < selectable.length; i++) {
                if (this.selected === selectable[i]) {
                    found = true;
                    this.selectedIndex = i;
                    break;
                }
            }
            if (!found) this.selected = undefined;
            if (this.selected == undefined) {
                this.selected = selectable[this.selectedIndex];
            }
            for (let i = 0; i < selectable.length; i++) {
                let c = selectable[i];
                if (c.focused != (focused && i == this.selectedIndex)) {
                    c.focused = !c.focused;
                    b.invalidate(c);
                }
            }
        } else {
            this.selectedIndex = -1;
            this.selected = undefined;
        }
    }

    postRender(focused: boolean) {
        if (this.parent == undefined) {
            this._clear();
            return;
        }
        let ch = this.parent.children;
        if (!b.isArray(ch)) {
            this._clear();
            return;
        }
        const selectable = this.selectable;
        selectable.length = 0;
        for (let i = 0; i < ch.length; i++) {
            let c = ch[i].ctx as IMenuItemControllerChild;
            if (c.owner == this && !c._disabled) {
                selectable.push(c);
            }
        }
        this._update(focused);
    }

    addToIndex(delta: number) {
        this.selected = undefined;
        this.selectedIndex += delta;
        this._update(true);
    }
}

function decrementKeyboardFocusIndex(ctx: IMenuCtx) {
    ctx.controller.addToIndex(-1);
    ctx.isKeyboardFocused = true;
    ctx.controller.focus();
}

function incrementKeyboardFocusIndex(ctx: IMenuCtx) {
    ctx.controller.addToIndex(1);
    ctx.isKeyboardFocused = true;
    ctx.controller.focus();
}

function handleKeyDown(ctx: IMenuCtx, event: b.IKeyDownUpEvent): boolean {
    switch (event.which) {
        case 27:
            ctx.controller.close();
            return true;
        case 38:
            decrementKeyboardFocusIndex(ctx);
            return true;
        case 40:
            incrementKeyboardFocusIndex(ctx);
            return true;
    }
    return false;
};

function setWidth(ctx: IMenuCtx) {
    let element = b.getDomNode(ctx.me) as HTMLElement;
    const elWidth = element.offsetWidth;
    const keyWidth = ctx.keyWidth;
    const minWidth = keyWidth * 1.5;
    let keyIncrements = elWidth / keyWidth;
    let newWidth;

    keyIncrements = keyIncrements <= 1.5 ? 1.5 : Math.ceil(keyIncrements);
    newWidth = keyIncrements * keyWidth;

    if (newWidth < minWidth) newWidth = minWidth;

    element.style.width = `${newWidth}px`;
}

// This method belongs to Bobril
function extendCfg(ctx: b.IBobrilCtx, propertyName: string, value: any): void {
    let c = Object.assign({}, ctx.cfg);
    c[propertyName] = value;
    ctx.me.cfg = c;
}

// This method belongs to Bobril
function withRef(node: b.IBobrilNode, ctx: b.IBobrilCtx, name: string): b.IBobrilNode {
    node.ref = [ctx, name];
    return node;
}
export const Menu = b.createVirtualComponent<IMenuData>({
    init(ctx: IMenuCtx) {
        const d = ctx.data;
        ctx.controller = new MenuController();
        ctx.controller.self = ctx.me;
        ctx.isKeyboardFocused = d.initiallyKeyboardFocused || false;
        ctx.keyWidth = d.desktop ? 64 : 56;
    },
    render(ctx: IMenuCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        ctx.controller.onClose = d.onClose;
        extendCfg(ctx, "menuController", ctx.controller);
        me.children = b.styledDiv(withRef(List({ tabindex: 0 }, d.children), ctx, "list"), {
            maxHeight: d.maxHeight,
            overflowY: d.maxHeight ? 'auto' : undefined,
        }, d.style);
    },
    postRender(ctx: IMenuCtx) {
        ctx.controller.postRender(ctx.isKeyboardFocused);
    },
    postInitDom(ctx: IMenuCtx) {
        setWidth(ctx);
        if (ctx.isKeyboardFocused) {
            ctx.controller.focus();
        }
    },
    postUpdateDomEverytime(ctx: IMenuCtx) {
        setWidth(ctx);
    },
    onPointerUp(ctx: IMenuCtx, _ev: b.IBobrilPointerEvent): boolean {
        if (ctx.isKeyboardFocused = true) {
            ctx.isKeyboardFocused = false;
            b.invalidate(ctx);
        }
        return true;
    },
    onKeyDown(ctx: IMenuCtx, event: b.IKeyDownUpEvent): boolean {
        return handleKeyDown(ctx, event);
    },
    onFocusIn(ctx: IMenuCtx) {
        if (!ctx.data.onClose) {
            ctx.isKeyboardFocused = true;
            b.invalidate(ctx);
        }
    },
    onFocusOut(ctx: IMenuCtx) {
        ctx.isKeyboardFocused = false;
        b.invalidate(ctx);
    }
});
