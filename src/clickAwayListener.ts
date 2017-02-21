import * as b from 'bobril';

let layerId: string | undefined;
let onClicks: { [id: string]: () => void } = {};

export interface IClickAwayListenerLayerData { }

interface IClickAwayListenerLayerCtx extends b.IBobrilCtx {
    data: IClickAwayListenerData;
}

const clickAwayListenerLayer = b.createComponent<IClickAwayListenerLayerData>({
    render(_ctx: IClickAwayListenerLayerCtx, me: b.IBobrilNode) {
        b.style(me, {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%'
        });
    },
    onPointerUp(_ctx: IClickAwayListenerLayerCtx, _event: b.IBobrilPointerEvent): boolean {
        for (var id in onClicks)
            onClicks[id]();

        return false;
    }
});

export interface IClickAwayListenerData {
    id: string;
    onClick: () => void;
}

interface IClickAwayListenerCtx extends b.IBobrilCtx {
    data: IClickAwayListenerData;
}

export const ClickAwayListener = b.createComponent<IClickAwayListenerData>({
    init(ctx: IClickAwayListenerCtx) {
        const d = ctx.data;
        onClicks[d.id] = d.onClick;
        if (!layerId)
            layerId = b.addRoot(() => clickAwayListenerLayer({ onClick: d.onClick }));
    },
    destroy(ctx: IClickAwayListenerCtx) {
        delete onClicks[ctx.data.id];
        if (layerId && Object.keys(onClicks).length === 0) {
            b.removeRoot(layerId);
            layerId = undefined;
        }
    },
});
