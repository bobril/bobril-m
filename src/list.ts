import * as b from 'bobril';

export interface IListData {
    children?: b.IBobrilChildren;
    privateNested?: boolean;
}

interface IListCtx extends b.IBobrilCtx {
    data: IListData;
}

let listStyle = b.styleDef({
    padding: 0,
    paddingBottom: 8
});

export const List = b.createComponent<IListData>({
    id: "List",
    render(ctx: IListCtx, me: b.IBobrilNode) {
        me.children = ctx.data.children;
    },
    postRender(_ctx: IListCtx, me: b.IBobrilCacheNode) {
        let hasSubheader = true;
        let ch = me.children;
        if (typeof ch !== "string") {
            let children = (<b.IBobrilCacheNode[]>me.children);
            if (!children || !children.length || !children[0]) return;
            if (children[0].component) hasSubheader = false;
        }
        b.style(me, listStyle, hasSubheader || { paddingTop: 8 });
    }
});
