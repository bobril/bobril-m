import * as b from 'bobril';
import * as c from './styleConsts';

let layerId: string | undefined;
let onClicks: { [id: string]: () => void } = {};
let lastId = 0;
let count = 0;

interface IClickAwayListenerLayerCtx extends b.IBobrilCtx {
    data: IClickAwayListenerData;
}

const layerStyle = b.styleDef([c.widthHeight100p, {
    position: 'fixed',
    top: 0
}]);

const clickAwayListenerLayer = b.createComponent<never>({
    render(_ctx: b.IBobrilCtx, me: b.IBobrilNode) {
        b.style(me, layerStyle);
    },
    onPointerUp(_ctx: IClickAwayListenerLayerCtx, _event: b.IBobrilPointerEvent): boolean {
        for (var id in onClicks)
            onClicks[id]();
        return true;
    }
});

export interface IClickAwayListenerData {
    onClick: () => void;
}

interface IClickAwayListenerCtx extends b.IBobrilCtx {
    id: string;
    data: IClickAwayListenerData;
}

export const ClickAwayListener = b.createVirtualComponent<IClickAwayListenerData>({
    init(ctx: IClickAwayListenerCtx) {
        ctx.id = "" + lastId++;
        onClicks[ctx.id] = ctx.data.onClick;
        count++;
        if (count === 1) {
            layerId = b.addRoot(() => clickAwayListenerLayer());
        }
    },
    destroy(ctx: IClickAwayListenerCtx) {
        delete onClicks[ctx.id];
        count--;
        if (count === 0) {
            b.removeRoot(layerId!);
            layerId = undefined;
        }
    },
});
