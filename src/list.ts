import * as b from 'bobril';
import { Subheader } from './subheader';

export interface IListData {
    children?: b.IBobrilNode[];
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
        let d = ctx.data;
        let hasSubheader = true;
        let firstChild = d.children[0];
        if (firstChild.component) hasSubheader = false;

        b.style(me, listStyle, { paddingTop: hasSubheader ? 0 : 8 });
        me.children = d.children;
    }
});
